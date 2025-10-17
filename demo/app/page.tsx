'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useMigrate, useClaim } from '@migratefun/sdk/react';
import { parseTokenAmount } from '@migratefun/sdk';
import { useState, useEffect, useCallback } from 'react';

// Import modular components
import { ProjectLoader } from '../components/ProjectLoader';
import { BalancesDisplay } from '../components/BalancesDisplay';
import { MigrationForm } from '../components/MigrationForm';
import { ClaimInterface } from '../components/ClaimInterface';
import { ProjectInfoSkeleton } from '../components/LoadingStates';

// Import custom hooks
import { useComposedData } from '../hooks/useComposedData';
import { useAutoRetry } from '../hooks/useAutoRetry';

/**
 * MigrateFun SDK Demo - Refactored with Modular Components
 *
 * This is a simplified version that uses modular components to reduce
 * complexity and improve maintainability. The main logic is now split
 * across reusable components and custom hooks.
 *
 * Original: 595 lines → Now: ~200 lines in main file
 */
export default function Home() {
  const { connection } = useConnection();
  const wallet = useWallet();

  // Configuration
  const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet') as 'devnet' | 'mainnet-beta';
  const defaultProjectId = process.env.NEXT_PUBLIC_DEFAULT_PROJECT_ID || '';

  // State
  const [projectIdInput, setProjectIdInput] = useState<string>(defaultProjectId);

  // Use composed data hook for all data fetching
  const {
    project,
    formatted,
    eligibility,
    claimType,
    projectLoading,
    projectError,
    hasLoadedProject,
    refresh,
    refreshBalances,
  } = useComposedData(projectIdInput, connection, wallet.publicKey, {
    network,
    refetchInterval: 3000,
  });

  // Auto-retry logic
  const { retryCount, resetRetry } = useAutoRetry(projectError, refresh);

  // Ensure full refresh after wallet connects (mitigates race conditions)
  useEffect(() => {
    if (wallet.connected && projectIdInput) {
      const t = setTimeout(() => refresh(), 50);
      return () => clearTimeout(t);
    }
  }, [wallet.connected, projectIdInput, refresh]);

  // Migration hook
  const {
    migrate,
    isLoading: migrating,
    status: migrateStatus,
    error: migrateTxError,
    signature: migrateSignature,
  } = useMigrate(connection, wallet, {
    onSuccess: (sig) => {
      console.log('Migration successful:', sig);
      refresh();
    },
    onError: (err) => {
      console.error('Migration failed:', err.message);
    },
  });

  // Claim hook
  const {
    claimMft,
    claimRefund,
    isLoading: claiming,
    status: claimStatus,
    error: claimTxError,
    signature: claimSignature,
  } = useClaim(connection, wallet, {
    onSuccess: (sig) => {
      console.log('Claim successful:', sig);
      refresh();
    },
    onError: (err) => {
      console.error('Claim failed:', err.message);
    },
  });

  // Migration handler
  const handleMigrate = useCallback(async (amount: string) => {
    if (!project || !projectIdInput) {
      alert('Please load a project first');
      return;
    }

    const numAmount = parseFloat(amount);
    if (!Number.isFinite(numAmount) || numAmount <= 0) {
      alert('Please enter a valid positive amount');
      return;
    }

    // Check against available balance
    const maxAmount = parseFloat(formatted?.oldToken || '0');
    if (numAmount > maxAmount) {
      alert(`Insufficient balance. You have ${maxAmount.toFixed(2)} tokens available.`);
      return;
    }

    // Check decimal precision
    const decimalPlaces = (amount.split('.')[1] || '').length;
    if (decimalPlaces > project.oldTokenDecimals) {
      alert(`Maximum ${project.oldTokenDecimals} decimal places allowed`);
      return;
    }

    try {
      const tokenAmount = parseTokenAmount(numAmount, project.oldTokenDecimals);
      await migrate(projectIdInput, tokenAmount, project);
    } catch (err) {
      console.error('Migration error:', err);
    }
  }, [project, projectIdInput, formatted, migrate]);

  // Claim handler
  const handleClaim = useCallback(async () => {
    if (!project || !eligibility) {
      alert('Please connect wallet and load a project first');
      return;
    }

    try {
      if (claimType === 'mft' && eligibility.mftBalance > BigInt(0)) {
        await claimMft(projectIdInput, eligibility.mftBalance, project);
      } else if (claimType === 'merkle') {
        alert('Merkle claims require additional setup. Contact support for merkle proof.');
      } else if (claimType === 'refund' && eligibility.oldTokenBalance > BigInt(0)) {
        await claimRefund(projectIdInput, project);
      } else {
        alert('No eligible claim available');
      }
    } catch (err) {
      console.error('Claim error:', err);
    }
  }, [project, eligibility, claimType, projectIdInput, claimMft, claimRefund]);

  const handleRefresh = useCallback(() => {
    resetRetry();
    refresh();
  }, [resetRetry, refresh]);

  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-4xl mx-auto">
        {/* Header with wallet button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">MigrateFun SDK Demo</h1>
            <p className="text-gray-400 mt-2">Complete token migration journey (modular edition)</p>
          </div>
          <WalletMultiButton />
        </div>

        {/* Project Loader Component */}
        <ProjectLoader
          projectId={projectIdInput}
          onProjectIdChange={setProjectIdInput}
          onRefresh={handleRefresh}
          isLoading={projectLoading}
          error={projectError}
          walletConnected={wallet.connected}
          walletConnecting={wallet.connecting}
          autoRetryCount={retryCount}
        />

        {/* Show skeleton while initial project is loading */}
        {projectLoading && !hasLoadedProject && projectIdInput && (
          <ProjectInfoSkeleton />
        )}

        {/* Balances Display Component */}
        {project && (
          <BalancesDisplay
            project={project}
            balances={formatted}
            isBalancesLoading={false}
            balancesError={null}
            walletPublicKey={wallet.publicKey}
            walletConnected={wallet.connected}
            walletConnecting={wallet.connecting}
            onRefreshBalances={refreshBalances}
          />
        )}

        {/* Migration Form Component */}
        {wallet.publicKey && project && (
          <MigrationForm
            project={project}
            projectId={projectIdInput}
            balances={formatted}
            onMigrate={handleMigrate}
            isLoading={migrating}
            status={migrateStatus}
            error={migrateTxError}
            signature={migrateSignature}
            network={network}
          />
        )}

        {/* Claim Interface Component */}
        {wallet.publicKey && project && claimType && (
          <ClaimInterface
            project={project}
            eligibility={eligibility}
            claimType={claimType}
            onClaim={handleClaim}
            isLoading={claiming}
            status={claimStatus}
            error={claimTxError}
            signature={claimSignature}
            network={network}
          />
        )}

        {/* Getting Started Instructions */}
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