/**
 * React hook for checking claim eligibility
 *
 * Focused hook that only handles claim eligibility checks.
 * Takes wallet as a parameter, doesn't manage wallet state.
 *
 * @module react/useEligibility
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Connection, PublicKey } from '@solana/web3.js';
import type { ClaimEligibility, ClaimType, Network } from '../src/core/types';
import {
  computeClaimEligibility,
  determineClaimType,
} from '../src/queries/eligibility';

/**
 * Options for useEligibility hook
 */
export interface UseEligibilityOptions {
  /**
   * Network to use (defaults to active network)
   */
  network?: Network;

  /**
   * Enable/disable the hook (set to false to pause fetching)
   * @default true
   */
  enabled?: boolean;

  /**
   * Skip cache for fresh data
   * @default false
   */
  skipCache?: boolean;
}

/**
 * Return type for useEligibility hook
 */
export interface UseEligibilityReturn {
  /**
   * Detailed claim eligibility information
   */
  eligibility: ClaimEligibility | null;

  /**
   * Best available claim type for the user
   */
  claimType: ClaimType;

  /**
   * Whether eligibility is currently being checked
   */
  isLoading: boolean;

  /**
   * Error if eligibility check failed
   */
  error: Error | null;

  /**
   * Manually refresh eligibility
   */
  refetch: () => Promise<void>;
}

/**
 * React hook for checking claim eligibility
 *
 * Determines what type of claim (if any) a user is eligible for.
 * Follows single responsibility principle - only handles eligibility.
 *
 * @param {string} projectId - Unique project identifier
 * @param {PublicKey | null | undefined} user - User wallet public key (null/undefined disables hook)
 * @param {Connection} connection - Solana RPC connection
 * @param {UseEligibilityOptions} [options] - Hook options
 * @returns {UseEligibilityReturn} Eligibility data, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * import { useEligibility } from '@migratefun/sdk/react';
 * import { useWallet, useConnection } from '@solana/wallet-adapter-react';
 *
 * function ClaimEligibility() {
 *   const { publicKey } = useWallet();
 *   const { connection } = useConnection();
 *
 *   const { eligibility, claimType, isLoading, error } = useEligibility(
 *     'my-project',
 *     publicKey,
 *     connection
 *   );
 *
 *   if (!publicKey) return <div>Connect wallet to check eligibility</div>;
 *   if (isLoading) return <div>Checking eligibility...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   if (!eligibility) return <div>Unable to determine eligibility</div>;
 *
 *   return (
 *     <div>
 *       {claimType === 'mft' && <p>You can claim with MFT (no penalty)</p>}
 *       {claimType === 'merkle' && <p>You can claim with merkle proof (with penalty)</p>}
 *       {claimType === 'refund' && <p>You can claim a refund</p>}
 *       {!claimType && <p>No claims available</p>}
 *     </div>
 *   );
 * }
 * ```
 */
export function useEligibility(
  projectId: string,
  user: PublicKey | null | undefined,
  connection: Connection,
  options: UseEligibilityOptions = {}
): UseEligibilityReturn {
  const { network, enabled = true, skipCache = false } = options;

  const [eligibility, setEligibility] = useState<ClaimEligibility | null>(null);
  const [claimType, setClaimType] = useState<ClaimType>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Track if component is mounted
  const isMountedRef = useRef<boolean>(true);
  const isFetchingRef = useRef<boolean>(false);

  /**
   * Fetch eligibility data
   */
  const fetchEligibility = useCallback(async () => {
    // Skip if no user or disabled
    if (!user || !enabled) {
      setEligibility(null);
      setClaimType(null);
      setIsLoading(false);
      return;
    }

    // Prevent concurrent fetches
    if (isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;

    try {
      setIsLoading(true);
      setError(null);

      const result = await computeClaimEligibility(
        connection,
        projectId,
        user,
        { network, skipCache }
      );

      if (isMountedRef.current) {
        setEligibility(result);
        setClaimType(determineClaimType(result));
        setError(null);
      }
    } catch (err) {
      if (isMountedRef.current) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        setEligibility(null);
        setClaimType(null);
      }
    } finally {
      isFetchingRef.current = false;
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [projectId, user, connection, network, enabled, skipCache]);

  /**
   * Manual refetch function
   */
  const refetch = useCallback(async () => {
    await fetchEligibility();
  }, [fetchEligibility]);

  // Fetch when dependencies change
  useEffect(() => {
    fetchEligibility();
  }, [fetchEligibility]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    eligibility,
    claimType,
    isLoading,
    error,
    refetch,
  };
}