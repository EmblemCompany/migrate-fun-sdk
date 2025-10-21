"use client";

/**
 * MigrateFun SDK Demo - Simplified Version
 *
 * This demo shows the most direct way to use the @migratefun/sdk package.
 * It demonstrates loading projects, fetching balances, and performing migrations
 * without unnecessary abstraction layers.
 */

import { useState, useCallback, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  loadProject,
  getBalances,
  parseTokenAmount,
  formatTokenAmount,
  MigrationPhase
} from "@migratefun/sdk";
import { useMigrate, useClaim } from "@migratefun/sdk/react";
import type { LoadedProject, BalanceSnapshot } from "@migratefun/sdk";

export default function Home() {
  const { connection } = useConnection();
  const wallet = useWallet();

  // State
  const [projectId, setProjectId] = useState("mig1"); // Default for testing
  const [project, setProject] = useState<LoadedProject | null>(null);
  const [balances, setBalances] = useState<BalanceSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [migrateAmount, setMigrateAmount] = useState("");

  // Load project and balances directly using SDK functions
  const loadProjectData = useCallback(async () => {
    if (!projectId.trim()) {
      setError("Please enter a project ID");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Load project (doesn't require wallet)
      console.log("Loading project:", projectId);
      const loadedProject = await loadProject(projectId, connection);
      setProject(loadedProject);
      console.log("Project loaded:", loadedProject);

      // Step 2: Load balances if wallet is connected
      if (wallet.publicKey) {
        console.log("Loading balances for:", wallet.publicKey.toBase58());
        const userBalances = await getBalances(
          projectId,
          wallet.publicKey,
          connection,
          loadedProject
        );
        setBalances(userBalances);
        console.log("Balances loaded:", userBalances);
      }
    } catch (err) {
      console.error("Error loading data:", err);
      setError(err instanceof Error ? err.message : "Failed to load project");
    } finally {
      setLoading(false);
    }
  }, [projectId, connection, wallet.publicKey]);

  // Load data when wallet connects
  useEffect(() => {
    if (projectId) {
      loadProjectData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallet.publicKey]); // Re-load when wallet changes only

  // Migration hook from SDK
  const {
    migrate,
    isLoading: migrating,
    error: migrateError,
    signature: migrateSignature
  } = useMigrate(connection, wallet, {
    onSuccess: () => {
      console.log("Migration successful!");
      setMigrateAmount("");
      loadProjectData(); // Refresh balances
    },
    onError: (err) => {
      console.error("Migration failed:", err);
    }
  });

  // Claim hook from SDK
  const {
    claimMft,
    // claimRefund, // Available for refund claims
    isLoading: claiming,
    error: claimError,
    signature: claimSignature
  } = useClaim(connection, wallet, {
    onSuccess: () => {
      console.log("Claim successful!");
      loadProjectData(); // Refresh balances
    },
    onError: (err) => {
      console.error("Claim failed:", err);
    }
  });

  // Handle migration
  const handleMigrate = async () => {
    if (!project || !migrateAmount) {
      setError("Please enter an amount to migrate");
      return;
    }

    if (!balances) {
      setError("Please wait for balances to load");
      return;
    }

    const amount = parseFloat(migrateAmount);
    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    // Check if user has enough tokens
    const maxTokens = parseFloat(formatTokenAmount(balances.oldToken, project.oldTokenDecimals));
    if (amount > maxTokens) {
      setError(`Insufficient balance. You have ${maxTokens} tokens available`);
      return;
    }

    // Check if user has SOL for fees (minimum 0.01 SOL)
    const solBalance = Number(balances.sol) / 1e9;
    if (solBalance < 0.01) {
      setError(`Insufficient SOL for transaction fees. You have ${solBalance.toFixed(4)} SOL`);
      return;
    }

    try {
      setError(null);
      const tokenAmount = parseTokenAmount(amount, project.oldTokenDecimals);
      console.log("Migrating:", amount, "tokens =", tokenAmount.toString(), "raw amount");
      await migrate(projectId, tokenAmount, project);
    } catch (err) {
      console.error("Migration error:", err);
      setError(err instanceof Error ? err.message : "Migration failed");
    }
  };

  // Handle MFT claim
  const handleClaimMft = async () => {
    if (!project || !balances || balances.mft === BigInt(0)) {
      setError("No MFT tokens to claim");
      return;
    }

    // Check if user has SOL for fees
    const solBalance = Number(balances.sol) / 1e9;
    if (solBalance < 0.01) {
      setError(`Insufficient SOL for transaction fees. You have ${solBalance.toFixed(4)} SOL`);
      return;
    }

    try {
      setError(null);
      console.log("Claiming MFT:", balances.mft.toString());
      await claimMft(projectId, balances.mft, project);
    } catch (err) {
      console.error("Claim error:", err);
      setError(err instanceof Error ? err.message : "Claim failed");
    }
  };

  // Format balance for display
  const formatBalance = (amount: bigint | undefined, decimals: number) => {
    if (!amount) return "0";
    return formatTokenAmount(amount, decimals);
  };

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">MigrateFun SDK Demo</h1>
            <p className="text-gray-400 mt-2">Simple and direct SDK usage example</p>
          </div>
          <WalletMultiButton />
        </div>

        {/* Project Loader */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-semibold mb-4">1. Load Project</h2>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter Project ID"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value.trim())}
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
            />
            <button
              onClick={loadProjectData}
              disabled={loading || !projectId}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg"
            >
              {loading ? "Loading..." : "Load"}
            </button>
          </div>

          {/* Status */}
          {error && (
            <div className="mt-3 p-3 bg-red-900/20 border border-red-500 rounded text-red-400">
              <div className="font-semibold">Error:</div>
              <div className="text-sm mt-1">{error}</div>
            </div>
          )}

          {!wallet.connected && !loading && (
            <p className="text-yellow-400 text-sm mt-3">
              💡 Connect wallet to see your balances
            </p>
          )}
        </div>

        {/* Project Info */}
        {project && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">2. Project Details</h2>
            <div className="space-y-2 text-sm">
              <div>Project ID: <span className="text-gray-400">{project.projectId.toBase58()}</span></div>
              <div>Old Token: <span className="text-gray-400">{project.oldTokenMint.toBase58().slice(0, 8)}...</span></div>
              <div>New Token: <span className="text-gray-400">{project.newTokenMint.toBase58().slice(0, 8)}...</span></div>
              <div>Exchange Rate: <span className="text-gray-400">{Number(project.exchangeRate) / 10000}</span></div>
              <div>Migration Window: <span className="text-gray-400">
                {new Date(project.startTs * 1000).toLocaleDateString()} - {new Date(project.endTs * 1000).toLocaleDateString()}
              </span></div>
              <div>Claims Enabled: <span className={project.claimsEnabled ? 'text-green-400' : 'text-gray-400'}>
                {project.claimsEnabled ? 'Yes' : 'No'}
              </span></div>
              <div>Phase: <span className={`font-semibold ${
                project.phase === MigrationPhase.Setup ? 'text-yellow-400' :
                project.phase === MigrationPhase.ActiveMigration ? 'text-green-400' :
                project.phase === MigrationPhase.GracePeriod ? 'text-purple-400' :
                project.phase === MigrationPhase.Finalized ? 'text-blue-400' :
                'text-gray-400'
              }`}>
                {project.phase === MigrationPhase.Setup ? '🟡 Setup' :
                 project.phase === MigrationPhase.ActiveMigration ? '🟢 Active Migration' :
                 project.phase === MigrationPhase.GracePeriod ? '🟣 Grace Period (Claim)' :
                 project.phase === MigrationPhase.Finalized ? '🔵 Finalized' :
                 '⚫ Unknown'}
              </span></div>
              <div>Status: <span className={project.paused ? 'text-red-400' : 'text-green-400'}>
                {project.paused ? '⏸️ Paused' : '▶️ Active'}
              </span></div>
            </div>
          </div>
        )}

        {/* Balances */}
        {wallet.publicKey && project && balances && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">3. Your Balances</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>SOL:</span>
                <span>{formatBalance(balances.sol, 9)}</span>
              </div>
              <div className="flex justify-between">
                <span>Old Token:</span>
                <span>{formatBalance(balances.oldToken, project.oldTokenDecimals)}</span>
              </div>
              <div className="flex justify-between">
                <span>New Token:</span>
                <span>{formatBalance(balances.newToken, project.newTokenDecimals)}</span>
              </div>
              <div className="flex justify-between">
                <span>MFT:</span>
                <span>{formatBalance(balances.mft, project.mftDecimals)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Show message if project is in setup phase */}
        {wallet.publicKey && project && project.phase === MigrationPhase.Setup && !project.paused && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Project Status</h2>
            <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded">
              <p className="text-yellow-400 font-semibold">
                🟡 Project is in Setup Phase
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Migration will be available once the project moves to Active Migration phase.
              </p>
            </div>
          </div>
        )}

        {/* Show message if project is paused */}
        {wallet.publicKey && project && project.paused && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">Project Status</h2>
            <div className="p-4 bg-red-900/20 border border-red-500/30 rounded">
              <p className="text-red-400 font-semibold">
                ⏸️ This project is currently paused
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Migrations and claims are temporarily disabled. Please check back later.
              </p>
            </div>
          </div>
        )}

        {/* Check if currently in migration window */}
        {(() => {
          if (!wallet.publicKey || !project || project.paused || !balances) return null;

          const now = Date.now() / 1000;
          const inMigrationWindow = now >= project.startTs && now < project.endTs;

          if (!inMigrationWindow) {
            if (now < project.startTs) {
              return (
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
                  <h2 className="text-2xl font-semibold mb-4">Migration Status</h2>
                  <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded">
                    <p className="text-yellow-400 font-semibold">
                      ⏰ Migration Not Started Yet
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Migration will begin on {new Date(project.startTs * 1000).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            } else {
              return (
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
                  <h2 className="text-2xl font-semibold mb-4">Migration Status</h2>
                  <div className="p-4 bg-red-900/20 border border-red-500/30 rounded">
                    <p className="text-red-400 font-semibold">
                      🛑 Migration Window Closed
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      The migration period ended on {new Date(project.endTs * 1000).toLocaleString()}
                    </p>
                    {project.claimsEnabled && balances.mft > BigInt(0) && (
                      <p className="text-sm text-green-400 mt-2">
                        You can still claim your MFT tokens below.
                      </p>
                    )}
                  </div>
                </div>
              );
            }
          }

          return null;
        })()}

        {/* Migration - Show message if no tokens */}
        {wallet.publicKey && project && !project.paused && balances && (() => {
          const now = Date.now() / 1000;
          const inMigrationWindow = now >= project.startTs && now < project.endTs;
          return inMigrationWindow && balances.oldToken === BigInt(0);
        })() && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">4. Migrate Tokens</h2>
            <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded">
              <p className="text-yellow-400">
                You don&apos;t have any old tokens to migrate. You need to acquire some tokens first.
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Old token mint: {project.oldTokenMint.toBase58()}
              </p>
            </div>
          </div>
        )}

        {/* Migration - Normal flow */}
        {wallet.publicKey && project && !project.paused && balances && (() => {
          const now = Date.now() / 1000;
          const inMigrationWindow = now >= project.startTs && now < project.endTs;
          return inMigrationWindow && balances.oldToken > BigInt(0);
        })() && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">4. Migrate Tokens</h2>

            {/* Show available balance and exchange info */}
            <div className="mb-4 space-y-3">
              <div className="p-3 bg-gray-800 rounded">
                <div className="text-sm text-gray-400">Available to migrate:</div>
                <div className="text-lg font-semibold">
                  {formatBalance(balances.oldToken, project.oldTokenDecimals)} tokens
                </div>
              </div>

              <div className="p-3 bg-blue-900/20 border border-blue-500/30 rounded text-sm">
                <div className="text-blue-400 mb-1">Exchange Rate: {Number(project.exchangeRate) / 10000}x</div>
                <div className="text-gray-400">
                  You&apos;ll receive MFT tokens that can be claimed for new tokens in the claim phase
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Amount to migrate"
                value={migrateAmount}
                onChange={(e) => setMigrateAmount(e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                step="0.000000001"
              />
              <button
                onClick={() => setMigrateAmount(formatBalance(balances.oldToken, project.oldTokenDecimals))}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
              >
                Max
              </button>
              <button
                onClick={handleMigrate}
                disabled={migrating || !migrateAmount || Number(migrateAmount) <= 0}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg"
              >
                {migrating ? "Migrating..." : "Migrate"}
              </button>
            </div>

            {migrateError && (
              <div className="mt-3 p-3 bg-red-900/20 border border-red-500 rounded text-red-400">
                {migrateError.message}
              </div>
            )}

            {migrateSignature && (
              <div className="mt-3 p-3 bg-green-900/20 border border-green-500 rounded text-green-400">
                Success! TX: {migrateSignature.slice(0, 8)}...
              </div>
            )}
          </div>
        )}

        {/* Claims not enabled yet but user has MFT */}
        {wallet.publicKey && project && !project.claimsEnabled && !project.paused && balances?.mft && balances.mft > BigInt(0) && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">5. Claim Tokens</h2>
            <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded">
              <p className="text-yellow-400 font-semibold">
                ⏳ Claims Not Available Yet
              </p>
              <p className="text-sm text-gray-400 mt-2">
                You have {formatBalance(balances.mft, project.mftDecimals)} MFT tokens ready to claim.
                Claims will be enabled after the migration period ends.
              </p>
            </div>
          </div>
        )}

        {/* Claims enabled */}
        {wallet.publicKey && project && project.claimsEnabled && !project.paused && balances?.mft && balances.mft > BigInt(0) && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4">5. Claim Tokens</h2>
            <p className="text-gray-400 mb-4">
              You have {formatBalance(balances.mft, project.mftDecimals)} MFT tokens to claim
            </p>
            <button
              onClick={handleClaimMft}
              disabled={claiming}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 text-white rounded-lg"
            >
              {claiming ? "Claiming..." : "Claim New Tokens"}
            </button>

            {claimError && (
              <div className="mt-3 p-3 bg-red-900/20 border border-red-500 rounded text-red-400">
                {claimError.message}
              </div>
            )}

            {claimSignature && (
              <div className="mt-3 p-3 bg-green-900/20 border border-green-500 rounded text-green-400">
                Success! TX: {claimSignature.slice(0, 8)}...
              </div>
            )}
          </div>
        )}

        {/* Instructions when no project loaded */}
        {!project && !loading && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Enter a project ID (e.g., &quot;mig1&quot; for testing)</li>
              <li>Click &quot;Load&quot; to fetch project details</li>
              <li>Connect your wallet to see balances</li>
              <li>Ensure you have old tokens and SOL for fees</li>
              <li>Migrate tokens during migration phase</li>
              <li>Claim new tokens during claim phase</li>
            </ol>

            <div className="mt-6 p-4 bg-gray-800 rounded">
              <h3 className="font-semibold mb-2">SDK Usage Example:</h3>
              <pre className="text-xs text-gray-400">
{`import { loadProject, getBalances } from '@migratefun/sdk';
import { useMigrate, useClaim } from '@migratefun/sdk/react';

// Load project
const project = await loadProject('mig1', connection);

// Get balances
const balances = await getBalances('mig1', publicKey, connection);

// Use hooks for transactions
const { migrate } = useMigrate(connection, wallet);
await migrate(projectId, amount, project);`}
              </pre>
            </div>

            {/* Debug info */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-3 bg-gray-800 rounded text-xs text-gray-500">
                <div>Network: {process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet'}</div>
                <div>RPC: {process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'default'}</div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}