/**
 * Program resolution and IDL handling for the migrate.fun migration program
 *
 * This module handles:
 * - Network-specific IDL loading (devnet vs mainnet)
 * - Program ID resolution
 * - Anchor Program instance creation
 * - Environment variable configuration
 *
 * @module program
 */

import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import type { Network, IdlSource } from './types';
import devnetIdlJson from '../idl/dev/devnet_hustle_migration.json';
import mainnetIdlJson from '../idl/mainnet/mainnet_hustle_migration.json';

/**
 * Type representing the base IDL structure
 */
type BaseIdl = typeof devnetIdlJson | typeof mainnetIdlJson;

/**
 * IDL type with string address (for serialization compatibility)
 */
type WithStringAddress<T> = Omit<T, 'address'> & { address: string };
export type HustleMigrationIdl = WithStringAddress<BaseIdl> & { __migrationIdl: true };

/**
 * Cached IDL data
 */
interface CachedIdl {
  network: Network;
  idl: HustleMigrationIdl;
  programId: PublicKey;
}

// Cache for loaded IDLs
const cacheByNetwork = new Map<Network, CachedIdl>();
let activeNetwork: Network | null = null;

/**
 * Normalize IDL accounts by merging type definitions
 * This fixes cases where account type is missing but defined in types array
 */
function normalizeIdlAccounts(idl: BaseIdl): BaseIdl {
  if (!Array.isArray(idl.accounts) || !Array.isArray(idl.types)) {
    return idl;
  }

  const typeMap = new Map<string, any>();
  for (const typeDef of idl.types) {
    if (typeDef?.name) {
      typeMap.set(typeDef.name.toLowerCase(), typeDef);
    }
  }

  let didChange = false;
  const accounts = idl.accounts.map((account) => {
    if ((account as any)?.type) {
      return account;
    }

    const typeDef = typeMap.get((account as any).name.toLowerCase());
    if (!typeDef?.type) {
      return account;
    }

    didChange = true;
    return {
      ...account,
      type: typeDef.type,
      docs: (account as any).docs ?? typeDef.docs,
    };
  });

  if (!didChange) {
    return idl;
  }

  return {
    ...idl,
    accounts,
  };
}

/**
 * Resolve the network from environment variables
 *
 * Checks in order:
 * 1. SOLANA_NETWORK env var
 * 2. NEXT_PUBLIC_SOLANA_NETWORK env var
 * 3. Defaults to 'devnet'
 *
 * @returns {Network} The resolved network ('devnet' or 'mainnet-beta')
 * @throws {Error} If an unsupported network is specified
 */
export function resolveNetwork(explicit?: Network): Network {
  if (explicit) {
    return explicit;
  }

  // Browser-safe: only check process.env if available
  const envNetwork =
    (typeof process !== 'undefined' && process.env?.SOLANA_NETWORK) ||
    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SOLANA_NETWORK);

  const candidate = (typeof envNetwork === 'string' ? envNetwork.toLowerCase() : 'devnet') || 'devnet';

  if (candidate === 'mainnet' || candidate === 'mainnet-beta') {
    return 'mainnet-beta';
  }

  if (candidate === 'devnet') {
    return 'devnet';
  }

  throw new Error(
    `Unsupported Solana network "${candidate}" for migration program.\n` +
      'Set SOLANA_NETWORK (or NEXT_PUBLIC_SOLANA_NETWORK) to devnet or mainnet-beta.'
  );
}

/**
 * Load and cache IDL for a given network
 *
 * @param {Network} [networkOverride] - Optional network override
 * @returns {CachedIdl} Cached IDL data including programId
 */
function loadIdl(networkOverride?: Network): CachedIdl {
  const network = networkOverride ?? activeNetwork ?? resolveNetwork();

  // Return cached version if available
  if (cacheByNetwork.has(network)) {
    activeNetwork = network;
    return cacheByNetwork.get(network)!;
  }

  // Load appropriate IDL for network
  const source = network === 'mainnet-beta' ? mainnetIdlJson : devnetIdlJson;
  const normalizedSource = normalizeIdlAccounts(source);

  // Check for program ID override
  const programOverride =
    typeof process !== 'undefined' && process.env?.MIGRATION_PROGRAM_OVERRIDE;
  const programAddress = (typeof programOverride === 'string' ? programOverride.trim() : source.address) || source.address;
  const programId = new PublicKey(programAddress);

  // Create typed IDL
  const idl: HustleMigrationIdl = {
    ...normalizedSource,
    address: programAddress,
    __migrationIdl: true,
  } as HustleMigrationIdl;

  // Cache the result
  const cached: CachedIdl = { network, idl, programId };
  cacheByNetwork.set(network, cached);
  activeNetwork = network;

  return cached;
}

