# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is `@migratefun/sdk` - a production-ready TypeScript SDK for the migrate.fun token migration protocol on Solana. The SDK enables browser-safe integration of Solana token migration functionality in web applications (Next.js, Vite, React Native).

**Key characteristics:**
- Dual-format build (ESM + CommonJS) via tsup
- Browser-safe with zero Node.js dependencies in runtime code
- React hooks as optional peer dependency (`@migratefun/sdk/react`)
- Network-agnostic design (devnet/mainnet-beta)
- Built-in RPC throttling and caching for performance

## Development Commands

### Building
```bash
# Build both SDK and React adapter
yarn build

# Watch mode for development
yarn dev
```

### Testing
```bash
# Run all tests once
yarn test

# Watch mode for test-driven development
yarn test:watch

# Type checking
yarn typecheck
```

### Publishing
```bash
# Pre-publish validation (runs automatically before publish)
yarn prepublishOnly  # typecheck + test + build

# Publish next version (pre-release)
yarn publish:next

# Publish stable version
yarn publish:latest
```

### Demo App
```bash
# Run demo app (uses local SDK via file:..)
cd demo
npm install
npm run dev
```

## Architecture

### Module Structure

The SDK is split into two entry points with separate build targets:

1. **Core SDK** (`src/index.ts` → `dist/index.{js,cjs}`)
   - `core/program.ts` - IDL loading, Program instance creation, network resolution
   - `core/pdas.ts` - All PDA derivation functions (project config, vaults, user accounts)
   - `core/types.ts` - Core types and interfaces
   - `queries/balances.ts` - Balance fetching & watching
   - `queries/eligibility.ts` - Claim eligibility determination
   - `queries/projects.ts` - Project discovery & user migration records
   - `transactions/builders.ts` - Transaction builders (migrate, claim MFT, claim merkle, claim refund)
   - `utils/calculations.ts` - Token calculations, exchange rates, penalties
   - `utils/errors.ts` - Error handling and parsing
   - `utils/cache.ts` - RPC throttling and in-memory caching

2. **React Adapter** (`react/index.ts` → `dist/react/index.{js,cjs}`)
   - `useLoadedProject.ts` - Project metadata with caching
   - `useBalances.ts` - Real-time balance updates with polling
   - `useMigrate.ts` - Migration execution with status tracking
   - `useProjectSession.ts` - Unified hook combining project, balances, and eligibility
   - `useClaim.ts` - Unified claim hook for all claim types (MFT, merkle, refund)

### Critical Architecture Patterns

#### Network Resolution & IDL Management
The SDK uses a singleton pattern for IDL caching by network (`core/program.ts`):
- IDLs are bundled at build time from `idl/dev/` and `idl/mainnet/`
- `loadIdl()` maintains a `Map<Network, CachedIdl>` to avoid re-parsing
- `activeNetwork` tracks the current network globally
- `resolveNetwork()` checks env vars: `SOLANA_NETWORK` or `NEXT_PUBLIC_SOLANA_NETWORK`
- Program ID can be overridden via `MIGRATION_PROGRAM_OVERRIDE` env var

**Important:** The IDL includes a `normalizeIdlAccounts()` function (program.ts:47-86) that merges account type definitions from the `types` array into the `accounts` array. This is necessary because some Anchor versions separate these.

#### PDA Derivation Strategy
All PDAs use deterministic seeds defined in `core/pdas.ts`:
- Project-scoped PDAs: `getProjectConfigPda()`, `getOldTokenVaultPda()`, `getNewTokenVaultPda()`, `getMftMintPda()`
- User-scoped PDAs: `getUserMigrationPda(user, projectId)`
- Platform PDAs: `getPlatformConfigPda()`, `getRegistryPda()`
- Batch helper: `getProjectPdas(projectId)` derives all PDAs at once

**When building transactions:** Anchor 0.31.0 automatically derives PDAs from seeds if they're not explicitly passed. Only pass user wallet, token mints, ATAs, and token programs. Do NOT manually derive and pass vault PDAs unless the IDL requires it.

