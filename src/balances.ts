/**
 * Balance fetching and project discovery for the migrate.fun SDK
 *
 * This module provides functions to:
 * - Load project configurations from the blockchain
 * - Fetch user token balances (SOL, old token, new token, MFT)
 * - Watch balances for real-time updates
 *
 * @module balances
 */

import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { getProgram } from './program';
import { getProjectConfigPda, getUserAta, getProjectPdas } from './pdas';
import type { LoadedProject, BalanceSnapshot, Network, MigrationPhase } from './types';
import { SdkError, SdkErrorCode } from './types';
import { sdkCache, rpcThrottle, CACHE_TTL, createCacheKey } from './utils/cache';

/**
 * Options for loading a project
 */
export interface LoadProjectOptions {
  /**
   * Network to use (defaults to current active network)
   */
  network?: Network;

  /**
   * Skip cache and fetch fresh data
   */
  skipCache?: boolean;
}

/**
 * Options for fetching balances
 */
export interface GetBalancesOptions {
  /**
   * Network to use (defaults to current active network)
   */
  network?: Network;

  /**
   * Skip cache and fetch fresh data
   */
  skipCache?: boolean;
}

/**
 * Options for watching balances
 */
export interface WatchBalancesOptions {
  /**
   * Poll interval in milliseconds (default: 150ms)
   */
  intervalMs?: number;

  /**
   * Network to use (defaults to current active network)
   */
  network?: Network;
}

/**
 * Unsubscribe function returned by watchBalances
 */
export type UnsubscribeFn = () => void;

/**
 * Load complete project configuration and metadata from the blockchain
 *
 * Fetches all project data including token mints, decimals, exchange rates,
 * phase information, and derives all necessary PDAs.
 *
 * @param {string} projectId - Unique project identifier
 * @param {Connection} connection - Solana RPC connection
 * @param {LoadProjectOptions} [options] - Loading options
 * @returns {Promise<LoadedProject>} Complete project metadata with PDAs
 * @throws {SdkError} If project not found or fetch fails
 *
 * @example
 * ```typescript
 * import { Connection } from '@solana/web3.js';
 * import { loadProject } from '@migratefun/sdk';
 *
 * const connection = new Connection('https://api.devnet.solana.com');
 * const project = await loadProject('my-project', connection);
 *
 * console.log(`Exchange rate: ${project.exchangeRate}`);
 * console.log(`Old token mint: ${project.oldTokenMint.toBase58()}`);
 * console.log(`Phase: ${project.phase}`);
 * ```
 */
