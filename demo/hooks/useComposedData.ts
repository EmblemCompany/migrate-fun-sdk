/**
 * useComposedData Hook
 *
 * Combines all data fetching hooks into a single interface.
 * Manages refresh logic and loading states.
 */

import { useCallback, useEffect, useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import {
  useLoadedProject,
  useBalances,
  useEligibility
} from '@migratefun/sdk/react';

interface UseComposedDataOptions {
  network?: 'devnet' | 'mainnet-beta';
  refetchInterval?: number;
  enabled?: boolean;
}

export function useComposedData(
  projectId: string,
  connection: Connection,
  publicKey: PublicKey | null,
  options: UseComposedDataOptions = {}
) {
  const { network, refetchInterval = 3000, enabled = true } = options;

  // Track if we've ever loaded the project successfully
  const [hasLoadedProject, setHasLoadedProject] = useState(false);

  // Load project (doesn't need wallet)
  const {
    project,
    isLoading: projectLoading,
    error: projectError,
    refetch: refetchProject,
  } = useLoadedProject(projectId, connection, {
    network,
    enabled: enabled && !!projectId,
  });

  // Load balances (only when wallet connected)
  const {
    balances,
    formatted,
    isLoading: balancesLoading,
    error: balancesError,
    refetch: refreshBalances,
  } = useBalances(
    projectId,
    publicKey,
    connection,
    {
      network,
      project: project || undefined,
      refetchInterval: publicKey ? refetchInterval : 0,
      enabled: enabled && !!projectId && !!publicKey,
    }
  );

  // Check eligibility (only when wallet connected)
  const {
    eligibility,
    claimType,
    isLoading: claimLoading,
    error: claimError,
    refetch: refetchEligibility,
  } = useEligibility(
    projectId,
    publicKey,
    connection,
    {
      network,
      enabled: enabled && !!projectId && !!publicKey,
    }
  );

  // Track if project has ever loaded
  useEffect(() => {
    if (project && !hasLoadedProject) {
      setHasLoadedProject(true);
    }
  }, [project, hasLoadedProject]);

  // Refresh balances and eligibility when wallet connects
  useEffect(() => {
    if (publicKey && project) {
      console.log('[ComposedData] Wallet connected, refreshing data...');
      refreshBalances();
      refetchEligibility();
    }
  }, [publicKey, project, refreshBalances, refetchEligibility]);

  // Composed refresh function
  const refresh = useCallback(async () => {
    console.log('[ComposedData] Refreshing all data...');
    await Promise.all([
      refetchProject(),
      publicKey ? refreshBalances() : Promise.resolve(),
      publicKey ? refetchEligibility() : Promise.resolve(),
    ]);
  }, [refetchProject, refreshBalances, refetchEligibility, publicKey]);

  // Computed states
  const isLoading = projectLoading || (publicKey && (balancesLoading || claimLoading));
  const hasError = !!(projectError || balancesError || claimError);
  const isInitializing = projectLoading && !project;

  return {
    // Data
    project,
    balances,
    formatted,
    eligibility,
    claimType,

    // Loading states
    projectLoading,
    balancesLoading,
    claimLoading,
    isLoading,
    isInitializing,
    hasLoadedProject,

    // Error states
    projectError,
    balancesError,
    claimError,
    hasError,

    // Actions
    refresh,
    refreshBalances,
    refetchProject,
    refetchEligibility,
  };
}