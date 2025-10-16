/**
 * React hook for unified claim transaction execution
 *
 * Provides building, signing, sending, and status tracking for all claim types:
 * - MFT claims (burn MFT → receive new tokens, no penalty)
 * - Merkle claims (late migration with penalty)
 * - Refund claims (failed migration, get old tokens back)
 *
 * @module react/useClaim
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import type { Connection, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import type { LoadedProject } from '../src/types';
import {
  buildClaimMftTx,
  buildClaimMerkleTx,
  buildClaimRefundTx,
  sendAndConfirmTransaction,
} from '../src/builders';
import { SdkError } from '../src/types';

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
 * Claim execution status (mirrors MigrationStatus from useMigrate)
 */
export type ClaimStatus =
  | 'idle'
  | 'preparing'
  | 'signing'
  | 'sending'
  | 'confirming'
  | 'confirmed'
  | 'error';

/**
 * Transaction result
 */
export interface TransactionResult {
  /**
   * Transaction signature
   */
  signature: string;

  /**
   * Slot number (if available)
   */
  slot?: number;
}

/**
 * Options for useClaim hook
 */
export interface UseClaimOptions {
  /**
   * Callback when claim succeeds
   */
  onSuccess?: (result: TransactionResult) => void;

  /**
   * Callback when claim fails
   */
  onError?: (error: Error) => void;

  /**
   * Callback when claim status changes
   */
  onStatusChange?: (status: ClaimStatus) => void;
}

/**
 * Return type for useClaim hook
 */
export interface UseClaimReturn {
  /**
   * Claim MFT tokens (burn MFT → receive new tokens, no penalty)
   * @param projectId - Project identifier
   * @param mftAmount - Amount of MFT to claim (in base units as bigint)
   * @param project - Pre-loaded project configuration
   * @returns Transaction signature
   */
  claimMft: (
    projectId: string,
    mftAmount: bigint,
    project: LoadedProject
  ) => Promise<string>;

  /**
   * Claim via merkle proof (late migration with penalty)
   * @param projectId - Project identifier
   * @param amount - Amount to claim (in old token base units as bigint)
   * @param proof - Merkle proof (array of 32-byte buffers)
   * @param project - Pre-loaded project configuration
   * @returns Transaction signature
   */
  claimMerkle: (
    projectId: string,
    amount: bigint,
    proof: Buffer[],
    project: LoadedProject
  ) => Promise<string>;

  /**
   * Claim refund (failed migration, get old tokens back)
   * @param projectId - Project identifier
   * @param project - Pre-loaded project configuration
   * @returns Transaction signature
   */
  claimRefund: (
    projectId: string,
    project: LoadedProject
  ) => Promise<string>;

  /**
   * Whether a claim is currently in progress
   */
  isLoading: boolean;

  /**
   * Current claim status
   */
  status: ClaimStatus;

  /**
   * Error if claim failed
   */
  error: Error | null;

  /**
   * Transaction signature (available after confirmation)
   */
  signature: string | null;

  /**
   * Reset claim state
   */
  reset: () => void;
}

