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
  ComputeBudgetProgram,
} from '@solana/web3.js';
import {
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountIdempotentInstruction,
  TOKEN_PROGRAM_ID,
  // TOKEN_2022_PROGRAM_ID,  // Will be used in future for Token-2022 detection
} from '@solana/spl-token';

import { getProgram } from '../core/program';
import { LoadedProject, SdkError, SdkErrorCode } from '../core/types';
import { parseError } from '../utils/errors';

/**
 * Determine the token program for a mint based on project configuration
 * @internal
 */
function getTokenProgramForMint(_mint: PublicKey, _project: LoadedProject): PublicKey {
  // For now, we default to TOKEN_PROGRAM_ID
  // In the future, this can be enhanced to detect Token-2022 based on:
  // - The mint address (_mint) by checking on-chain
  // - Project configuration (_project)
  // - Token metadata
  return TOKEN_PROGRAM_ID;
}

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

    // Validate migration window
    const now = Date.now() / 1000;
    if (now < project.startTs) {
      throw new SdkError(
        SdkErrorCode.MIGRATION_WINDOW_CLOSED,
        `Migration has not started yet. Start time: ${new Date(project.startTs * 1000).toISOString()}`
      );
    }
    if (now >= project.endTs) {
      throw new SdkError(
        SdkErrorCode.MIGRATION_WINDOW_CLOSED,
        `Migration window has ended. End time: ${new Date(project.endTs * 1000).toISOString()}`
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

    // Determine token programs
    const oldTokenProgram = getTokenProgramForMint(project.oldTokenMint, project);
    const mftTokenProgram = TOKEN_PROGRAM_ID; // MFT always uses standard token program

    // Derive Associated Token Accounts
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
      mftTokenProgram
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
    const transaction = new Transaction();

    // Add compute budget instructions
    // Default to 200k compute units and small priority fee to ensure transaction success
    const computeUnitLimit = options.computeUnitLimit || 200000;
    const computeUnitPrice = options.computeUnitPrice || 1000; // 0.001 lamports per compute unit

    transaction.add(
      ComputeBudgetProgram.setComputeUnitLimit({
        units: computeUnitLimit,
      })
    );

    transaction.add(
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: computeUnitPrice,
      })
    );

    // Create ATAs if they don't exist (idempotent - won't fail if they already exist)
    // Create old token ATA if needed
    const createOldTokenAtaIx = createAssociatedTokenAccountIdempotentInstruction(
      user,  // payer
      userOldTokenAta,  // ata
      user,  // owner
      project.oldTokenMint,  // mint
      oldTokenProgram  // token program
    );
    transaction.add(createOldTokenAtaIx);

    // Create MFT ATA if needed
    const createMftAtaIx = createAssociatedTokenAccountIdempotentInstruction(
      user,  // payer
      userMftAta,  // ata
      user,  // owner
      project.mftMint,  // mint
      mftTokenProgram  // token program
    );
    transaction.add(createMftAtaIx);

    // Add the migration instruction
    const instruction = await (program as any).methods
      .migrate(projectId, amountBN)
      .accounts(accounts)
      .instruction();

    transaction.add(instruction);

    // Set blockhash for signing (will be refreshed in sendAndConfirmTransaction if stale)
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = blockhash;
    transaction.lastValidBlockHeight = lastValidBlockHeight;
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
    // Validate project status
    if (project.paused) {
      throw new SdkError(
        SdkErrorCode.PROJECT_PAUSED,
        'Project is paused - claims are temporarily disabled'
      );
    }

    // Validate claims are enabled
    if (!project.claimsEnabled) {
      throw new SdkError(
        SdkErrorCode.INVALID_PHASE,
        'Claims are not enabled yet for this project'
      );
    }

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

    // Determine token programs
    const mftTokenProgram = TOKEN_PROGRAM_ID; // MFT always uses standard token program
    const newTokenProgram = getTokenProgramForMint(project.newTokenMint, project);

    // Derive Associated Token Accounts
    const userMftAta = getAssociatedTokenAddressSync(
      project.mftMint,
      user,
      false,
      mftTokenProgram
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
    const transaction = new Transaction();

    // Add compute budget instructions for claim transactions
    const computeUnitLimit = _options.computeUnitLimit || 200000;
    const computeUnitPrice = _options.computeUnitPrice || 1000;

    transaction.add(
      ComputeBudgetProgram.setComputeUnitLimit({
        units: computeUnitLimit,
      })
    );

    transaction.add(
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: computeUnitPrice,
      })
    );

    // Create ATAs if they don't exist (idempotent - won't fail if they already exist)
    // Create MFT ATA if needed (user needs MFT to claim)
    const createMftAtaIx = createAssociatedTokenAccountIdempotentInstruction(
      user,  // payer
      userMftAta,  // ata
      user,  // owner
      project.mftMint,  // mint
      mftTokenProgram  // token program
    );
    transaction.add(createMftAtaIx);

    // Create new token ATA if needed (for receiving new tokens)
    const createNewTokenAtaIx = createAssociatedTokenAccountIdempotentInstruction(
      user,  // payer
      userNewTokenAta,  // ata
      user,  // owner
      project.newTokenMint,  // mint
      newTokenProgram  // token program
    );
    transaction.add(createNewTokenAtaIx);

    // Add the claim instruction
    const instruction = await (program as any).methods
      .claimWithMft(projectId, mftAmountBN)
      .accounts(accounts)
      .instruction();

    transaction.add(instruction);

    // Set blockhash for signing (will be refreshed in sendAndConfirmTransaction if stale)
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = blockhash;
    transaction.lastValidBlockHeight = lastValidBlockHeight;
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
  options: { skipPreflight?: boolean; maxRetries?: number } = {}
): Promise<string> {
  const maxRetries = options.maxRetries ?? 2;
  let lastError: Error | null = null;
  let lastSignature: string | null = null;

  // Transaction should already have a blockhash from builder, but ensure it's set
  if (!transaction.recentBlockhash) {
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = blockhash;
    transaction.lastValidBlockHeight = lastValidBlockHeight;
  }

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // If this is a retry, get a fresh blockhash
      if (attempt > 0) {
        console.log(`Retry attempt ${attempt + 1} with fresh blockhash...`);
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
        transaction.recentBlockhash = blockhash;
        transaction.lastValidBlockHeight = lastValidBlockHeight;

        // On retry, consider skipping preflight if it failed before
        // This helps when simulation fails but transaction would succeed
        if (attempt === maxRetries - 1) {
          console.log('Final attempt - skipping preflight simulation');
        }
      }

      const rawTransaction = transaction.serialize();

      // On last retry, skip preflight to try sending anyway
      const skipPreflight = options.skipPreflight ?? (attempt === maxRetries - 1);

      const signature = await connection.sendRawTransaction(rawTransaction, {
        skipPreflight,
        preflightCommitment: 'confirmed',
        maxRetries: 1, // We handle retries ourselves
      });

      // Store signature for error recovery
      lastSignature = signature;

      // Wait for confirmation with timeout
      const confirmationPromise = connection.confirmTransaction({
        signature,
        blockhash: transaction.recentBlockhash!,
        lastValidBlockHeight: transaction.lastValidBlockHeight!,
      }, 'confirmed');

      // Add timeout to confirmation (30 seconds)
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Transaction confirmation timeout')), 30000)
      );

      const confirmation = await Promise.race([
        confirmationPromise,
        timeoutPromise
      ]) as any;

      if (confirmation?.value?.err) {
        throw new SdkError(
          SdkErrorCode.TRANSACTION_FAILED,
          `Transaction failed: ${JSON.stringify(confirmation.value.err)}`,
          confirmation.value.err
        );
      }

      return signature;
    } catch (error: any) {
      lastError = error;

      // Check if error is blockhash expiry
      const errorMessage = error?.message?.toLowerCase() || '';
      const isBlockhashExpired = (errorMessage.includes('blockhash') && errorMessage.includes('not found')) ||
                                  (errorMessage.includes('block height') && errorMessage.includes('exceeded')) ||
                                  errorMessage.includes('blockhash has expired') ||
                                  errorMessage.includes('signature') && errorMessage.includes('expired');

      // If blockhash expired but we have a signature, check if transaction actually succeeded
      if (isBlockhashExpired && lastSignature) {
        console.log('Blockhash expired during confirmation, checking transaction status directly...');

        try {
          // Use getSignatureStatus to check without blockhash
          const statusResponse = await connection.getSignatureStatus(lastSignature);

          if (statusResponse?.value?.confirmationStatus === 'confirmed' ||
              statusResponse?.value?.confirmationStatus === 'finalized') {
            console.log('Transaction was successfully confirmed despite blockhash expiry!');
            return lastSignature;
          }

          if (statusResponse?.value?.err) {
            throw new SdkError(
              SdkErrorCode.TRANSACTION_FAILED,
              `Transaction failed: ${JSON.stringify(statusResponse.value.err)}`,
              statusResponse.value.err
            );
          }

          // Status is still pending, might need to wait longer
          // Try one more time with a short delay
          console.log('Transaction status pending, waiting before final check...');
          await new Promise(resolve => setTimeout(resolve, 2000));

          const finalStatus = await connection.getSignatureStatus(lastSignature);
          if (finalStatus?.value?.confirmationStatus === 'confirmed' ||
              finalStatus?.value?.confirmationStatus === 'finalized') {
            console.log('Transaction confirmed after additional wait!');
            return lastSignature;
          }

          if (finalStatus?.value?.err) {
            throw new SdkError(
              SdkErrorCode.TRANSACTION_FAILED,
              `Transaction failed: ${JSON.stringify(finalStatus.value.err)}`,
              finalStatus.value.err
            );
          }

          console.log('Transaction status still unknown, will retry if attempts remain');
        } catch (statusError) {
          console.error('Failed to check transaction status:', statusError);
          // Fall through to normal retry logic
        }
      }

      // Check if error is simulation failure
      const isSimulationError = errorMessage.includes('simulation') ||
                                errorMessage.includes('preflight') ||
                                errorMessage.includes('0x1'); // Common simulation error code

      // If it's a simulation error and we have retries left, continue
      if (isSimulationError && attempt < maxRetries - 1) {
        console.log(`Simulation failed, retrying... (attempt ${attempt + 1}/${maxRetries})`);
        // Small delay before retry
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }

      // If not retryable or no retries left, throw the error
      break;
    }
  }

  // If we get here, all retries failed
  throw parseError(lastError || new Error('Transaction failed after all retries'));
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

    // Determine token programs
    const oldTokenProgram = getTokenProgramForMint(project.oldTokenMint, project);
    const newTokenProgram = getTokenProgramForMint(project.newTokenMint, project);

    // Derive Associated Token Accounts
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
      projectConfig: project.pdas.projectConfig,  // Fixed: was 'config', should be 'projectConfig'
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
    const transaction = new Transaction();

    // Add compute budget instructions for claim transactions
    const computeUnitLimit = _options.computeUnitLimit || 200000;
    const computeUnitPrice = _options.computeUnitPrice || 1000;

    transaction.add(
      ComputeBudgetProgram.setComputeUnitLimit({
        units: computeUnitLimit,
      })
    );

    transaction.add(
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: computeUnitPrice,
      })
    );

    // Create ATAs if they don't exist (idempotent - won't fail if they already exist)
    // Create old token ATA if needed (for burning old tokens)
    const createOldTokenAtaIx = createAssociatedTokenAccountIdempotentInstruction(
      user,  // payer
      userOldTokenAta,  // ata
      user,  // owner
      project.oldTokenMint,  // mint
      oldTokenProgram  // token program
    );
    transaction.add(createOldTokenAtaIx);

    // Create new token ATA if needed (for receiving new tokens)
    const createNewTokenAtaIx = createAssociatedTokenAccountIdempotentInstruction(
      user,  // payer
      userNewTokenAta,  // ata
      user,  // owner
      project.newTokenMint,  // mint
      newTokenProgram  // token program
    );
    transaction.add(createNewTokenAtaIx);

    // Add the merkle claim instruction
    const instruction = await (program as any).methods
      .claimWithMerkle(projectId, amountBN, proofArray)
      .accounts(accounts)
      .instruction();

    transaction.add(instruction);

    // Set blockhash for signing (will be refreshed in sendAndConfirmTransaction if stale)
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = blockhash;
    transaction.lastValidBlockHeight = lastValidBlockHeight;
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

    // Determine token programs
    const oldTokenProgram = getTokenProgramForMint(project.oldTokenMint, project);
    const mftTokenProgram = TOKEN_PROGRAM_ID; // MFT always uses standard token program

    // Derive Associated Token Accounts
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
      mftTokenProgram
    );

    // Build instruction accounts
    // Include both user and projectConfig for proper validation
    const accounts = {
      user,
      projectConfig: project.pdas.projectConfig,
      userOldTokenAta,
      userMftAta,
      oldTokenMint: project.oldTokenMint,
      mftMint: project.mftMint,
      oldTokenProgram,
    };

    // Build transaction
    const transaction = new Transaction();

    // Add compute budget instructions for claim transactions
    const computeUnitLimit = _options.computeUnitLimit || 200000;
    const computeUnitPrice = _options.computeUnitPrice || 1000;

    transaction.add(
      ComputeBudgetProgram.setComputeUnitLimit({
        units: computeUnitLimit,
      })
    );

    transaction.add(
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: computeUnitPrice,
      })
    );

    // Create ATAs if they don't exist (idempotent - won't fail if they already exist)
    // Create old token ATA if needed (for receiving refunded tokens)
    const createOldTokenAtaIx = createAssociatedTokenAccountIdempotentInstruction(
      user,  // payer
      userOldTokenAta,  // ata
      user,  // owner
      project.oldTokenMint,  // mint
      oldTokenProgram  // token program
    );
    transaction.add(createOldTokenAtaIx);

    // Create MFT ATA if needed (for burning MFT during refund)
    const createMftAtaIx = createAssociatedTokenAccountIdempotentInstruction(
      user,  // payer
      userMftAta,  // ata
      user,  // owner
      project.mftMint,  // mint
      mftTokenProgram  // token program
    );
    transaction.add(createMftAtaIx);

    // Add the refund instruction (no amount needed - refunds entire migration)
    const instruction = await (program as any).methods
      .claimRefund(projectId)
      .accounts(accounts)
      .instruction();

    transaction.add(instruction);

    // Set blockhash for signing (will be refreshed in sendAndConfirmTransaction if stale)
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
    transaction.recentBlockhash = blockhash;
    transaction.lastValidBlockHeight = lastValidBlockHeight;
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