export async function loadProject(
  projectId: string,
  connection: Connection,
  options: LoadProjectOptions = {}
): Promise<LoadedProject> {
  const { network, skipCache = false } = options;

  // Check cache first
  const cacheKey = createCacheKey('project', projectId, network || 'default');
  if (!skipCache) {
    const cached = sdkCache.get(cacheKey) as LoadedProject | null;
    if (cached) {
      return cached;
    }
  }

  try {
    // Throttle RPC request
    await rpcThrottle.wait();

    // Get program instance
    const program = await getProgram(connection, { network });

    // Derive project config PDA
    const [projectConfigPda] = getProjectConfigPda(projectId, { network });

    // Fetch project config account
    const projectConfig = await (program.account as any).projectConfig.fetch(projectConfigPda);

    if (!projectConfig) {
      throw new SdkError(
        SdkErrorCode.PROJECT_NOT_FOUND,
        `Project "${projectId}" not found on chain`
      );
    }

    // Throttle before fetching mint info
    await rpcThrottle.wait();

    // Fetch old token mint info for decimals
    const oldTokenMintInfo = await connection.getParsedAccountInfo(
      projectConfig.oldTokenMint
    );
    const oldTokenDecimals =
      oldTokenMintInfo.value?.data &&
      'parsed' in oldTokenMintInfo.value.data &&
      typeof oldTokenMintInfo.value.data.parsed.info.decimals === 'number'
        ? oldTokenMintInfo.value.data.parsed.info.decimals
        : 9;

    // Throttle before next request
    await rpcThrottle.wait();

    // Fetch new token mint info for decimals
    const newTokenMintInfo = await connection.getParsedAccountInfo(
      projectConfig.newTokenMint
    );
    const newTokenDecimals =
      newTokenMintInfo.value?.data &&
      'parsed' in newTokenMintInfo.value.data &&
      typeof newTokenMintInfo.value.data.parsed.info.decimals === 'number'
        ? newTokenMintInfo.value.data.parsed.info.decimals
        : 9;

    // MFT always has 9 decimals
    const mftDecimals = 9;

    // Derive all PDAs for the project
    const pdas = getProjectPdas(projectId, { network });

    // Determine migration phase
    const now = Date.now() / 1000;
    const startTs = (projectConfig.startTs as any).toNumber
      ? (projectConfig.startTs as any).toNumber()
      : Number(projectConfig.startTs);
    const endTs = (projectConfig.endTs as any).toNumber
      ? (projectConfig.endTs as any).toNumber()
      : Number(projectConfig.endTs);

    let phase: MigrationPhase;
    if (now < startTs) {
      phase = 0; // Setup
    } else if (now >= startTs && now < endTs) {
      phase = 1; // ActiveMigration
    } else if (now >= endTs && (projectConfig as any).claimsEnabled) {
      phase = 2; // GracePeriod
    } else {
      phase = 3; // Finalized
    }

    // Get exchange rate (stored as basis points, 10000 = 1:1)
    const exchangeRateBps = (projectConfig as any).exchangeRateBasisPoints || 10000;
    const exchangeRate = BigInt(exchangeRateBps);

    // Construct loaded project
    const loadedProject: LoadedProject = {
      projectId: projectConfigPda, // Use the PDA as the project identifier
      oldTokenMint: projectConfig.oldTokenMint,
      newTokenMint: projectConfig.newTokenMint,
      mftMint: pdas.mftMint,
      phase,
      paused: (projectConfig as any).isPaused || false,
      oldTokenDecimals,
      newTokenDecimals,
      mftDecimals,
      exchangeRate,
      pdas: {
        projectConfig: projectConfigPda,
        mftMint: pdas.mftMint,
        oldTokenVault: pdas.oldTokenVault,
        newTokenVault: pdas.newTokenVault,
      },
    };

    // Cache the loaded project
    sdkCache.set(cacheKey, loadedProject, CACHE_TTL.PROJECT_CONFIG);

    return loadedProject;
  } catch (error) {
    if (error instanceof SdkError) {
      throw error;
    }

    // Check for specific error types
    if (error && typeof error === 'object' && 'message' in error) {
      const message = (error as any).message;
      if (message?.includes('Account does not exist')) {
        throw new SdkError(
          SdkErrorCode.PROJECT_NOT_FOUND,
          `Project "${projectId}" not found on chain`,
          error
        );
      }
      if (message?.includes('403') || message?.includes('rate limit')) {
        throw new SdkError(
          SdkErrorCode.RATE_LIMIT,
          'RPC rate limit reached. Please try again in a moment.',
          error
        );
      }
    }

    throw new SdkError(
      SdkErrorCode.RPC_ERROR,
      `Failed to load project: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error
    );
  }
}

/**
 * Get all token balances for a user in a specific project
 *
 * Fetches SOL balance and token balances (old token, new token, MFT)
 * in a single batch of RPC requests with rate limiting.
 *
 * @param {string} projectId - Unique project identifier
 * @param {PublicKey} user - User wallet public key
 * @param {Connection} connection - Solana RPC connection
 * @param {LoadedProject} [project] - Pre-loaded project (skips project fetch)
 * @param {GetBalancesOptions} [options] - Balance fetching options
 * @returns {Promise<BalanceSnapshot>} All user balances as bigint
 * @throws {SdkError} If balance fetch fails
 *
 * @example
 * ```typescript
 * import { Connection, PublicKey } from '@solana/web3.js';
 * import { getBalances } from '@migratefun/sdk';
 *
 * const connection = new Connection('https://api.devnet.solana.com');
 * const userPubkey = new PublicKey('...');
 *
 * const balances = await getBalances('my-project', userPubkey, connection);
 *
 * console.log(`SOL: ${Number(balances.sol) / 1e9}`);
 * console.log(`Old token: ${balances.oldToken}`);
 * console.log(`New token: ${balances.newToken}`);
 * console.log(`MFT: ${balances.mft}`);
 * ```
 */
export async function getBalances(
  projectId: string,
  user: PublicKey,
  connection: Connection,
  project?: LoadedProject,
  options: GetBalancesOptions = {}
): Promise<BalanceSnapshot> {
  const { network, skipCache = false } = options;

  // Check cache first
  const cacheKey = createCacheKey('balances', projectId, user.toBase58(), network || 'default');
  if (!skipCache) {
    const cached = sdkCache.get(cacheKey) as BalanceSnapshot | null;
    if (cached) {
      return cached;
    }
  }

  try {
    // Load project if not provided
    const loadedProject = project || (await loadProject(projectId, connection, { network }));

    // Throttle before SOL balance request
    await rpcThrottle.wait();

    // Get SOL balance
    let solBalance = 0n;
    try {
      const balance = await connection.getBalance(user);
      solBalance = BigInt(balance);
    } catch (error) {
      // If rate limit error, throw it
      if (error && typeof error === 'object' && 'message' in error) {
        const message = (error as any).message;
        if (message?.includes('403') || message?.includes('rate limit')) {
          throw new SdkError(
            SdkErrorCode.RATE_LIMIT,
            'RPC rate limit reached. Please try again in a moment.',
            error
          );
        }
      }
      // Otherwise, default to 0
      solBalance = 0n;
    }

    // Get old token program
    const oldTokenProgram = TOKEN_PROGRAM_ID; // Can be extended for Token-2022

    // Throttle before old token balance
    await rpcThrottle.wait();

    // Get old token balance
    let oldTokenBalance = 0n;
    try {
      const oldTokenAta = getUserAta(user, loadedProject.oldTokenMint, oldTokenProgram);
      const tokenAccount = await connection.getTokenAccountBalance(oldTokenAta);
      oldTokenBalance = BigInt(tokenAccount.value.amount);
    } catch (error) {
      // ATA doesn't exist or error, balance is 0
      oldTokenBalance = 0n;
    }

    // Throttle before new token balance
    await rpcThrottle.wait();

    // Get new token balance
    let newTokenBalance = 0n;
    try {
      const newTokenAta = getUserAta(user, loadedProject.newTokenMint, oldTokenProgram);
      const tokenAccount = await connection.getTokenAccountBalance(newTokenAta);
      newTokenBalance = BigInt(tokenAccount.value.amount);
    } catch (error) {
      // ATA doesn't exist or error, balance is 0
      newTokenBalance = 0n;
    }

    // Throttle before MFT balance
    await rpcThrottle.wait();

    // Get MFT balance
    let mftBalance = 0n;
    try {
      const mftAta = getUserAta(user, loadedProject.mftMint, TOKEN_PROGRAM_ID);
      const tokenAccount = await connection.getTokenAccountBalance(mftAta);
      mftBalance = BigInt(tokenAccount.value.amount);
    } catch (error) {
      // MFT ATA doesn't exist or error, balance is 0
      mftBalance = 0n;
    }

    const balanceSnapshot: BalanceSnapshot = {
      oldToken: oldTokenBalance,
      newToken: newTokenBalance,
      mft: mftBalance,
      sol: solBalance,
    };

    // Cache the balances
    sdkCache.set(cacheKey, balanceSnapshot, CACHE_TTL.BALANCES);

    return balanceSnapshot;
  } catch (error) {
    if (error instanceof SdkError) {
      throw error;
    }

    throw new SdkError(
      SdkErrorCode.RPC_ERROR,
      `Failed to fetch balances: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error
    );
  }
}

