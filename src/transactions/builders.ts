/**
 * Transaction builders for migration operations
 *
 * This module provides functions to build Solana transactions for:
 * - Token migration (migrate old tokens to new tokens)
 * - MFT claiming (redeem MFT for new tokens)
 * - Transaction simulation and validation
 *
 * @module builders
 */

import { AnchorProvider, BN } from '@coral-xyz/anchor';
import {
  Connection,
  PublicKey,
  Transaction,
} from '@solana/web3.js';
import {
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

import { getProgram } from '../core/program';
import { LoadedProject, SdkError, SdkErrorCode } from '../core/types';
import { parseError } from '../utils/errors';

/**
 * Options for building a migration transaction
 */
export interface BuildMigrateTxOptions {
  /**
   * Skip pre-flight simulation (default: false)
   */
  skipPreflight?: boolean;

  /**
   * Compute unit limit for the transaction (optional)
   */
  computeUnitLimit?: number;

  /**
   * Compute unit price for priority fees (optional, in micro-lamports)
   */
  computeUnitPrice?: number;
}

/**
 * Result of building a migration transaction
 */
export interface BuildMigrateTxResult {
  /**
   * The built transaction, ready to sign and send
   */
  transaction: Transaction;

  /**
   * Amount being migrated (in token base units)
   */
  amount: bigint;

  /**
   * Expected MFT to be received (in token base units)
   */
  expectedMft: bigint;

  /**
   * Required accounts for the transaction
   * Note: PDAs (oldTokenVault, userMigration) are automatically derived by Anchor 0.31.0
   */
  accounts: {
    user: PublicKey;
    projectConfig: PublicKey;
    userOldTokenAta: PublicKey;
    userMftAta: PublicKey;
    oldTokenMint: PublicKey;
    mftMint: PublicKey;
  };
}

/**
 * Build a token migration transaction
 *
 * Creates a transaction that migrates old tokens to receive MFT (Migration Finalization Tokens).
 * The MFT can later be redeemed 1:1 for new tokens.
 *
 * @param {Connection} connection - Solana RPC connection
 * @param {PublicKey} user - User wallet public key
 * @param {string} projectId - Project identifier
 * @param {bigint} amount - Amount to migrate in token base units (not decimals)
 * @param {LoadedProject} project - Pre-loaded project configuration
 * @param {BuildMigrateTxOptions} [options] - Transaction options
 * @returns {Promise<BuildMigrateTxResult>} Transaction and metadata
 * @throws {SdkError} If project is paused, migration window closed, or invalid amount
 *
 * @example
 * ```typescript
 * import { Connection, PublicKey } from '@solana/web3.js';
 * import { loadProject, buildMigrateTx, parseTokenAmount } from '@migratefun/sdk';
 *
 * const connection = new Connection('https://api.devnet.solana.com');
 * const user = new PublicKey('...');
 *
 * // Load project first
 * const project = await loadProject('my-project', connection);
 *
 * // Parse user input to token base units
 * const amount = parseTokenAmount(100.5, project.oldTokenDecimals);
 *
 * // Build transaction
 * const { transaction, expectedMft } = await buildMigrateTx(
 *   connection,
 *   user,
 *   'my-project',
 *   amount,
 *   project
 * );
 *
 * // Sign and send
 * transaction.feePayer = user;
 * const signed = await wallet.signTransaction(transaction);
 * const signature = await connection.sendRawTransaction(signed.serialize());
 * ```
 */
export async function buildMigrateTx(
  connection: Connection,
  user: PublicKey,
  projectId: string,
  amount: bigint,
  project: LoadedProject,
  options: BuildMigrateTxOptions = {}
): Promise<BuildMigrateTxResult> {
  try {
    // Validate project status
    if (project.paused) {
      throw new SdkError(
        SdkErrorCode.PROJECT_PAUSED,
        'Project is paused - migrations are temporarily disabled'
      );
    }

    // Validate amount
    if (amount <= 0n) {
      throw new SdkError(
        SdkErrorCode.INVALID_AMOUNT,
        'Migration amount must be greater than zero'
      );
    }

    // Get program instance
    const provider = new AnchorProvider(
      connection,
      {
        publicKey: user,
        signTransaction: async () => {
          throw new Error('This is a read-only provider');
        },
        signAllTransactions: async () => {
          throw new Error('This is a read-only provider');
        },
      } as any,
      { commitment: 'confirmed' }
    );

    const program = await getProgram(provider);

    // Resolve required accounts
    const oldTokenProgram = project.oldTokenDecimals === 9 ? TOKEN_PROGRAM_ID : TOKEN_PROGRAM_ID; // Adjust based on project config

    const userOldTokenAta = getAssociatedTokenAddressSync(
      project.oldTokenMint,
      user,
      false,
      oldTokenProgram
    );

    const userMftAta = getAssociatedTokenAddressSync(
      project.mftMint,
      user,
      false,
      TOKEN_PROGRAM_ID
    );

    // Build instruction accounts
    // NOTE: Anchor 0.31.0 automatically derives PDAs and includes system programs.
    // Only provide: user wallet, token mints, ATAs, and custom token programs.
    const accounts = {
      user,
      projectConfig: project.pdas.projectConfig,
      userOldTokenAta,
      userMftAta,
      oldTokenMint: project.oldTokenMint,
      mftMint: project.mftMint,
      // Always pass oldTokenProgram as required by IDL
      oldTokenProgram,
    };

    // Convert bigint to BN for Anchor
    const amountBN = new BN(amount.toString());

    // Build transaction
    const instruction = await (program as any).methods
      .migrate(projectId, amountBN)
      .accounts(accounts)
      .instruction();

    const transaction = new Transaction();

    // Add compute budget instructions if specified
    if (options.computeUnitLimit || options.computeUnitPrice) {
      // Note: ComputeBudgetProgram instructions would go here
      // Keeping it simple for now
    }

    transaction.add(instruction);

    // Set recent blockhash
    const { blockhash } = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = user;

    // Calculate expected MFT based on exchange rate
    const expectedMft = calculateMftAmount(amount, project.exchangeRate, project.oldTokenDecimals, project.mftDecimals);

    return {
      transaction,
      amount,
      expectedMft,
      accounts: {
        user,
        projectConfig: project.pdas.projectConfig,
        userOldTokenAta,
        userMftAta,
        oldTokenMint: project.oldTokenMint,
        mftMint: project.mftMint,
      },
    };
  } catch (error) {
    throw parseError(error);
  }
}

/**
 * Calculate MFT amount based on exchange rate
 *
 * Uses banker's rounding (round half to even) to prevent systematic bias
 * in rounding operations. Includes overflow protection for Solana u64 limits.
 *
 * @param {bigint} oldTokenAmount - Amount of old tokens (in base units)
 * @param {bigint} exchangeRate - Exchange rate basis points (10000 = 1:1)
 * @param {number} oldTokenDecimals - Old token decimals
 * @param {number} mftDecimals - MFT token decimals
 * @returns {bigint} Expected MFT amount (in base units)
 * @throws {SdkError} If calculation would overflow
 * @internal
 */
function calculateMftAmount(
  oldTokenAmount: bigint,
  exchangeRate: bigint,
  oldTokenDecimals: number,
  mftDecimals: number
): bigint {
  // Solana uses u64 for token amounts (max: 18,446,744,073,709,551,615)
  const MAX_U64 = BigInt('18446744073709551615');

  // Validate inputs are within bounds
  if (oldTokenAmount > MAX_U64) {
    throw new SdkError(
      SdkErrorCode.INVALID_AMOUNT,
      `Amount ${oldTokenAmount} exceeds maximum supported value (u64 limit)`
    );
  }

  // Exchange rate is in basis points (10000 = 1:1, 20000 = 2:1)
  // MFT amount = (old_amount * exchange_rate) / 10000
  const numerator = oldTokenAmount * exchangeRate;
  const denominator = 10000n;

  // Use banker's rounding (round half to even) for fairness
  const quotient = numerator / denominator;
  const remainder = numerator % denominator;

  // Round up if remainder >= half, using banker's rounding for exact half
  let mftAmount: bigint;
  if (remainder * 2n > denominator) {
    // Remainder > half: always round up
    mftAmount = quotient + 1n;
  } else if (remainder * 2n === denominator) {
    // Remainder == half: round to nearest even (banker's rounding)
    mftAmount = quotient % 2n === 0n ? quotient : quotient + 1n;
  } else {
    // Remainder < half: round down
    mftAmount = quotient;
  }

  // Adjust for decimal differences
  if (oldTokenDecimals !== mftDecimals) {
    const decimalDiff = mftDecimals - oldTokenDecimals;
    if (decimalDiff > 0) {
      const result = mftAmount * BigInt(10 ** decimalDiff);
      // Check for overflow after decimal adjustment
      if (result > MAX_U64) {
        throw new SdkError(
          SdkErrorCode.INVALID_AMOUNT,
          'Calculated MFT amount exceeds maximum supported value (u64 limit)'
        );
      }
      return result;
    } else {
      return mftAmount / BigInt(10 ** Math.abs(decimalDiff));
    }
  }

  return mftAmount;
}

/**
 * Options for building an MFT claim transaction
 */
export interface BuildClaimMftTxOptions extends BuildMigrateTxOptions {
  // Additional claim-specific options can be added here
}

/**
 * Result of building an MFT claim transaction
 */
export interface BuildClaimMftTxResult {
  /**
   * The built transaction, ready to sign and send
   */
  transaction: Transaction;

  /**
   * Amount of MFT being claimed (in base units)
   */
  mftAmount: bigint;

  /**
   * Expected new tokens to receive (in base units)
   */
  expectedNewTokens: bigint;

  /**
   * Required accounts for the transaction
   * Note: PDAs (newTokenVault) are automatically derived by Anchor 0.31.0
   */
  accounts: {
    user: PublicKey;
    projectConfig: PublicKey;
    userMftAta: PublicKey;
    userNewTokenAta: PublicKey;
    newTokenMint: PublicKey;
    mftMint: PublicKey;
  };
}

/**
 * Build an MFT claim transaction
 *
 * Creates a transaction that burns MFT tokens to receive new tokens at 1:1 ratio.
 *
 * @param {Connection} connection - Solana RPC connection
 * @param {PublicKey} user - User wallet public key
 * @param {string} projectId - Project identifier
 * @param {bigint} mftAmount - Amount of MFT to claim (in base units)
 * @param {LoadedProject} project - Pre-loaded project configuration
 * @param {BuildClaimMftTxOptions} [options] - Transaction options
 * @returns {Promise<BuildClaimMftTxResult>} Transaction and metadata
 * @throws {SdkError} If claims not enabled or invalid amount
 *
 * @example
 * ```typescript
 * import { Connection, PublicKey } from '@solana/web3.js';
 * import { loadProject, buildClaimMftTx, parseTokenAmount } from '@migratefun/sdk';
 *
 * const connection = new Connection('https://api.devnet.solana.com');
 * const user = new PublicKey('...');
 *
 * // Load project first
 * const project = await loadProject('my-project', connection);
 *
 * // Parse MFT amount (MFT always has 9 decimals)
 * const mftAmount = parseTokenAmount(100, 9);
 *
 * // Build claim transaction
 * const { transaction, expectedNewTokens } = await buildClaimMftTx(
 *   connection,
 *   user,
 *   'my-project',
 *   mftAmount,
 *   project
 * );
 *
 * // Sign and send
 * transaction.feePayer = user;
 * const signed = await wallet.signTransaction(transaction);
 * const signature = await connection.sendRawTransaction(signed.serialize());
 * ```
 */
export async function buildClaimMftTx(
  connection: Connection,
  user: PublicKey,
  projectId: string,
  mftAmount: bigint,
  project: LoadedProject,
  _options: BuildClaimMftTxOptions = {}
): Promise<BuildClaimMftTxResult> {
  try {
    // Validate amount
    if (mftAmount <= 0n) {
      throw new SdkError(
        SdkErrorCode.INVALID_AMOUNT,
        'MFT claim amount must be greater than zero'
      );
    }

    // Get program instance
    const provider = new AnchorProvider(
      connection,
      {
        publicKey: user,
        signTransaction: async () => {
          throw new Error('This is a read-only provider');
        },
        signAllTransactions: async () => {
          throw new Error('This is a read-only provider');
        },
      } as any,
      { commitment: 'confirmed' }
    );

    const program = await getProgram(provider);

    // Resolve required accounts
    const newTokenProgram = TOKEN_PROGRAM_ID; // Adjust based on project config

    const userMftAta = getAssociatedTokenAddressSync(
      project.mftMint,
      user,
      false,
      TOKEN_PROGRAM_ID
    );

    const userNewTokenAta = getAssociatedTokenAddressSync(
      project.newTokenMint,
      user,
      false,
      newTokenProgram
    );

    // Build instruction accounts
    // NOTE: Anchor 0.31.0 automatically derives PDAs and includes system programs.
    // Only provide: user wallet, token mints, ATAs, and custom token programs.
    const accounts = {
      user,
      projectConfig: project.pdas.projectConfig,
      userMftAta,
      userNewTokenAta,
      newTokenMint: project.newTokenMint,
      mftMint: project.mftMint,
      // Always pass newTokenProgram as required by IDL
      newTokenProgram,
    };

    // Convert bigint to BN for Anchor
    const mftAmountBN = new BN(mftAmount.toString());

    // Build transaction
    const instruction = await (program as any).methods
      .claimWithMft(projectId, mftAmountBN)
      .accounts(accounts)
      .instruction();

    const transaction = new Transaction();
    transaction.add(instruction);

    // Set recent blockhash
    const { blockhash } = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = user;

    // MFT to new tokens is 1:1, but need to adjust for decimals
    const expectedNewTokens = adjustForDecimals(
      mftAmount,
      project.mftDecimals,
      project.newTokenDecimals
    );

    return {
      transaction,
      mftAmount,
      expectedNewTokens,
      accounts: {
        user,
        projectConfig: project.pdas.projectConfig,
        userMftAta,
        userNewTokenAta,
        newTokenMint: project.newTokenMint,
        mftMint: project.mftMint,
      },
    };
  } catch (error) {
    throw parseError(error);
  }
}

/**
 * Adjust token amount for decimal differences
 * @internal
 */
function adjustForDecimals(amount: bigint, fromDecimals: number, toDecimals: number): bigint {
  if (fromDecimals === toDecimals) {
    return amount;
  }

  const decimalDiff = toDecimals - fromDecimals;
  if (decimalDiff > 0) {
    return amount * BigInt(10 ** decimalDiff);
  } else {
    return amount / BigInt(10 ** Math.abs(decimalDiff));
  }
}

/**
 * Simulate a transaction to check if it would succeed
 *
 * @param {Connection} connection - Solana RPC connection
 * @param {Transaction} transaction - Transaction to simulate
 * @returns {Promise<boolean>} True if simulation succeeds
 * @throws {SdkError} If simulation fails with error details
 *
 * @example
 * ```typescript
 * import { buildMigrateTx, simulateTransaction } from '@migratefun/sdk';
 *
 * const { transaction } = await buildMigrateTx(...);
 *
 * // Simulate before sending
 * const willSucceed = await simulateTransaction(connection, transaction);
 * if (willSucceed) {
 *   // Proceed with signing and sending
 * }
 * ```
 */
export async function simulateTransaction(
  connection: Connection,
  transaction: Transaction
): Promise<boolean> {
  try {
    const simulation = await connection.simulateTransaction(transaction);

    if (simulation.value.err) {
      throw new SdkError(
        SdkErrorCode.SIMULATION_FAILED,
        `Transaction simulation failed: ${JSON.stringify(simulation.value.err)}`,
        simulation.value.err
      );
    }

    return true;
  } catch (error) {
    throw parseError(error);
  }
}

/**
 * Send and confirm a transaction with retry logic
 *
 * @param {Connection} connection - Solana RPC connection
 * @param {Transaction} transaction - Signed transaction to send
 * @param {Object} options - Send options
 * @returns {Promise<string>} Transaction signature
 * @throws {SdkError} If transaction fails
 *
 * @example
 * ```typescript
 * import { buildMigrateTx, sendAndConfirmTransaction } from '@migratefun/sdk';
 *
 * const { transaction } = await buildMigrateTx(...);
 * transaction.feePayer = user;
 * const signed = await wallet.signTransaction(transaction);
 *
 * const signature = await sendAndConfirmTransaction(
 *   connection,
 *   signed,
 *   { skipPreflight: false }
 * );
 *
 * console.log('Transaction confirmed:', signature);
 * ```
 */
export async function sendAndConfirmTransaction(
  connection: Connection,
  transaction: Transaction,
  options: { skipPreflight?: boolean } = {}
): Promise<string> {
  try {
    const rawTransaction = transaction.serialize();
    const signature = await connection.sendRawTransaction(rawTransaction, {
      skipPreflight: options.skipPreflight ?? false,
      preflightCommitment: 'confirmed',
    });

    // Wait for confirmation
    const confirmation = await connection.confirmTransaction(signature, 'confirmed');

    if (confirmation.value.err) {
      throw new SdkError(
        SdkErrorCode.TRANSACTION_FAILED,
        `Transaction failed: ${JSON.stringify(confirmation.value.err)}`,
        confirmation.value.err
      );
    }

    return signature;
  } catch (error) {
    throw parseError(error);
  }
}

/**
 * Options for building a merkle claim transaction
 */
export interface BuildClaimMerkleTxOptions extends BuildMigrateTxOptions {
  // Additional merkle-specific options can be added here
}

/**
 * Result of building a merkle claim transaction
 */
export interface BuildClaimMerkleTxResult {
  /**
   * The built transaction, ready to sign and send
   */
  transaction: Transaction;

  /**
   * Amount of old tokens being claimed (in base units)
   */
  oldTokenAmount: bigint;

  /**
   * Expected new tokens to receive after penalty (in base units)
   */
  expectedNewTokens: bigint;

  /**
   * Penalty amount in basis points (e.g., 1000 = 10%)
   */
  penaltyBps: number;

  /**
   * Required accounts for the transaction
   */
  accounts: {
    user: PublicKey;
    projectConfig: PublicKey;
    userOldTokenAta: PublicKey;
    userNewTokenAta: PublicKey;
    oldTokenMint: PublicKey;
    newTokenMint: PublicKey;
  };
}

/**
 * Build a merkle claim transaction (late migration with penalty)
 *
 * Creates a transaction that migrates old tokens directly to new tokens using a merkle proof.
 * This is for users who missed the migration window and incur a penalty.
 *
 * @param {Connection} connection - Solana RPC connection
 * @param {PublicKey} user - User wallet public key
 * @param {string} projectId - Project identifier
 * @param {bigint} amount - Amount to claim (in old token base units)
 * @param {Buffer[]} merkleProof - Merkle proof for late claim eligibility
 * @param {LoadedProject} project - Pre-loaded project configuration
 * @param {BuildClaimMerkleTxOptions} [options] - Transaction options
 * @returns {Promise<BuildClaimMerkleTxResult>} Transaction and metadata
 * @throws {SdkError} If claims not enabled or invalid amount
 *
 * @see IDL_REFERENCE.md:310-419 for instruction details
 *
 * @example
 * ```typescript
 * import { Connection, PublicKey } from '@solana/web3.js';
 * import { loadProject, buildClaimMerkleTx, parseTokenAmount } from '@migratefun/sdk';
 *
 * const connection = new Connection('https://api.devnet.solana.com');
 * const user = new PublicKey('...');
 *
 * // Load project first
 * const project = await loadProject('my-project', connection);
 *
 * // Get merkle proof from your merkle tree
 * const merkleProof = [...]; // Array of Buffer
 *
 * // Parse amount
 * const amount = parseTokenAmount(100, project.oldTokenDecimals);
 *
 * // Build merkle claim transaction
 * const { transaction, expectedNewTokens, penaltyBps } = await buildClaimMerkleTx(
 *   connection,
 *   user,
 *   'my-project',
 *   amount,
 *   merkleProof,
 *   project
 * );
 *
 * console.log(`Penalty: ${penaltyBps / 100}%`);
 * console.log(`Expected new tokens: ${expectedNewTokens}`);
 * ```
 */
export async function buildClaimMerkleTx(
  connection: Connection,
  user: PublicKey,
  projectId: string,
  amount: bigint,
  merkleProof: Buffer[],
  project: LoadedProject,
  _options: BuildClaimMerkleTxOptions = {}
): Promise<BuildClaimMerkleTxResult> {
  try {
    // Validate amount
    if (amount <= 0n) {
      throw new SdkError(
        SdkErrorCode.INVALID_AMOUNT,
        'Claim amount must be greater than zero'
      );
    }

    // Get program instance
    const provider = new AnchorProvider(
      connection,
      {
        publicKey: user,
        signTransaction: async () => {
          throw new Error('This is a read-only provider');
        },
        signAllTransactions: async () => {
          throw new Error('This is a read-only provider');
        },
      } as any,
      { commitment: 'confirmed' }
    );

    const program = await getProgram(provider);

    // Resolve required accounts
    const oldTokenProgram = TOKEN_PROGRAM_ID;
    const newTokenProgram = TOKEN_PROGRAM_ID;

    const userOldTokenAta = getAssociatedTokenAddressSync(
      project.oldTokenMint,
      user,
      false,
      oldTokenProgram
    );

    const userNewTokenAta = getAssociatedTokenAddressSync(
      project.newTokenMint,
      user,
      false,
      newTokenProgram
    );

    // Build instruction accounts
    const accounts = {
      user,
      config: project.pdas.projectConfig,
      userOldTokenAta,
      userNewTokenAta,
      oldTokenMint: project.oldTokenMint,
      newTokenMint: project.newTokenMint,
      oldTokenProgram,
      newTokenProgram,
    };

    // Convert bigint to BN for Anchor
    const amountBN = new BN(amount.toString());

    // Convert merkle proof to array format expected by Anchor
    const proofArray = merkleProof.map(p => Array.from(p));

    // Build transaction
    const instruction = await (program as any).methods
      .claimWithMerkle(projectId, amountBN, proofArray)
      .accounts(accounts)
      .instruction();

    const transaction = new Transaction();
    transaction.add(instruction);

    // Set recent blockhash
    const { blockhash } = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = user;

    // Calculate penalty and expected tokens
    // Note: In a real implementation, penalty should come from project config
    const penaltyBps = 0; // TODO: Fetch from project.lateClaimHaircutBps when available

    const penalty = (amount * BigInt(penaltyBps)) / 10000n;
    const amountAfterPenalty = amount - penalty;

    // Adjust for decimal differences
    const expectedNewTokens = adjustForDecimals(
      amountAfterPenalty,
      project.oldTokenDecimals,
      project.newTokenDecimals
    );

    return {
      transaction,
      oldTokenAmount: amount,
      expectedNewTokens,
      penaltyBps,
      accounts: {
        user,
        projectConfig: project.pdas.projectConfig,
        userOldTokenAta,
        userNewTokenAta,
        oldTokenMint: project.oldTokenMint,
        newTokenMint: project.newTokenMint,
      },
    };
  } catch (error) {
    throw parseError(error);
  }
}

/**
 * Options for building a refund claim transaction
 */
export interface BuildClaimRefundTxOptions extends BuildMigrateTxOptions {
  // Additional refund-specific options can be added here
}

/**
 * Result of building a refund claim transaction
 */
export interface BuildClaimRefundTxResult {
  /**
   * The built transaction, ready to sign and send
   */
  transaction: Transaction;

  /**
   * Expected old tokens to be refunded (in base units)
   */
  expectedRefundAmount: bigint;

  /**
   * Required accounts for the transaction
   */
  accounts: {
    user: PublicKey;
    projectConfig: PublicKey;
  };
}

/**
 * Build a refund claim transaction
 *
 * Creates a transaction that returns old tokens to the user by burning their MFT.
 * This is only available for failed migrations.
 *
 * @param {Connection} connection - Solana RPC connection
 * @param {PublicKey} user - User wallet public key
 * @param {string} projectId - Project identifier
 * @param {LoadedProject} project - Pre-loaded project configuration
 * @param {BuildClaimRefundTxOptions} [options] - Transaction options
 * @returns {Promise<BuildClaimRefundTxResult>} Transaction and metadata
 * @throws {SdkError} If refund not available
 *
 * @see IDL_REFERENCE.md:510-617 for instruction details
 *
 * @example
 * ```typescript
 * import { Connection, PublicKey } from '@solana/web3.js';
 * import { loadProject, buildClaimRefundTx } from '@migratefun/sdk';
 *
 * const connection = new Connection('https://api.devnet.solana.com');
 * const user = new PublicKey('...');
 *
 * // Load project first
 * const project = await loadProject('my-project', connection);
 *
 * // Build refund claim transaction
 * const { transaction, expectedRefundAmount } = await buildClaimRefundTx(
 *   connection,
 *   user,
 *   'my-project',
 *   project
 * );
 *
 * console.log(`Expected refund: ${expectedRefundAmount}`);
 *
 * // Sign and send
 * transaction.feePayer = user;
 * const signed = await wallet.signTransaction(transaction);
 * const signature = await connection.sendRawTransaction(signed.serialize());
 * ```
 */
export async function buildClaimRefundTx(
  connection: Connection,
  user: PublicKey,
  projectId: string,
  project: LoadedProject,
  _options: BuildClaimRefundTxOptions = {}
): Promise<BuildClaimRefundTxResult> {
  try {
    // Get program instance
    const provider = new AnchorProvider(
      connection,
      {
        publicKey: user,
        signTransaction: async () => {
          throw new Error('This is a read-only provider');
        },
        signAllTransactions: async () => {
          throw new Error('This is a read-only provider');
        },
      } as any,
      { commitment: 'confirmed' }
    );

    const program = await getProgram(provider);

    // Build instruction accounts
    // Note: For claim_refund, only user is required per IDL_REFERENCE.md:525-528
    const accounts = {
      user,
    };

    // Build transaction (no amount needed - refunds entire migration)
    const instruction = await (program as any).methods
      .claimRefund(projectId)
      .accounts(accounts)
      .instruction();

    const transaction = new Transaction();
    transaction.add(instruction);

    // Set recent blockhash
    const { blockhash } = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = user;

    // TODO: Fetch expected refund amount from user migration record
    const expectedRefundAmount = 0n;

    return {
      transaction,
      expectedRefundAmount,
      accounts: {
        user,
        projectConfig: project.pdas.projectConfig,
      },
    };
  } catch (error) {
    throw parseError(error);
  }
}