/**
 * Get the currently active network
 *
 * @returns {Network} The active network
 */
export function getActiveNetwork(): Network {
  return activeNetwork ?? loadIdl().network;
}

/**
 * Set the active network (forces IDL reload)
 *
 * @param {Network} network - Network to activate
 */
export function setActiveNetwork(network: Network): void {
  loadIdl(network);
}

/**
 * Get the migration program ID for a given network
 *
 * This is the primary entry point for getting the program ID.
 * By default, uses the program ID from the bundled IDL.
 * Can be overridden via MIGRATION_PROGRAM_OVERRIDE env var.
 *
 * @param {Network} [network] - Optional network override
 * @returns {PublicKey} The migration program ID
 *
 * @example
 * ```typescript
 * import { PROGRAM_ID } from '@migratefun/sdk';
 *
 * console.log(PROGRAM_ID.toBase58());
 * // => "migkduYrPRH1tt7jdpdeu6BjRrJw5DSoLPcD9W2pp68"
 * ```
 */
export function getProgramId(network?: Network): PublicKey {
  return loadIdl(network).programId;
}

/**
 * Default program ID (loaded for current network)
 */
export const PROGRAM_ID = getProgramId();

/**
 * Get the Anchor IDL for the migration program
 *
 * @param {Network} [network] - Optional network override
 * @returns {HustleMigrationIdl} The typed IDL
 *
 * @example
 * ```typescript
 * import { getIdl } from '@migratefun/sdk';
 *
 * const idl = getIdl('mainnet-beta');
 * console.log(idl.version); // => "0.1.0"
 * ```
 */
export function getIdl(network?: Network): HustleMigrationIdl {
  return loadIdl(network).idl;
}

/**
 * Configuration options for creating a Program instance
 */
export interface GetProgramOptions {
  /**
   * Network to use (defaults to active network)
   */
  network?: Network;

  /**
   * IDL source preference
   * - 'bundle': Use bundled IDL (default, fastest)
   * - 'onchain': Fetch IDL from on-chain (requires RPC call)
   */
  idlSource?: IdlSource;
}

/**
 * Create an Anchor Program instance for the migration program
 *
 * This is the main entry point for creating a typed Program instance
 * that can be used to call migration instructions.
 *
 * @param {Connection | AnchorProvider} connectionOrProvider - Solana connection or Anchor provider
 * @param {GetProgramOptions} [options] - Configuration options
 * @returns {Promise<Program>} Typed Anchor Program instance
 *
 * @example
 * ```typescript
 * import { Connection } from '@solana/web3.js';
 * import { getProgram } from '@migratefun/sdk';
 *
 * const connection = new Connection('https://api.devnet.solana.com');
 * const program = await getProgram(connection, { network: 'devnet' });
 *
 * // Now you can call program methods
 * const projectConfig = await program.account.projectConfig.fetch(projectConfigPda);
 * ```
 */
export async function getProgram(
  connectionOrProvider: Connection | AnchorProvider,
  options: GetProgramOptions = {}
): Promise<Program> {
  const { network, idlSource = 'bundle' } = options;
  const { idl, programId } = loadIdl(network);

  // Create provider if connection was passed
  const provider =
    connectionOrProvider instanceof Connection
      ? new AnchorProvider(
          connectionOrProvider,
          {} as any, // No wallet needed for read-only operations
          { commitment: 'confirmed' }
        )
      : connectionOrProvider;

  // Use bundled IDL (default, fastest)
  if (idlSource === 'bundle') {
    return new Program(idl as any, provider);
  }

  // Fetch IDL from on-chain (slower, but always up-to-date)
  try {
    const onchainIdl = await Program.fetchIdl(programId, provider);
    if (onchainIdl) {
      return new Program(onchainIdl as any, provider);
    }
  } catch (error) {
    console.warn(
      '[migrate.fun SDK] Failed to fetch on-chain IDL, falling back to bundled version:',
      error
    );
  }

  // Fallback to bundled IDL
  return new Program(idl as any, provider);
}

/**
 * Reset the IDL cache (useful for testing)
 * @internal
 */
export function _resetCache(): void {
  cacheByNetwork.clear();
  activeNetwork = null;
}
