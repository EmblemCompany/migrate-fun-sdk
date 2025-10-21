# MigrateFun SDK Architecture Guide

## Table of Contents
1. [Overview](#overview)
2. [Current Architecture Issues](#current-architecture-issues)
3. [Best Practices from Successful Solana SDKs](#best-practices-from-successful-solana-sdks)
4. [Recommended Architecture](#recommended-architecture)
5. [Implementation Guidelines](#implementation-guidelines)
6. [Migration Path](#migration-path)
7. [Examples](#examples)

## Overview

This document outlines the architectural principles and best practices for the `@migratefun/sdk`, ensuring reliability, maintainability, and developer experience.

### Core Principles

1. **Separation of Concerns** - SDK handles business logic, apps handle UI/UX
2. **Framework Agnostic** - Core SDK works anywhere (Node, Browser, React Native)
3. **Composability** - Small, focused modules that combine well
4. **No Hidden Magic** - Explicit, predictable behavior
5. **Wallet Agnostic** - Works with any wallet solution

## Current Architecture Issues

### 1. The "God Hook" Problem

**Issue**: `useProjectSession` (747 lines) tries to do everything:
- Load project metadata
- Fetch user balances
- Determine claim eligibility
- Handle routing logic
- Manage retry strategies
- Format display values
- Track multiple loading states
- Handle wallet reconnection

**Problems This Creates**:
- **Race conditions** from complex state interactions
- **Hard to debug** - too many moving parts
- **Poor reusability** - all or nothing
- **Hidden complexity** - developers don't know what it's doing
- **Tight coupling** - changes affect everything

### 2. Wallet State Management

**Issue**: SDK tries to detect and handle wallet connection states

**Problems**:
- **Framework coupling** - assumes specific wallet adapter
- **Edge cases** - can't handle all wallet scenarios
- **Maintenance burden** - wallet adapters change frequently
- **Limiting** - apps may have custom wallet requirements

### 3. Overly Opinionated Patterns

**Issue**: SDK makes assumptions about how apps want to handle:
- Error recovery (automatic retries)
- Loading states (multiple concurrent states)
- Data refresh (automatic polling)
- State management (refs vs state)

## Best Practices from Successful Solana SDKs

### Metaplex JS SDK

```typescript
// Takes wallet as parameter, doesn't manage it
const nft = await metaplex
  .nfts()
  .findByMint({ mintAddress, loadJsonMetadata: true });

// Clear separation: SDK logic vs wallet management
const transaction = await metaplex
  .nfts()
  .builders()
  .create({ ... })
  .toTransaction();
```

### Anchor Framework

```typescript
// Provider is constructed by the app
const provider = new AnchorProvider(connection, wallet, {});

// SDK uses provider but doesn't manage wallet
const program = new Program(idl, programId, provider);
```

### SPL Token

```typescript
// Pure functions that take publicKey as parameter
await getAccount(connection, tokenAccount, commitment, programId);

// Transaction builders return instructions, not manage wallets
const ix = createTransferInstruction(source, destination, owner, amount);
```

### Key Lessons

1. **Always take wallet as parameter** - never manage internally
2. **Provide building blocks** - not monolithic solutions
3. **Return instructions/transactions** - let app handle signing
4. **Pure functions where possible** - easier to test and compose
5. **Thin framework adapters** - React hooks should wrap core logic

## Recommended Architecture

### Layer 1: Core SDK (Pure Functions)

```
@migratefun/sdk
├── core/
│   ├── program.ts       # Program initialization
│   ├── pdas.ts          # PDA derivation
│   └── types.ts         # Type definitions
├── queries/
│   ├── projects.ts      # Project data fetching
│   ├── balances.ts      # Balance queries
│   └── eligibility.ts   # Eligibility checks
├── transactions/
│   └── builders.ts      # Transaction builders
└── utils/
    ├── calculations.ts  # Token math
    ├── errors.ts        # Error handling
    └── cache.ts         # Optional caching
```

**Characteristics**:
- No React dependencies
- No wallet adapter dependencies
- Takes `Connection` and `PublicKey` as parameters
- Returns data or instructions
- Can be used in any JavaScript environment

### Layer 2: React Adapter (Thin Wrappers)

```
@migratefun/sdk/react
├── useProject.ts        # Load project (single responsibility)
├── useBalances.ts       # Load balances (single responsibility)
├── useEligibility.ts    # Check eligibility (single responsibility)
├── useMigrate.ts        # Migration transactions
└── useClaim.ts          # Claim transactions
```

**Characteristics**:
- Thin wrappers around core SDK functions
- Takes `PublicKey | null` as parameter
- Simple hooks doing ONE thing
- No wallet state management
- Composable by design

### Layer 3: Examples (Composition Patterns)

```
examples/
├── composition/
│   └── useProjectSession.ts  # Example of composing hooks
├── demo/
│   └── app.tsx               # Full demo app
└── patterns/
    ├── with-retry.ts         # Retry pattern
    └── with-caching.ts       # Caching pattern
```

## Implementation Guidelines

### ✅ DO: Accept Wallet as Parameter

```typescript
// GOOD: Takes publicKey as parameter
export function useBalances(
  projectId: string,
  user: PublicKey | null,
  connection: Connection,
  options?: BalanceOptions
): BalanceResult {
  // Implementation
}

// Usage in app
function MyComponent() {
  const { publicKey } = useWallet(); // App manages wallet
  const { connection } = useConnection();
  const balances = useBalances(projectId, publicKey, connection);
}
```

### ❌ DON'T: Manage Wallet State

```typescript
// BAD: SDK manages wallet state
export function useBalances(projectId: string): BalanceResult {
  const wallet = useWallet(); // ❌ SDK shouldn't know about wallet adapter
  const { publicKey } = wallet;
  // ...
}
```

### ✅ DO: Single Responsibility

```typescript
// GOOD: Each hook does one thing
const project = useProject(projectId, connection);
const balances = useBalances(projectId, publicKey, connection);
const eligibility = useEligibility(projectId, publicKey, connection);

// App composes as needed
const canMigrate = project && !project.paused && balances?.oldToken > 0n;
```

### ❌ DON'T: Kitchen Sink Hooks

```typescript
// BAD: One hook doing everything
const {
  project,
  balances,
  eligibility,
  isLoading,
  error,
  refetch,
  // ... 20 more properties
} = useEverything(projectId);
```

### ✅ DO: Return Simple States

```typescript
// GOOD: Clear, simple states
interface UseProjectReturn {
  project: LoadedProject | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
```

### ❌ DON'T: Complex State Management

```typescript
// BAD: Too many states to track
interface UseProjectSessionReturn {
  projectLoading: boolean;
  balancesLoading: boolean;
  claimLoading: boolean;
  isInitializing: boolean;
  hasError: boolean;
  projectError: Error | null;
  balancesError: Error | null;
  // ... continues
}
```

## Migration Path

### Phase 1: Create New Focused Hooks (Non-Breaking)

1. **Create `useEligibility` hook**
   ```typescript
   export function useEligibility(
     projectId: string,
     user: PublicKey | null,
     connection: Connection
   ): UseEligibilityReturn
   ```

2. **Update existing hooks** to take `PublicKey` as parameter
   - Already done: `useBalances`, `useProject`
   - Needs update: Remove wallet detection logic

### Phase 2: Move Complex Hooks to Examples

1. **Move `useProjectSession`** to `examples/composition/`
2. **Add deprecation notice** pointing to composition example
3. **Document migration path** for existing users

### Phase 3: Update Demo App

1. **Use individual hooks** instead of `useProjectSession`
2. **Show proper wallet handling** at app level
3. **Add comments** explaining patterns

### Phase 4: Documentation

1. **Update README** with new patterns
2. **Add migration guide** for v1 → v2
3. **Create examples** for common use cases

## Examples

### Example 1: Simple Balance Display

```typescript
import { useBalances } from '@migratefun/sdk/react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

function BalanceDisplay({ projectId }: { projectId: string }) {
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  const { formatted, isLoading, error } = useBalances(
    projectId,
    publicKey,
    connection
  );

  if (!publicKey) return <div>Connect wallet</div>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <p>Old Token: {formatted?.oldToken ?? '0'}</p>
      <p>New Token: {formatted?.newToken ?? '0'}</p>
    </div>
  );
}
```

### Example 2: Composed Migration Flow

```typescript
function MigrationFlow({ projectId }: { projectId: string }) {
  const { publicKey } = useWallet();
  const { connection } = useConnection();

  // Compose individual hooks
  const project = useProject(projectId, connection);
  const balances = useBalances(projectId, publicKey, connection);
  const eligibility = useEligibility(projectId, publicKey, connection);
  const { migrate } = useMigrate(connection, wallet);

  // App controls the logic
  const canMigrate = project && !project.paused &&
                     balances?.oldToken > 0n;

  const handleMigrate = async () => {
    if (!canMigrate) return;
    await migrate(projectId, amount, project);
  };

  // App controls the UI
  return (
    <div>
      {/* Render based on composed state */}
    </div>
  );
}
```

### Example 3: Custom Retry Logic (App-Controlled)

```typescript
function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  return fn().catch((error) => {
    if (maxRetries > 0) {
      return withRetry(fn, maxRetries - 1);
    }
    throw error;
  });
}

// App decides retry strategy
function MyComponent() {
  const handleRefresh = () => {
    withRetry(() => refetch(), 3);
  };
}
```

## Benefits of This Architecture

### 1. **Reliability**
- Simpler code = fewer bugs
- Single responsibility = easier to test
- No hidden state interactions

### 2. **Flexibility**
- Apps choose what to use
- Apps control composition
- Apps handle edge cases their way

### 3. **Maintainability**
- Small, focused modules
- Clear boundaries
- Easy to update individually

### 4. **Developer Experience**
- Predictable behavior
- Easy to understand
- Follows ecosystem patterns

### 5. **Performance**
- Only load what you need
- No unnecessary re-renders
- Efficient caching strategies

## Conclusion

By following these architectural principles, the MigrateFun SDK will be:

1. **More reliable** - Simpler hooks with single responsibilities
2. **More flexible** - Apps can compose functionality as needed
3. **More maintainable** - Smaller, focused modules
4. **More adoptable** - Follows Solana ecosystem patterns

The key insight: **SDKs should provide building blocks, not complete solutions**. Let applications decide how to compose those blocks based on their specific needs.