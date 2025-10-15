import React, { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useLoadedProject, useBalances, useMigrate, parseTokenAmount } from '@migratefun/sdk/react';

const PROJECT_ID = import.meta.env.VITE_PROJECT_ID
  ? new PublicKey(import.meta.env.VITE_PROJECT_ID)
  : null;

export default function MigrationDemo() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [amount, setAmount] = useState('100');

  const { project, isLoading: loadingProject } = useLoadedProject(
    PROJECT_ID!,
    connection,
    { network: 'devnet', enabled: !!PROJECT_ID }
  );

  const { formatted, isLoading: loadingBalances } = useBalances(
    PROJECT_ID!,
    wallet.publicKey,
    connection,
    { project, enabled: !!PROJECT_ID && !!wallet.publicKey }
  );

  const { migrate, isLoading, status, signature } = useMigrate(connection, wallet, {
    onSuccess: (sig) => alert(`Success! ${sig}`),
  });

  const handleMigrate = async () => {
    if (!project || !PROJECT_ID) return;
    const amountBigInt = parseTokenAmount(parseFloat(amount), project.oldTokenDecimals);
    await migrate(PROJECT_ID, amountBigInt, project);
  };

  if (!PROJECT_ID) {
    return <div className="error">Please set VITE_PROJECT_ID in .env</div>;
  }

  if (!wallet.connected) {
    return <div className="info">Connect your wallet to get started</div>;
  }

  return (
    <main>
      <section className="card">
        <h2>Project Info</h2>
        {loadingProject ? (
          <p>Loading...</p>
        ) : project ? (
          <div>
            <p>Exchange Rate: 1 : {project.exchangeRatio}</p>
            <p>Status: {project.isPaused ? 'Paused' : 'Active'}</p>
          </div>
        ) : null}
      </section>

      <section className="card">
        <h2>Balances</h2>
        {loadingBalances ? (
          <p>Loading...</p>
        ) : formatted ? (
          <div className="balances">
            <div><strong>SOL:</strong> {formatted.sol.toFixed(4)}</div>
            <div><strong>Old Token:</strong> {formatted.oldToken.toFixed(2)}</div>
            <div><strong>New Token:</strong> {formatted.newToken.toFixed(2)}</div>
            <div><strong>MFT:</strong> {formatted.mft.toFixed(2)}</div>
          </div>
        ) : null}
      </section>

      <section className="card">
        <h2>Migrate</h2>
        <div className="migrate-form">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isLoading}
          />
          <button onClick={handleMigrate} disabled={isLoading}>
            {isLoading ? status : 'Migrate'}
          </button>
        </div>
        {signature && (
          <div className="success">
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
    </main>
  );
}
