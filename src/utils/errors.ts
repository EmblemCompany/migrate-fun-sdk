/**
 * Error mapping and normalization for the migrate.fun SDK
 *
 * This module provides:
 * - Mapping of Anchor program errors to user-friendly messages
 * - Normalization of common blockchain errors
 * - Error parsing and categorization
 * - User-friendly error messages with recovery guidance
 *
 * @module errors
 */

import { SdkError, SdkErrorCode } from '../core/types';

/**
 * Anchor program error codes from the migration program IDL
 * @internal
 */
const PROGRAM_ERROR_CODES = {
  MigrationWindowClosed: 6000,
  MigrationNotEnded: 6001,
  MigrationAlreadyStarted: 6002,
  AlreadyFinalized: 6003,
  CannotFinalizeEarly: 6004,
  AlreadyEvaluated: 6005,
  NoMigration: 6006,
  MigrationNotEvaluated: 6007,
  MigrationFailed: 6008,
  InvalidProjectId: 6009,
  InvalidProjectName: 6010,
  ProjectNotInitialized: 6011,
  ProjectAlreadyExists: 6012,
  ProjectNotFinalized: 6013,
  ProjectIdMismatch: 6014,
  ProjectPaused: 6015,
  ProjectFinalized: 6016,
  ProjectNotActive: 6017,
  InvalidProject: 6018,
  InvalidTimeRange: 6019,
} as const;

/**
 * Error metadata including user-friendly messages and recovery actions
 * @internal
 */
interface ErrorMetadata {
  sdkCode: SdkErrorCode;
  message: string;
  userMessage: string;
  recoveryActions?: string[];
}

/**
 * Map of program error codes to error metadata
 * @internal
 */
const PROGRAM_ERROR_METADATA: Record<number, ErrorMetadata> = {
  [PROGRAM_ERROR_CODES.MigrationWindowClosed]: {
    sdkCode: SdkErrorCode.MIGRATION_WINDOW_CLOSED,
    message: 'Migration window has closed',
    userMessage: 'The migration period for this project has ended. New migrations are no longer accepted.',
    recoveryActions: [
      'Check if there is an extension period',
      'Look for MFT claiming options if you already migrated',
      'Contact the project team for assistance',
    ],
  },
  [PROGRAM_ERROR_CODES.ProjectPaused]: {
    sdkCode: SdkErrorCode.PROJECT_PAUSED,
    message: 'Project is paused',
    userMessage: 'This migration project is temporarily paused by the administrator.',
    recoveryActions: [
      'Wait for the project to be unpaused',
      'Check project announcements for updates',
      'Contact the project administrator',
    ],
  },
  [PROGRAM_ERROR_CODES.ProjectNotActive]: {
    sdkCode: SdkErrorCode.INVALID_PHASE,
    message: 'Project is not in active migration phase',
    userMessage: 'This project is not currently accepting migrations.',
    recoveryActions: [
      'Check the project status and phase',
      'Wait for the active migration period to begin',
      'Verify you have the correct project',
    ],
  },
  [PROGRAM_ERROR_CODES.ProjectNotInitialized]: {
    sdkCode: SdkErrorCode.PROJECT_NOT_FOUND,
    message: 'Project not initialized',
    userMessage: 'This migration project does not exist or has not been initialized.',
    recoveryActions: [
      'Verify the project ID is correct',
      'Check if the project is on the correct network (devnet/mainnet)',
      'Browse available projects to find the right one',
    ],
  },
  [PROGRAM_ERROR_CODES.InvalidProjectId]: {
    sdkCode: SdkErrorCode.PROJECT_NOT_FOUND,
    message: 'Invalid project ID',
    userMessage: 'The project ID format is invalid. It must be lowercase, 16 characters or less, with no spaces.',
    recoveryActions: [
      'Check the project ID format',
      'Ensure all characters are lowercase',
      'Remove any spaces or special characters',
    ],
  },
  [PROGRAM_ERROR_CODES.MigrationFailed]: {
    sdkCode: SdkErrorCode.TRANSACTION_FAILED,
    message: 'Migration evaluation failed',
    userMessage: 'This migration did not meet success criteria. You can claim a refund of your tokens and fees.',
    recoveryActions: [
      'Check the refund claim interface',
      'Your original tokens will be returned',
      'Contact support if you need assistance with the refund',
    ],
  },
  [PROGRAM_ERROR_CODES.NoMigration]: {
    sdkCode: SdkErrorCode.ACCOUNT_NOT_FOUND,
    message: 'No migration record found',
    userMessage: 'You have not migrated any tokens for this project yet.',
    recoveryActions: [
      'Complete a migration first',
      'Check if you are using the correct wallet',
      'Verify you are on the right network',
    ],
  },
};