/**
 * Watch user balances for real-time updates
 *
 * Polls balances at a configurable interval and calls the onChange callback
 * whenever balances change. Automatically throttles RPC requests.
 *
 * @param {string} projectId - Unique project identifier
 * @param {PublicKey} user - User wallet public key
 * @param {Connection} connection - Solana RPC connection
 * @param {(balances: BalanceSnapshot, project?: LoadedProject) => void} onChange - Callback for balance updates (receives project when loaded)
 * @param {WatchBalancesOptions} [options] - Watch options
 * @returns {UnsubscribeFn} Function to stop watching balances
 *
 * @example
 * ```typescript
 * import { Connection, PublicKey } from '@solana/web3.js';
 * import { watchBalances } from '@migratefun/sdk';
 *
 * const connection = new Connection('https://api.devnet.solana.com');
 * const userPubkey = new PublicKey('...');
 *
 * const unsubscribe = watchBalances(
 *   'my-project',
 *   userPubkey,
 *   connection,
 *   (balances, project) => {
 *     console.log('Balances updated:', balances);
 *     if (project) console.log('Project loaded:', project);
 *   },
 *   { intervalMs: 1000 } // Poll every second
 * );
 *
 * // Stop watching after 10 seconds
 * setTimeout(() => unsubscribe(), 10000);
 * ```
 */