#### RPC Throttling & Caching (`utils/cache.ts`)
The SDK implements request coalescing to prevent rate limits:
- **Throttling:** `rpcThrottle.wait()` enforces minimum 100ms between RPC calls
- **Caching:** `sdkCache` with configurable TTLs:
  - `BALANCES: 30_000ms` (30 seconds)
  - `METADATA: 300_000ms` (5 minutes)
  - `PROJECT_CONFIG: 3_600_000ms` (1 hour)
- Cache keys: `createCacheKey(category, ...identifiers)`

**Usage pattern in queries/balances.ts:**
```typescript
// Check cache first
const cacheKey = createCacheKey('balances', projectId, user.toBase58(), network);
const cached = sdkCache.get(cacheKey);
if (cached) return cached;

// Throttle before RPC call
await rpcThrottle.wait();
const result = await connection.getBalance(user);

// Cache the result
sdkCache.set(cacheKey, result, CACHE_TTL.BALANCES);
```

#### Balance Watching Pattern
`watchBalances()` uses interval-based polling (not WebSocket subscriptions) for broad RPC compatibility:
- Default interval: 150ms (configurable)
- Loads project once, then polls balances
- Compares snapshots to detect changes before calling `onChange`
- Returns unsubscribe function for cleanup
- Handles project load failures gracefully with retry logic

**React hook implementation:** `useBalances` wraps `watchBalances()` and manages component lifecycle with `useEffect` cleanup.

#### Transaction Building Flow
All transaction builders (`buildMigrateTx()`, `buildClaimMftTx()`, `buildClaimMerkleTx()`, `buildClaimRefundTx()`) follow this pattern:

1. Validate project state (not paused, correct phase)
2. Validate amount (> 0, no overflow)
3. Create read-only AnchorProvider (no wallet needed for ix building)
4. Derive user ATAs for tokens
5. Build instruction with Anchor's `.methods.{methodName}(projectId, amount).accounts({...}).instruction()`
6. Add compute budget instructions if specified
7. Set recent blockhash and fee payer
8. Return transaction + metadata (accounts, expected amounts)

**Critical:** Use `new BN(amount.toString())` to convert bigint → BN for Anchor. Never use `Number()` which loses precision.

#### Error Handling Philosophy
All errors are normalized to `SdkError` with typed codes:
- `parseError()` in `utils/errors.ts` converts any error to SdkError
- Error codes: `PROJECT_PAUSED`, `INSUFFICIENT_BALANCE`, `RATE_LIMIT`, `RPC_ERROR`, etc.
- Each error includes user-friendly message, code, and originalError for debugging

**Pattern:**
```typescript
try {
  // SDK operation
} catch (error) {
  throw parseError(error); // Converts to SdkError
}
```

### React Hooks Architecture

#### Race Condition Handling in useProjectSession
The hook solves a specific race condition where balances arrive before project metadata (react/useProjectSession.ts:176-387):

1. `projectRef` stores the latest known LoadedProject (updated by separate effect or from watchBalances callback)
2. Raw balances are set immediately when received
3. Formatted balances are computed whenever both balances AND project are available
4. A backfill effect (lines 350-352) re-formats balances when project loads late
5. Concurrent fetch prevention via `isFetchingRef` flag (lines 236-240)
6. Timeout protection (30s) to prevent infinite loading states (lines 249-254)

**This prevents:** Temporary "Loading..." states when balances are ready but project is still loading.

#### useMigrate Status Tracking
The hook uses a state machine with these statuses:
- `idle` - No migration in progress
- `preparing` - Building transaction
- `signing` - Waiting for wallet signature
- `sending` - Transaction sent to network
- `confirming` - Waiting for confirmation
- `confirmed` - Migration complete
- `error` - Migration failed

**Callbacks:** `onSuccess`, `onError`, `onStatusChange` fire at appropriate transitions.

#### useClaim Unified Claim Hook
The `useClaim` hook provides a single interface for all claim types:
- `claimMft()` - Claim new tokens using MFT (no penalty)
- `claimMerkle()` - Late claim with merkle proof (with penalty)
- `claimRefund()` - Refund old tokens for failed migration
- All share the same status tracking and error handling
- Use with `useProjectSession` for automatic claim type detection

## Common Tasks

### Adding a New Transaction Builder

