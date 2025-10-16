/**
 * React hook for token migration transactions
 *
 * Provides migration transaction building, signing, sending, and status tracking.
 * Handles loading states, error states, and transaction confirmation.
 *
 * @module react/useMigrate
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type { Connection, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import type { LoadedProject } from '../src/core/types';
import { buildMigrateTx, sendAndConfirmTransaction } from '../src/transactions/builders';
import { SdkError } from '../src/core/types';

/**
 * Wallet adapter interface (compatible with Solana Wallet Adapter)
 */
export interface WalletAdapter {
  /**
   * Wallet public key
   */
  publicKey: PublicKey | null;

  /**
   * Sign a transaction
   */
  signTransaction?: <T extends Transaction | VersionedTransaction>(
    transaction: T
  ) => Promise<T>;

  /**
   * Sign all transactions
   */
  signAllTransactions?: <T extends Transaction | VersionedTransaction>(
    transactions: T[]
  ) => Promise<T[]>;
}

/**
 * Migration status tracking
 */
export type MigrationStatus =
  | 'idle'
  | 'preparing'
  | 'signing'
  | 'sending'
  | 'confirming'
  | 'confirmed'
  | 'error';

/**
 * Options for useMigrate hook
 */
export interface UseMigrateOptions {
  /**
   * Callback when migration succeeds
   */
  onSuccess?: (signature: string) => void;

  /**
   * Callback when migration fails
   */
  onError?: (error: Error) => void;

  /**
   * Callback when migration status changes
   */
  onStatusChange?: (status: MigrationStatus) => void;
}

/**
 * Return type for useMigrate hook
 */
export interface UseMigrateReturn {
  /**
   * Execute a token migration
   * @param projectId - Project identifier
   * @param amount - Amount to migrate (in base units as bigint)
   * @param project - Pre-loaded project configuration
   * @returns Transaction signature
   */
  migrate: (
    projectId: string,
    amount: bigint,
    project: LoadedProject
  ) => Promise<string>;

  /**
   * Whether a migration is currently in progress
   */
  isLoading: boolean;

  /**
   * Current migration status
   */
  status: MigrationStatus;

  /**
   * Error if migration failed
   */
  error: Error | null;

  /**
   * Transaction signature (available after confirmation)
   */
  signature: string | null;

  /**
   * Reset migration state
   */
  reset: () => void;
}

/**
 * React hook for executing token migrations
 *
 * Automatically handles the full migration lifecycle: building transactions,
 * wallet signing, sending to the network, and confirming. Provides detailed
 * status tracking and error handling.
 *
 * @param {Connection} connection - Solana RPC connection
 * @param {WalletAdapter} wallet - Wallet adapter instance
 * @param {UseMigrateOptions} [options] - Hook options
 * @returns {UseMigrateReturn} Migration function, status, and controls
 *
 * @example
 * ```tsx
 * import { useMigrate } from '@migratefun/sdk/react';
 * import { useWallet, useConnection } from '@solana/wallet-adapter-react';
 * import { parseTokenAmount } from '@migratefun/sdk';
 *
 * function MigrateButton({ project }) {
 *   const { connection } = useConnection();
 *   const wallet = useWallet();
 *
 *   const { migrate, isLoading, status, signature, error } = useMigrate(
 *     connection,
 *     wallet,
 *     {
 *       onSuccess: (sig) => {
 *         console.log('Migration successful!', sig);
 *       },
 *       onError: (err) => {
 *         console.error('Migration failed:', err);
 *       }
 *     }
 *   );
 *
 *   const handleMigrate = async () => {
 *     const amount = parseTokenAmount(100, project.oldTokenDecimals);
 *     await migrate('my-project', amount, project);
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleMigrate} disabled={isLoading}>
 *         {isLoading ? `Migrating... (${status})` : 'Migrate Tokens'}
 *       </button>
 *       {signature && <p>Transaction: {signature}</p>}
 *       {error && <p>Error: {error.message}</p>}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With status tracking
 * const { migrate, status, isLoading } = useMigrate(
 *   connection,
 *   wallet,
 *   {
 *     onStatusChange: (status) => {
 *       if (status === 'signing') {
 *         toast.info('Please sign the transaction in your wallet');
 *       } else if (status === 'confirming') {
 *         toast.info('Confirming transaction on Solana...');
 *       }
 *     }
 *   }
 * );
 * ```
 */
export function useMigrate(
  connection: Connection,
  wallet: WalletAdapter,
  options: UseMigrateOptions = {}
): UseMigrateReturn {
  const { onSuccess, onError, onStatusChange } = options;

  const [status, setStatus] = useState<MigrationStatus>('idle');
  const [error, setError] = useState<Error | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Track if component is mounted
  const isMountedRef = useRef<boolean>(true);

  /**
   * Update status with optional callback
   */
  const updateStatus = useCallback(
    (newStatus: MigrationStatus) => {
      if (isMountedRef.current) {
        setStatus(newStatus);
        if (onStatusChange) {
          onStatusChange(newStatus);
        }
      }
    },
    [onStatusChange]
  );

  /**
   * Reset migration state
   */
  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
    setSignature(null);
    setIsLoading(false);
  }, []);

  /**
   * Execute migration
   */
  const migrate = useCallback(
    async (
      projectId: string,
      amount: bigint,
      project: LoadedProject
    ): Promise<string> => {
      // Validate wallet
      if (!wallet.publicKey) {
        const error = new Error('Wallet not connected');
        setError(error);
        if (onError) {
          onError(error);
        }
        throw error;
      }

      if (!wallet.signTransaction) {
        const error = new Error('Wallet does not support signing transactions');
        setError(error);
        if (onError) {
          onError(error);
        }
        throw error;
      }

      try {
        setIsLoading(true);
        setError(null);
        setSignature(null);

        // Step 1: Prepare transaction
        updateStatus('preparing');

        const { transaction } = await buildMigrateTx(
          connection,
          wallet.publicKey,
          projectId,
          amount,
          project
        );

        // Step 2: Sign transaction
        updateStatus('signing');

        const signedTransaction = await wallet.signTransaction(transaction);

        // Step 3: Send transaction
        updateStatus('sending');

        const sig = await sendAndConfirmTransaction(connection, signedTransaction);

        // Step 4: Confirm
        updateStatus('confirming');

        // Already confirmed by sendAndConfirmTransaction
        updateStatus('confirmed');

        if (isMountedRef.current) {
          setSignature(sig);
          setIsLoading(false);
        }

        if (onSuccess) {
          onSuccess(sig);
        }

        // Reset to idle after success
        setTimeout(() => {
          if (isMountedRef.current) {
            updateStatus('idle');
          }
        }, 2000);

        return sig;
      } catch (err) {
        const error = err instanceof SdkError || err instanceof Error
          ? err
          : new Error(String(err));

        if (isMountedRef.current) {
          setError(error);
          setIsLoading(false);
          updateStatus('error');
        }

        if (onError) {
          onError(error);
        }

        throw error;
      }
    },
    [connection, wallet, onSuccess, onError, updateStatus]
  );

  // Cleanup on unmount - prevents memory leaks from state updates on unmounted components
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    migrate,
    isLoading,
    status,
    error,
    signature,
    reset,
  };
}