export function watchBalances(
  projectId: string,
  user: PublicKey,
  connection: Connection,
  onChange: (balances: BalanceSnapshot, project?: LoadedProject) => void,
  options: WatchBalancesOptions = {}
): UnsubscribeFn {
  const { intervalMs = 150, network } = options;

  let isActive = true;
  let lastBalances: BalanceSnapshot | null = null;

  // Load project once at start
  let loadedProject: LoadedProject | undefined;

  const poll = async () => {
    if (!isActive) return;

    try {
      // Fetch balances (skip cache to get fresh data)
      const balances = await getBalances(projectId, user, connection, loadedProject, {
        network,
        skipCache: true,
      });

      // Check if balances changed
      if (
        !lastBalances ||
        balances.sol !== lastBalances.sol ||
        balances.oldToken !== lastBalances.oldToken ||
        balances.newToken !== lastBalances.newToken ||
        balances.mft !== lastBalances.mft
      ) {
        lastBalances = balances;
        onChange(balances, loadedProject);
      }
    } catch (error) {
      // Log error but continue polling
      console.warn('[migrate.fun SDK] Balance watch error:', error);
    }

    // Schedule next poll
    if (isActive) {
      setTimeout(poll, intervalMs);
    }
  };

  // Load project and start polling
  (async () => {
    try {
      loadedProject = await loadProject(projectId, connection, { network });
    } catch (error) {
      console.warn('[migrate.fun SDK] Failed to load project for balance watch:', error);
    }
    poll();
  })();

  // Return unsubscribe function
  return () => {
    isActive = false;
  };
}

/**
 * Check if a project is currently paused
 *
 * @param {LoadedProject} project - Loaded project
 * @returns {boolean} True if project is paused
 *
 * @example
 * ```typescript
 * import { loadProject, isProjectPaused } from '@migratefun/sdk';
 *
 * const project = await loadProject('my-project', connection);
 * if (isProjectPaused(project)) {
 *   console.log('Project is paused - migrations are disabled');
 * }
 * ```
 */
export function isProjectPaused(project: LoadedProject): boolean {
  return project.paused;
}

/**
 * Check if a project is in the active migration phase
 *
 * @param {LoadedProject} project - Loaded project
 * @returns {boolean} True if project is in active migration phase
 *
 * @example
 * ```typescript
 * import { loadProject, isProjectActive } from '@migratefun/sdk';
 *
 * const project = await loadProject('my-project', connection);
 * if (isProjectActive(project)) {
 *   console.log('Project is active - users can migrate');
 * }
 * ```
 */
