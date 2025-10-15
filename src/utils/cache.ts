/**
 * Caching and RPC throttling utilities for the migrate.fun SDK
 *
 * This module provides:
 * - In-memory caching with TTL support
 * - RPC request throttling to avoid rate limits
 * - Memoization helpers for expensive operations
 *
 * @module utils/cache
 */

/**
 * Cache entry with expiration
 * @internal
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * TTL constants for different data types (in milliseconds)
 */
export const CACHE_TTL = {
  /** Balance queries - 30 seconds */
  BALANCES: 30_000,
  /** Token metadata - 5 minutes */
  METADATA: 300_000,
  /** Project configurations - 1 hour */
  PROJECT_CONFIG: 3_600_000,
  /** Token supplies - 30 seconds */
  SUPPLY: 30_000,
  /** Account info - 10 seconds */
  ACCOUNT_INFO: 10_000,
} as const;

/**
 * Simple in-memory cache with TTL support
 *
 * @example
 * ```typescript
 * const cache = new Cache<string>();
 * cache.set('key', 'value', 30000); // Cache for 30 seconds
 * const value = cache.get('key');
 * ```
 */
export class Cache<T = any> {
  private cache = new Map<string, CacheEntry<T>>();
  private defaultTTL: number;

  /**
   * Create a new cache instance
   *
   * @param {number} [defaultTTL=30000] - Default TTL in milliseconds
   */
  constructor(defaultTTL = 30_000) {
    this.defaultTTL = defaultTTL;
  }

  /**
   * Store a value in the cache
   *
   * @param {string} key - Cache key
   * @param {T} data - Data to cache
   * @param {number} [ttl] - Time to live in milliseconds (defaults to instance default)
   */
  set(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl ?? this.defaultTTL,
    });
  }

  /**
   * Retrieve a value from the cache
   *
   * @param {string} key - Cache key
   * @returns {T | null} Cached value or null if not found/expired
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Check if a key exists and is not expired
   *
   * @param {string} key - Cache key
   * @returns {boolean} True if key exists and is valid
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);

    if (!entry) {
      return false;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Remove a specific key from the cache
   *
   * @param {string} key - Cache key to delete
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cached values
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get the number of cached entries
   *
   * @returns {number} Number of cached entries
   */
  size(): number {
    return this.cache.size;
  }
}

/**
 * Global SDK cache instance
 *
 * Used internally by the SDK for caching RPC responses.
 *
 * @example
 * ```typescript
 * import { sdkCache, CACHE_TTL } from '@migratefun/sdk';
 *
 * // Cache project config
 * sdkCache.set('project:my-id', config, CACHE_TTL.PROJECT_CONFIG);
 *
 * // Retrieve from cache
 * const config = sdkCache.get('project:my-id');
 * ```
 */
export const sdkCache = new Cache();

/**
 * RPC request throttler to prevent rate limiting
 *
 * Enforces minimum delay between RPC requests.
 *
 * @example
 * ```typescript
 * const throttle = new Throttle(100); // 100ms minimum between requests
 *
 * await throttle.wait(); // Waits if needed
 * const result = await connection.getAccountInfo(address);
 * ```
 */
export class Throttle {
  private lastRequestTime = 0;
  private minDelay: number;

  /**
   * Create a new throttle instance
   *
   * @param {number} [minDelay=100] - Minimum delay between requests in milliseconds
   */
  constructor(minDelay = 100) {
    this.minDelay = minDelay;
  }

  /**
   * Wait if necessary to enforce minimum delay
   *
   * @returns {Promise<void>} Resolves when it's safe to make the next request
   */
  async wait(): Promise<void> {
    const now = Date.now();
    const elapsed = now - this.lastRequestTime;

    if (elapsed < this.minDelay) {
      const delay = this.minDelay - elapsed;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    this.lastRequestTime = Date.now();
  }

  /**
   * Reset the throttle timer
   */
  reset(): void {
    this.lastRequestTime = 0;
  }
}

/**
 * Global RPC throttle instance
 *
 * Used internally to throttle RPC requests and avoid rate limits.
 *
 * @example
 * ```typescript
 * import { rpcThrottle } from '@migratefun/sdk';
 *
 * // Wait before making RPC request
 * await rpcThrottle.wait();
 * const balance = await connection.getBalance(publicKey);
 * ```
 */
export const rpcThrottle = new Throttle(100);

/**
 * Helper to get cached data or fetch if not available
 *
 * @template T
 * @param {string} key - Cache key
 * @param {() => Promise<T>} fetcher - Function to fetch data if not cached
 * @param {number} [ttl] - Time to live in milliseconds
 * @returns {Promise<T>} Cached or freshly fetched data
 *
 * @example
 * ```typescript
 * import { getCached, CACHE_TTL } from '@migratefun/sdk';
 *
 * const config = await getCached(
 *   'project:my-id',
 *   async () => {
 *     const [pda] = getProjectConfigPda('my-id');
 *     return await program.account.projectConfig.fetch(pda);
 *   },
 *   CACHE_TTL.PROJECT_CONFIG
 * );
 * ```
 */
export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
): Promise<T> {
  // Check cache first
  const cached = sdkCache.get(key) as T | null;
  if (cached !== null) {
    return cached;
  }

  // Fetch data
  const data = await fetcher();

  // Cache the result (only if not null/undefined)
  if (data !== null && data !== undefined) {
    sdkCache.set(key, data, ttl);
  }

  return data;
}

