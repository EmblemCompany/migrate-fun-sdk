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
   * @deprecated Project will always load when projectId is provided. This option only affects balance loading.
   */
  enabled?: boolean;

  /**
   * Maximum number of retries for failed requests (default: 3)
   */
  maxRetries?: number;

  /**
   * Base retry delay in milliseconds (default: 1000)
   * Actual delay uses exponential backoff: delay * retryCount
   */
  retryDelay?: number;
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
   * @deprecated Use projectLoading, balancesLoading, or claimLoading for granular control
   */
  isLoading: boolean;

  /**
   * Error if fetch failed
   * @deprecated Use projectError, balancesError, or claimError for granular control
   */
  error: Error | null;

  /**
   * Manually refresh all data
   */
  refresh: () => Promise<void>;

  // New granular loading states
  /**
   * Whether project is currently loading
   */
  projectLoading: boolean;

  /**
   * Project loading error
   */
  projectError: Error | null;

  /**
   * Whether balances are currently loading
   */
  balancesLoading: boolean;

  /**
   * Balances loading error
   */
  balancesError: Error | null;

  /**
   * Whether claim eligibility is currently loading
   */
  claimLoading: boolean;

  /**
   * Claim eligibility loading error
   */
  claimError: Error | null;

  /**
   * Refresh only balances (faster than full refresh)
   */
  refreshBalances: () => Promise<void>;

  /**
   * Clear all errors
   */
  clearErrors: () => void;

  /**
   * Whether this is the initial load
   */
  isInitializing: boolean;

  /**
   * Whether any critical error occurred
   */
  hasError: boolean;
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
  const {
    network,
    refetchInterval = 5000,
    enabled = true,
    maxRetries = 3,
    retryDelay = 1000
  } = options;

  // Core state
  const [project, setProject] = useState<LoadedProject | null>(null);
  const [balances, setBalances] = useState<BalanceSnapshot | null>(null);
  const [formatted, setFormatted] = useState<FormattedBalances | null>(null);
  const [claimEligibility, setClaimEligibility] = useState<ClaimEligibility | null>(null);
  const [claimType, setClaimType] = useState<ClaimType>(null);
  const [redirect, setRedirect] = useState<ProjectRedirectIntent | null>(null);

  // Granular loading states
  const [projectLoading, setProjectLoading] = useState<boolean>(false);
  const [projectError, setProjectError] = useState<Error | null>(null);
  const [balancesLoading, setBalancesLoading] = useState<boolean>(false);
  const [balancesError, setBalancesError] = useState<Error | null>(null);
  const [claimLoading, setClaimLoading] = useState<boolean>(false);
  const [claimError, setClaimError] = useState<Error | null>(null);

  // Overall states
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  // Legacy states for backward compatibility
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Track if component is mounted
  const isMountedRef = useRef<boolean>(true);

  // Track if we're currently fetching to prevent concurrent fetches
  const isFetchingRef = useRef<{ project: boolean; balances: boolean; claim: boolean }>({
    project: false,
    balances: false,
    claim: false,
  });

  // Retry counters
  const retryCountRef = useRef<{ project: number; balances: number; claim: number }>({
    project: 0,
    balances: 0,
    claim: 0,
  });

  // Refs for latest values to avoid stale closures
  const projectRef = useRef<LoadedProject | null>(null);
  const balancesRef = useRef<BalanceSnapshot | null>(null);
  const lastProjectIdRef = useRef<string>('');
  const previousUserRef = useRef<PublicKey | null>(null);

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
   * Load project with retry logic
   */
  const loadProjectData = useCallback(async (forceRefresh = false) => {
    // Skip if already loading or if projectId is empty
    if (!projectId || isFetchingRef.current.project) {
      return;
    }

    // Reset retry count on new projectId
    if (projectId !== lastProjectIdRef.current) {
      retryCountRef.current.project = 0;
      lastProjectIdRef.current = projectId;
    }

    isFetchingRef.current.project = true;

    try {
      if (isMountedRef.current) {
        setProjectLoading(true);
        setProjectError(null);
        // Update legacy state - always update when loading starts
        setIsLoading(true);
      }

      // Add timeout for better UX
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Project loading timeout. Please check your connection.'));
        }, 15000); // 15 second timeout
      });

      // Load project
      const loadedProject = await Promise.race([
        loadProject(projectId, connection, {
          network,
          skipCache: forceRefresh
        }),
        timeoutPromise
      ]);

      projectRef.current = loadedProject;

      if (isMountedRef.current) {
        setProject(loadedProject);
        setProjectLoading(false);
        setProjectError(null);
        retryCountRef.current.project = 0;
        // Update legacy state when loading completes
        setIsLoading(false);
      }

    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error('[useProjectSession] Failed to load project:', error);

      if (isMountedRef.current) {
        setProjectError(error);
        setProjectLoading(false);
        setError(error); // Legacy error state
        setIsLoading(false); // Update legacy loading state on error

        // Retry logic with exponential backoff and jitter
        if (retryCountRef.current.project < maxRetries) {
          retryCountRef.current.project++;
          console.log(`[useProjectSession] Retrying project load (${retryCountRef.current.project}/${maxRetries})...`);
          // Add jitter to prevent thundering herd
          const jitter = Math.random() * 500; // 0-500ms jitter
          const delay = retryDelay * Math.pow(1.5, retryCountRef.current.project - 1) + jitter;
          setTimeout(() => {
            if (isMountedRef.current) {
              loadProjectData(forceRefresh);
            }
          }, delay);
        } else {
          console.error('[useProjectSession] Max retries reached for project load');
        }
      }
    } finally {
      isFetchingRef.current.project = false;
    }
  }, [projectId, connection, network, maxRetries, retryDelay]);

  /**
   * Load balances with retry logic
   */
  const loadBalancesData = useCallback(async (forceRefresh = false) => {
    // Skip if no user or project, or if already loading
    if (!user || !projectRef.current || isFetchingRef.current.balances) {
      return;
    }

    isFetchingRef.current.balances = true;

    try {
      if (isMountedRef.current) {
        setBalancesLoading(true);
        setBalancesError(null);
      }

      // Add timeout for better UX
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Balance loading timeout. Please check your connection.'));
        }, 15000); // 15 second timeout
      });

      const userBalances = await Promise.race([
        getBalances(
          projectId,
          user,
          connection,
          projectRef.current,
          { network, skipCache: forceRefresh }
        ),
        timeoutPromise
      ]);

      balancesRef.current = userBalances;

      if (isMountedRef.current) {
        setBalances(userBalances);
        setBalancesLoading(false);
        setBalancesError(null);
        retryCountRef.current.balances = 0;
      }

    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error('[useProjectSession] Failed to load balances:', error);

      if (isMountedRef.current) {
        setBalancesError(error);
        setBalancesLoading(false);

        // Retry for non-critical errors with exponential backoff
        if (!error.message.includes('Account does not exist') &&
            retryCountRef.current.balances < maxRetries) {
          retryCountRef.current.balances++;
          console.log(`[useProjectSession] Retrying balance load (${retryCountRef.current.balances}/${maxRetries})...`);
          // Add jitter to prevent thundering herd
          const jitter = Math.random() * 500;
          const delay = retryDelay * Math.pow(1.5, retryCountRef.current.balances - 1) + jitter;
          setTimeout(() => {
            if (isMountedRef.current) {
              loadBalancesData(forceRefresh);
            }
          }, delay);
        } else if (retryCountRef.current.balances >= maxRetries) {
          console.error('[useProjectSession] Max retries reached for balance load');
        }
      }
    } finally {
      isFetchingRef.current.balances = false;
    }
  }, [user, projectId, connection, network, maxRetries, retryDelay]);

  /**
   * Load claim eligibility with retry logic
   */
  const loadClaimData = useCallback(async (forceRefresh = false) => {
    // Skip if no user or if already loading
    if (!user || isFetchingRef.current.claim) {
      return;
    }

    isFetchingRef.current.claim = true;

    try {
      if (isMountedRef.current) {
        setClaimLoading(true);
        setClaimError(null);
      }

      // Add timeout for better UX
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Claim eligibility loading timeout. Please check your connection.'));
        }, 15000); // 15 second timeout
      });

      const eligibility = await Promise.race([
        computeClaimEligibility(
          connection,
          projectId,
          user,
          { network, skipCache: forceRefresh }
        ),
        timeoutPromise
      ]);

      if (isMountedRef.current) {
        setClaimEligibility(eligibility);
        setClaimType(determineClaimType(eligibility));
        if (projectRef.current) {
          setRedirect(getRedirectIntent(eligibility, projectRef.current));
        }
        setClaimLoading(false);
        setClaimError(null);
        retryCountRef.current.claim = 0;
      }

    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error('[useProjectSession] Failed to load claim eligibility:', error);

      if (isMountedRef.current) {
        setClaimError(error);
        setClaimLoading(false);
        setClaimType(null);

        // Retry for non-critical errors with exponential backoff
        if (retryCountRef.current.claim < maxRetries) {
          retryCountRef.current.claim++;
          console.log(`[useProjectSession] Retrying claim load (${retryCountRef.current.claim}/${maxRetries})...`);
          // Add jitter to prevent thundering herd
          const jitter = Math.random() * 500;
          const delay = retryDelay * Math.pow(1.5, retryCountRef.current.claim - 1) + jitter;
          setTimeout(() => {
            if (isMountedRef.current) {
              loadClaimData(forceRefresh);
            }
          }, delay);
        } else {
          console.error('[useProjectSession] Max retries reached for claim load');
        }
      }
    } finally {
      isFetchingRef.current.claim = false;
    }
  }, [user, projectId, connection, network, maxRetries, retryDelay]);


  /**
   * Manual refresh function - refreshes all data
   */
  const refresh = useCallback(async () => {
    console.log('[useProjectSession] Refreshing all data...');
    retryCountRef.current = { project: 0, balances: 0, claim: 0 };

    // Load project first
    await loadProjectData(true);

    // Then load user-specific data in parallel if applicable
    if (user) {
      await Promise.all([
        loadBalancesData(true),
        loadClaimData(true),
      ]);
    }
  }, [loadProjectData, loadBalancesData, loadClaimData, user]);

  /**
   * Refresh only balances (faster than full refresh)
   */
  const refreshBalances = useCallback(async () => {
    if (user && projectRef.current) {
      await loadBalancesData(true);
    }
  }, [loadBalancesData, user]);

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setProjectError(null);
    setBalancesError(null);
    setClaimError(null);
    setError(null); // Legacy error
    retryCountRef.current = { project: 0, balances: 0, claim: 0 };
  }, []);

  // Load project when projectId changes (always, regardless of enabled)
  useEffect(() => {
    if (projectId) {
      // Reset project state when projectId changes to clear old data
      if (projectId !== lastProjectIdRef.current) {
        projectRef.current = null;
        setProject(null);
        setProjectError(null);
        setBalances(null);
        setFormatted(null);
        setClaimEligibility(null);
        setClaimType(null);
        setRedirect(null);
        balancesRef.current = null;
        // Reset retry counters for fresh start
        retryCountRef.current = { project: 0, balances: 0, claim: 0 };
      }
      loadProjectData();
    }
  }, [projectId, loadProjectData]);

  // Ensure balances load when project finishes loading and wallet is already connected
  // This handles the case where wallet connects before project loads
  useEffect(() => {
    if (project && user && enabled && !balancesRef.current && !isFetchingRef.current.balances) {
      console.log('[useProjectSession] Project loaded with connected wallet, loading balances...');
      loadBalancesData();
      loadClaimData();
    }
    // Intentionally omit loadBalancesData and loadClaimData from deps to prevent infinite loops
    // These functions are stable in practice due to useCallback with stable deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, user, enabled]);

  // Load balances and claim data when user or project changes
  useEffect(() => {
    // Detect wallet reconnection (null -> PublicKey)
    const wasDisconnected = previousUserRef.current === null;
    const isNowConnected = user !== null;
    const justReconnected = wasDisconnected && isNowConnected;

    if (user && project) {
      if (enabled) {
        // Always load balances when both user and project are available
        // This handles both initial load and wallet reconnection cases
        loadBalancesData();
        loadClaimData();

        // Log reconnection for debugging
        if (justReconnected) {
          console.log('[useProjectSession] Wallet reconnected, loading balances...');
        }
      }
    } else if (!user) {
      // Clear user-specific data when wallet disconnects
      setBalances(null);
      setClaimEligibility(null);
      setClaimType(null);
      setRedirect(null);
      setBalancesError(null);
      setClaimError(null);
      // Also clear refs
      balancesRef.current = null;
    }

    // Update the previous user ref
    previousUserRef.current = user;
    // Intentionally omit loadBalancesData and loadClaimData from deps to prevent infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, project, enabled]);

  // Backfill formatted balances if project loads after balances
  useEffect(() => {
    updateFormattedBalances();
  }, [project, balances, updateFormattedBalances]);

  // Track initialization state
  useEffect(() => {
    if (projectLoading === false && projectRef.current) {
      setIsInitializing(false);
    }
  }, [projectLoading]);

  // Auto-refetch at interval if enabled
  useEffect(() => {
    if (!enabled || refetchInterval === null || refetchInterval <= 0) {
      return;
    }

    const interval = setInterval(() => {
      // Only refresh balances on interval (lighter than full refresh)
      if (user && projectRef.current && !isFetchingRef.current.balances) {
        loadBalancesData();
      }
    }, refetchInterval);

    return () => {
      clearInterval(interval);
    };
    // Intentionally omit loadBalancesData to prevent infinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, refetchInterval, user]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      // Critical: Reset fetching flags to prevent blocking future loads
      isFetchingRef.current = {
        project: false,
        balances: false,
        claim: false,
      };
    };
  }, []);

  // Compute hasError state
  const hasError = !!(projectError || balancesError || claimError);

  return {
    // Core data
    project,
    balances,
    formatted,
    claimType,
    claimEligibility,
    redirect,

    // Legacy states (backward compatibility)
    isLoading,
    error,

    // Granular loading states
    projectLoading,
    projectError,
    balancesLoading,
    balancesError,
    claimLoading,
    claimError,

    // Overall states
    isInitializing,
    hasError,

    // Actions
    refresh,
    refreshBalances,
    clearErrors,
  };
}