export function isProjectActive(project: LoadedProject): boolean {
  return project.phase === 1 && !project.paused;
}

/**
 * Format a token amount from raw bigint to human-readable string
 *
 * Returns a string to preserve precision for large amounts (>Number.MAX_SAFE_INTEGER).
 * For amounts larger than 9 million tokens with 9 decimals, converting to Number
 * would lose precision.
 *
 * @param {bigint} amount - Raw token amount
 * @param {number} decimals - Token decimals
 * @returns {string} Human-readable amount as string (preserves full precision)
 *
 * @example
 * ```typescript
 * import { getBalances, formatTokenAmount } from '@migratefun/sdk';
 *
 * const balances = await getBalances('my-project', user, connection);
 * const oldTokenAmount = formatTokenAmount(balances.oldToken, 9);
 * console.log(`Old token balance: ${oldTokenAmount}`); // "100.500000000"
 * ```
 */
export function formatTokenAmount(amount: bigint, decimals: number): string {
  // Handle negative amounts (shouldn't happen, but be safe)
  const isNegative = amount < 0n;
  const absAmount = isNegative ? -amount : amount;

  // Calculate divisor
  const divisor = BigInt(10 ** decimals);
  const wholePart = absAmount / divisor;
  const remainder = absAmount % divisor;

  // Pad remainder with leading zeros to match decimals
  const decimalPart = remainder.toString().padStart(decimals, '0');

  // Trim trailing zeros for cleaner display
  const trimmedDecimalPart = decimalPart.replace(/0+$/, '');

  // Build result
  if (trimmedDecimalPart === '') {
    return `${isNegative ? '-' : ''}${wholePart}`;
  }

  return `${isNegative ? '-' : ''}${wholePart}.${trimmedDecimalPart}`;
}

/**
 * Convert a human-readable token amount to raw bigint
 *
 * Validates input and handles edge cases including scientific notation,
 * NaN, infinity, and negative numbers.
 *
 * @param {number} amount - Human-readable amount
 * @param {number} decimals - Token decimals
 * @returns {bigint} Raw token amount
 * @throws {SdkError} If amount is invalid (NaN, infinite, negative, or out of range)
 *
 * @example
 * ```typescript
 * import { parseTokenAmount } from '@migratefun/sdk';
 *
 * const amount = parseTokenAmount(100.5, 9);
 * console.log(amount); // => 100500000000n
 * ```
 */
export function parseTokenAmount(amount: number, decimals: number): bigint {
  // Validate amount
  if (!Number.isFinite(amount)) {
    throw new SdkError(
      SdkErrorCode.INVALID_AMOUNT,
      `Invalid amount: ${amount} is not a finite number`
    );
  }

  if (amount < 0) {
    throw new SdkError(
      SdkErrorCode.INVALID_AMOUNT,
      `Invalid amount: ${amount} is negative`
    );
  }

  // Validate decimals
  if (decimals < 0 || decimals > 18 || !Number.isInteger(decimals)) {
    throw new SdkError(
      SdkErrorCode.INVALID_AMOUNT,
      `Invalid decimals: ${decimals} must be an integer between 0 and 18`
    );
  }

  // Convert to string with fixed decimals to handle scientific notation
  // Use toFixed to avoid scientific notation for large/small numbers
  const amountStr = amount.toFixed(decimals);
  const parts = amountStr.split('.');
  const wholePart = parts[0] || '0';
  const decimalPart = (parts[1] || '').slice(0, decimals);

  // Combine whole and decimal parts
  const fullAmountStr = wholePart + decimalPart.padEnd(decimals, '0');
  const cleanAmountStr = fullAmountStr.replace(/^0+/, '') || '0';

  try {
    return BigInt(cleanAmountStr);
  } catch (error) {
    throw new SdkError(
      SdkErrorCode.INVALID_AMOUNT,
      `Failed to parse amount: ${amount}`,
      error
    );
  }
}