1. Define options and result interfaces in `transactions/builders.ts`
2. Create builder function following the pattern:
   ```typescript
   export async function buildMyTx(
     connection: Connection,
     user: PublicKey,
     projectId: string,
     // ... params
     project: LoadedProject,
     options: BuildMyTxOptions = {}
   ): Promise<BuildMyTxResult>
   ```
3. Validate inputs (project state, amounts)
4. Create read-only provider
5. Derive necessary ATAs
6. Build instruction with Anchor program
7. Create transaction with recent blockhash
8. Return transaction + metadata
9. Export from `src/index.ts`

### Adding a New React Hook

1. Create `react/useMyHook.ts`
2. Define options and return type interfaces
3. Implement with proper cleanup (unmount, cancellation)
4. Use refs for latest values to avoid stale closures
5. Export from `react/index.ts`
6. Add to tsup config `entry` if needed (usually auto-included)

### Testing Strategy

Tests live in `__tests__/` and use Vitest:
- Mock Connection and Program responses
- Test error cases (paused project, invalid amounts, rate limits)
- Test caching behavior
- Test bigint arithmetic edge cases

**Run specific test:**
```bash
yarn test __tests__/sdk.test.ts
```

### Building for a New Network

1. Add IDL JSON to `idl/{network}/` directory
2. Update `Network` type in `core/types.ts` if needed
3. Update `resolveNetwork()` in `core/program.ts` to handle new network name
4. Update `loadIdl()` to load the new IDL

## Type Safety Notes

- **Always use bigint for token amounts** - Never use Number() which loses precision above 9M tokens (9 decimals)
- **BN vs bigint:** Anchor uses BN, but SDK uses bigint. Convert with `new BN(amount.toString())`
- **PublicKey serialization:** Use `.toBase58()` for strings, `.toBuffer()` for seeds
- **Decimals:** Old token, new token, and MFT can have different decimals. Always pass project to functions that need to format amounts

## Browser Safety

The SDK is designed to work in all JavaScript environments:
- No Node.js-specific imports (fs, path, etc.)
- Env var access wrapped in `typeof process !== 'undefined'` checks (core/program.ts:105-107)
- No crypto polyfills required (uses Solana's built-in)
- Works in Next.js server components (SSR) and client components

## Demo App Integration

The demo app (`demo/`) shows production patterns:
- Next.js 15 App Router with `'use client'` directives
- Solana wallet adapter integration
- All hooks in use (`useLoadedProject`, `useBalances`, `useMigrate`, `useProjectSession`, `useClaim`)
- Local SDK via `"@migratefun/sdk": "file:.."` for instant updates during development

**To test local changes:**
1. Make changes in `src/` or `react/`
2. Run `yarn build` in SDK root
3. Demo app automatically picks up changes (no need to reinstall)

## Critical Implementation Notes

### Claim Eligibility System
The SDK supports three claim types (queries/eligibility.ts):
- **MFT Claim:** User has MFT balance > 0, best option (no penalty)
- **Merkle Claim:** User has migration record but missed migration window (with penalty)
- **Refund Claim:** Migration failed, user can recover old tokens

The `computeClaimEligibility()` function determines which claim type is available and populates `ClaimEligibility` with all necessary data.

### Transaction Calculation Precision
Token calculations use banker's rounding (round half to even) to prevent systematic bias (transactions/builders.ts:256-314):
- MFT calculation includes overflow protection for Solana u64 limits
- Penalty calculations account for basis points (10000 = 100%)
- Decimal adjustments handle token precision differences

### Cache Invalidation Strategy
The SDK does NOT auto-invalidate caches on transaction success. Client code should:
1. Manually call `sdkCache.delete(key)` after successful transactions
2. Use `refetch()` functions from hooks
3. Let TTL expire naturally for non-critical data

## Important Constraints

- **Anchor Version:** SDK is built for Anchor 0.31.0+ which auto-derives PDAs
- **Solana Web3.js:** Requires 1.95.4+ for modern Connection API
- **React (Optional):** Hooks require React 18+ if using `@migratefun/sdk/react`
- **Token Programs:** Supports both TOKEN_PROGRAM_ID and TOKEN_2022_PROGRAM_ID (project-specific)
