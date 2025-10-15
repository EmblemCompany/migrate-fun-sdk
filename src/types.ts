import { PublicKey } from '@solana/web3.js';

/**
 * Solana network identifier
 */
export type Network = 'devnet' | 'mainnet-beta';

/**
 * IDL source preference
 */
export type IdlSource = 'bundle' | 'onchain';

/**
 * Project migration phase
 */
export enum MigrationPhase {
  Setup = 0,
  ActiveMigration = 1,
  GracePeriod = 2,
  Finalized = 3,
}

/**
 * Complete project metadata with derived PDAs
 */
export interface LoadedProject {
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
export interface BalanceSnapshot {
  oldToken: bigint;
  newToken: bigint;
  mft: bigint;
  sol: bigint;
}

/**
 * SDK error codes
 */
export enum SdkErrorCode {
  // Project errors
  PROJECT_NOT_FOUND = 'PROJECT_NOT_FOUND',
  PROJECT_PAUSED = 'PROJECT_PAUSED',
  MIGRATION_WINDOW_CLOSED = 'MIGRATION_WINDOW_CLOSED',
  INVALID_PHASE = 'INVALID_PHASE',

  // Account errors
  ACCOUNT_NOT_FOUND = 'ACCOUNT_NOT_FOUND',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  INVALID_MINT = 'INVALID_MINT',

  // Transaction errors
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  SIMULATION_FAILED = 'SIMULATION_FAILED',

  // RPC errors
  RPC_ERROR = 'RPC_ERROR',
  RATE_LIMIT = 'RATE_LIMIT',

  // Validation errors
  INVALID_AMOUNT = 'INVALID_AMOUNT',
  INVALID_PUBLIC_KEY = 'INVALID_PUBLIC_KEY',

  // Unknown
  UNKNOWN = 'UNKNOWN',
}

/**
 * SDK-specific error class
 */
export class SdkError extends Error {
  constructor(
    public code: SdkErrorCode,
    message: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'SdkError';

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, SdkError);
    }
  }
}

/**
 * Type guard to check if an error is an SdkError
 */
export function isSdkError(error: unknown): error is SdkError {
  return error instanceof SdkError;
}
