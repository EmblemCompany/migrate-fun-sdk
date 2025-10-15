import { Connection, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import { N as Network, L as LoadedProject, B as BalanceSnapshot } from '../types-B_E0RrC2.js';

/**
 * React hook for loading project metadata with caching
 *
 * Provides automatic project loading, caching, and revalidation for React applications.
 * Handles loading states, error states, and allows manual refetching.
 *
 * @module react/useLoadedProject
 */

/**
 * Options for useLoadedProject hook
 */
interface UseLoadedProjectOptions {
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
interface UseLoadedProjectReturn {
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
declare function useLoadedProject(projectId: string, connection: Connection, options?: UseLoadedProjectOptions): UseLoadedProjectReturn;

/**
 * React hook for real-time balance updates
 *
 * Provides automatic balance fetching with polling, caching, and formatted display values.
 * Handles loading states, error states, and allows manual refetching.
 *
 * @module react/useBalances
 */

/**
 * Options for useBalances hook
 */
interface UseBalancesOptions {
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
interface FormattedBalances {
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
interface UseBalancesReturn {
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
declare function useBalances(projectId: string, user: PublicKey | null | undefined, connection: Connection, options?: UseBalancesOptions): UseBalancesReturn;

/**
 * React hook for token migration transactions
 *
 * Provides migration transaction building, signing, sending, and status tracking.
 * Handles loading states, error states, and transaction confirmation.
 *
 * @module react/useMigrate
 */

/**
 * Wallet adapter interface (compatible with Solana Wallet Adapter)
 */
interface WalletAdapter {
    /**
     * Wallet public key
     */
    publicKey: PublicKey | null;
    /**
     * Sign a transaction
     */
    signTransaction?: <T extends Transaction | VersionedTransaction>(transaction: T) => Promise<T>;
    /**
     * Sign all transactions
     */
    signAllTransactions?: <T extends Transaction | VersionedTransaction>(transactions: T[]) => Promise<T[]>;
}
/**
 * Migration status tracking
 */
type MigrationStatus = 'idle' | 'preparing' | 'signing' | 'sending' | 'confirming' | 'confirmed' | 'error';
/**
 * Options for useMigrate hook
 */
interface UseMigrateOptions {
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
interface UseMigrateReturn {
    /**
     * Execute a token migration
     * @param projectId - Project identifier
     * @param amount - Amount to migrate (in base units as bigint)
     * @param project - Pre-loaded project configuration
     * @returns Transaction signature
     */
    migrate: (projectId: string, amount: bigint, project: LoadedProject) => Promise<string>;
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
declare function useMigrate(connection: Connection, wallet: WalletAdapter, options?: UseMigrateOptions): UseMigrateReturn;

export { type FormattedBalances, type MigrationStatus, type UseBalancesOptions, type UseBalancesReturn, type UseLoadedProjectOptions, type UseLoadedProjectReturn, type UseMigrateOptions, type UseMigrateReturn, type WalletAdapter, useBalances, useLoadedProject, useMigrate };
