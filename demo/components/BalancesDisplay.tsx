/**
 * BalancesDisplay Component
 *
 * Shows project information and user token balances.
 * Handles different wallet connection states gracefully.
 */

import { LoadedProject } from '@migratefun/sdk';
import { FormattedBalances } from '@migratefun/sdk/react';
import { PublicKey } from '@solana/web3.js';
import { BalancesSkeleton, ErrorDisplay, LoadingIndicator } from './LoadingStates';

interface BalancesDisplayProps {
  project: LoadedProject | null;
  balances: FormattedBalances | null;
  isBalancesLoading: boolean;
  balancesError?: Error | null;
  walletPublicKey: PublicKey | null;
  walletConnected: boolean;
  walletConnecting: boolean;
  onRefreshBalances: () => void;
}

export function BalancesDisplay({
  project,
  balances,
  isBalancesLoading,
  balancesError,
  walletPublicKey,
  walletConnected,
  walletConnecting,
  onRefreshBalances
}: BalancesDisplayProps) {
  // Don't show anything if no project
  if (!project) return null;

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4">2. Project Info &amp; Balances</h2>

      {/* Project Metadata - Always show when project is loaded */}
      <ProjectInfo project={project} />

      {/* Balances Section - Best practice for wallet state handling */}
      {walletPublicKey ? (
        <>
          {/* Wallet is fully connected - show balances */}
          {isBalancesLoading && !balances ? (
            <BalancesSkeleton />
          ) : balances ? (
            <BalancesGrid balances={balances} />
          ) : balancesError ? (
            <ErrorDisplay
              error={balancesError}
              onRetry={onRefreshBalances}
              context="loading balances"
            />
          ) : (
            // Loading initial balances
            <BalancesSkeleton />
          )}
        </>
      ) : walletConnecting || (walletConnected && !walletPublicKey) ? (
        // Wallet is connecting or reconnecting
        <div className="text-center py-4">
          <LoadingIndicator message="Wallet connecting..." />
          <p className="text-gray-500 text-xs mt-2">
            {walletConnected ? 'Reconnecting to your wallet' : 'Establishing wallet connection'}
          </p>
        </div>
      ) : (
        // Wallet is not connected
        <div className="text-center py-4">
          <p className="text-yellow-400 text-sm mb-2">Connect wallet to view your balances</p>
          <p className="text-gray-500 text-xs">Project information is displayed above</p>
        </div>
      )}
    </div>
  );
}

// Sub-component for project info
function ProjectInfo({ project }: { project: LoadedProject }) {
  return (
    <div className="mb-4 pb-4 border-b border-gray-700">
      <h3 className="text-lg font-semibold text-gray-300 mb-2">Project Details</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <p>
          <span className="text-gray-400">Exchange Rate:</span>{' '}
          1 : {Number(project.exchangeRate) / 10000}
        </p>
        <p>
          <span className="text-gray-400">Phase:</span>{' '}
          <span
            className={project.phase === 1 ? 'text-green-400' : 'text-yellow-400'}
          >
            {project.phase === 0
              ? 'Setup'
              : project.phase === 1
              ? 'Active'
              : project.phase === 2
              ? 'Grace Period'
              : 'Finalized'}
          </span>
        </p>
        <p>
          <span className="text-gray-400">Paused:</span>{' '}
          <span className={project.paused ? 'text-red-400' : 'text-green-400'}>
            {project.paused ? 'Yes' : 'No'}
          </span>
        </p>
      </div>
    </div>
  );
}

// Sub-component for balances grid
function BalancesGrid({ balances }: { balances: FormattedBalances }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-300 mb-2">Your Balances</h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <p>
          <span className="text-gray-400">SOL:</span>{' '}
          <span className="text-white font-mono">
            {parseFloat(balances.sol).toFixed(4)}
          </span>
        </p>
        <p>
          <span className="text-gray-400">Old Token:</span>{' '}
          <span className="text-white font-mono">
            {parseFloat(balances.oldToken).toFixed(2)}
          </span>
        </p>
        <p>
          <span className="text-gray-400">New Token:</span>{' '}
          <span className="text-white font-mono">
            {parseFloat(balances.newToken).toFixed(2)}
          </span>
        </p>
        <p>
          <span className="text-gray-400">MFT:</span>{' '}
          <span className="text-white font-mono">
            {parseFloat(balances.mft).toFixed(2)}
          </span>
        </p>
      </div>
      <p className="text-xs text-gray-500 mt-2">Updates every 3 seconds</p>
    </div>
  );
}