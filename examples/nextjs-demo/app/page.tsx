'use client';

import React, { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey } from '@solana/web3.js';
import {
  useLoadedProject,
  useBalances,
  useMigrate,
  parseTokenAmount,
} from '@migratefun/sdk/react';

export default function Home() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [migrateAmount, setMigrateAmount] = useState('100');

  // Replace with your actual project ID
  const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID
    ? new PublicKey(process.env.NEXT_PUBLIC_PROJECT_ID)
    : null;

  // Load project configuration
  const {
    project,
    isLoading: loadingProject,
    error: projectError,
  } = useLoadedProject(PROJECT_ID!, connection, {
    network: 'devnet',
    enabled: !!PROJECT_ID,
  });

  // Watch user balances
  const {
    formatted,
    isLoading: loadingBalances,
    error: balancesError,
  } = useBalances(PROJECT_ID!, wallet.publicKey, connection, {
    project,
    enabled: !!PROJECT_ID && !!wallet.publicKey,
  });

  // Migration hook
  const {
    migrate,
    isLoading: migrating,
    status,
    signature,
    error: migrateError,
  } = useMigrate(connection, wallet, {
    onSuccess: (sig) => {
      alert(`Migration successful! Signature: ${sig}`);
    },
    onError: (err) => {
      alert(`Migration failed: ${err.message}`);
    },
  });

  const handleMigrate = async () => {
    if (!project || !wallet.publicKey || !PROJECT_ID) return;

    try {
      const amount = parseTokenAmount(
        parseFloat(migrateAmount),
        project.oldTokenDecimals
      );
      await migrate(PROJECT_ID, amount, project);
    } catch (err) {
      console.error('Migration error:', err);
    }
  };

  if (!PROJECT_ID) {
    return (
      <main className="container">
        <h1>@migratefun/sdk Demo</h1>
        <div className="error-box">
          <p>Please set NEXT_PUBLIC_PROJECT_ID in .env.local</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container">
      <h1>@migratefun/sdk Demo</h1>
      <p className="subtitle">Next.js 15 + React Hooks Integration</p>

      <div className="wallet-section">
        <WalletMultiButton />
      </div>

      {!wallet.connected && (
        <div className="info-box">
          <p>Connect your wallet to get started</p>
        </div>
      )}

      {wallet.connected && (
        <>
          {/* Project Info */}
          <section className="card">
            <h2>Project Information</h2>
            {loadingProject && <p>Loading project...</p>}
            {projectError && (
              <div className="error-box">Error: {projectError.message}</div>
            )}
            {project && (
              <div className="info-grid">
                <div>
                  <strong>Project ID:</strong>
                  <code>{project.projectId.toString().slice(0, 8)}...</code>
                </div>
                <div>
                  <strong>Exchange Rate:</strong> 1 : {project.exchangeRatio}
                </div>
                <div>
                  <strong>Status:</strong>{' '}
                  {project.isPaused ? 'Paused' : 'Active'}
                </div>
                <div>
                  <strong>Phase:</strong> {project.currentPhase}
                </div>
              </div>
            )}
          </section>

          {/* Balances */}
          <section className="card">
            <h2>Your Balances</h2>
            {loadingBalances && <p>Loading balances...</p>}
            {balancesError && (
              <div className="error-box">Error: {balancesError.message}</div>
            )}
            {formatted && (
              <div className="balances-grid">
                <div className="balance-item">
                  <span className="label">SOL</span>
                  <span className="value">{formatted.sol.toFixed(4)}</span>
                </div>
                <div className="balance-item">
                  <span className="label">Old Token</span>
                  <span className="value">{formatted.oldToken.toFixed(2)}</span>
                </div>
                <div className="balance-item">
                  <span className="label">New Token</span>
                  <span className="value">{formatted.newToken.toFixed(2)}</span>
                </div>
                <div className="balance-item">
                  <span className="label">MFT</span>
                  <span className="value">{formatted.mft.toFixed(2)}</span>
                </div>
              </div>
            )}
          </section>

          {/* Migration */}
          <section className="card">
            <h2>Migrate Tokens</h2>
            <div className="migration-form">
              <input
                type="number"
                value={migrateAmount}
                onChange={(e) => setMigrateAmount(e.target.value)}
                placeholder="Amount to migrate"
                disabled={migrating}
                className="amount-input"
              />
              <button
                onClick={handleMigrate}
                disabled={migrating || !project || project.isPaused}
                className="migrate-button"
              >
                {migrating ? `${status}...` : 'Migrate'}
              </button>
            </div>
            {migrateError && (
              <div className="error-box">{migrateError.message}</div>
            )}
            {signature && (
              <div className="success-box">
                <strong>Success!</strong>
                <br />
                <a
                  href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Transaction
                </a>
              </div>
            )}
          </section>
        </>
      )}

      <footer className="footer">
        <p>
          Powered by{' '}
          <a
            href="https://github.com/EmblemCompany/migratefun"
            target="_blank"
            rel="noopener noreferrer"
          >
            @migratefun/sdk
          </a>
        </p>
      </footer>
    </main>
  );
}
