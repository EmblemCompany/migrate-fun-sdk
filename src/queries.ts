/**
 * Project discovery and user migration record queries
 *
 * This module provides functions for:
 * - Discovering all projects on-chain
 * - Fetching user migration records
 * - Getting lightweight project snapshots for eligibility checks
 *
 * All functions use RPC throttling and caching to minimize network load.
 *
 * @module queries
 * @see IDL_REFERENCE.md:621-871 for query operations
 */

import { Connection, PublicKey } from '@solana/web3.js';
import { getProgram } from './program';
import { getUserMigrationPda } from './pdas';
import { loadProject } from './balances';
import type {
  LoadedProject,
  UserMigrationRecord,
  Network,
} from './types';
import { SdkError, SdkErrorCode } from './types';
import { sdkCache, rpcThrottle, CACHE_TTL, createCacheKey } from './utils/cache';

/**
 * Paginated project results
 */
export interface ProjectInfoPage {
  /**
   * Array of loaded projects
   */
  projects: LoadedProject[];

  /**
   * Cursor for next page (if hasMore is true)
   */
  cursor?: string;

  /**
   * Whether there are more projects to fetch
   */
  hasMore: boolean;
}

/**
 * Options for getAllProjects
 */
export interface GetAllProjectsOptions {
  /**
   * Network to query (defaults to current active network)
   */
  network?: Network;

  /**
   * Maximum number of projects to return
   */
  limit?: number;

  /**
   * Cursor from previous page (for pagination)
   */
  cursor?: string;

  /**
   * Skip cache and fetch fresh data
   */
  skipCache?: boolean;
}

/**
 * Options for getUserMigrationRecord
 */
export interface GetUserMigrationRecordOptions {
  /**
   * Network to query (defaults to current active network)
   */
  network?: Network;

  /**
   * Skip cache and fetch fresh data
   */
  skipCache?: boolean;
}

/**
 * Get all migration projects
 *
 * Returns a paginated list of all projects on-chain. Results are cached
 * to reduce RPC load.
 *
 * @param {Connection} connection - Solana RPC connection
 * @param {GetAllProjectsOptions} [options] - Query options
 * @returns {Promise<ProjectInfoPage>} Paginated project list
 * @throws {SdkError} If fetch fails
 *
 * @example
 * ```typescript
 * import { Connection } from '@solana/web3.js';
 * import { getAllProjects } from '@migratefun/sdk';
 *
 * const connection = new Connection('https://api.devnet.solana.com');
 *
 * // Get first 10 projects
 * const page1 = await getAllProjects(connection, { limit: 10 });
 * console.log(`Found ${page1.projects.length} projects`);
 *
 * // Get next page if available
 * if (page1.hasMore) {
 *   const page2 = await getAllProjects(connection, {
 *     limit: 10,
 *     cursor: page1.cursor
 *   });
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Get all projects (no limit)
 * const allProjects = await getAllProjects(connection);
 * console.log(`Total projects: ${allProjects.projects.length}`);
 * ```
 */
