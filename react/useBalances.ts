/**
 * React hook for real-time balance updates
 *
 * Provides automatic balance fetching with polling, caching, and formatted display values.
 * Handles loading states, error states, and allows manual refetching.
 *
 * @module react/useBalances
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Connection, PublicKey } from '@solana/web3.js';
import type { BalanceSnapshot, LoadedProject, Network } from '../src/types';
import { getBalances, watchBalances, formatTokenAmount } from '../src/balances';
import type { UnsubscribeFn } from '../src/balances';
import { SdkError } from '../src/types';

/**
 * Options for useBalances hook
 */
export interface UseBalancesOptions {
  /**
   * Network to use (defaults to active network)
   */
  network?: Network;

  /**
   * Pre-loaded project (skips project fetch)
   */
  project?: LoadedProject;

  /**
   * Polling interval in milliseconds (set to 0 to disable real-time updates)
   * @default 150
   */
  refetchInterval?: number;

  /**
   * Enable/disable the hook (set to false to pause fetching)
   * @default true
   */
  enabled?: boolean;
}

/**
 * Formatted balance values for display
 */
export interface FormattedBalances {
  /**
   * Old token balance as human-readable string (preserves full precision)
   */
  oldToken: string;

  /**
   * New token balance as human-readable string (preserves full precision)
   */
  newToken: string;

  /**
   * MFT balance as human-readable string (preserves full precision)
   */
  mft: string;

  /**
   * SOL balance as human-readable string (preserves full precision)
   */
  sol: string;
}

/**
 * Return type for useBalances hook
 */
export interface UseBalancesReturn {
  /**
   * Raw balance data (null if not loaded)
   */
  balances: BalanceSnapshot | null;

  /**
   * Formatted balances for display (null if not loaded)
   */
  formatted: FormattedBalances | null;

  /**
   * Whether balances are currently loading
   */
  isLoading: boolean;

  /**
   * Error if balance fetch failed
   */
  error: Error | null;

  /**
   * Manually refetch balances
   */
  refetch: () => Promise<void>;
}

/**
 * React hook for real-time user balance updates
 *
 * Automatically fetches and watches user balances with built-in polling,
 * loading states, error handling, and formatted display values.
 *
 * @param {string} projectId - Unique project identifier
 * @param {PublicKey | null | undefined} user - User wallet public key (null/undefined disables hook)
 * @param {Connection} connection - Solana RPC connection
 * @param {UseBalancesOptions} [options] - Hook options
 * @returns {UseBalancesReturn} Balance data, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * import { useBalances } from '@migratefun/sdk/react';
 * import { useWallet, useConnection } from '@solana/wallet-adapter-react';
 *
 * function BalanceDisplay() {
 *   const { publicKey } = useWallet();
 *   const { connection } = useConnection();
 *   const { balances, formatted, isLoading, error } = useBalances(
 *     'my-project',
 *     publicKey,
 *     connection
 *   );
 *
 *   if (!publicKey) return <div>Connect wallet to view balances</div>;
 *   if (isLoading) return <div>Loading balances...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   if (!formatted) return <div>No balances found</div>;
 *
 *   return (
 *     <div>
 *       <p>SOL: {formatted.sol}</p>
 *       <p>Old Token: {formatted.oldToken}</p>
 *       <p>New Token: {formatted.newToken}</p>
 *       <p>MFT: {formatted.mft}</p>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With custom polling interval and project
 * const { balances, refetch } = useBalances(
 *   'my-project',
 *   publicKey,
 *   connection,
 *   {
 *     refetchInterval: 1000, // Poll every second
 *     project: loadedProject, // Pass pre-loaded project
 *     network: 'devnet'
 *   }
 * );
 * ```
 */
export function useBalances(
  projectId: string,
  user: PublicKey | null | undefined,
  connection: Connection,
  options: UseBalancesOptions = {}
): UseBalancesReturn {
  const {
    network,
    project,
    refetchInterval = 150,
    enabled = true,
  } = options;

  const [balances, setBalances] = useState<BalanceSnapshot | null>(null);
  const [formatted, setFormatted] = useState<FormattedBalances | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Use ref to track if component is mounted
  const isMountedRef = useRef<boolean>(true);
  const unsubscribeRef = useRef<UnsubscribeFn | null>(null);

  // Track if we're using real-time updates or manual fetching
  const shouldWatch = refetchInterval > 0;

  /**
   * Manual fetch function (used when polling is disabled)
   */
  const fetchBalances = useCallback(async () => {
    if (!enabled || !user) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const snapshot = await getBalances(projectId, user, connection, project, {
        network,
        skipCache: true,
      });

      if (isMountedRef.current) {
        setBalances(snapshot);

        // Format balances if we have project info
        if (project) {
          setFormatted({
            oldToken: formatTokenAmount(snapshot.oldToken, project.oldTokenDecimals),
            newToken: formatTokenAmount(snapshot.newToken, project.newTokenDecimals),
            mft: formatTokenAmount(snapshot.mft, project.mftDecimals),
            sol: formatTokenAmount(snapshot.sol, 9), // SOL always has 9 decimals
          });
        }

        setError(null);
      }
    } catch (err) {
      if (isMountedRef.current) {
        const error = err instanceof SdkError || err instanceof Error
          ? err
          : new Error(String(err));
        setError(error);
        setBalances(null);
        setFormatted(null);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [projectId, user, connection, network, project, enabled]);

  /**
   * Manual refetch function exposed to users
   */
  const refetch = useCallback(async () => {
    await fetchBalances();
  }, [fetchBalances]);

  // Set up balance watching with real-time updates
  useEffect(() => {
    if (!enabled || !user || !shouldWatch) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Subscribe to balance updates
    const unsubscribe = watchBalances(
      projectId,
      user,
      connection,
      (snapshot) => {
        if (isMountedRef.current) {
          setBalances(snapshot);

          // Format balances if we have project info
          if (project) {
            setFormatted({
              oldToken: formatTokenAmount(snapshot.oldToken, project.oldTokenDecimals),
              newToken: formatTokenAmount(snapshot.newToken, project.newTokenDecimals),
              mft: formatTokenAmount(snapshot.mft, project.mftDecimals),
              sol: formatTokenAmount(snapshot.sol, 9), // SOL always has 9 decimals
            });
          }

          setIsLoading(false);
          setError(null);
        }
      },
      { intervalMs: refetchInterval, network }
    );

    unsubscribeRef.current = unsubscribe;

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [projectId, user, connection, network, project, refetchInterval, enabled, shouldWatch]);

  // Manual fetch when not watching (polling disabled)
  useEffect(() => {
    if (!shouldWatch && enabled && user) {
      fetchBalances();
    }
  }, [shouldWatch, enabled, user, fetchBalances]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  return {
    balances,
    formatted,
    isLoading,
    error,
    refetch,
  };
}
