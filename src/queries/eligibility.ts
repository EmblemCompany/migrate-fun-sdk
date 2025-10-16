/**
 * Claim eligibility determination and routing logic
 *
 * This module provides functions to determine which claim types are available
 * to users based on project state, user balances, and timing.
 *
 * @module eligibility
 * @see IDL_REFERENCE.md:802-871 for eligibility rules
 */

import { Connection, PublicKey } from '@solana/web3.js';
import { loadProject } from './balances';
import { getBalances } from './balances';
import type {
  LoadedProject,
  ClaimEligibility,
  ClaimType,
  ProjectRedirectIntent,
  Network,
} from '../core/types';
import { MigrationPhase } from '../core/types';

/**
 * Options for computing claim eligibility
 */
export interface ComputeClaimEligibilityOptions {
  /**
   * Network to use (defaults to current active network)
   */
  network?: Network;

  /**
   * Skip cache and fetch fresh data
   */
  skipCache?: boolean;
}

/**
 * Options for checking project eligibility
 */
export interface CheckProjectEligibilityOptions extends ComputeClaimEligibilityOptions {
  // Inherit all options from ComputeClaimEligibilityOptions
}

/**
 * High-level eligibility summary for UI queries
 */
export interface ProjectEligibilitySummary {
  /**
   * Is migration currently active (can migrate old tokens → MFT)
   */
  isMigrationActive: boolean;

  /**
   * Can claim MFT (burn MFT → receive new tokens, no penalty)
   */
  canClaimMft: boolean;

  /**
   * Can claim via merkle proof (late claim with penalty)
   */
  canClaimMerkle: boolean;

  /**
   * Can claim refund (failed migration, get old tokens back)
   */
  canRefund: boolean;

  /**
   * Is the project expired (migration ended, claims disabled)
   */
  isExpired: boolean;

  /**
   * Reason if no actions available
   */
  reason?: string;
}

/**
 * Options for redirect intent
 */
export interface GetRedirectIntentOptions {
  /**
   * Current route (e.g., '/migrate/my-project')
   */
  currentRoute?: string;
}

/**
 * Compute detailed claim eligibility for a user in a project
 *
 * Determines which claim types are available based on:
 * - Project phase (active migration, claims enabled, etc.)
 * - User balances (has old tokens, has MFT, etc.)
 * - Project state (paused, merkle root set, migration failed, etc.)
 *
 * @param {Connection} connection - Solana RPC connection
 * @param {string} projectId - Project identifier
 * @param {PublicKey | null} user - User wallet public key (null for anonymous)
 * @param {ComputeClaimEligibilityOptions} [options] - Options
 * @returns {Promise<ClaimEligibility>} Detailed eligibility information
 *
 * @example
 * ```typescript
 * import { Connection, PublicKey } from '@solana/web3.js';
 * import { computeClaimEligibility } from '@migratefun/sdk';
 *
 * const connection = new Connection('https://api.devnet.solana.com');
 * const user = new PublicKey('...');
 *
 * const eligibility = await computeClaimEligibility(
 *   connection,
 *   'my-project',
 *   user
 * );
 *
 * console.log('Can claim MFT:', eligibility.canClaimMft);
 * console.log('Can claim merkle:', eligibility.canClaimMerkle);
 * console.log('Can refund:', eligibility.canRefund);
 * console.log('MFT balance:', eligibility.mftBalance);
 * ```
 */
