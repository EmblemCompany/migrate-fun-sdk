import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Program, AnchorProvider, web3, BN } from "@coral-xyz/anchor";
import { HustleMigration } from "@/lib/types/generated/hustle_migration";
import { rpcCache } from "@/lib/cache";
import { getTokenMetadata, toRawAmount } from "@/lib/domain/token";
import {
  findMftMintPDA,
  findOldTokenVaultPDA,
  findProjectConfigPDA,
  findRegistryPDA,
  findUserMigrationPDA,
} from "@/lib/domain/project/utils/pdas";
import { filterVisibleProjects } from "@/lib/project-filter";
import { getProjectMigrationStateWithBalance as computeMigrationStateWithBalance } from "@/lib/project-migration-states";
import {
  getDetailedMigrationState,
  type ProjectMigrationInfo,
} from "./types/migration-states";
import {
  ProjectService,
  MigrationStateService,
  ClaimService,
  type ProjectRedirectIntent,
  type ClaimType,
} from "@/lib/domain/project";
import { getTokenProgramFromMint } from "@/lib/domain/token";
import { PROGRAM_ID as MIGRATION_PROGRAM_ID } from "@/lib/constants/solana";
import { getHustleMigrationIdl } from "@/lib/solana/hustle-migration";

// Custom error class for timeout with preserved signature
export class ConfirmTimeoutError extends Error {
  signature: string;

  constructor(
    signature: string,
    message: string = "Transaction confirmation timeout",
  ) {
    super(message);
    this.name = "ConfirmTimeoutError";
    this.signature = signature;
  }
}

// New return type for claim operations
export interface ClaimResult {
  signature: string;
  confirmed: boolean;
}

// Shared retry configuration for confirmation polling
export interface RetryOptions {
  maxRetries?: number;
  intervalMs?: number;
  backoffMultiplier?: number;
}

export const DEFAULT_CONFIRM_RETRY: RetryOptions = {
  maxRetries: 40,
  intervalMs: 3000,
  backoffMultiplier: 1.1,
};

// Import polling helper
import { waitForSignatureFinality } from "./claim-verification";

// Re-export for convenience
export { waitForSignatureFinality };

// Project ID can still come from env for backwards compatibility,
// but will be overridden by selected project
export const DEFAULT_PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID || "";

export interface TokenBalance {
  oldToken: number;
  newToken: number;
  solBalance: number;
  mftBalance?: number; // Migration Finalization Token balance
  // Keep TNSR and HUSTLE for backwards compatibility
  TNSR?: number;
  HUSTLE?: number;
}

export interface TokenSupplies {
  oldTokenSupply: number;
  newTokenSupply: number;
}

// Helper function to add delay between requests
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function createProgram(provider: AnchorProvider): Program<HustleMigration> {
  return new Program<HustleMigration>(
    getHustleMigrationIdl() as HustleMigration,
    provider,
  );
}

// Check project eligibility type
export function checkProjectEligibility(projectConfig: any): {
  isMigrationActive: boolean;
  canClaimMft: boolean;
  isExpired: boolean;
} {
  const now = Date.now() / 1000;
  const startTs = projectConfig.startTs?.toNumber() || 0;
  const endTs = projectConfig.endTs?.toNumber() || 0;

  const isMigrationActive =
    !projectConfig.isPaused && now >= startTs && now < endTs;

  const canClaimMft = projectConfig.claimsEnabled && now >= startTs;

  const isExpired = now >= endTs;

  return {
    isMigrationActive,
    canClaimMft,
    isExpired,
  };
}

// Helper function to check if user has MFT balance
export async function getUserMftBalance(
  connection: Connection,
  walletAddress: string,
  projectId: string,
): Promise<number> {
  try {
    const [mftMint] = findMftMintPDA(projectId);
    const walletPublicKey = new PublicKey(walletAddress);
    const userMftAta = await getAssociatedTokenAddress(
      mftMint,
      walletPublicKey,
      false,
      TOKEN_PROGRAM_ID,
    );

    const mftAccountInfo = await connection.getTokenAccountBalance(userMftAta);
    // MFT always has 9 decimals
    return Number(mftAccountInfo.value.amount) / Math.pow(10, 9);
  } catch {
    // MFT account doesn't exist or not available
    return 0;
  }
}

