/**
 * ProjectLoader Component
 *
 * Handles project ID input, loading state, and error display.
 * Extracted from the main page to reduce complexity.
 */

import { ConnectionStatus, LoadingIndicator, ErrorDisplay } from './LoadingStates';

interface ProjectLoaderProps {
  projectId: string;
  onProjectIdChange: (id: string) => void;
  onRefresh: () => void;
  isLoading: boolean;
  error?: Error | null;
  walletConnected: boolean;
  walletConnecting: boolean;
  autoRetryCount?: number;
}

export function ProjectLoader({
  projectId,
  onProjectIdChange,
  onRefresh,
  isLoading,
  error,
  walletConnected,
  walletConnecting,
  autoRetryCount = 0
}: ProjectLoaderProps) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4">1. Load Project</h2>

      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Enter Project ID"
          value={projectId}
          onChange={(e) => onProjectIdChange(e.target.value.trim())}
          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={onRefresh}
          disabled={isLoading || !projectId}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
        >
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Status indicators */}
      <div className="mt-3 flex items-center gap-4">
        <ConnectionStatus
          connected={walletConnected}
          connecting={walletConnecting}
        />
        {isLoading && (
          <LoadingIndicator message="Loading project..." />
        )}
      </div>

      {/* Error display with retry info */}
      {error && (
        <div className="mt-3">
          <ErrorDisplay
            error={error}
            onRetry={onRefresh}
            context="loading project"
          />
          {autoRetryCount > 0 && autoRetryCount < 3 && (
            <p className="text-yellow-400 text-sm mt-2">
              🔄 Auto-retrying... (attempt {autoRetryCount}/3)
            </p>
          )}
        </div>
      )}

      {/* Wallet connection hints */}
      {!error && projectId && (
        <>
          {walletConnecting && (
            <p className="text-blue-400 text-sm mt-3">⏳ Wallet connecting...</p>
          )}

          {walletConnected && !walletConnecting && (
            <p className="text-green-400 text-sm mt-3">✓ Wallet connected</p>
          )}

          {!walletConnected && !walletConnecting && (
            <p className="text-yellow-400 text-sm mt-3">
              💡 Tip: Connect wallet to view your balances
            </p>
          )}
        </>
      )}
    </div>
  );
}