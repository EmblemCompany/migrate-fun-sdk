/**
 * RPC Health Monitoring and Recovery
 *
 * Provides utilities for monitoring RPC endpoint health and
 * automatic failover to backup endpoints.
 */

import { Connection } from '@solana/web3.js';

/**
 * RPC endpoint health status
 */
export interface RpcHealthStatus {
  endpoint: string;
  healthy: boolean;
  lastChecked: Date;
  latency?: number;
  errorCount: number;
  consecutiveErrors: number;
}

/**
 * RPC health monitor configuration
 */
export interface RpcHealthConfig {
  /**
   * Primary RPC endpoint
   */
  primary: string;

  /**
   * Backup RPC endpoints (optional)
   */
  backups?: string[];

  /**
   * Health check interval in ms (default: 30000 = 30 seconds)
   */
  checkInterval?: number;

  /**
   * Maximum consecutive errors before marking unhealthy (default: 3)
   */
  maxConsecutiveErrors?: number;

  /**
   * Latency threshold in ms to consider unhealthy (default: 5000)
   */
  latencyThreshold?: number;
}

/**
 * RPC Health Monitor
 */
export class RpcHealthMonitor {
  private config: Required<RpcHealthConfig>;
  private health: Map<string, RpcHealthStatus> = new Map();
  private currentEndpoint: string;
  private checkInterval: NodeJS.Timeout | null = null;
  private isMonitoring = false;

  constructor(config: RpcHealthConfig) {
    this.config = {
      primary: config.primary,
      backups: config.backups || [],
      checkInterval: config.checkInterval || 30000,
      maxConsecutiveErrors: config.maxConsecutiveErrors || 3,
      latencyThreshold: config.latencyThreshold || 5000,
    };

    this.currentEndpoint = this.config.primary;

    // Initialize health status for all endpoints
    this.health.set(this.config.primary, {
      endpoint: this.config.primary,
      healthy: true,
      lastChecked: new Date(),
      errorCount: 0,
      consecutiveErrors: 0,
    });

    for (const backup of this.config.backups) {
      this.health.set(backup, {
        endpoint: backup,
        healthy: true,
        lastChecked: new Date(),
        errorCount: 0,
        consecutiveErrors: 0,
      });
    }
  }

  /**
   * Start health monitoring
   */
  start(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.performHealthChecks();

    // Schedule periodic health checks
    this.checkInterval = setInterval(() => {
      this.performHealthChecks();
    }, this.config.checkInterval);
  }

  /**
   * Stop health monitoring
   */
  stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.isMonitoring = false;
  }

  /**
   * Get current healthy endpoint
   */
  getHealthyEndpoint(): string {
    // First, check if current endpoint is healthy
    const currentHealth = this.health.get(this.currentEndpoint);
    if (currentHealth?.healthy) {
      return this.currentEndpoint;
    }

    // Find a healthy backup
    for (const [endpoint, status] of this.health.entries()) {
      if (status.healthy) {
        console.log(`[RPC Health] Switching from ${this.currentEndpoint} to ${endpoint}`);
        this.currentEndpoint = endpoint;
        return endpoint;
      }
    }

    // No healthy endpoints, return primary as fallback
    console.warn('[RPC Health] No healthy endpoints available, using primary');
    return this.config.primary;
  }

  /**
   * Get connection with automatic failover
   */
  getConnection(commitment?: 'finalized' | 'confirmed' | 'processed'): Connection {
    const endpoint = this.getHealthyEndpoint();
    return new Connection(endpoint, commitment || 'confirmed');
  }

  /**
   * Report an error for an endpoint
   */
  reportError(endpoint: string, _error: Error): void {
    const status = this.health.get(endpoint);
    if (!status) return;

    status.errorCount++;
    status.consecutiveErrors++;

    if (status.consecutiveErrors >= this.config.maxConsecutiveErrors) {
      status.healthy = false;
      console.error(`[RPC Health] Endpoint ${endpoint} marked unhealthy after ${status.consecutiveErrors} consecutive errors`);
    }

    this.health.set(endpoint, status);
  }

  /**
   * Report a successful operation for an endpoint
   */
  reportSuccess(endpoint: string, latency?: number): void {
    const status = this.health.get(endpoint);
    if (!status) return;

    status.consecutiveErrors = 0;
    status.lastChecked = new Date();

    if (latency !== undefined) {
      status.latency = latency;

      // Mark unhealthy if latency is too high
      if (latency > this.config.latencyThreshold) {
        status.healthy = false;
        console.warn(`[RPC Health] Endpoint ${endpoint} marked unhealthy due to high latency (${latency}ms)`);
      } else if (!status.healthy) {
        // Re-mark as healthy if latency is good and was previously unhealthy
        status.healthy = true;
        console.log(`[RPC Health] Endpoint ${endpoint} recovered and marked healthy`);
      }
    }

    this.health.set(endpoint, status);
  }

  /**
   * Get health status for all endpoints
   */
  getHealthStatus(): RpcHealthStatus[] {
    return Array.from(this.health.values());
  }

  /**
   * Perform health checks on all endpoints
   */
  private async performHealthChecks(): Promise<void> {
    const checks = Array.from(this.health.keys()).map(async (endpoint) => {
      try {
        const start = Date.now();
        const connection = new Connection(endpoint);

        // Simple health check: get latest blockhash
        await connection.getLatestBlockhash('confirmed');

        const latency = Date.now() - start;
        this.reportSuccess(endpoint, latency);
      } catch (err) {
        this.reportError(endpoint, err as Error);
      }
    });

    await Promise.allSettled(checks);
  }
}

/**
 * Singleton instance for global RPC health monitoring
 */
let globalMonitor: RpcHealthMonitor | null = null;

/**
 * Initialize global RPC health monitor
 */
export function initializeRpcHealthMonitor(config: RpcHealthConfig): RpcHealthMonitor {
  if (globalMonitor) {
    globalMonitor.stop();
  }

  globalMonitor = new RpcHealthMonitor(config);
  globalMonitor.start();
  return globalMonitor;
}

/**
 * Get global RPC health monitor
 */
export function getRpcHealthMonitor(): RpcHealthMonitor | null {
  return globalMonitor;
}

/**
 * Create a connection with automatic RPC failover
 */
export function createHealthyConnection(
  commitment?: 'finalized' | 'confirmed' | 'processed'
): Connection {
  if (!globalMonitor) {
    throw new Error('RPC health monitor not initialized. Call initializeRpcHealthMonitor first.');
  }

  return globalMonitor.getConnection(commitment);
}

/**
 * Wrap an async function with RPC health tracking
 */
export async function withRpcTracking<T>(
  fn: () => Promise<T>,
  endpoint?: string
): Promise<T> {
  const monitor = getRpcHealthMonitor();
  if (!monitor || !endpoint) {
    return fn();
  }

  const start = Date.now();
  try {
    const result = await fn();
    const latency = Date.now() - start;
    monitor.reportSuccess(endpoint, latency);
    return result;
  } catch (err) {
    monitor.reportError(endpoint, err as Error);
    throw err;
  }
}