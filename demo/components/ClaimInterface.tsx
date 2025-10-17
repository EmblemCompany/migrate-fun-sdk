/**
 * ClaimInterface Component
 *
 * Handles token claims with auto-detection of claim type.
 * Supports MFT, Merkle, and Refund claims.
 */

import { LoadedProject, ClaimEligibility } from '@migratefun/sdk';

interface ClaimInterfaceProps {
  project: LoadedProject;
  eligibility: ClaimEligibility | null;
  claimType: 'mft' | 'merkle' | 'refund' | null;
  onClaim: () => Promise<void>;
  isLoading: boolean;
  status?: string | null;
  error?: Error | null;
  signature?: string | null;
  network: 'devnet' | 'mainnet-beta';
}

export function ClaimInterface({
  project,
  eligibility,
  claimType,
  onClaim,
  isLoading,
  status,
  error,
  signature,
  network
}: ClaimInterfaceProps) {
  if (!eligibility || !claimType) return null;

  const getExplorerLink = (sig: string) => {
    const cluster = network === 'mainnet-beta' ? '' : `?cluster=${network}`;
    return `https://explorer.solana.com/tx/${sig}${cluster}`;
  };

  const formatClaimType = () => {
    switch (claimType) {
      case 'mft': return 'MFT';
      case 'merkle': return 'Merkle';
      case 'refund': return 'Refund';
      default: return '';
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-semibold mb-4">4. Claim Tokens</h2>

      {/* Claim Type Info */}
      <div className="mb-4 p-4 bg-gray-800 rounded-lg">
        <p className="text-sm text-gray-300 mb-2">
          <span className="text-gray-400">Claim Type:</span>{' '}
          <span className="text-blue-400 font-semibold">
            {formatClaimType()}
          </span>
        </p>

        <ClaimTypeInfo
          claimType={claimType}
          eligibility={eligibility}
          project={project}
        />
      </div>

      {/* Claim Button */}
      <button
        onClick={onClaim}
        disabled={isLoading || project.paused}
        className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
      >
        {isLoading ? `${status}...` : `Claim ${formatClaimType()} Tokens`}
      </button>

      {/* Error display */}
      {error && (
        <p className="text-red-400 text-sm mt-4">
          ❌ Error: {error.message}
        </p>
      )}

      {/* Success display */}
      {signature && (
        <div className="text-green-400 text-sm mt-4">
          <p className="font-semibold">✅ Claim successful!</p>
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

// Sub-component for claim type specific information
function ClaimTypeInfo({
  claimType,
  eligibility,
  project
}: {
  claimType: 'mft' | 'merkle' | 'refund';
  eligibility: ClaimEligibility;
  project: LoadedProject;
}) {
  switch (claimType) {
    case 'mft':
      const mftBalance = eligibility.mftBalance
        ? parseFloat(eligibility.mftBalance.toString()) / Math.pow(10, project.mftDecimals)
        : 0;

      return (
        <div>
          <p className="text-sm text-gray-300">
            Claim new tokens using your MFT (Migration Fungible Token)
          </p>
          <p className="text-sm text-green-400 mt-1">✓ No penalty</p>
          <p className="text-sm text-gray-400 mt-1">
            MFT Balance: {mftBalance.toFixed(4)} MFT
          </p>
        </div>
      );

    case 'merkle':
      return (
        <div>
          <p className="text-sm text-gray-300">
            Late claim with merkle proof (missed migration window)
          </p>
          <p className="text-sm text-yellow-400 mt-1">
            ⚠️ Penalty may apply
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Requires merkle proof from backend
          </p>
        </div>
      );

    case 'refund':
      const oldBalance = eligibility.oldTokenBalance
        ? parseFloat(eligibility.oldTokenBalance.toString()) / Math.pow(10, project.oldTokenDecimals)
        : 0;

      return (
        <div>
          <p className="text-sm text-gray-300">
            Migration failed - claim refund of old tokens
          </p>
          <p className="text-sm text-blue-400 mt-1">↩️ Refund available</p>
          <p className="text-sm text-gray-400 mt-1">
            Old Token Balance: {oldBalance.toFixed(2)} tokens
          </p>
        </div>
      );

    default:
      return null;
  }
}