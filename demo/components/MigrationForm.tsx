/**
 * MigrationForm Component
 *
 * Handles token migration input, validation, and execution.
 * Provides clear feedback for transaction status and errors.
 */

import { LoadedProject } from '@migratefun/sdk';
import { FormattedBalances } from '@migratefun/sdk/react';
import { useState } from 'react';

interface MigrationFormProps {
  project: LoadedProject;
  projectId: string;
  balances: FormattedBalances | null;
  onMigrate: (amount: string) => Promise<void>;
  isLoading: boolean;
  status?: string | null;
  error?: Error | null;
  signature?: string | null;
  network: 'devnet' | 'mainnet-beta';
}

export function MigrationForm({
  project,
  projectId,
  balances,
  onMigrate,
  isLoading,
  status,
  error,
  signature,
  network
}: MigrationFormProps) {
  const [amount, setAmount] = useState('10');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onMigrate(amount);
    // Clear amount on success
    if (signature) {
      setAmount('');
    }
  };

  const getExplorerLink = (sig: string) => {
    const cluster = network === 'mainnet-beta' ? '' : `?cluster=${network}`;
    return `https://explorer.solana.com/tx/${sig}${cluster}`;
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4">3. Migrate Tokens</h2>
      <p className="text-gray-400 text-sm mb-4">
        Exchange old tokens for new tokens at the project&apos;s exchange rate
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">
            Amount to Migrate
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            disabled={isLoading || project.paused}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 disabled:opacity-50"
            step="0.01"
            min="0"
          />
          {balances && (
            <p className="text-xs text-gray-500 mt-1">
              Available: {parseFloat(balances.oldToken).toFixed(2)} tokens
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={
            isLoading ||
            project.paused ||
            !amount ||
            parseFloat(amount) <= 0
          }
          className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
        >
          {isLoading ? `${status}...` : `Migrate ${amount || '0'} Tokens`}
        </button>
      </form>

      {/* Project paused warning */}
      {project.paused && (
        <p className="text-yellow-400 text-sm mt-4">
          ⚠️ Project is currently paused
        </p>
      )}

      {/* Error display */}
      {error && (
        <MigrationError error={error} projectId={projectId} network={network} />
      )}

      {/* Success display */}
      {signature && (
        <div className="text-green-400 text-sm mt-4">
          <p className="font-semibold">✅ Migration successful!</p>
          <a
            href={getExplorerLink(signature)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline break-all"
          >
            View on Explorer →
          </a>
        </div>
      )}
    </div>
  );
}

// Sub-component for detailed error messages
function MigrationError({
  error,
  projectId,
  network
}: {
  error: Error;
  projectId: string;
  network: string;
}) {
  const isSimulationError = error.message.includes('simulation failed');

  return (
    <div className="text-red-400 text-sm mt-4">
      <p>❌ Error: {error.message}</p>
      {isSimulationError && (
        <div className="mt-2 text-xs text-gray-400">
          <p>Common solutions:</p>
          <ul className="list-disc ml-4">
            <li>Ensure project ID &quot;{projectId}&quot; exists on {network}</li>
            <li>Check you have at least 0.002 SOL for fees</li>
            <li>Try using a premium RPC endpoint (see .env.example)</li>
            <li>Verify the project is active and not paused</li>
          </ul>
        </div>
      )}
      {error.message.includes('insufficient balance') && (
        <p className="mt-2 text-xs text-gray-400">
          💡 Tip: Check that you have enough tokens to migrate
        </p>
      )}
      {error.message.includes('rate limit') && (
        <p className="mt-2 text-xs text-gray-400">
          💡 Tip: RPC rate limit hit. Use a premium RPC endpoint
        </p>
      )}
    </div>
  );
}