/**
 * Memoize a function with argument-based caching
 *
 * @template Args, Return
 * @param {(...args: Args) => Return} fn - Function to memoize
 * @param {number} [ttl] - Cache TTL in milliseconds
 * @returns {(...args: Args) => Return} Memoized function
 *
 * @example
 * ```typescript
 * import { memoize } from '@migratefun/sdk';
 *
 * const expensiveCalc = memoize((a: number, b: number) => {
 *   console.log('Computing...');
 *   return a * b;
 * }, 60000);
 *
 * expensiveCalc(5, 10); // Computing... => 50
 * expensiveCalc(5, 10); // (cached) => 50
 * ```
 */
export function memoize<Args extends any[], Return>(
  fn: (...args: Args) => Return,
  ttl?: number
): (...args: Args) => Return {
  const cache = new Cache<Return>(ttl);

  return (...args: Args): Return => {
    const key = JSON.stringify(args);
    const cached = cache.get(key);

    if (cached !== null) {
      return cached;
    }

    const result = fn(...args);
    cache.set(key, result, ttl);
    return result;
  };
}

/**
 * Async version of memoize
 *
 * @template Args, Return
 * @param {(...args: Args) => Promise<Return>} fn - Async function to memoize
 * @param {number} [ttl] - Cache TTL in milliseconds
 * @returns {(...args: Args) => Promise<Return>} Memoized async function
 *
 * @example
 * ```typescript
 * import { memoizeAsync, CACHE_TTL } from '@migratefun/sdk';
 *
 * const fetchProject = memoizeAsync(
 *   async (id: string) => {
 *     const [pda] = getProjectConfigPda(id);
 *     return await program.account.projectConfig.fetch(pda);
 *   },
 *   CACHE_TTL.PROJECT_CONFIG
 * );
 *
 * await fetchProject('my-id'); // Fetches from chain
 * await fetchProject('my-id'); // Returns cached
 * ```
 */
export function memoizeAsync<Args extends any[], Return>(
  fn: (...args: Args) => Promise<Return>,
  ttl?: number
): (...args: Args) => Promise<Return> {
  const cache = new Cache<Return>(ttl);
  const pending = new Map<string, Promise<Return>>();

  return async (...args: Args): Promise<Return> => {
    const key = JSON.stringify(args);

    // Check cache first
    const cached = cache.get(key);
    if (cached !== null) {
      return cached;
    }

    // Check if already fetching
    const existingPromise = pending.get(key);
    if (existingPromise) {
      return existingPromise;
    }

    // Fetch and cache
    const promise = fn(...args)
      .then((result) => {
        cache.set(key, result, ttl);
        pending.delete(key);
        return result;
      })
      .catch((error) => {
        pending.delete(key);
        throw error;
      });

    pending.set(key, promise);
    return promise;
  };
}

/**
 * Create a cache key from multiple parts
 *
 * @param {...any[]} parts - Parts to combine into a cache key
 * @returns {string} Combined cache key
 *
 * @example
 * ```typescript
 * import { createCacheKey } from '@migratefun/sdk';
 *
 * const key = createCacheKey('balance', projectId, userPubkey.toBase58());
 * // => "balance:my-project:7xKX...ABC"
 * ```
 */
export function createCacheKey(...parts: any[]): string {
  return parts
    .map((part) => {
      if (typeof part === 'string') return part;
      if (typeof part === 'number') return part.toString();
      if (part?.toBase58) return part.toBase58();
      return JSON.stringify(part);
    })
    .join(':');
}

/**
 * Delay execution for a specified time
 *
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise<void>} Promise that resolves after the delay
 *
 * @example
 * ```typescript
 * import { delay } from '@migratefun/sdk';
 *
 * await delay(1000); // Wait 1 second
 * console.log('Done waiting');
 * ```
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
