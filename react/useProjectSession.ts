/**
 * React hook for unified project session management
 *
 * Combines project loading, balance watching, and eligibility checking into
 * a single high-level hook for building migration UIs.
 *
 * @module react/useProjectSession
 * @see migrate.fun/lib/domain/project/hooks/use-project-session.ts for reference implementation
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Connection, PublicKey } from '@solana/web3.js';
import type {
  LoadedProject,
  BalanceSnapshot,
  ClaimEligibility,
  ClaimType,
  ProjectRedirectIntent,
  Network,
} from '../src/core/types';
import { loadProject, getBalances } from '../src/queries/balances';
import {
  computeClaimEligibility,
  determineClaimType,
  getRedirectIntent,
} from '../src/queries/eligibility';
import { formatTokenAmount } from '../src/queries/balances';

/**
 * Formatted balances for display
 */
export interface FormattedBalances {
  oldToken: string;
  newToken: string;
  mft: string;
  sol: string;
}

/**
 * Options for useProjectSession hook
 */
export interface UseProjectSessionOptions {
  /**
   * Network to use (defaults to current active network)
   */
  network?: Network;

  /**
   * Refetch interval in milliseconds (default: 5000 = 5 seconds)
   * Set to 0 or null to disable auto-refetch
   */
  refetchInterval?: number | null;

  /**
   * Whether to enable the hook (default: true)
   * Useful for conditional fetching
   */
  enabled?: boolean;
}

/**
 * Return type for useProjectSession hook
 */
export interface UseProjectSessionReturn {
  /**
   * Loaded project configuration (null while loading or if error)
   */
  project: LoadedProject | null;

  /**
   * User balances (null while loading, if error, or if no user)
   */
  balances: BalanceSnapshot | null;

  /**
   * Formatted balances for display (null while loading, if error, or if no user)
   */
  formatted: FormattedBalances | null;

  /**
   * Best available claim type for the user
   */
  claimType: ClaimType;

  /**
   * Detailed claim eligibility
   */
  claimEligibility: ClaimEligibility | null;

  /**
   * Redirect intent for routing logic
   */
  redirect: ProjectRedirectIntent | null;

  /**
   * Whether data is currently loading
   */
  isLoading: boolean;

  /**
   * Error if fetch failed
   */
  error: Error | null;

  /**
   * Manually refresh all data
   */
  refresh: () => Promise<void>;
}

/**
 * React hook for complete project session management
 *
 * Provides project configuration, user balances, claim eligibility, and routing
 * intent in a single hook. Automatically refetches data at a configurable interval
 * and handles the race condition where balances arrive before project metadata.
 *
 * @param {string} projectId - Project identifier
 * @param {Connection} connection - Solana RPC connection
 * @param {PublicKey | null} user - User wallet public key (null for anonymous)
 * @param {UseProjectSessionOptions} [options] - Hook options
 * @returns {UseProjectSessionReturn} Project session state and controls
 *
 * @example
 * ```tsx
 * import { useProjectSession } from '@migratefun/sdk/react';
 * import { useConnection, useWallet } from '@solana/wallet-adapter-react';
 *
 * function MigrationPage({ projectId }) {
 *   const { connection } = useConnection();
 *   const { publicKey } = useWallet();
 *
 *   const {
 *     project,
 *     balances,
 *     formatted,
 *     claimType,
 *     isLoading,
 *     error,
 *   } = useProjectSession(projectId, connection, publicKey);
 *
 *   if (isLoading) return <div>Loading project...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   if (!project) return <div>Project not found</div>;
 *
 *   return (
 *     <div>
 *       <h1>{project.projectId.toBase58()}</h1>
 *       {formatted && (
 *         <div>
 *           <p>Old Token: {formatted.oldToken}</p>
 *           <p>New Token: {formatted.newToken}</p>
 *           <p>MFT: {formatted.mft}</p>
 *         </div>
 *       )}
 *       {claimType === 'mft' && <button>Claim MFT</button>}
 *       {claimType === 'merkle' && <button>Claim with Merkle</button>}
 *       {claimType === 'refund' && <button>Claim Refund</button>}
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With routing based on redirect intent
 * const { redirect, claimType } = useProjectSession(projectId, connection, user);
 *
 * useEffect(() => {
 *   if (redirect && redirect.action !== 'view') {
 *     router.push(redirect.targetRoute);
 *   }
 * }, [redirect, router]);
 * ```
 */