// Export the detailed migration state function for use in components
export function getProjectMigrationInfo(
  projectConfig: any,
): ProjectMigrationInfo {
  return getDetailedMigrationState(projectConfig);
}

// Enhanced version that checks MFT balance
export async function getProjectMigrationInfoWithBalance(
  projectConfig: any,
  connection?: Connection,
  walletAddress?: string,
): Promise<ProjectMigrationInfo> {
  if (!connection || !walletAddress) {
    return getDetailedMigrationState(projectConfig);
  }

  try {
    const walletPublicKey = new PublicKey(walletAddress);
    return computeMigrationStateWithBalance(
      connection,
      projectConfig,
      walletPublicKey,
    );
  } catch (error) {
    console.error("Failed to compute migration info with balance:", error);
    return getDetailedMigrationState(projectConfig);
  }
}

export async function getProjectRedirectIntent(
  connection: Connection,
  projectConfig: any,
  projectId: string,
  wallet?: PublicKey | null,
): Promise<ProjectRedirectIntent> {
  const projectService = new ProjectService({ connection });
  const migrationStateService = new MigrationStateService(connection);

  const snapshot = projectService.createSnapshot(projectId, projectConfig);
  return migrationStateService.getRedirectIntent(snapshot, wallet ?? null);
}

export async function getProjectClaimType(
  connection: Connection,
  projectConfig: any,
  wallet?: PublicKey | null,
): Promise<ClaimType> {
  const claimService = new ClaimService(connection);
  return claimService.determineClaimType(projectConfig, wallet ?? null);
}

export async function getTokenBalances(
  connection: Connection,
  walletPublicKey: PublicKey,
  projectConfig: any,
): Promise<TokenBalance> {
  // Check cache first for this specific wallet
  const cacheKey = `balances-${walletPublicKey.toBase58()}-${
    projectConfig?.projectId || "default"
  }`;
  const cached = rpcCache.get<TokenBalance>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // Get SOL balance with retry logic
    let solBalance = 0;
    try {
      solBalance = await connection.getBalance(walletPublicKey);
    } catch (error: any) {
      // If it's a rate limit error, throw it up to show user a message
      if (
        error.message?.includes("403") ||
        error.message?.includes("rate limit")
      ) {
        throw new Error(
          "RPC rate limit reached. Please try again in a moment or configure a custom RPC endpoint.",
        );
      }
      solBalance = 0;
    }

    // Add small delay between requests to avoid rate limiting
    await delay(100);

    // Ensure projectConfig is provided
    if (
      !projectConfig ||
      !projectConfig.oldTokenMint ||
      !projectConfig.newTokenMint
    ) {
      throw new Error("Project configuration with token mints is required");
    }

    // Use token mints and programs from project config
    const oldTokenMint =
      projectConfig.oldTokenMint instanceof PublicKey
        ? projectConfig.oldTokenMint
        : new PublicKey(projectConfig.oldTokenMint);
    const newTokenMint =
      projectConfig.newTokenMint instanceof PublicKey
        ? projectConfig.newTokenMint
        : new PublicKey(projectConfig.newTokenMint);
    const oldTokenProgram = projectConfig.oldTokenProgram || TOKEN_PROGRAM_ID;
    const newTokenProgram = projectConfig.newTokenProgram || TOKEN_PROGRAM_ID;

    // Get old token (TNSR) balance
    const oldTokenATA = await getAssociatedTokenAddress(
      oldTokenMint,
      walletPublicKey,
      false,
      oldTokenProgram,
    );

    let TNSRBalance = 0;
    try {
      const oldTokenAccount =
        await connection.getTokenAccountBalance(oldTokenATA);
      TNSRBalance = oldTokenAccount.value.uiAmount || 0;
    } catch (error: any) {
      // ATA doesn't exist or RPC error, balance is 0
      TNSRBalance = 0;
    }

    // Add small delay between requests
    await delay(100);

    // Get new token (HUSTLE) balance
    const newTokenATA = await getAssociatedTokenAddress(
      newTokenMint,
      walletPublicKey,
      false,
      newTokenProgram,
    );

    let HUSTLEBalance = 0;
    try {
      const newTokenAccount =
        await connection.getTokenAccountBalance(newTokenATA);
      HUSTLEBalance = newTokenAccount.value.uiAmount || 0;
    } catch (error: any) {
      // ATA doesn't exist or RPC error, balance is 0
      HUSTLEBalance = 0;
    }

    // Always fetch MFT balance - users receive MFT during migration
    let mftBalance = 0;
    if (projectConfig.projectId) {
      try {
        await delay(100); // Rate limiting
        const [mftMint] = findMftMintPDA(projectConfig.projectId);
        const userMftAta = await getAssociatedTokenAddress(
          mftMint,
          walletPublicKey,
          false,
          TOKEN_PROGRAM_ID,
        );
        const mftAccountInfo =
          await connection.getTokenAccountBalance(userMftAta);
        // MFT always has 9 decimals
        mftBalance = Number(mftAccountInfo.value.amount) / Math.pow(10, 9);
      } catch {
        // MFT account doesn't exist or not available
        mftBalance = 0;
      }
    }

    const result = {
      oldToken: TNSRBalance,
      newToken: HUSTLEBalance,
      solBalance: solBalance / web3.LAMPORTS_PER_SOL,
      mftBalance,
      // Keep TNSR and HUSTLE for backwards compatibility
      TNSR: TNSRBalance,
      HUSTLE: HUSTLEBalance,
    };

    // Cache for 10 seconds to avoid rapid repeated calls
    rpcCache.set(cacheKey, result, 10000);

    return result;
  } catch (error: any) {
    // Re-throw rate limit errors so UI can show appropriate message
    if (error.message?.includes("RPC rate limit")) {
      throw error;
    }
    return {
      oldToken: 0,
      newToken: 0,
      solBalance: 0,
      mftBalance: 0,
      TNSR: 0,
      HUSTLE: 0,
    };
  }
}