/**
 * Parse a raw error into a structured SdkError
 *
 * This function normalizes errors from various sources (Anchor, RPC, network)
 * into a consistent SdkError format with user-friendly messages.
 *
 * @param {unknown} error - The raw error to parse
 * @returns {SdkError} Structured SDK error with code and message
 *
 * @example
 * ```typescript
 * import { parseError } from '@migratefun/sdk';
 *
 * try {
 *   await program.methods.migrate().rpc();
 * } catch (err) {
 *   const sdkError = parseError(err);
 *   console.log(sdkError.code); // => 'PROJECT_PAUSED'
 *   console.log(sdkError.message); // User-friendly message
 * }
 * ```
 */
export function parseError(error: unknown): SdkError {
  // Already an SdkError
  if (error instanceof SdkError) {
    return error;
  }

  // Extract error message
  const errorObj = error as any;
  const message = errorObj?.message || errorObj?.toString() || 'Unknown error';
  const lowerMessage = message.toLowerCase();

  // Check for Anchor program errors
  const programError = parseProgramError(errorObj);
  if (programError) {
    return programError;
  }

  // Check for common Solana/blockchain errors
  if (lowerMessage.includes('account does not exist') || lowerMessage.includes('accountnotfound')) {
    return new SdkError(
      SdkErrorCode.ACCOUNT_NOT_FOUND,
      'Account not found on-chain',
      error
    );
  }

  if (lowerMessage.includes('insufficient') && lowerMessage.includes('balance')) {
    return new SdkError(
      SdkErrorCode.INSUFFICIENT_BALANCE,
      'Insufficient token balance for this operation',
      error
    );
  }

  if (lowerMessage.includes('invalid mint') || lowerMessage.includes('mint mismatch')) {
    return new SdkError(
      SdkErrorCode.INVALID_MINT,
      'Token mint address does not match expected value',
      error
    );
  }

  if (lowerMessage.includes('simulation failed')) {
    return new SdkError(
      SdkErrorCode.SIMULATION_FAILED,
      'Transaction simulation failed - the transaction would likely fail on-chain',
      error
    );
  }

  if (lowerMessage.includes('transaction') && lowerMessage.includes('failed')) {
    return new SdkError(
      SdkErrorCode.TRANSACTION_FAILED,
      'Transaction failed to execute',
      error
    );
  }

  // RPC errors
  if (lowerMessage.includes('429') || lowerMessage.includes('rate limit')) {
    return new SdkError(
      SdkErrorCode.RATE_LIMIT,
      'RPC rate limit exceeded - please wait and try again',
      error
    );
  }

  if (
    lowerMessage.includes('rpc') ||
    lowerMessage.includes('network') ||
    lowerMessage.includes('timeout')
  ) {
    return new SdkError(
      SdkErrorCode.RPC_ERROR,
      'RPC request failed - check your network connection',
      error
    );
  }

  // Validation errors
  if (lowerMessage.includes('invalid public key') || lowerMessage.includes('invalid address')) {
    return new SdkError(
      SdkErrorCode.INVALID_PUBLIC_KEY,
      'Invalid Solana public key format',
      error
    );
  }

  if (lowerMessage.includes('invalid amount') || lowerMessage.includes('amount')) {
    return new SdkError(
      SdkErrorCode.INVALID_AMOUNT,
      'Invalid token amount',
      error
    );
  }

  // Default to unknown error
  return new SdkError(
    SdkErrorCode.UNKNOWN,
    message,
    error
  );
}