export function useProjectSession(
  projectId: string,
  connection: Connection,
  user: PublicKey | null,
  options: UseProjectSessionOptions = {}
): UseProjectSessionReturn {
  const { network, refetchInterval = 5000, enabled = true } = options;

  const [project, setProject] = useState<LoadedProject | null>(null);
  const [balances, setBalances] = useState<BalanceSnapshot | null>(null);
  const [formatted, setFormatted] = useState<FormattedBalances | null>(null);
  const [claimEligibility, setClaimEligibility] = useState<ClaimEligibility | null>(null);
  const [claimType, setClaimType] = useState<ClaimType>(null);
  const [redirect, setRedirect] = useState<ProjectRedirectIntent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Track if component is mounted
  const isMountedRef = useRef<boolean>(true);

  // Track if we're currently fetching to prevent concurrent fetches
  const isFetchingRef = useRef<boolean>(false);

  // Refs for latest values to avoid stale closures
  const projectRef = useRef<LoadedProject | null>(null);
  const balancesRef = useRef<BalanceSnapshot | null>(null);

  /**
   * Update formatted balances when balances or project change
   */
  const updateFormattedBalances = useCallback(() => {
    const currentProject = projectRef.current;
    const currentBalances = balancesRef.current;

    if (currentProject && currentBalances) {
      const newFormatted: FormattedBalances = {
        oldToken: formatTokenAmount(currentBalances.oldToken, currentProject.oldTokenDecimals),
        newToken: formatTokenAmount(currentBalances.newToken, currentProject.newTokenDecimals),
        mft: formatTokenAmount(currentBalances.mft, currentProject.mftDecimals),
        sol: formatTokenAmount(currentBalances.sol, 9), // SOL always has 9 decimals
      };

      if (isMountedRef.current) {
        setFormatted(newFormatted);
      }
    } else {
      if (isMountedRef.current) {
        setFormatted(null);
      }
    }
  }, []);

  /**
   * Fetch all project session data
   */
  const fetchData = useCallback(async () => {
    if (!enabled) {
      return;
    }

    // Prevent concurrent fetches
    if (isFetchingRef.current) {
      console.log(`[useProjectSession] Already fetching project session: ${projectId}`);
      return;
    }

    try {
      isFetchingRef.current = true;
      console.log(`[useProjectSession] Starting to load project session: ${projectId}`);
      setIsLoading(true);
      setError(null);

      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Project session loading timeout after 30 seconds. Please check your RPC connection.`));
        }, 30000); // 30 second timeout
      });

      // 1. Load project
      const loadProjectPromise = loadProject(projectId, connection, {
        network,
        skipCache: false,
      });

      const loadedProject = await Promise.race([
        loadProjectPromise,
        timeoutPromise
      ]);

      projectRef.current = loadedProject;

      if (isMountedRef.current) {
        setProject(loadedProject);
      }

      // 2. Get balances if user is provided
      if (user) {
        const userBalances = await getBalances(projectId, user, connection, loadedProject, {
          network,
          skipCache: false,
        });

        balancesRef.current = userBalances;

        if (isMountedRef.current) {
          setBalances(userBalances);
        }

        // 3. Compute eligibility
        const eligibility = await computeClaimEligibility(
          connection,
          projectId,
          user,
          {
            network,
            skipCache: false,
          }
        );

        if (isMountedRef.current) {
          setClaimEligibility(eligibility);
          setClaimType(determineClaimType(eligibility));
          setRedirect(getRedirectIntent(eligibility, loadedProject));
        }
      } else {
        // No user - clear balances and eligibility
        balancesRef.current = null;

        if (isMountedRef.current) {
          setBalances(null);
          setClaimEligibility(null);
          setClaimType(null);
          setRedirect(null);
        }
      }

      // Update formatted balances
      updateFormattedBalances();

      if (isMountedRef.current) {
        setIsLoading(false);
      }

      console.log(`[useProjectSession] Successfully loaded project session for: ${projectId}`);
    } catch (err) {
      console.error(`[useProjectSession] Failed to load project session "${projectId}":`, err);
      const error = err instanceof Error ? err : new Error(String(err));

      if (isMountedRef.current) {
        setError(error);
        setIsLoading(false);
      }
    } finally {
      isFetchingRef.current = false;
      if (isMountedRef.current) {
        console.log(`[useProjectSession] Finished loading attempt for "${projectId}"`);
      }
    }
  }, [projectId, connection, user, network, enabled, updateFormattedBalances]);

  /**
   * Manual refresh function
   */
  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Backfill formatted balances if project loads after balances
  useEffect(() => {
    updateFormattedBalances();
  }, [project, balances, updateFormattedBalances]);

  // Auto-refetch at interval if enabled
  useEffect(() => {
    if (!enabled || refetchInterval === null || refetchInterval <= 0) {
      return;
    }

    const interval = setInterval(() => {
      fetchData();
    }, refetchInterval);

    return () => {
      clearInterval(interval);
    };
  }, [fetchData, refetchInterval, enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    project,
    balances,
    formatted,
    claimType,
    claimEligibility,
    redirect,
    isLoading,
    error,
    refresh,
  };
}
