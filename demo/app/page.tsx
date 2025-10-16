'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useProjectSession, useMigrate, useClaim } from '@migratefun/sdk/react';
import { parseTokenAmount } from '@migratefun/sdk';
import { useState } from 'react';

/**
 * MigrateFun SDK Demo - Single Page Application
 *
 * Demonstrates all core SDK features in ~300 lines:
 * 1. Wallet Connection (Solana Wallet Adapter)
 * 2. Project Info + Balances (useProjectSession hook)
 * 3. Token Migration (useMigrate hook)
 * 4. Token Claims (useClaim hook with auto-detection)
 */
export default function Home() {
  const { connection } = useConnection();
  const wallet = useWallet();

  // Configuration from environment variables
  const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet') as 'devnet' | 'mainnet-beta';
  const defaultProjectId = process.env.NEXT_PUBLIC_DEFAULT_PROJECT_ID || '';

  // State: project ID and transaction amounts
  const [projectIdInput, setProjectIdInput] = useState<string>(defaultProjectId);
  const [migrationAmount, setMigrationAmount] = useState('10');

  // ===== SECTION 2: PROJECT INFO + BALANCES =====
  // useProjectSession combines project metadata, balances, and eligibility in one hook
  const {
    project,
    formatted,
    claimEligibility,
    isLoading,
    error,
    refresh,
  } = useProjectSession(
    projectIdInput,
    connection,
    wallet.publicKey,
    {
      network,
      enabled: !!projectIdInput && !!wallet.publicKey,
      refetchInterval: 3000, // Auto-refresh every 3 seconds
    }
  );

  // ===== SECTION 3: MIGRATE TOKENS =====
  const {
    migrate,
    isLoading: migrating,
    status: migrateStatus,
    error: migrateError,
    signature: migrateSignature,
  } = useMigrate(connection, wallet, {
    onSuccess: (sig) => {
      console.log('Migration successful:', sig);
      refresh(); // Refresh balances after migration
    },
    onError: (err) => {
      console.error('Migration failed:', err.message);
    },
  });

  // ===== SECTION 4: CLAIM TOKENS =====
  const {
    claimMft,
    claimMerkle,
    claimRefund,
    isLoading: claiming,
    status: claimStatus,
    error: claimError,
    signature: claimSignature,
  } = useClaim(connection, wallet, {
    onSuccess: (sig) => {
      console.log('Claim successful:', sig);
      refresh(); // Refresh balances after claim
    },
    onError: (err) => {
      console.error('Claim failed:', err.message);
    },
  });

  // Migration handler
  const handleMigrate = async () => {
    if (!project || !wallet.publicKey || !projectIdInput) {
      alert('Please connect wallet and load a project first');
      return;
    }

    try {
      const amount = parseTokenAmount(parseFloat(migrationAmount), project.oldTokenDecimals);
      await migrate(projectIdInput, amount, project);
    } catch (err) {
      console.error('Migration error:', err);
    }
  };

  // Claim handler with auto-detection
  const handleClaim = async () => {
    if (!project || !wallet.publicKey || !claimEligibility) {
      alert('Please connect wallet and load a project first');
      return;
    }

    try {
      // Auto-detect claim type based on eligibility
      if (claimEligibility.canClaimMft && claimEligibility.mftBalance > BigInt(0)) {
        // MFT claim - no penalty
        await claimMft(projectIdInput, claimEligibility.mftBalance, project);
      } else if (claimEligibility.canClaimMerkle) {
        // Merkle claim - with penalty (requires merkle proof from backend)
        // Note: This is simplified - real implementation would need to fetch proof
        alert('Merkle claims require additional setup. Contact support for merkle proof.');
      } else if (claimEligibility.canRefund && claimEligibility.oldTokenBalance > BigInt(0)) {
        // Refund claim - get old tokens back
        await claimRefund(projectIdInput, project);
      } else {
        alert('No eligible claim available');
      }
    } catch (err) {
      console.error('Claim error:', err);
    }
  };

  // Helper to get claim type name
  const getClaimType = () => {
    if (!claimEligibility) return null;
    if (claimEligibility.canClaimMft && claimEligibility.mftBalance > BigInt(0)) return 'MFT';
    if (claimEligibility.canClaimMerkle) return 'Merkle';
    if (claimEligibility.canRefund && claimEligibility.oldTokenBalance > BigInt(0)) return 'Refund';
    return null;
  };

  // Helper to format transaction link
  const getExplorerLink = (signature: string) => {
    const cluster = network === 'mainnet-beta' ? '' : `?cluster=${network}`;
    return `https://explorer.solana.com/tx/${signature}${cluster}`;
  };

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-4xl mx-auto">
        {/* ===== SECTION 1: HEADER + WALLET CONNECTION ===== */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">MigrateFun SDK Demo</h1>
            <p className="text-gray-400 mt-2">Complete token migration journey in one page</p>
          </div>
          <WalletMultiButton />
        </div>

        {/* Project ID Input */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">1. Load Project</h2>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter Project ID"
              value={projectIdInput}
              onChange={(e) => setProjectIdInput(e.target.value.trim())}
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={() => refresh()}
              disabled={isLoading || !projectIdInput}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
            >
              {isLoading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
          {error && (
            <p className="text-red-400 text-sm mt-2">Error: {error.message}</p>
          )}
          {!wallet.connected && projectIdInput && (
            <p className="text-yellow-400 text-sm mt-2">⚠️ Connect wallet to view balances</p>
          )}
        </div>

        {/* ===== SECTION 2: PROJECT INFO + BALANCES ===== */}
        {project && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">2. Project Info &amp; Balances</h2>

            {/* Project Metadata */}
            <div className="mb-4 pb-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold text-gray-300 mb-2">Project Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p><span className="text-gray-400">Exchange Rate:</span> 1 : {Number(project.exchangeRate) / 10000}</p>
                <p><span className="text-gray-400">Phase:</span> <span className={project.phase === 1 ? 'text-green-400' : 'text-yellow-400'}>{project.phase === 0 ? 'Setup' : project.phase === 1 ? 'Active' : project.phase === 2 ? 'Grace Period' : 'Finalized'}</span></p>
                <p><span className="text-gray-400">Paused:</span> <span className={project.paused ? 'text-red-400' : 'text-green-400'}>{project.paused ? 'Yes' : 'No'}</span></p>
              </div>
            </div>

            {/* Balances */}
            {wallet.connected && formatted && (
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-2">Your Balances</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p><span className="text-gray-400">SOL:</span> <span className="text-white font-mono">{parseFloat(formatted.sol).toFixed(4)}</span></p>
                  <p><span className="text-gray-400">Old Token:</span> <span className="text-white font-mono">{parseFloat(formatted.oldToken).toFixed(2)}</span></p>
                  <p><span className="text-gray-400">New Token:</span> <span className="text-white font-mono">{parseFloat(formatted.newToken).toFixed(2)}</span></p>
                  <p><span className="text-gray-400">MFT:</span> <span className="text-white font-mono">{parseFloat(formatted.mft).toFixed(2)}</span></p>
                </div>
                <p className="text-xs text-gray-500 mt-2">Updates every 3 seconds</p>
              </div>
            )}
          </div>
        )}

        {/* ===== SECTION 3: MIGRATE TOKENS ===== */}
        {wallet.connected && project && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">3. Migrate Tokens</h2>
            <p className="text-gray-400 text-sm mb-4">Exchange old tokens for new tokens at the project&apos;s exchange rate</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Amount to Migrate</label>
                <input
                  type="number"
                  value={migrationAmount}
                  onChange={(e) => setMigrationAmount(e.target.value)}
                  placeholder="Enter amount"
                  disabled={migrating || project.paused}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 disabled:opacity-50"
                />
                {formatted && (
                  <p className="text-xs text-gray-500 mt-1">
                    Available: {parseFloat(formatted.oldToken).toFixed(2)} tokens
                  </p>
                )}
              </div>

              <button
                onClick={handleMigrate}
                disabled={migrating || !wallet.connected || project.paused || !migrationAmount || parseFloat(migrationAmount) <= 0}
                className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
              >
                {migrating ? `${migrateStatus}...` : `Migrate ${migrationAmount} Tokens`}
              </button>

              {project.paused && (
                <p className="text-yellow-400 text-sm">⚠️ Project is currently paused</p>
              )}

              {migrateError && (
                <p className="text-red-400 text-sm">❌ Error: {migrateError.message}</p>
              )}

              {migrateSignature && (
                <div className="text-green-400 text-sm">
                  <p className="font-semibold">✅ Migration successful!</p>
                  <a
                    href={getExplorerLink(migrateSignature)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline break-all"
                  >
                    View on Explorer →
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== SECTION 4: CLAIM TOKENS ===== */}
        {wallet.connected && project && claimEligibility && getClaimType() && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">4. Claim Tokens</h2>

            {/* Claim Type Info */}
            <div className="mb-4 p-4 bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-300 mb-2">
                <span className="text-gray-400">Claim Type:</span> <span className="text-blue-400 font-semibold">{getClaimType()}</span>
              </p>

              {getClaimType() === 'MFT' && (
                <div>
                  <p className="text-sm text-gray-300">Claim new tokens using your MFT (Migration Fungible Token)</p>
                  <p className="text-sm text-green-400 mt-1">✓ No penalty</p>
                  <p className="text-sm text-gray-400 mt-1">MFT Balance: {claimEligibility.mftBalance ? parseFloat(claimEligibility.mftBalance.toString()) / Math.pow(10, project.mftDecimals) : 0} MFT</p>
                </div>
              )}

              {getClaimType() === 'Merkle' && (
                <div>
                  <p className="text-sm text-gray-300">Late claim with merkle proof (missed migration window)</p>
                  <p className="text-sm text-yellow-400 mt-1">⚠️ Penalty may apply</p>
                  <p className="text-sm text-gray-400 mt-1">Requires merkle proof from backend</p>
                </div>
              )}

              {getClaimType() === 'Refund' && (
                <div>
                  <p className="text-sm text-gray-300">Migration failed - claim refund of old tokens</p>
                  <p className="text-sm text-blue-400 mt-1">↩️ Refund available</p>
                  <p className="text-sm text-gray-400 mt-1">Old Token Balance: {claimEligibility.oldTokenBalance ? parseFloat(claimEligibility.oldTokenBalance.toString()) / Math.pow(10, project.oldTokenDecimals) : 0} tokens</p>
                </div>
              )}
            </div>

            {/* Claim Button */}
            <button
              onClick={handleClaim}
              disabled={claiming || !wallet.connected || project.paused}
              className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
            >
              {claiming ? `${claimStatus}...` : `Claim ${getClaimType()} Tokens`}
            </button>

            {claimError && (
              <p className="text-red-400 text-sm mt-4">❌ Error: {claimError.message}</p>
            )}

            {claimSignature && (
              <div className="text-green-400 text-sm mt-4">
                <p className="font-semibold">✅ Claim successful!</p>
                <a
                  href={getExplorerLink(claimSignature)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline break-all"
                >
                  View on Explorer →
                </a>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        {!project && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Enter a project ID above</li>
              <li>Connect your Solana wallet (top right)</li>
              <li>View project details and your token balances</li>
              <li>Migrate tokens or claim available tokens</li>
            </ol>
            <p className="text-sm text-gray-500 mt-4">
              💡 Need a test project? Check the README for devnet test projects
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