/**
 * React hook for executing all types of claims
 *
 * Automatically handles the full claim lifecycle: building transactions,
 * wallet signing, sending to the network, and confirming. Provides detailed
 * status tracking and error handling shared across all claim types.
 *
 * @param {Connection} connection - Solana RPC connection
 * @param {WalletAdapter} wallet - Wallet adapter instance
 * @param {UseClaimOptions} [options] - Hook options
 * @returns {UseClaimReturn} Claim functions, status, and controls
 *
 * @example
 * ```tsx
 * import { useClaim } from '@migratefun/sdk/react';
 * import { useWallet, useConnection } from '@solana/wallet-adapter-react';
 *
 * function ClaimButton({ project, claimType, mftBalance }) {
 *   const { connection } = useConnection();
 *   const wallet = useWallet();
 *
 *   const { claimMft, claimMerkle, claimRefund, isLoading, status, signature } = useClaim(
 *     connection,
 *     wallet,
 *     {
 *       onSuccess: (result) => {
 *         console.log('Claim successful!', result.signature);
 *       },
 *       onError: (err) => {
 *         console.error('Claim failed:', err);
 *       }
 *     }
 *   );
 *
 *   const handleClaim = async () => {
 *     if (claimType === 'mft') {
 *       await claimMft('my-project', mftBalance, project);
 *     } else if (claimType === 'merkle') {
 *       const proof = [...]; // Get merkle proof
 *       await claimMerkle('my-project', amount, proof, project);
 *     } else if (claimType === 'refund') {
 *       await claimRefund('my-project', project);
 *     }
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleClaim} disabled={isLoading}>
 *         {isLoading ? `Processing... (${status})` : 'Claim Tokens'}
 *       </button>
 *       {signature && <p>Transaction: {signature}</p>}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // MFT claim only
 * const { claimMft, isLoading, error } = useClaim(connection, wallet);
 *
 * const handleMftClaim = async () => {
 *   try {
 *     const sig = await claimMft(projectId, mftAmount, project);
 *     console.log('MFT claimed:', sig);
 *   } catch (err) {
 *     console.error('Failed:', err);
 *   }
 * };
 * ```
 */
export function useClaim(
  connection: Connection,
  wallet: WalletAdapter,
  options: UseClaimOptions = {}
): UseClaimReturn {
  const { onSuccess, onError, onStatusChange } = options;

  const [status, setStatus] = useState<ClaimStatus>('idle');
  const [error, setError] = useState<Error | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Track if component is mounted
  const isMountedRef = useRef<boolean>(true);

  /**
   * Update status with optional callback
   */
  const updateStatus = useCallback(
    (newStatus: ClaimStatus) => {
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
   * Reset claim state
   */
  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
    setSignature(null);
    setIsLoading(false);
  }, []);

  /**
   * Execute a claim transaction
   * @private
   */
  const executeClaim = useCallback(
    async (buildTransaction: () => Promise<Transaction>): Promise<string> => {
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
        const transaction = await buildTransaction();

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

        const result: TransactionResult = {
          signature: sig,
        };

        if (onSuccess) {
          onSuccess(result);
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

  /**
   * Claim MFT tokens
   */
  const claimMft = useCallback(
    async (
      projectId: string,
      mftAmount: bigint,
      project: LoadedProject
    ): Promise<string> => {
      return executeClaim(async () => {
        if (!wallet.publicKey) {
          throw new Error('Wallet not connected');
        }

        const { transaction } = await buildClaimMftTx(
          connection,
          wallet.publicKey,
          projectId,
          mftAmount,
          project
        );

        return transaction;
      });
    },
    [connection, wallet, executeClaim]
  );

  /**
   * Claim via merkle proof
   */
  const claimMerkle = useCallback(
    async (
      projectId: string,
      amount: bigint,
      proof: Buffer[],
      project: LoadedProject
    ): Promise<string> => {
      return executeClaim(async () => {
        if (!wallet.publicKey) {
          throw new Error('Wallet not connected');
        }

        const { transaction } = await buildClaimMerkleTx(
          connection,
          wallet.publicKey,
          projectId,
          amount,
          proof,
          project
        );

        return transaction;
      });
    },
    [connection, wallet, executeClaim]
  );

  /**
   * Claim refund
   */
  const claimRefund = useCallback(
    async (
      projectId: string,
      project: LoadedProject
    ): Promise<string> => {
      return executeClaim(async () => {
        if (!wallet.publicKey) {
          throw new Error('Wallet not connected');
        }

        const { transaction } = await buildClaimRefundTx(
          connection,
          wallet.publicKey,
          projectId,
          project
        );

        return transaction;
      });
    },
    [connection, wallet, executeClaim]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    claimMft,
    claimMerkle,
    claimRefund,
    isLoading,
    status,
    error,
    signature,
    reset,
  };
}