/**
 * Parse Anchor program-specific errors
 * @internal
 */
function parseProgramError(error: any): SdkError | null {
  // Try to extract error code from various error formats
  let errorCode: number | undefined;

  // Anchor error format: error.code
  if (typeof error?.code === 'number') {
    errorCode = error.code;
  }

  // Error in logs format
  if (error?.logs && Array.isArray(error.logs)) {
    for (const log of error.logs) {
      const match = log.match(/Error Code: (\d+)/i);
      if (match) {
        errorCode = parseInt(match[1], 10);
        break;
      }
    }
  }

  // Error message format: "Error: 0x1770" (6000 in hex)
  const hexMatch = error?.message?.match(/0x([0-9a-f]+)/i);
  if (hexMatch) {
    errorCode = parseInt(hexMatch[1], 16);
  }

  // No error code found
  if (!errorCode) {
    return null;
  }

  // Look up error metadata
  const metadata = PROGRAM_ERROR_METADATA[errorCode];
  if (metadata) {
    return new SdkError(
      metadata.sdkCode,
      metadata.userMessage,
      error
    );
  }

  return null;
}

/**
 * Get user-friendly error message with recovery actions
 *
 * Provides detailed guidance for users on how to resolve errors.
 *
 * @param {SdkError | unknown} error - The error to format
 * @returns Formatted error information
 *
 * @example
 * ```typescript
 * import { getErrorDetails, parseError } from '@migratefun/sdk';
 *
 * try {
 *   await executeMigration();
 * } catch (err) {
 *   const sdkError = parseError(err);
 *   const details = getErrorDetails(sdkError);
 *
 *   console.log(details.title); // => "Migration Error"
 *   console.log(details.message); // User-friendly message
 *   console.log(details.actions); // Array of recovery steps
 * }
 * ```
 */
export function getErrorDetails(error: SdkError | unknown): {
  title: string;
  message: string;
  actions: string[];
  code: string;
  canRetry: boolean;
} {
  const sdkError = error instanceof SdkError ? error : parseError(error);

  // Find metadata for this error code
  const metadata = Object.values(PROGRAM_ERROR_METADATA).find(
    (m) => m.sdkCode === sdkError.code
  );

  // Determine if error is retryable
  const retryableErrors = [
    SdkErrorCode.RPC_ERROR,
    SdkErrorCode.RATE_LIMIT,
    SdkErrorCode.SIMULATION_FAILED,
    SdkErrorCode.TRANSACTION_FAILED,
  ];

  return {
    title: getErrorTitle(sdkError.code),
    message: metadata?.userMessage || sdkError.message,
    actions: metadata?.recoveryActions || getDefaultRecoveryActions(sdkError.code),
    code: sdkError.code,
    canRetry: retryableErrors.includes(sdkError.code),
  };
}

/**
 * Get error title based on code
 * @internal
 */
function getErrorTitle(code: SdkErrorCode): string {
  switch (code) {
    case SdkErrorCode.PROJECT_NOT_FOUND:
    case SdkErrorCode.PROJECT_PAUSED:
    case SdkErrorCode.MIGRATION_WINDOW_CLOSED:
    case SdkErrorCode.INVALID_PHASE:
      return 'Migration Unavailable';

    case SdkErrorCode.ACCOUNT_NOT_FOUND:
    case SdkErrorCode.INSUFFICIENT_BALANCE:
    case SdkErrorCode.INVALID_MINT:
      return 'Account Error';

    case SdkErrorCode.TRANSACTION_FAILED:
    case SdkErrorCode.SIMULATION_FAILED:
      return 'Transaction Failed';

    case SdkErrorCode.RPC_ERROR:
    case SdkErrorCode.RATE_LIMIT:
      return 'Network Error';

    case SdkErrorCode.INVALID_AMOUNT:
    case SdkErrorCode.INVALID_PUBLIC_KEY:
      return 'Validation Error';

    default:
      return 'Error';
  }
}