export async function claimWithMft(
  connection: Connection,
  wallet: any,
  projectId: string,
  mftAmount: number,
  projectConfig: any,
): Promise<ClaimResult> {
  if (!wallet.publicKey) {
    throw new Error("Wallet not connected");
  }

  let signature: string | undefined;

  try {
    const provider = new AnchorProvider(connection, wallet as any, {});
    const program = createProgram(provider);

    // Get MFT decimals from project config
    const mftDecimals = projectConfig.mftDecimals || 9;

    // Convert the user-provided amount to the proper format with decimals using toRawAmount for precision
    const mftAmountBN = new BN(toRawAmount(mftAmount, mftDecimals));

    // Verify the user has enough MFT balance
    const [mftMint] = findMftMintPDA(projectId);
    const userMftAta = await getAssociatedTokenAddress(
      mftMint,
      wallet.publicKey,
      false,
      TOKEN_PROGRAM_ID,
    );

    const mftAccountInfo = await connection.getTokenAccountBalance(userMftAta);
    const mftBalanceRaw = mftAccountInfo.value?.amount;

    if (!mftBalanceRaw || mftBalanceRaw === "0") {
      throw new Error("No MFT tokens available to claim");
    }

    const mftBalanceBN = new BN(mftBalanceRaw);

    // Check if requested amount exceeds balance
    if (mftAmountBN.gt(mftBalanceBN)) {
      throw new Error("Insufficient MFT balance for the requested amount");
    }

    // Build transaction
    const tx = await program.methods
      .claimWithMft(projectId, mftAmountBN)
      .accounts({
        user: wallet.publicKey,
        newTokenMint: projectConfig.newTokenMint,
        newTokenProgram: projectConfig.newTokenProgram || TOKEN_PROGRAM_ID,
      })
      .transaction();

    // Set fee payer and recent blockhash
    tx.feePayer = wallet.publicKey;
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash("confirmed");
    tx.recentBlockhash = blockhash;

    // Send via wallet adapter (handles signing)
    signature = await wallet.sendTransaction(tx, connection);
    console.log("MFT claim transaction sent:", signature);

    // Try to confirm with our custom polling
    try {
      const confirmed = await waitForSignatureFinality(
        connection,
        signature!, // We know signature exists here
        DEFAULT_CONFIRM_RETRY,
      );

      if (confirmed) {
        console.log("MFT claim confirmed:", signature);
        return { signature: signature!, confirmed: true };
      } else {
        // Transaction failed
        throw new Error("Transaction failed to confirm");
      }
    } catch (confirmError) {
      // Confirmation timed out but we have the signature
      console.log(
        "Confirmation timeout, but transaction may still succeed:",
        signature,
      );
      throw new ConfirmTimeoutError(
        signature!,
        "Transaction submitted but confirmation is taking longer than expected. Your claim may still process successfully.",
      );
    }
  } catch (error: any) {
    console.error("MFT claim error:", error);

    // If we have a signature, throw ConfirmTimeoutError to preserve it
    if (signature && !error.signature) {
      throw new ConfirmTimeoutError(
        signature,
        error.message || "Transaction submitted but encountered an error",
      );
    }

    // Enhanced error messages
    if (error.message?.includes("insufficient")) {
      throw new Error("Insufficient MFT balance for claim");
    } else if (error.message?.includes("claims not enabled")) {
      throw new Error("Claims are not enabled for this project");
    } else if (error.message?.includes("0x0")) {
      throw new Error("No MFT tokens to claim");
    }

    throw error;
  }
}

