/**
 * Loading state components for better UX
 * Provides skeleton loaders and placeholders for different data types
 */

import React from 'react';

/**
 * Shimmer animation for skeleton loaders
 */
const shimmer = `
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
`;

/**
 * Base skeleton component with shimmer effect
 */
export function Skeleton({
  className = '',
  width = 'w-full',
  height = 'h-4'
}: {
  className?: string;
  width?: string;
  height?: string;
}) {
  return (
    <>
      <style>{shimmer}</style>
      <div
        className={`${width} ${height} bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded animate-pulse ${className}`}
        style={{
          backgroundSize: '1000px 100%',
          animation: 'shimmer 2s infinite',
        }}
      />
    </>
  );
}

/**
 * Project info skeleton loader
 */
export function ProjectInfoSkeleton() {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4">2. Project Info &amp; Balances</h2>

      {/* Project Metadata Skeleton */}
      <div className="mb-4 pb-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-gray-300 mb-2">Project Details</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Exchange Rate:</span>
            <Skeleton width="w-20" height="h-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Phase:</span>
            <Skeleton width="w-24" height="h-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Paused:</span>
            <Skeleton width="w-12" height="h-4" />
          </div>
        </div>
      </div>

      {/* Connect Wallet Prompt */}
      <div className="text-center py-4">
        <p className="text-yellow-400 text-sm">Connect wallet to view balances</p>
      </div>
    </div>
  );
}

/**
 * Balance skeleton loader
 */
export function BalancesSkeleton() {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-300 mb-2">Your Balances</h3>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">SOL:</span>
          <Skeleton width="w-20" height="h-4" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">Old Token:</span>
          <Skeleton width="w-20" height="h-4" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">New Token:</span>
          <Skeleton width="w-20" height="h-4" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">MFT:</span>
          <Skeleton width="w-20" height="h-4" />
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2">Loading balances...</p>
    </div>
  );
}

/**
 * Error display component
 */
export function ErrorDisplay({
  error,
  onRetry,
  context = 'loading data'
}: {
  error: Error | null;
  onRetry?: () => void;
  context?: string;
}) {
  if (!error) return null;

  return (
    <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <span className="text-red-400 text-xl">⚠️</span>
        <div className="flex-1">
          <p className="text-red-400 font-semibold">Error {context}</p>
          <p className="text-gray-400 text-sm mt-1">{error.message}</p>

          {/* Helpful tips based on error type */}
          {error.message.includes('rate limit') && (
            <p className="text-gray-500 text-xs mt-2">
              💡 Tip: Consider using a premium RPC endpoint for better performance
            </p>
          )}

          {error.message.includes('timeout') && (
            <p className="text-gray-500 text-xs mt-2">
              💡 Tip: Check your internet connection or try a different RPC endpoint
            </p>
          )}

          {error.message.includes('not found') && (
            <p className="text-gray-500 text-xs mt-2">
              💡 Tip: Verify the project ID exists on {process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet'}
            </p>
          )}

          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 px-4 py-1 bg-red-700 hover:bg-red-600 text-white text-sm rounded transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Connection status indicator
 */
export function ConnectionStatus({
  connected,
  connecting
}: {
  connected: boolean;
  connecting: boolean;
}) {
  if (connecting) {
    return (
      <div className="flex items-center gap-2 text-yellow-400 text-sm">
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
        <span>Connecting wallet...</span>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="flex items-center gap-2 text-gray-400 text-sm">
        <div className="w-2 h-2 bg-gray-400 rounded-full" />
        <span>Wallet not connected</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-green-400 text-sm">
      <div className="w-2 h-2 bg-green-400 rounded-full" />
      <span>Wallet connected</span>
    </div>
  );
}

/**
 * Loading indicator with message
 */
export function LoadingIndicator({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-5 h-5">
        <div className="absolute inset-0 border-2 border-gray-600 rounded-full" />
        <div className="absolute inset-0 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
      <span className="text-gray-400 text-sm">{message}</span>
    </div>
  );
}