export async function computeClaimEligibility(
  connection: Connection,
  projectId: string,
  user: PublicKey | null,
  options: ComputeClaimEligibilityOptions = {}
): Promise<ClaimEligibility> {
  const { network, skipCache = false } = options;

  // Load project
  const project = await loadProject(projectId, connection, {
    network,
    skipCache,
  });

  // If no user provided, return all false
  if (!user) {
    return {
      canClaimMft: false,
      canClaimMerkle: false,
      canRefund: false,
      hasOldTokens: false,
      hasMftTokens: false,
      mftBalance: 0n,
      oldTokenBalance: 0n,
    };
  }

  // Get user balances
  const balances = await getBalances(projectId, user, connection, project, {
    network,
    skipCache,
  });

  // Determine eligibility flags
  const hasOldTokens = balances.oldToken > 0n;
  const hasMftTokens = balances.mft > 0n;

  // MFT claim eligibility:
  // - Must be in grace period (phase 2) or finalized (phase 3)
  // - Must have MFT tokens
  // - Project must not be paused
  const canClaimMft =
    (project.phase === MigrationPhase.GracePeriod ||
      project.phase === MigrationPhase.Finalized) &&
    hasMftTokens &&
    !project.paused;

  // Merkle claim eligibility:
  // - Must have old tokens
  // - Project must have merkle root set (TODO: need to check project config)
  // - Not paused
  // For now, we assume merkle claims are not available
  // TODO: Fetch merkle root from project config and check if it's set
  const canClaimMerkle = false;

  // Refund eligibility:
  // - Migration must have failed (TODO: need migrationFailed flag in LoadedProject)
  // - Must have MFT tokens (proof of participation)
  // For now, we assume refunds are not available
  // TODO: Add migrationFailed flag to LoadedProject type
  const canRefund = false;

  return {
    canClaimMft,
    canClaimMerkle,
    canRefund,
    hasOldTokens,
    hasMftTokens,
    mftBalance: balances.mft,
    oldTokenBalance: balances.oldToken,
  };
}

/**
 * Check project eligibility with simplified boolean results
 *
 * This is a convenience wrapper around `computeClaimEligibility` that provides
 * high-level boolean flags suitable for UI decision making.
 *
 * @param {Connection} connection - Solana RPC connection
 * @param {string} projectId - Project identifier
 * @param {PublicKey | null} user - User wallet public key (null for anonymous)
 * @param {CheckProjectEligibilityOptions} [options] - Options
 * @returns {Promise<ProjectEligibilitySummary>} High-level eligibility summary
 *
 * @example
 * ```typescript
 * import { checkProjectEligibility } from '@migratefun/sdk';
 *
 * const summary = await checkProjectEligibility(
 *   connection,
 *   'my-project',
 *   user
 * );
 *
 * if (summary.isMigrationActive) {
 *   console.log('Show migration UI');
 * } else if (summary.canClaimMft) {
 *   console.log('Show MFT claim UI');
 * } else if (summary.canClaimMerkle) {
 *   console.log('Show merkle claim UI');
 * } else if (summary.canRefund) {
 *   console.log('Show refund UI');
 * } else {
 *   console.log(summary.reason);
 * }
 * ```
 */
export async function checkProjectEligibility(
  connection: Connection,
  projectId: string,
  user: PublicKey | null,
  options: CheckProjectEligibilityOptions = {}
): Promise<ProjectEligibilitySummary> {
  const { network, skipCache = false } = options;

  // Load project to check phase
  const project = await loadProject(projectId, connection, {
    network,
    skipCache,
  });

  // Compute detailed eligibility
  const eligibility = await computeClaimEligibility(
    connection,
    projectId,
    user,
    { network, skipCache }
  );

  // Check if migration is active
  const isMigrationActive =
    project.phase === MigrationPhase.ActiveMigration &&
    !project.paused &&
    eligibility.hasOldTokens;

  // Check if project is expired
  const isExpired =
    project.phase === MigrationPhase.Finalized &&
    !eligibility.canClaimMft &&
    !eligibility.canClaimMerkle &&
    !eligibility.canRefund;

  // Determine reason if no actions available
  let reason: string | undefined;
  if (!isMigrationActive && !eligibility.canClaimMft && !eligibility.canClaimMerkle && !eligibility.canRefund) {
    if (project.paused) {
      reason = 'Project is paused';
    } else if (project.phase === MigrationPhase.Setup) {
      reason = 'Migration not started yet';
    } else if (project.phase === MigrationPhase.ActiveMigration && !eligibility.hasOldTokens) {
      reason = 'No old tokens to migrate';
    } else if (project.phase === MigrationPhase.GracePeriod && !eligibility.hasMftTokens) {
      reason = 'No MFT tokens to claim';
    } else if (isExpired) {
      reason = 'Project has expired - no claims available';
    } else {
      reason = 'No claim options available';
    }
  }

  return {
    isMigrationActive,
    canClaimMft: eligibility.canClaimMft,
    canClaimMerkle: eligibility.canClaimMerkle,
    canRefund: eligibility.canRefund,
    isExpired,
    reason,
  };
}