// Helper function to get user migration record
export async function getUserMigration(
  connection: Connection,
  userPublicKey: PublicKey,
  projectId: string,
): Promise<any | null> {
  try {
    // Create a read-only provider
    const dummyWallet = {
      publicKey: new PublicKey("11111111111111111111111111111111"),
      signTransaction: async () => {
        throw new Error("Read-only wallet");
      },
      signAllTransactions: async () => {
        throw new Error("Read-only wallet");
      },
    };

    const provider = new AnchorProvider(connection, dummyWallet as any, {});
    const program = createProgram(provider);

    // Derive UserMigration PDA
    const [userMigrationPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("user_migration"),
        Buffer.from(projectId),
        userPublicKey.toBuffer(),
      ],
      MIGRATION_PROGRAM_ID,
    );

    // Try to fetch the account
    const userMigration =
      await program.account.userMigration.fetch(userMigrationPDA);
    return userMigration;
  } catch (error) {
    // Account doesn't exist - user hasn't migrated
    console.log("User migration record not found:", error);
    return null;
  }
}

export async function claimRefund(
  connection: Connection,
  wallet: any,
  projectId: string,
  projectConfig: any,
): Promise<string> {
  if (!wallet.publicKey) {
    throw new Error("Wallet not connected");
  }

  try {
    const provider = new AnchorProvider(connection, wallet as any, {});
    const program = createProgram(provider);

    // First, fetch user migration record to validate they participated
    const userMigration = await getUserMigration(
      connection,
      wallet.publicKey,
      projectId,
    );
    if (!userMigration) {
      throw new Error("You did not participate in this migration");
    }

    if (userMigration.hasClaimedRefund) {
      throw new Error("You have already claimed your refund");
    }

    // Check MFT balance to ensure user has enough to burn
    const [mftMint] = findMftMintPDA(projectId);
    const userMftAta = await getAssociatedTokenAddress(
      mftMint,
      wallet.publicKey,
      false,
      TOKEN_PROGRAM_ID,
    );

    const mftAccountInfo = await connection.getTokenAccountBalance(userMftAta);
    const mftBalanceRaw = mftAccountInfo.value?.amount || "0";
    const mftBalanceBN = new BN(mftBalanceRaw);
    const { calculateMftAmount } = await import("@/lib/migration-calculations");
    const requiredMft = calculateMftAmount(
      userMigration.amountMigrated,
      projectConfig.exchangeRateBasisPoints || 10000,
      projectConfig.oldTokenDecimals || 9,
      9, // MFT always has 9 decimals
    );

    if (mftBalanceBN.lt(requiredMft)) {
      throw new Error(
        `Insufficient MFT tokens. Need ${requiredMft.toString()}, have ${mftBalanceBN.toString()}`,
      );
    }

    // Build and send the refund claim transaction
    const tx = await program.methods
      .claimRefund(projectId)
      .accounts({
        user: wallet.publicKey,
      })
      .rpc();

    console.log("Refund claim successful:", tx);
    return tx;
  } catch (error: any) {
    console.error("Refund claim error:", error);

    // Enhanced error messages
    if (error.message?.includes("already claimed")) {
      throw new Error("You have already claimed your refund");
    } else if (error.message?.includes("migration not failed")) {
      throw new Error("Refunds are only available for failed migrations");
    } else if (error.message?.includes("no tokens to refund")) {
      throw new Error("You have no tokens to refund");
    } else if (error.message?.includes("did not participate")) {
      throw error; // Pass through our custom error
    } else if (error.message?.includes("Insufficient MFT")) {
      throw error; // Pass through our custom error
    } else if (error.message?.includes("0x0")) {
      throw new Error("No MFT tokens found for refund");
    }

    throw error;
  }
}

