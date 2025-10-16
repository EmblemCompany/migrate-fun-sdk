/**
 * Program Derived Address (PDA) utilities for the migrate.fun migration program
 *
 * This module provides functions to derive all PDAs used by the migration program.
 * PDAs are deterministic addresses derived from seeds and the program ID.
 *
 * @module pdas
 */

import { PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { getProgramId } from './program';
import type { Network } from './types';

/**
 * PDA seeds used by the migration program
 * @internal
 */
const SEEDS = {
  PROJECT_CONFIG: Buffer.from('project_config'),
  OLD_TOKEN_VAULT: Buffer.from('old_token_vault'),
  NEW_TOKEN_VAULT: Buffer.from('new_token_vault'),
  PROJECT_WSOL_VAULT: Buffer.from('project_wsol_vault'),
  PROJECT_REGISTRY: Buffer.from('project_registry'),
  PLATFORM_CONFIG: Buffer.from('platform_config'),
  PLATFORM_FEE_VAULT: Buffer.from([
    6, 221, 246, 225, 215, 101, 161, 147, 217, 203, 225, 70, 206, 235, 121, 172, 28, 180, 133,
    237, 95, 91, 55, 145, 58, 140, 245, 133, 126, 255, 0, 169,
  ]),
  QUOTE_TOKEN_VAULT: Buffer.from('quote_token_vault'),
  LP_VAULT: Buffer.from('lp_vault'),
  MFT_MINT: Buffer.from('mft_mint'),
  USER_MIGRATION: Buffer.from('user_migration'),
} as const;

/**
 * Options for PDA derivation
 */
export interface PdaOptions {
  /**
   * Network to use for program ID resolution
   */
  network?: Network;
}

/**
 * Get the project config PDA for a given project
 *
 * The project config PDA stores all project configuration including:
 * - Token mints (old/new)
 * - Migration timing (start/end timestamps)
 * - Exchange rates and decimals
 * - Pause status and phase
 *
 * @param {string} projectId - Unique project identifier (max 16 characters)
 * @param {PdaOptions} [options] - PDA derivation options
 * @returns {[PublicKey, number]} Tuple of [PDA address, bump seed]
 *
 * @example
 * ```typescript
 * import { getProjectConfigPda } from '@migratefun/sdk';
 *
 * const [projectConfigPda, bump] = getProjectConfigPda('my-project');
 * console.log(projectConfigPda.toBase58());
 * ```
 */
export function getProjectConfigPda(
  projectId: string,
  options: PdaOptions = {}
): [PublicKey, number] {
  const programId = getProgramId(options.network);
  return PublicKey.findProgramAddressSync(
    [SEEDS.PROJECT_CONFIG, Buffer.from(projectId)],
    programId
  );
}

/**
 * Get the old token vault PDA for a project
 *
 * The old token vault holds tokens that users migrate from.
 * Users send their old tokens to this vault during migration.
 *
 * @param {string} projectId - Unique project identifier
 * @param {PdaOptions} [options] - PDA derivation options
 * @returns {[PublicKey, number]} Tuple of [PDA address, bump seed]
 *
 * @example
 * ```typescript
 * import { getOldTokenVaultPda } from '@migratefun/sdk';
 *
 * const [vaultPda] = getOldTokenVaultPda('my-project');
 * ```
 */
export function getOldTokenVaultPda(
  projectId: string,
  options: PdaOptions = {}
): [PublicKey, number] {
  const programId = getProgramId(options.network);
  return PublicKey.findProgramAddressSync(
    [SEEDS.OLD_TOKEN_VAULT, Buffer.from(projectId)],
    programId
  );
}

/**
 * Get the new token vault PDA for a project
 *
 * The new token vault holds tokens that are distributed to users
 * who claim with MFT (Migration Finalization Tokens).
 *
 * @param {string} projectId - Unique project identifier
 * @param {PdaOptions} [options] - PDA derivation options
 * @returns {[PublicKey, number]} Tuple of [PDA address, bump seed]
 *
 * @example
 * ```typescript
 * import { getNewTokenVaultPda } from '@migratefun/sdk';
 *
 * const [vaultPda] = getNewTokenVaultPda('my-project');
 * ```
 */
export function getNewTokenVaultPda(
  projectId: string,
  options: PdaOptions = {}
): [PublicKey, number] {
  const programId = getProgramId(options.network);
  return PublicKey.findProgramAddressSync(
    [SEEDS.NEW_TOKEN_VAULT, Buffer.from(projectId)],
    programId
  );
}

/**
 * Get the WSOL vault PDA for a project
 *
 * The WSOL vault holds wrapped SOL collected as migration fees.
 *
 * @param {string} projectId - Unique project identifier
 * @param {PdaOptions} [options] - PDA derivation options
 * @returns {[PublicKey, number]} Tuple of [PDA address, bump seed]
 *
 * @example
 * ```typescript
 * import { getWsolVaultPda } from '@migratefun/sdk';
 *
 * const [wsolVault] = getWsolVaultPda('my-project');
 * ```
 */
export function getWsolVaultPda(projectId: string, options: PdaOptions = {}): [PublicKey, number] {
  const programId = getProgramId(options.network);
  return PublicKey.findProgramAddressSync(
    [SEEDS.PROJECT_WSOL_VAULT, Buffer.from(projectId)],
    programId
  );
}

/**
 * Get the quote token vault PDA for a project
 *
 * Used for projects that collect fees in a specific token (e.g., USDC).
 *
 * @param {string} projectId - Unique project identifier
 * @param {PdaOptions} [options] - PDA derivation options
 * @returns {[PublicKey, number]} Tuple of [PDA address, bump seed]
 *
 * @example
 * ```typescript
 * import { getQuoteTokenVaultPda } from '@migratefun/sdk';
 *
 * const [quoteVault] = getQuoteTokenVaultPda('my-project');
 * ```
 */
export function getQuoteTokenVaultPda(
  projectId: string,
  options: PdaOptions = {}
): [PublicKey, number] {
  const programId = getProgramId(options.network);
  return PublicKey.findProgramAddressSync(
    [SEEDS.QUOTE_TOKEN_VAULT, Buffer.from(projectId)],
    programId
  );
}

/**
 * Get the MFT (Migration Finalization Token) mint PDA for a project
 *
 * MFT is a receipt token minted to users during migration.
 * Users can later burn MFT to claim new tokens at 1:1 ratio.
 *
 * @param {string} projectId - Unique project identifier
 * @param {PdaOptions} [options] - PDA derivation options
 * @returns {[PublicKey, number]} Tuple of [PDA address, bump seed]
 *
 * @example
 * ```typescript
 * import { getMftMintPda } from '@migratefun/sdk';
 *
 * const [mftMint] = getMftMintPda('my-project');
 * ```
 */
export function getMftMintPda(projectId: string, options: PdaOptions = {}): [PublicKey, number] {
  const programId = getProgramId(options.network);
  return PublicKey.findProgramAddressSync([SEEDS.MFT_MINT, Buffer.from(projectId)], programId);
}

/**
 * Get the LP vault PDA for a project
 *
 * Holds liquidity pool tokens for projects that create DEX pools.
 *
 * @param {string} projectId - Unique project identifier
 * @param {PdaOptions} [options] - PDA derivation options
 * @returns {[PublicKey, number]} Tuple of [PDA address, bump seed]
 *
 * @example
 * ```typescript
 * import { getLpVaultPda } from '@migratefun/sdk';
 *
 * const [lpVault] = getLpVaultPda('my-project');
 * ```
 */
export function getLpVaultPda(projectId: string, options: PdaOptions = {}): [PublicKey, number] {
  const programId = getProgramId(options.network);
  return PublicKey.findProgramAddressSync([SEEDS.LP_VAULT, Buffer.from(projectId)], programId);
}

/**
 * Get the user migration PDA for a user and project
 *
 * Stores per-user migration data including:
 * - Amount migrated
 * - MFT received
 * - Refund claim status
 *
 * @param {PublicKey} user - User wallet public key
 * @param {string} projectId - Unique project identifier
 * @param {PdaOptions} [options] - PDA derivation options
 * @returns {[PublicKey, number]} Tuple of [PDA address, bump seed]
 *
 * @example
 * ```typescript
 * import { getUserMigrationPda } from '@migratefun/sdk';
 * import { PublicKey } from '@solana/web3.js';
 *
 * const userPubkey = new PublicKey('...');
 * const [userMigration] = getUserMigrationPda(userPubkey, 'my-project');
 * ```
 */
export function getUserMigrationPda(
  user: PublicKey,
  projectId: string,
  options: PdaOptions = {}
): [PublicKey, number] {
  const programId = getProgramId(options.network);
  return PublicKey.findProgramAddressSync(
    [SEEDS.USER_MIGRATION, Buffer.from(projectId), user.toBuffer()],
    programId
  );
}

/**
 * Get the project registry PDA
 *
 * The registry maintains a list of all project IDs in the system.
 *
 * @param {PdaOptions} [options] - PDA derivation options
 * @returns {[PublicKey, number]} Tuple of [PDA address, bump seed]
 *
 * @example
 * ```typescript
 * import { getRegistryPda } from '@migratefun/sdk';
 *
 * const [registry] = getRegistryPda();
 * ```
 */
export function getRegistryPda(options: PdaOptions = {}): [PublicKey, number] {
  const programId = getProgramId(options.network);
  return PublicKey.findProgramAddressSync([SEEDS.PROJECT_REGISTRY], programId);
}

/**
 * Get the platform config PDA
 *
 * Stores global platform configuration including admin settings and fees.
 *
 * @param {PdaOptions} [options] - PDA derivation options
 * @returns {[PublicKey, number]} Tuple of [PDA address, bump seed]
 *
 * @example
 * ```typescript
 * import { getPlatformConfigPda } from '@migratefun/sdk';
 *
 * const [platformConfig] = getPlatformConfigPda();
 * ```
 */
export function getPlatformConfigPda(options: PdaOptions = {}): [PublicKey, number] {
  const programId = getProgramId(options.network);
  return PublicKey.findProgramAddressSync([SEEDS.PLATFORM_CONFIG], programId);
}

/**
 * Get the platform fee vault PDA
 *
 * Holds platform fees collected in a specific quote token.
 *
 * @param {PublicKey} platformConfig - Platform config PDA
 * @param {PublicKey} quoteTokenMint - Quote token mint address
 * @param {PdaOptions} [options] - PDA derivation options
 * @returns {[PublicKey, number]} Tuple of [PDA address, bump seed]
 *
 * @example
 * ```typescript
 * import { getPlatformFeeVaultPda, getPlatformConfigPda } from '@migratefun/sdk';
 * import { PublicKey } from '@solana/web3.js';
 *
 * const [platformConfig] = getPlatformConfigPda();
 * const usdcMint = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
 * const [feeVault] = getPlatformFeeVaultPda(platformConfig, usdcMint);
 * ```
 */
export function getPlatformFeeVaultPda(
  platformConfig: PublicKey,
  quoteTokenMint: PublicKey,
  options: PdaOptions = {}
): [PublicKey, number] {
  const programId = getProgramId(options.network);
  return PublicKey.findProgramAddressSync(
    [platformConfig.toBuffer(), SEEDS.PLATFORM_FEE_VAULT, quoteTokenMint.toBuffer()],
    programId
  );
}

/**
 * Get the associated token address (ATA) for a user and mint
 *
 * Helper function to derive ATAs used in migration transactions.
 * Supports both TOKEN_PROGRAM_ID and TOKEN_2022_PROGRAM_ID.
 *
 * @param {PublicKey} user - User wallet public key
 * @param {PublicKey} mint - Token mint address
 * @param {PublicKey} [tokenProgram=TOKEN_PROGRAM_ID] - Token program (TOKEN_PROGRAM_ID or TOKEN_2022_PROGRAM_ID)
 * @returns {PublicKey} Associated token address
 *
 * @example
 * ```typescript
 * import { getUserAta } from '@migratefun/sdk';
 * import { PublicKey } from '@solana/web3.js';
 * import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
 *
 * const userPubkey = new PublicKey('...');
 * const tokenMint = new PublicKey('...');
 * const ata = getUserAta(userPubkey, tokenMint, TOKEN_PROGRAM_ID);
 * ```
 */
export function getUserAta(
  user: PublicKey,
  mint: PublicKey,
  tokenProgram: PublicKey = TOKEN_PROGRAM_ID
): PublicKey {
  return getAssociatedTokenAddressSync(
    mint,
    user,
    false, // allowOwnerOffCurve
    tokenProgram
  );
}

/**
 * Batch derive multiple PDAs for a project
 *
 * Convenience function to derive all common PDAs for a project at once.
 * More efficient than calling individual functions.
 *
 * @param {string} projectId - Unique project identifier
 * @param {PdaOptions} [options] - PDA derivation options
 * @returns Object with all derived PDAs
 *
 * @example
 * ```typescript
 * import { getProjectPdas } from '@migratefun/sdk';
 *
 * const pdas = getProjectPdas('my-project');
 * console.log(pdas.projectConfig.toBase58());
 * console.log(pdas.oldTokenVault.toBase58());
 * console.log(pdas.newTokenVault.toBase58());
 * console.log(pdas.mftMint.toBase58());
 * ```
 */
export function getProjectPdas(projectId: string, options: PdaOptions = {}) {
  const [projectConfig] = getProjectConfigPda(projectId, options);
  const [oldTokenVault] = getOldTokenVaultPda(projectId, options);
  const [newTokenVault] = getNewTokenVaultPda(projectId, options);
  const [mftMint] = getMftMintPda(projectId, options);
  const [wsolVault] = getWsolVaultPda(projectId, options);
  const [quoteTokenVault] = getQuoteTokenVaultPda(projectId, options);
  const [lpVault] = getLpVaultPda(projectId, options);

  return {
    projectConfig,
    oldTokenVault,
    newTokenVault,
    mftMint,
    wsolVault,
    quoteTokenVault,
    lpVault,
  };
}
