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
import type { BalanceSnapshot, LoadedProject, Network } from '../src/core/types';
import { getBalances, watchBalances, formatTokenAmount, loadProject } from '../src/queries/balances';
import type { UnsubscribeFn } from '../src/queries/balances';
import { SdkError } from '../src/core/types';

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
   * @default 3000
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
    refetchInterval = 3000,
    enabled = true,
  } = options;

  const [balances, setBalances] = useState<BalanceSnapshot | null>(null);
  const [formatted, setFormatted] = useState<FormattedBalances | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Track the latest known project metadata so we always format consistently
  const projectRef = useRef<LoadedProject | null>(project ?? null);

  useEffect(() => {
    projectRef.current = project ?? null;
  }, [project]);

  // Use ref to track if component is mounted
  const isMountedRef = useRef<boolean>(true);
  const unsubscribeRef = useRef<UnsubscribeFn | null>(null);

  // Track if we're using real-time updates or manual fetching
  const shouldWatch = refetchInterval > 0;

  /**
   * Manual fetch function (used when polling is disabled)
   */
  const ensureProject = useCallback(async (): Promise<LoadedProject | null> => {
    // Always check projectRef first (updated via separate effect)
    if (projectRef.current) {
      return projectRef.current;
    }

    try {
      const loaded = await loadProject(projectId, connection, { network });
      projectRef.current = loaded;
      return loaded;
    } catch (err) {
      console.warn('[useBalances] Failed to load project for balances:', err);
      return null;
    }
  }, [projectId, connection, network]);

  const fetchBalances = useCallback(async () => {
    if (!enabled || !user) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const projectForFetch = await ensureProject();

      const snapshot = await getBalances(projectId, user, connection, projectForFetch ?? project ?? undefined, {
        network,
        skipCache: true,
      });

      if (isMountedRef.current) {
        setBalances(snapshot);

        const projectForFormat = projectRef.current ?? projectForFetch ?? project ?? null;
        if (projectForFormat) {
          setFormatted({
            oldToken: formatTokenAmount(snapshot.oldToken, projectForFormat.oldTokenDecimals),
            newToken: formatTokenAmount(snapshot.newToken, projectForFormat.newTokenDecimals),
            mft: formatTokenAmount(snapshot.mft, projectForFormat.mftDecimals),
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
  }, [projectId, user, connection, network, enabled]);

  /**
   * Manual refetch function exposed to users
   */
  const refetch = useCallback(async () => {
    await fetchBalances();
  }, [fetchBalances]);

  // Set up balance watching with real-time updates
  useEffect(() => {
    console.log('[useBalances] Effect triggered', {
      enabled,
      hasUser: !!user,
      shouldWatch,
      hasProject: !!project,
      projectId
    });

    // Start watching as soon as user is available; formatting backfills when project arrives
    if (!enabled || !user || !shouldWatch) {
      console.log('[useBalances] Hook disabled or waiting for user');
      setIsLoading(false);
      return;
    }

    console.log('[useBalances] Starting balance watch for', user.toBase58());
    setIsLoading(true);
    setError(null);

    let didCancel = false;

    const startWatching = async () => {
      await ensureProject();

      if (didCancel) {
        return;
      }

      // Subscribe to balance updates
      const unsubscribe = watchBalances(
        projectId,
        user,
        connection,
        (snapshot, watchProject) => {
          if (!isMountedRef.current) return;

          setBalances(snapshot);

          if (watchProject) {
            projectRef.current = watchProject;
          }

          const projectToUse = projectRef.current ?? watchProject ?? project ?? null;
          if (projectToUse) {
            setFormatted({
              oldToken: formatTokenAmount(snapshot.oldToken, projectToUse.oldTokenDecimals),
              newToken: formatTokenAmount(snapshot.newToken, projectToUse.newTokenDecimals),
              mft: formatTokenAmount(snapshot.mft, projectToUse.mftDecimals),
              sol: formatTokenAmount(snapshot.sol, 9),
            });
          }

          setIsLoading(false);
          setError(null);
        },
        { intervalMs: refetchInterval, network }
      );

      unsubscribeRef.current = unsubscribe;
    };

    startWatching();

    return () => {
      console.log('[useBalances] Cleaning up balance watch');
      didCancel = true;
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [projectId, user, connection, network, refetchInterval, enabled, shouldWatch]);

  // Manual fetch when not watching (polling disabled)
  useEffect(() => {
    if (!shouldWatch && enabled && user) {
      fetchBalances();
    }
  }, [shouldWatch, enabled, user, fetchBalances]);

  // Backfill formatted balances when project loads after raw balances
  // This covers the race where a balance snapshot arrives before `project` is available.
  useEffect(() => {
    if (!balances) return;

    const projectForFormat = projectRef.current ?? project ?? null;
    if (!projectForFormat) return;
    try {
      const next: FormattedBalances = {
        oldToken: formatTokenAmount(balances.oldToken, projectForFormat.oldTokenDecimals),
        newToken: formatTokenAmount(balances.newToken, projectForFormat.newTokenDecimals),
        mft: formatTokenAmount(balances.mft, projectForFormat.mftDecimals),
        sol: formatTokenAmount(balances.sol, 9),
      };
      setFormatted(next);
    } catch (e) {
      // ignore formatting errors; hook will keep raw balances
    }
  }, [balances, project]);

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