export async function executeMigration(
  connection: Connection,
  wallet: any,
  amount: number,
  projectConfig: any,
): Promise<string> {
  if (!wallet.publicKey) {
    throw new Error("Wallet not connected");
  }

  try {
    // Always re-fetch a fresh project config to avoid stale flags
    try {
      const fresh = await getProjectConfig(
        connection,
        projectConfig?.projectId || projectConfig?.project_id || "",
      );
      if (fresh) projectConfig = fresh;
    } catch {}

    // Guard: ensure project vaults are initialized before attempting migration
    const hasInitFlag = Object.prototype.hasOwnProperty.call(
      projectConfig || {},
      "isInitialized",
    );
    const isInitializedOk = hasInitFlag ? !!projectConfig.isInitialized : true; // treat missing as true (older layouts)
    const vaultsOk = !!projectConfig?.vaultsInitialized;
    if (!isInitializedOk || !vaultsOk) {
      throw new Error(
        "Project is not initialized on-chain (vaults not ready). Please try again later.",
      );
    }

    const provider = new AnchorProvider(connection, wallet as any, {});
    const program = createProgram(provider);

    const toPublicKey = (value: any): PublicKey => {
      if (!value) {
        throw new Error("Missing public key value");
      }
      if (value instanceof PublicKey) {
        return value;
      }
      if (typeof value === "string") {
        return new PublicKey(value);
      }
      if (value?.toBase58) {
        return new PublicKey(value.toBase58());
      }
      throw new Error("Invalid public key value");
    };

    const projectConfigAddress = projectConfig.publicKey
      ? toPublicKey(projectConfig.publicKey)
      : findProjectConfigPDA(projectConfig.projectId)[0];

    const oldTokenMint = toPublicKey(projectConfig.oldTokenMint);
    const oldTokenProgram = projectConfig.oldTokenProgram
      ? toPublicKey(projectConfig.oldTokenProgram)
      : TOKEN_PROGRAM_ID;

    const [mftMintPda] = findMftMintPDA(projectConfig.projectId);
    const [oldTokenVaultPda] = findOldTokenVaultPDA(projectConfig.projectId);
    const [userMigrationPda] = findUserMigrationPDA(
      wallet.publicKey,
      projectConfig.projectId,
    );

    const userOldTokenAta = await getAssociatedTokenAddress(
      oldTokenMint,
      wallet.publicKey,
      false,
      oldTokenProgram,
    );
    const userMftAta = await getAssociatedTokenAddress(
      mftMintPda,
      wallet.publicKey,
      false,
      TOKEN_PROGRAM_ID,
    );

    // CRITICAL FIX: Get actual decimals from project config or metadata
    // Don't assume 6 decimals - different tokens have different decimals
    const oldTokenDecimals = projectConfig.oldTokenDecimals || 9;

    // FIXED: Use proper BN conversion to avoid precision issues
    // Convert decimal string to BN properly to prevent overflow
    const amountStr = amount.toString();
    const parts = amountStr.split(".");
    const wholePart = parts[0] || "0";
    const decimalPart = (parts[1] || "")
      .padEnd(oldTokenDecimals, "0")
      .slice(0, oldTokenDecimals);

    // Combine parts and clean leading zeros
    const fullAmountStr = wholePart + decimalPart;
    const cleanAmountStr = fullAmountStr.replace(/^0+/, "") || "0";
    const migrationAmount = new BN(cleanAmountStr);

    // Fetch blockhash and build transaction in parallel for faster execution
    const [blockhashResult, transaction] = await Promise.all([
      connection.getLatestBlockhash("processed"),
      program.methods
        .migrate(projectConfig.projectId, migrationAmount)
        .accounts({
          user: wallet.publicKey,
          projectConfig: projectConfigAddress,
          userOldTokenAta,
          userMftAta,
          oldTokenVault: oldTokenVaultPda,
          oldTokenMint,
          mftMint: mftMintPda,
          userMigration: userMigrationPda,
          oldTokenProgram,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
        } as any)
        .transaction(),
    ]);

    // Set transaction parameters
    transaction.recentBlockhash = blockhashResult.blockhash;
    transaction.feePayer = wallet.publicKey;

    // Sign transaction
    const signedTx = await wallet.signTransaction(transaction);

    // Send raw transaction without WebSocket confirmation
    const rawTransaction = signedTx.serialize();
    const txid = await connection.sendRawTransaction(rawTransaction, {
      skipPreflight: false,
      preflightCommitment: "confirmed",
    });

    return txid;
  } catch (error) {
    // Surface logs if available for better diagnostics
    try {
      if (error && typeof (error as any).getLogs === "function") {
        const logs = await (error as any).getLogs();
        console.error("Migration simulation logs:", logs);
      }
    } catch (_) {}
    throw error;
  }
}

