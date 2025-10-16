'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useLoadedProject, useBalances, useMigrate } from '@migratefun/sdk/react';
import { parseTokenAmount, PROGRAM_ID } from '@migratefun/sdk';
import React, { useState } from 'react';

/**
 * MigrationDemo Component
 *
 * Demonstrates the core features of @migratefun/sdk:
 * 1. Loading projects with useLoadedProject hook
 * 2. Watching balances in real-time with useBalances hook
 * 3. Executing token migrations with useMigrate hook
 *
 * This component showcases the complete SDK integration pattern
 * for a Next.js 15 App Router application with Solana wallet integration.
 */
export function MigrationDemo() {
  const { connection } = useConnection();
  const wallet = useWallet();

  // Get configuration from environment variables
  const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet') as 'devnet' | 'mainnet-beta';
  const defaultProjectId = process.env.NEXT_PUBLIC_DEFAULT_PROJECT_ID || '';
  const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || `https://api.${network}.solana.com`;

  // State: project id and migration amount
  const [projectIdInput, setProjectIdInput] = useState<string>(defaultProjectId);
  const [migrationAmount, setMigrationAmount] = useState('10');

  // SDK Pattern 1: Load project configuration
  // The useLoadedProject hook automatically caches project data
  // and handles network switching between devnet/mainnet
  const { project, isLoading: loadingProject, error: projectError, refetch: refetchProject } = useLoadedProject(
    projectIdInput,
    connection,
    { network, enabled: !!projectIdInput }
  );

  // SDK Pattern 2: Watch balances with automatic refetching
  // Balances update automatically when transactions complete
  const { formatted, isLoading: loadingBalances, refetch: refetchBalances } = useBalances(
    projectIdInput,
    wallet.publicKey,
    connection,
    {
      project: project || undefined,
      enabled: !!projectIdInput && !!wallet.publicKey
    }
  );

  // SDK Pattern 3: Execute migration with status tracking
  // The useMigrate hook handles transaction building and signing
  const { migrate, isLoading: migrating, status, error: migrateError, signature } = useMigrate(
    connection,
    wallet,
    {
      onSuccess: (sig) => {
        alert(`Migration successful! Signature: ${sig}`);
      },
      onError: (err) => {
        alert(`Migration failed: ${err.message}`);
      }
    }
  );

  // Auto-refetch project when wallet connects
  const [didRefetchAfterConnect, setDidRefetchAfterConnect] = useState(false);
  React.useEffect(() => {
    if (!projectIdInput) return;
    if (project) return;
    if (loadingProject) return;
    if (!wallet.publicKey) return;
    if (didRefetchAfterConnect) return;
    setDidRefetchAfterConnect(true);
    refetchProject();
  }, [wallet.publicKey, projectIdInput, project, loadingProject, didRefetchAfterConnect, refetchProject]);

  // Auto-refetch balances when project loads with connected wallet
  const [didRefetchAfterProject, setDidRefetchAfterProject] = useState(false);
  React.useEffect(() => {
    if (!wallet.publicKey) return;
    if (!project) return;
    if (!projectIdInput) return;
    if (didRefetchAfterProject) return;
    setDidRefetchAfterProject(true);
    refetchBalances();
  }, [wallet.publicKey, project, projectIdInput, didRefetchAfterProject, refetchBalances]);

  const handleMigrate = async () => {
    if (!project || !wallet.publicKey || !projectIdInput) {
      alert('Please connect wallet and load a project first');
      return;
    }

    try {
      const amount = parseTokenAmount(parseFloat(migrationAmount), project.oldTokenDecimals);
      await migrate(projectIdInput, amount, project);
    } catch {
      // Error handling is managed by the useMigrate hook's onError callback
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Project Controls */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Project</h2>
        <div className="flex flex-col gap-3">
          <div className="flex gap-3 items-center">
            <input
              type="text"
              placeholder="Enter Project ID"
              value={projectIdInput}
              onChange={(e) => setProjectIdInput(e.target.value.trim())}
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            {loadingProject && (
              <div className="px-4 text-gray-400">Loading...</div>
            )}
          </div>
          {!projectIdInput && (
            <p className="text-sm text-blue-400">💡 Enter a project ID to load configuration</p>
          )}
          {projectError && (
            <div className="text-red-400">
              <p className="font-semibold">Error loading project</p>
              <p className="text-sm mt-1">{projectError.message}</p>
            </div>
          )}
          {!projectError && !loadingProject && projectIdInput && !project && (
            <p className="text-yellow-400 text-sm">No project found for ID: {projectIdInput}</p>
          )}
          {project && (
            <div className="text-green-400 text-sm">✓ Project loaded</div>
          )}
        </div>
      </div>

      {/* Project Info */}
      {project && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Project Information</h2>
          <div className="space-y-2">
            <p><span className="text-gray-400">Exchange Rate:</span> 1 : {Number(project.exchangeRate) / 10000}</p>
            <p><span className="text-gray-400">Phase:</span> {project.phase === 0 ? 'Setup' : project.phase === 1 ? 'Active Migration' : project.phase === 2 ? 'Grace Period' : 'Finalized'}</p>
            <p><span className="text-gray-400">Paused:</span> {project.paused ? 'Yes' : 'No'}</p>
            <p className="text-xs text-gray-500 break-all"><span className="text-gray-400">Old Token:</span> {project.oldTokenMint.toString()}</p>
            <p className="text-xs text-gray-500 break-all"><span className="text-gray-400">New Token:</span> {project.newTokenMint.toString()}</p>
          </div>
        </div>
      )}

      {/* Balances */}
      {wallet.connected && projectIdInput && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Your Balances</h2>
          {loadingBalances ? (
            <p className="text-gray-400">Loading balances...</p>
          ) : formatted ? (
            <div className="space-y-2">
              <p><span className="text-gray-400">SOL:</span> {parseFloat(formatted.sol).toFixed(4)}</p>
              <p><span className="text-gray-400">Old Token:</span> {parseFloat(formatted.oldToken).toFixed(2)}</p>
              <p><span className="text-gray-400">New Token:</span> {parseFloat(formatted.newToken).toFixed(2)}</p>
              <p><span className="text-gray-400">MFT:</span> {parseFloat(formatted.mft).toFixed(2)}</p>
            </div>
          ) : (
            <div className="space-y-2 text-gray-400">
              <p>No balances found for this wallet and project.</p>
              <p className="text-xs text-gray-500">
                If this is a fresh wallet, associated token accounts (ATAs) may not exist yet.
                They will be created automatically on first migrate/claim.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Migration */}
      {wallet.connected && project && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Migrate Tokens</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Amount to Migrate</label>
              <input
                type="number"
                value={migrationAmount}
                onChange={(e) => setMigrationAmount(e.target.value)}
                placeholder="Amount"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              onClick={handleMigrate}
              disabled={migrating || !wallet.connected || project.paused}
              className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
            >
              {migrating ? `${status}...` : `Migrate ${migrationAmount} Tokens`}
            </button>
            {project.paused && (
              <p className="text-yellow-400 text-sm">Project is currently paused</p>
            )}
            {migrateError && (
              <p className="text-red-400 text-sm">Error: {migrateError.message}</p>
            )}
            {signature && (
              <p className="text-green-400 text-sm break-all">
                Success! Signature: {signature}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-300">
          <li>Enter a project ID</li>
          <li>Connect your Solana wallet ({network})</li>
          <li>View project details and your token balances</li>
          <li>Enter an amount and migrate your tokens</li>
        </ol>
      </div>

      {/* SDK Info */}
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Configuration</h2>
        <div className="space-y-2">
          <p className="text-gray-300">
            <span className="text-gray-400">SDK:</span> Local <code className="bg-gray-800 px-2 py-1 rounded text-sm">@migratefun/sdk</code>
          </p>
          <p className="text-gray-300">
            <span className="text-gray-400">Network:</span>{' '}
            <span className={network === 'mainnet-beta' ? 'text-green-400 font-semibold' : 'text-blue-400 font-semibold'}>
              {network === 'mainnet-beta' ? 'Mainnet Beta' : 'Devnet'}
            </span>
          </p>
          <p className="text-gray-300 break-all">
            <span className="text-gray-400">RPC:</span>{' '}
            <code className="bg-gray-800 px-2 py-1 rounded text-xs">{rpcUrl}</code>
          </p>
          <p className="text-gray-300 break-all">
            <span className="text-gray-400">Project ID:</span>{' '}
            <code className="bg-gray-800 px-2 py-1 rounded text-xs">{projectIdInput || 'Not set'}</code>
          </p>
          <p className="text-gray-300 break-all">
            <span className="text-gray-400">Program ID:</span>{' '}
            <code className="bg-gray-800 px-2 py-1 rounded text-xs">{PROGRAM_ID.toString()}</code>
          </p>
          <p className="text-xs text-gray-500 mt-4">
            💡 Configure in <code className="bg-gray-800 px-1 rounded">.env.local</code>
          </p>
        </div>
      </div>

      {/* Debug Info */}
      {project && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Debug</h2>
          <div className="space-y-2 text-gray-300">
            <p className="text-xs text-gray-400">Project PDAs</p>
            <p className="text-xs break-all"><span className="text-gray-500">projectConfig:</span> {project.pdas.projectConfig.toString()}</p>
            <p className="text-xs break-all"><span className="text-gray-500">oldTokenVault:</span> {project.pdas.oldTokenVault.toString()}</p>
            <p className="text-xs break-all"><span className="text-gray-500">newTokenVault:</span> {project.pdas.newTokenVault.toString()}</p>
            <p className="text-xs break-all"><span className="text-gray-500">mftMint:</span> {project.pdas.mftMint.toString()}</p>
          </div>
        </div>
      )}
    </div>
  );
}
