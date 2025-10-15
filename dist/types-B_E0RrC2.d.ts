import { PublicKey } from '@solana/web3.js';

/**
 * Solana network identifier
 */
type Network = 'devnet' | 'mainnet-beta';
/**
 * IDL source preference
 */
type IdlSource = 'bundle' | 'onchain';
/**
 * Project migration phase
 */
declare enum MigrationPhase {
    Setup = 0,
    ActiveMigration = 1,
    GracePeriod = 2,
    Finalized = 3
}
/**
 * Complete project metadata with derived PDAs
 */
interface LoadedProject {
    projectId: PublicKey;
    oldTokenMint: PublicKey;
    newTokenMint: PublicKey;
    mftMint: PublicKey;
    phase: MigrationPhase;
    paused: boolean;
    oldTokenDecimals: number;
    newTokenDecimals: number;
    mftDecimals: number;
    exchangeRate: bigint;
    pdas: {
        projectConfig: PublicKey;
        mftMint: PublicKey;
        oldTokenVault: PublicKey;
        newTokenVault: PublicKey;
    };
}
/**
 * User token balances snapshot
 */
interface BalanceSnapshot {
    oldToken: bigint;
    newToken: bigint;
    mft: bigint;
    sol: bigint;
}
/**
 * SDK error codes
 */
declare enum SdkErrorCode {
    PROJECT_NOT_FOUND = "PROJECT_NOT_FOUND",
    PROJECT_PAUSED = "PROJECT_PAUSED",
    MIGRATION_WINDOW_CLOSED = "MIGRATION_WINDOW_CLOSED",
    INVALID_PHASE = "INVALID_PHASE",
    ACCOUNT_NOT_FOUND = "ACCOUNT_NOT_FOUND",
    INSUFFICIENT_BALANCE = "INSUFFICIENT_BALANCE",
    INVALID_MINT = "INVALID_MINT",
    TRANSACTION_FAILED = "TRANSACTION_FAILED",
    SIMULATION_FAILED = "SIMULATION_FAILED",
    RPC_ERROR = "RPC_ERROR",
    RATE_LIMIT = "RATE_LIMIT",
    INVALID_AMOUNT = "INVALID_AMOUNT",
    INVALID_PUBLIC_KEY = "INVALID_PUBLIC_KEY",
    UNKNOWN = "UNKNOWN"
}
/**
 * SDK-specific error class
 */
declare class SdkError extends Error {
    code: SdkErrorCode;
    originalError?: unknown | undefined;
    constructor(code: SdkErrorCode, message: string, originalError?: unknown | undefined);
}
/**
 * Type guard to check if an error is an SdkError
 */
declare function isSdkError(error: unknown): error is SdkError;

export { type BalanceSnapshot as B, type IdlSource as I, type LoadedProject as L, MigrationPhase as M, type Network as N, SdkError as S, SdkErrorCode as a, isSdkError as i };