// Helper function to find commitment config PDA
// Note: This is not in helpers.ts yet, keeping it here for now
export function findCommitmentConfigPDA(
  projectId: string,
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("project_commitment"), Buffer.from(projectId)],
    MIGRATION_PROGRAM_ID,
  );
}

// Helper function to check if migration is available
export async function isMigrationAvailable(
  connection: Connection,
  projectId: string,
): Promise<boolean> {
  try {
    // Check if project config exists
    const [projectConfigPDA] = findProjectConfigPDA(projectId);
    const accountInfo = await connection.getAccountInfo(projectConfigPDA);

    if (!accountInfo) {
      return false;
    }

    // Fetch project config to check if it's initialized and not paused
    const config = await getProjectConfig(connection, projectId);
    const now = Date.now() / 1000;

    return (
      config.isInitialized &&
      !config.isPaused &&
      now >= config.startTs.toNumber() &&
      now <= config.endTs.toNumber()
    );
  } catch (error) {
    return false;
  }
}

// Helper function to get project configuration
// Helper function to list available project IDs
export async function getAvailableProjects(
  connection: Connection,
): Promise<string[]> {
  try {
    const dummyWallet = {
      publicKey: new PublicKey("11111111111111111111111111111111"),
      signTransaction: async () => {
        throw new Error("Read-only wallet");
      },
      signAllTransactions: async () => {
        throw new Error("Read-only wallet");
      },
    };

    const provider = new AnchorProvider(connection, dummyWallet as any, {});
    const program = createProgram(provider);

    // First try to fetch all project configs directly
    try {
      const accounts = await program.account.projectConfig.all();
      const projectIds = accounts
        .map((acc) => acc.account.projectId)
        .filter((id) => id && id.length > 0);

      if (projectIds.length > 0) {
        console.log(`Found ${projectIds.length} projects:`, projectIds);
        return projectIds;
      }
    } catch (err) {
      console.log("Could not fetch project configs directly");
    }

    // Fallback: Try to fetch project registry
    const [projectRegistryPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("project_registry")],
      MIGRATION_PROGRAM_ID,
    );

    try {
      const registry =
        await program.account.projectRegistry.fetch(projectRegistryPDA);
      return registry.projectIds || [];
    } catch {
      console.log("Registry not found or empty");
      return [];
    }
  } catch (error) {
    console.error("Error in getAvailableProjects:", error);
    return [];
  }
}

// Note: getAllProjects function moved to end of file with enhanced filtering

export async function getProjectConfig(
  connection: Connection,
  projectId: string,
): Promise<any> {
  const service = new ProjectService({ connection });
  const snapshot = await service.loadProject(projectId);

  if (!snapshot) {
    try {
      const availableProjects = await getAvailableProjects(connection);
      if (availableProjects.length > 0) {
        console.log(`Available projects: ${availableProjects.join(", ")}`);
      } else {
        console.log("No projects found in registry.");
      }
    } catch (registryError) {
      console.log("Could not check project registry:", registryError);
    }

    return null;
  }

  return snapshot.raw;
}

