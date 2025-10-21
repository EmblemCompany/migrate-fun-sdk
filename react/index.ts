/**
 * @migratefun/sdk/react
 * React hooks for migrate.fun SDK
 */

// React hooks exports - Single responsibility hooks
export * from './useLoadedProject';
export * from './useBalances';
export * from './useMigrate';
export * from './useEligibility';

// Export from useClaim (exclude WalletAdapter to avoid conflict with useMigrate)
export type {
  ClaimStatus,
  TransactionResult,
  UseClaimOptions,
  UseClaimReturn,
} from './useClaim';
export { useClaim } from './useClaim';