/**
 * Determine which claim type to show the user
 *
 * Returns the best available claim type in priority order:
 * 1. MFT claim (no penalty)
 * 2. Merkle claim (with penalty)
 * 3. Refund claim (failed migration)
 * 4. null (no claims available)
 *
 * @param {ClaimEligibility} eligibility - Claim eligibility from computeClaimEligibility
 * @returns {ClaimType} Best available claim type
 *
 * @example
 * ```typescript
 * import { computeClaimEligibility, determineClaimType } from '@migratefun/sdk';
 *
 * const eligibility = await computeClaimEligibility(connection, 'my-project', user);
 * const claimType = determineClaimType(eligibility);
 *
 * switch (claimType) {
 *   case 'mft':
 *     console.log('Show MFT claim UI');
 *     break;
 *   case 'merkle':
 *     console.log('Show merkle claim UI');
 *     break;
 *   case 'refund':
 *     console.log('Show refund UI');
 *     break;
 *   default:
 *     console.log('No claims available');
 * }
 * ```
 */
export function determineClaimType(eligibility: ClaimEligibility): ClaimType {
  // Priority order: MFT > Merkle > Refund
  if (eligibility.canClaimMft) {
    return 'mft';
  }
  if (eligibility.canClaimMerkle) {
    return 'merkle';
  }
  if (eligibility.canRefund) {
    return 'refund';
  }
  return null;
}

/**
 * Get redirect intent for routing logic
 *
 * Determines where the user should be redirected based on their eligibility.
 * Useful for automatic routing to the appropriate page.
 *
 * @param {ClaimEligibility} eligibility - Claim eligibility
 * @param {LoadedProject} project - Loaded project
 * @param {GetRedirectIntentOptions} [options] - Options
 * @returns {ProjectRedirectIntent} Redirect intent
 *
 * @example
 * ```typescript
 * import { computeClaimEligibility, loadProject, getRedirectIntent } from '@migratefun/sdk';
 *
 * const project = await loadProject('my-project', connection);
 * const eligibility = await computeClaimEligibility(connection, 'my-project', user);
 * const redirect = getRedirectIntent(eligibility, project);
 *
 * if (redirect.action === 'migrate') {
 *   router.push(redirect.targetRoute);
 * }
 * ```
 */
export function getRedirectIntent(
  eligibility: ClaimEligibility,
  project: LoadedProject,
  _options: GetRedirectIntentOptions = {}
): ProjectRedirectIntent {
  const projectIdStr = project.projectId.toBase58();

  // If migration is active and user has old tokens, redirect to migrate
  if (
    project.phase === MigrationPhase.ActiveMigration &&
    !project.paused &&
    eligibility.hasOldTokens
  ) {
    return {
      action: 'migrate',
      targetRoute: `/migrate/${projectIdStr}`,
    };
  }

  // Determine claim type and redirect accordingly
  const claimType = determineClaimType(eligibility);

  if (claimType === 'mft') {
    return {
      action: 'claim',
      targetRoute: `/claim/${projectIdStr}`,
    };
  }

  if (claimType === 'merkle') {
    return {
      action: 'claim',
      targetRoute: `/claim/${projectIdStr}`,
    };
  }

  if (claimType === 'refund') {
    return {
      action: 'refund',
      targetRoute: `/refund/${projectIdStr}`,
    };
  }

  // No actions available, just view the project
  return {
    action: 'view',
    targetRoute: `/project/${projectIdStr}`,
  };
}