export async function getTokenSupplies(
  connection: Connection,
  projectConfig?: any,
): Promise<TokenSupplies> {
  try {
    if (!projectConfig) {
      return { oldTokenSupply: 0, newTokenSupply: 0 };
    }

    // Check cache first
    const cacheKey = `token-supplies-${projectConfig.projectId}`;
    const cached = rpcCache.get<TokenSupplies>(cacheKey);
    if (cached) {
      return cached;
    }

    // Make sure we have the mints as PublicKey objects
    const oldTokenMint =
      projectConfig.oldTokenMint instanceof PublicKey
        ? projectConfig.oldTokenMint
        : new PublicKey(projectConfig.oldTokenMint);
    const newTokenMint =
      projectConfig.newTokenMint instanceof PublicKey
        ? projectConfig.newTokenMint
        : new PublicKey(projectConfig.newTokenMint);

    // Fetch old token supply
    let oldTokenSupply = 0;
    try {
      const oldMintInfo = await connection.getParsedAccountInfo(oldTokenMint);
      if (oldMintInfo.value?.data && "parsed" in oldMintInfo.value.data) {
        const decimals = oldMintInfo.value.data.parsed.info.decimals;
        const supply = oldMintInfo.value.data.parsed.info.supply;
        oldTokenSupply = Number(supply) / Math.pow(10, decimals);
      } else {
      }
    } catch (error) {}

    await delay(100);

    // Fetch new token supply
    let newTokenSupply = 0;
    try {
      const newMintInfo = await connection.getParsedAccountInfo(newTokenMint);
      if (newMintInfo.value?.data && "parsed" in newMintInfo.value.data) {
        const decimals = newMintInfo.value.data.parsed.info.decimals;
        const supply = newMintInfo.value.data.parsed.info.supply;
        newTokenSupply = Number(supply) / Math.pow(10, decimals);
      } else {
      }
    } catch (error) {}

    const result = { oldTokenSupply, newTokenSupply };

    // Cache for 30 seconds
    rpcCache.set(cacheKey, result, 30000);

    return result;
  } catch (error) {
    return { oldTokenSupply: 0, newTokenSupply: 0 };
  }
}

/**
 * Get all available projects with filtering and sorting
 * @param connection - Solana connection
 * @returns Array of project configurations sorted by priority
 */
export async function getAllProjects(connection: Connection): Promise<any[]> {
  try {
    // Create a read-only wallet for fetching data
    const dummyWallet = {
      publicKey: new PublicKey("11111111111111111111111111111111"),
      signTransaction: async () => {
        throw new Error("Read-only wallet");
      },
      signAllTransactions: async () => {
        throw new Error("Read-only wallet");
      },
    };

    const provider = new AnchorProvider(connection, dummyWallet as any, {});
    const program = createProgram(provider);

    // Fetch all project configs
    const accounts = await program.account.projectConfig.all();

    // Filter out hidden projects first
    const visibleAccounts = filterVisibleProjects(
      accounts,
      (acc) => acc.account.projectId,
    );

    const now = Date.now() / 1000;

    // Process and filter visible projects
    const projectsWithStatus = await Promise.all(
      visibleAccounts.map(async (account) => {
        const config = account.account;
        const startTs = config.startTs?.toNumber
          ? config.startTs.toNumber()
          : config.startTs;
        const endTs = config.endTs?.toNumber
          ? config.endTs.toNumber()
          : config.endTs;

        // Filter out projects that expired over 90 days ago
        const isExpired = now > endTs + 90 * 24 * 60 * 60;
        if (isExpired) return null;

        // Check if project has started
        const hasStarted = now >= startTs;
        if (!hasStarted) return null;

        // Determine project status
        const isActive = now >= startTs && now < endTs;
        const hasEnded = now >= endTs;

        // Try to fetch token metadata for better display
        let oldTokenMetadata = null;
        let newTokenMetadata = null;
        try {
          [oldTokenMetadata, newTokenMetadata] = await Promise.all([
            getTokenMetadata(connection, config.oldTokenMint),
            getTokenMetadata(connection, config.newTokenMint),
          ]);
        } catch (error) {
          // Metadata fetch failed, continue without it
        }

        return {
          publicKey: account.publicKey,
          account: config,
          isActive,
          hasEnded,
          startTs,
          endTs,
          oldTokenMetadata,
          newTokenMetadata,
        };
      }),
    );

    // Filter out null values and sort
    const filteredProjects = projectsWithStatus
      .filter((p) => p !== null)
      .sort((a, b) => {
        // Active projects first
        if (a!.isActive && !b!.isActive) return -1;
        if (!a!.isActive && b!.isActive) return 1;

        // Then by start time (newest first)
        return b!.startTs - a!.startTs;
      });

    return filteredProjects;
  } catch (error) {
    console.error("Error fetching all projects:", error);
    return [];
  }
}