/**
 * Get default recovery actions for error codes without specific metadata
 * @internal
 */
function getDefaultRecoveryActions(code: SdkErrorCode): string[] {
  switch (code) {
    case SdkErrorCode.RPC_ERROR:
    case SdkErrorCode.RATE_LIMIT:
      return [
        'Wait a moment and try again',
        'Check your internet connection',
        'Try a different RPC endpoint if available',
      ];

    case SdkErrorCode.INSUFFICIENT_BALANCE:
      return [
        'Check your token balance',
        'Reduce the migration amount',
        'Ensure you have enough SOL for transaction fees',
      ];

    case SdkErrorCode.INVALID_AMOUNT:
      return [
        'Enter a valid amount',
        'Make sure the amount is greater than zero',
        'Check the token decimals',
      ];

    case SdkErrorCode.INVALID_PUBLIC_KEY:
      return [
        'Check the address format',
        'Ensure you are using a valid Solana address',
        'Copy the address again to avoid typos',
      ];

    default:
      return [
        'Try again in a few moments',
        'Check the console for more details',
        'Contact support if the problem persists',
      ];
  }
}

/**
 * Check if an error is retryable
 *
 * Some errors (like rate limits or network issues) can be resolved by retrying.
 * Others (like validation errors) require user action before retrying.
 *
 * @param {SdkError | unknown} error - The error to check
 * @returns {boolean} True if the operation can be retried
 *
 * @example
 * ```typescript
 * import { parseError, isRetryableError } from '@migratefun/sdk';
 *
 * try {
 *   await migrate();
 * } catch (err) {
 *   const sdkError = parseError(err);
 *
 *   if (isRetryableError(sdkError)) {
 *     // Show retry button
 *     console.log('You can try again');
 *   } else {
 *     // Show error message without retry
 *     console.log('Please fix the issue first');
 *   }
 * }
 * ```
 */
export function isRetryableError(error: SdkError | unknown): boolean {
  const sdkError = error instanceof SdkError ? error : parseError(error);

  const retryableErrors = [
    SdkErrorCode.RPC_ERROR,
    SdkErrorCode.RATE_LIMIT,
    SdkErrorCode.SIMULATION_FAILED,
    SdkErrorCode.TRANSACTION_FAILED,
    SdkErrorCode.UNKNOWN,
  ];

  return retryableErrors.includes(sdkError.code);
}

/**
 * Format error for logging (includes stack trace)
 *
 * @param {SdkError | unknown} error - The error to format
 * @returns {string} Formatted error string for logging
 *
 * @example
 * ```typescript
 * import { parseError, formatErrorForLog } from '@migratefun/sdk';
 *
 * try {
 *   await migrate();
 * } catch (err) {
 *   const formatted = formatErrorForLog(err);
 *   console.error(formatted);
 *   // Log to your error tracking service
 * }
 * ```
 */
export function formatErrorForLog(error: SdkError | unknown): string {
  const sdkError = error instanceof SdkError ? error : parseError(error);

  const parts = [
    `[${sdkError.code}] ${sdkError.message}`,
  ];

  if (sdkError.originalError) {
    parts.push('\nOriginal error:', JSON.stringify(sdkError.originalError, null, 2));
  }

  if (sdkError.stack) {
    parts.push('\nStack trace:', sdkError.stack);
  }

  return parts.join('\n');
}
