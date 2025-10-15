/**
 * React hook for loading project metadata with caching
 *
 * Provides automatic project loading, caching, and revalidation for React applications.
 * Handles loading states, error states, and allows manual refetching.
 *
 * @module react/useLoadedProject
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Connection } from '@solana/web3.js';
import type { LoadedProject, Network } from '../src/types';
import { loadProject } from '../src/balances';
import { SdkError } from '../src/types';

/**
 * Options for useLoadedProject hook
 */
export interface UseLoadedProjectOptions {
  /**
   * Network to use (defaults to active network)
   */
  network?: Network;

  /**
   * Polling interval in milliseconds (set to 0 to disable polling)
   * @default 0
   */
  refetchInterval?: number;

  /**
   * Enable/disable the hook (set to false to pause fetching)
   * @default true
   */
  enabled?: boolean;
}

/**
 * Return type for useLoadedProject hook
 */
export interface UseLoadedProjectReturn {
  /**
   * Loaded project data (null if not loaded)
   */
  project: LoadedProject | null;

  /**
   * Whether the project is currently loading
   */
  isLoading: boolean;

  /**
   * Error if project loading failed
   */
  error: Error | null;

  /**
   * Manually refetch the project
   */
  refetch: () => Promise<void>;
}

/**
 * React hook for loading and caching project metadata
 *
 * Automatically loads project configuration from the blockchain with built-in
 * caching, loading states, error handling, and optional polling for updates.
 *
 * @param {string} projectId - Unique project identifier
 * @param {Connection} connection - Solana RPC connection
 * @param {UseLoadedProjectOptions} [options] - Hook options
 * @returns {UseLoadedProjectReturn} Project data, loading state, error, and refetch function
 *
 * @example
 * ```tsx
 * import { useLoadedProject } from '@migratefun/sdk/react';
 * import { useConnection } from '@solana/wallet-adapter-react';
 *
 * function ProjectInfo() {
 *   const { connection } = useConnection();
 *   const { project, isLoading, error, refetch } = useLoadedProject(
 *     'my-project',
 *     connection
 *   );
 *
 *   if (isLoading) return <div>Loading project...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *   if (!project) return <div>Project not found</div>;
 *
 *   return (
 *     <div>
 *       <h2>Project: {project.projectId.toBase58()}</h2>
 *       <p>Exchange Rate: {Number(project.exchangeRate) / 10000}</p>
 *       <p>Phase: {project.phase}</p>
 *       <p>Paused: {project.paused ? 'Yes' : 'No'}</p>
 *       <button onClick={refetch}>Refresh</button>
 *     </div>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With polling for real-time updates
 * const { project, isLoading } = useLoadedProject(
 *   'my-project',
 *   connection,
 *   {
 *     refetchInterval: 60000, // Poll every 60 seconds
 *     network: 'devnet'
 *   }
 * );
 * ```
 */
export function useLoadedProject(
  projectId: string,
  connection: Connection,
  options: UseLoadedProjectOptions = {}
): UseLoadedProjectReturn {
  const {
    network,
    refetchInterval = 0,
    enabled = true,
  } = options;

  const [project, setProject] = useState<LoadedProject | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Use ref to track if component is mounted
  const isMountedRef = useRef<boolean>(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Fetch project data
   */
  const fetchProject = useCallback(async () => {
    if (!enabled) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const loadedProject = await loadProject(projectId, connection, { network });

      if (isMountedRef.current) {
        setProject(loadedProject);
        setError(null);
      }
    } catch (err) {
      if (isMountedRef.current) {
        const error = err instanceof SdkError || err instanceof Error
          ? err
          : new Error(String(err));
        setError(error);
        setProject(null);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [projectId, connection, network, enabled]);

  /**
   * Manual refetch function exposed to users
   */
  const refetch = useCallback(async () => {
    await fetchProject();
  }, [fetchProject]);

  // Initial fetch on mount or when dependencies change
  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  // Set up polling if refetchInterval is provided
  useEffect(() => {
    if (refetchInterval > 0 && enabled) {
      intervalRef.current = setInterval(() => {
        fetchProject();
      }, refetchInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      };
    }
    return undefined;
  }, [refetchInterval, enabled, fetchProject]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    project,
    isLoading,
    error,
    refetch,
  };
}