export async function getAllProjects(
  connection: Connection,
  options: GetAllProjectsOptions = {}
): Promise<ProjectInfoPage> {
  const { network, limit = 100, cursor, skipCache = false } = options;

  // Check cache first
  const cacheKey = createCacheKey('all-projects', network || 'default', cursor || 'first', limit.toString());
  if (!skipCache) {
    const cached = sdkCache.get(cacheKey) as ProjectInfoPage | null;
    if (cached) {
      return cached;
    }
  }

  try {
    // Throttle RPC request
    await rpcThrottle.wait();

    // Get program instance
    const program = await getProgram(connection, { network });

    // Fetch all project config accounts
    // Note: This is a simplified implementation. In production, you'd want to:
    // 1. Use getProgramAccounts with filters
    // 2. Implement proper pagination with data slicing
    // 3. Cache intermediate results
    const projectConfigs = await (program.account as any).projectConfig.all();

    // For now, return all projects (no pagination)
    // TODO: Implement proper pagination with cursor/offset
    const projects: LoadedProject[] = [];

    for (const config of projectConfigs.slice(0, limit)) {
      try {
        // Extract project ID from account (would need to be stored in account data)
        // For now, we'll use the account address as project ID
        const projectIdStr = config.publicKey.toBase58();

        // Load the full project
        const project = await loadProject(projectIdStr, connection, { network, skipCache: true });
        projects.push(project);
      } catch (error) {
        // Skip projects that fail to load
        console.warn(`Failed to load project ${config.publicKey.toBase58()}:`, error);
      }
    }

    const result: ProjectInfoPage = {
      projects,
      cursor: projects.length >= limit ? projects[projects.length - 1].projectId.toBase58() : undefined,
      hasMore: projectConfigs.length > limit,
    };

    // Cache the result
    sdkCache.set(cacheKey, result, CACHE_TTL.PROJECT_CONFIG);

    return result;
  } catch (error) {
    if (error instanceof SdkError) {
      throw error;
    }

    throw new SdkError(
      SdkErrorCode.RPC_ERROR,
      `Failed to fetch projects: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error
    );
  }
}

/**
 * Get user's migration record for a project
 *
 * Fetches the on-chain migration record showing how much the user migrated
 * and whether they've claimed a refund.
 *
 * @param {Connection} connection - Solana RPC connection
 * @param {PublicKey} user - User wallet public key
 * @param {string} projectId - Project identifier
 * @param {GetUserMigrationRecordOptions} [options] - Query options
 * @returns {Promise<UserMigrationRecord | null>} Migration record or null if user hasn't migrated
 * @throws {SdkError} If fetch fails
 *
 * @example
 * ```typescript
 * import { Connection, PublicKey } from '@solana/web3.js';
 * import { getUserMigrationRecord } from '@migratefun/sdk';
 *
 * const connection = new Connection('https://api.devnet.solana.com');
 * const user = new PublicKey('...');
 *
 * const record = await getUserMigrationRecord(
 *   connection,
 *   user,
 *   'my-project'
 * );
 *
 * if (record) {
 *   console.log(`Migrated: ${record.amountMigrated}`);
 *   console.log(`Claimed refund: ${record.hasClaimedRefund}`);
 *   console.log(`Migrated at: ${new Date(record.migratedAt * 1000)}`);
 * } else {
 *   console.log('User has not migrated');
 * }
 * ```
 */
export async function getUserMigrationRecord(
  connection: Connection,
  user: PublicKey,
  projectId: string,
  options: GetUserMigrationRecordOptions = {}
): Promise<UserMigrationRecord | null> {
  const { network, skipCache = false } = options;

  // Check cache first
  const cacheKey = createCacheKey('user-migration', projectId, user.toBase58(), network || 'default');
  if (!skipCache) {
    const cached = sdkCache.get(cacheKey) as UserMigrationRecord | null | undefined;
    if (cached !== undefined) {
      return cached;
    }
  }

  try {
    // Throttle RPC request
    await rpcThrottle.wait();

    // Get program instance
    const program = await getProgram(connection, { network });

    // Derive user migration PDA
    const [userMigrationPda] = getUserMigrationPda(user, projectId, { network });

    // Fetch user migration account
    let migrationAccount: any;
    try {
      migrationAccount = await (program.account as any).userMigration.fetch(userMigrationPda);
    } catch (error) {
      // Account doesn't exist - user hasn't migrated
      sdkCache.set(cacheKey, null, CACHE_TTL.BALANCES);
      return null;
    }

    if (!migrationAccount) {
      sdkCache.set(cacheKey, null, CACHE_TTL.BALANCES);
      return null;
    }

    // Parse migration record
    const record: UserMigrationRecord = {
      amountMigrated: BigInt(migrationAccount.amountMigrated?.toString() || '0'),
      hasClaimedRefund: migrationAccount.hasClaimedRefund || false,
      migratedAt: (migrationAccount.migratedAt as any)?.toNumber?.() || 0,
    };

    // Cache the record
    sdkCache.set(cacheKey, record, CACHE_TTL.BALANCES);

    return record;
  } catch (error) {
    if (error instanceof SdkError) {
      throw error;
    }

    // Check for account not found (expected if user hasn't migrated)
    if (error && typeof error === 'object' && 'message' in error) {
      const message = (error as any).message;
      if (message?.includes('Account does not exist')) {
        sdkCache.set(cacheKey, null, CACHE_TTL.BALANCES);
        return null;
      }
    }

    throw new SdkError(
      SdkErrorCode.RPC_ERROR,
      `Failed to fetch user migration record: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error
    );
  }
}

/**
 * Check if user has participated in a migration
 *
 * Convenience function that returns a simple boolean.
 *
 * @param {Connection} connection - Solana RPC connection
 * @param {PublicKey} user - User wallet public key
 * @param {string} projectId - Project identifier
 * @param {GetUserMigrationRecordOptions} [options] - Query options
 * @returns {Promise<boolean>} True if user has migrated
 *
 * @example
 * ```typescript
 * import { hasUserMigrated } from '@migratefun/sdk';
 *
 * const hasMigrated = await hasUserMigrated(connection, user, 'my-project');
 * if (hasMigrated) {
 *   console.log('User has participated in this migration');
 * }
 * ```
 */
export async function hasUserMigrated(
  connection: Connection,
  user: PublicKey,
  projectId: string,
  options: GetUserMigrationRecordOptions = {}
): Promise<boolean> {
  const record = await getUserMigrationRecord(connection, user, projectId, options);
  return record !== null && record.amountMigrated > 0n;
}
