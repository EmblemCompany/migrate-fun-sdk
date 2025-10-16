# @migratefun/sdk

Official TypeScript/JavaScript SDK for the [migrate.fun](https://migrate.fun) token migration protocol on Solana.

> **Production-ready SDK** for seamless token migration integration in your Solana applications

## Features

- **Complete claim support** - MFT claims, merkle claims, and refund claims with eligibility detection
- **Browser-safe** - Works in Next.js, Vite, React Native, and vanilla JavaScript
- **TypeScript-first** - Full type safety with comprehensive JSDoc documentation
- **Dual-format** - ESM and CommonJS support for maximum compatibility
- **Tree-shakable** - Optimized bundle sizes with proper exports
- **React hooks** - Optional React adapter for idiomatic integration including unified `useProjectSession` and `useClaim`
- **Network-agnostic** - Support for devnet and mainnet-beta
- **Built-in caching** - Intelligent RPC request optimization
- **Error handling** - User-friendly error messages with recovery actions

## Installation

```bash
# npm
npm install @migratefun/sdk

# yarn
yarn add @migratefun/sdk

# pnpm
pnpm add @migratefun/sdk
```

### Peer Dependencies

The SDK requires these peer dependencies (likely already in your project):

```bash
yarn add @coral-xyz/anchor@^0.31.0 @solana/web3.js@^1.95.4 @solana/spl-token@^0.4.9

# Optional: For React hooks
yarn add react@^18
```

## Live Demo App

A complete, production-ready demo application is included in the `demo/` directory. Use it to:
- Test the SDK locally during development
- See real-world implementation patterns
- Provide a working reference for your team

### Running the Demo

```bash
# From SDK root directory
cd demo

# Install dependencies
npm install

# Configure environment (optional)
cp .env.example .env.local
# Edit .env.local with your settings

# Start demo app
npm run dev
```

The demo automatically uses the local SDK via `file:..` reference, so any changes you make to the SDK are immediately available in the demo.

### Demo Features

- ✅ Complete SDK integration showcase
- ✅ All React hooks (useLoadedProject, useBalances, useMigrate, useProjectSession, useClaim)
- ✅ Real-time balance watching
- ✅ Transaction status tracking
- ✅ Claim eligibility detection
- ✅ Error handling examples
- ✅ Network switching (devnet/mainnet)
- ✅ Clean, simple component architecture

See [`demo/README.md`](./demo/README.md) for detailed documentation.

## Quick Start

### Vanilla JavaScript/TypeScript

```typescript
import { Connection, PublicKey } from '@solana/web3.js';
import { loadProject, getBalances, buildMigrateTx } from '@migratefun/sdk';

// Setup connection
const connection = new Connection('https://api.devnet.solana.com');
const projectId = new PublicKey('your-project-id');
const userWallet = new PublicKey('user-wallet-address');

// Load project metadata
const project = await loadProject(projectId, connection, {
  network: 'devnet'
});

console.log(`Migration project: ${project.projectId.toString()}`);
console.log(`Exchange ratio: 1 old token = ${project.exchangeRatio} new tokens`);

// Get user balances
const balances = await getBalances(projectId, userWallet, connection, {
  project // Optional: pass pre-loaded project to avoid re-fetching
});

console.log(`Old token balance: ${balances.oldToken.toString()}`);
console.log(`New token balance: ${balances.newToken.toString()}`);
console.log(`SOL balance: ${balances.sol.toString()}`);

// Build migration transaction
const amount = 1000000n; // Amount in token base units
const migrateTx = await buildMigrateTx({
  projectId,
  user: userWallet,
  amount,
  connection,
  project // Optional
});

// Sign and send transaction (with your wallet adapter)
const signature = await wallet.sendTransaction(migrateTx, connection);
console.log(`Migration successful: ${signature}`);
```

### React with Hooks

```tsx
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  useLoadedProject,
  useBalances,
  useMigrate,
  parseTokenAmount
} from '@migratefun/sdk/react';
import { PublicKey } from '@solana/web3.js';

function MigrationComponent() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const projectId = new PublicKey('your-project-id');

  // Load project with automatic caching
  const { project, isLoading: loadingProject } = useLoadedProject(
    projectId,
    connection,
    { network: 'devnet' }
  );

  // Watch balances in real-time
  const { balances, formatted, isLoading: loadingBalances } = useBalances(
    projectId,
    wallet.publicKey,
    connection,
    { project }
  );

  // Migration hook with status tracking
  const { migrate, isLoading, status, error } = useMigrate(
    connection,
    wallet,
    {
      onSuccess: (signature) => {
        console.log(`Migration complete: ${signature}`);
      },
      onError: (err) => {
        console.error('Migration failed:', err.message);
      }
    }
  );

  const handleMigrate = async () => {
    if (!project || !wallet.publicKey) return;

    const amount = parseTokenAmount(100, project.oldTokenDecimals);
    await migrate(projectId, amount, project);
  };

  if (loadingProject) return <div>Loading project...</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div>
      <h2>Token Migration</h2>
      <p>Exchange Rate: 1 : {project.exchangeRatio}</p>

      {loadingBalances ? (
        <div>Loading balances...</div>
      ) : (
        <div>
          <p>Old Token: {formatted?.oldToken.toFixed(2)}</p>
          <p>New Token: {formatted?.newToken.toFixed(2)}</p>
          <p>MFT: {formatted?.mft.toFixed(2)}</p>
          <p>SOL: {formatted?.sol.toFixed(4)}</p>
        </div>
      )}

      <button
        onClick={handleMigrate}
        disabled={isLoading || !wallet.connected}
      >
        {isLoading ? `${status}...` : 'Migrate 100 Tokens'}
      </button>

      {error && <div className="error">{error.message}</div>}
    </div>
  );
}
```

## Core API Reference

### Project Discovery

#### `loadProject(projectId, connection, options?)`

Fetches complete project configuration from the blockchain.

**Parameters:**
- `projectId: PublicKey` - The project's unique identifier
- `connection: Connection` - Solana RPC connection
- `options?: object`
  - `network?: 'devnet' | 'mainnet-beta'` - Override network detection
  - `idlSource?: 'bundle' | 'onchain'` - IDL source preference
  - `commitment?: Commitment` - Transaction confirmation level

**Returns:** `Promise<LoadedProject>`

```typescript
interface LoadedProject {
  projectId: PublicKey;
  authority: PublicKey;
  oldTokenMint: PublicKey;
  newTokenMint: PublicKey;
  mftMint: PublicKey;
  oldTokenDecimals: number;
  newTokenDecimals: number;
  mftDecimals: number;
  exchangeRatio: number;
  currentPhase: MigrationPhase;
  isPaused: boolean;
  // ... additional fields
}
```

**Example:**
```typescript
const project = await loadProject(
  new PublicKey('project-id'),
  connection,
  { network: 'devnet' }
);

console.log(`Paused: ${project.isPaused}`);
console.log(`Phase: ${project.currentPhase}`);
```

---

### Balance Fetching

#### `getBalances(projectId, user, connection, options?)`

Fetches all token balances for a user in a specific project.

**Parameters:**
- `projectId: PublicKey` - The project identifier
- `user: PublicKey` - User's wallet address
- `connection: Connection` - Solana RPC connection
- `options?: object`
  - `project?: LoadedProject` - Pre-loaded project (avoids re-fetch)
  - `network?: Network`
  - `commitment?: Commitment`

**Returns:** `Promise<BalanceSnapshot>`

```typescript
interface BalanceSnapshot {
  sol: bigint;           // Lamports
  oldToken: bigint;      // Base units
  newToken: bigint;      // Base units
  mft: bigint;           // Base units
  oldTokenProgram: PublicKey;
  newTokenProgram: PublicKey;
}
```

**Example:**
```typescript
const balances = await getBalances(
  projectId,
  wallet.publicKey,
  connection,
  { project } // Pass pre-loaded project
);

// Convert to human-readable format
const oldTokenFormatted = Number(balances.oldToken) / Math.pow(10, project.oldTokenDecimals);
console.log(`Old token balance: ${oldTokenFormatted}`);
```

#### `watchBalances(options)`

Subscribes to real-time balance updates with polling.

**Parameters:**
- `options: object`
  - `projectId: PublicKey`
  - `user: PublicKey`
  - `connection: Connection`
  - `onChange: (balances: BalanceSnapshot) => void` - Callback for updates
  - `onError?: (error: Error) => void` - Error handler
  - `intervalMs?: number` - Polling interval (default: 150ms)
  - `project?: LoadedProject`
  - `network?: Network`

**Returns:** `() => void` - Unsubscribe function

**Example:**
```typescript
const unsubscribe = watchBalances({
  projectId,
  user: wallet.publicKey,
  connection,
  onChange: (balances) => {
    console.log('Balances updated:', balances);
  },
  onError: (error) => {
    console.error('Balance watch error:', error);
  },
  intervalMs: 1000 // Poll every second
});

// Later: cleanup
unsubscribe();
```

---

### Transaction Builders

#### `buildMigrateTx(params)`

Builds an unsigned migration transaction.

**Parameters:**
- `params: object`
  - `projectId: PublicKey`
  - `user: PublicKey`
  - `amount: bigint` - Amount in base units (e.g., lamports for 9 decimals)
  - `connection: Connection`
  - `project?: LoadedProject` - Pre-loaded project
  - `network?: Network`
  - `computeBudget?: number` - Custom compute units

**Returns:** `Promise<Transaction>`

**Example:**
```typescript
import { parseTokenAmount } from '@migratefun/sdk';

// Parse human-readable amount to base units
const amount = parseTokenAmount(100.5, project.oldTokenDecimals);

const transaction = await buildMigrateTx({
  projectId,
  user: wallet.publicKey,
  amount,
  connection,
  project
});

// Sign and send
const signature = await wallet.sendTransaction(transaction, connection);
await connection.confirmTransaction(signature, 'confirmed');
```

#### `buildClaimMftTx(params)`

Builds a transaction to claim new tokens using MFT (Migration Future Tokens). No penalty applied.

**Parameters:**
- Same as `buildMigrateTx`

**Returns:** `Promise<Transaction>`

**Example:**
```typescript
const claimTx = await buildClaimMftTx({
  projectId,
  user: wallet.publicKey,
  amount: balances.mft, // Claim all MFT
  connection,
  project
});

const signature = await wallet.sendTransaction(claimTx, connection);
```

#### `buildClaimMerkleTx(connection, user, projectId, amount, proof, project, options?)`

Builds a transaction to claim tokens via merkle proof (late migration with penalty).

**Parameters:**
- `connection: Connection` - Solana RPC connection
- `user: PublicKey` - User wallet public key
- `projectId: string` - Project identifier
- `amount: bigint` - Amount of old tokens to claim (in base units)
- `proof: Buffer[]` - Merkle proof (array of 32-byte buffers)
- `project: LoadedProject` - Pre-loaded project configuration
- `options?: object` - Optional configuration

**Returns:** `Promise<BuildClaimMerkleTxResult>`

**Example:**
```typescript
import { buildClaimMerkleTx } from '@migratefun/sdk';

// Get merkle proof from API/cache
const proof = getMerkleProof(wallet.publicKey);

const { transaction, expectedNewTokens, penaltyAmount } = await buildClaimMerkleTx(
  connection,
  wallet.publicKey,
  projectId,
  oldTokenAmount,
  proof,
  project
);

console.log(`Penalty: ${penaltyAmount}, Expected: ${expectedNewTokens}`);

const signature = await wallet.sendTransaction(transaction, connection);
```

#### `buildClaimRefundTx(connection, user, projectId, project, options?)`

Builds a transaction to claim a refund for a failed migration.

**Parameters:**
- `connection: Connection` - Solana RPC connection
- `user: PublicKey` - User wallet public key
- `projectId: string` - Project identifier
- `project: LoadedProject` - Pre-loaded project configuration
- `options?: object` - Optional configuration

**Returns:** `Promise<BuildClaimRefundTxResult>`

**Example:**
```typescript
import { buildClaimRefundTx } from '@migratefun/sdk';

const { transaction, expectedRefundAmount } = await buildClaimRefundTx(
  connection,
  wallet.publicKey,
  projectId,
  project
);

console.log(`Refund amount: ${expectedRefundAmount}`);

const signature = await wallet.sendTransaction(transaction, connection);
```

---

### Utilities

#### `formatTokenAmount(amount, decimals)`

Converts base units to human-readable format.

```typescript
const formatted = formatTokenAmount(1000000n, 6); // "1.000000"
```

#### `parseTokenAmount(amount, decimals)`

Converts human-readable amount to base units.

```typescript
const baseUnits = parseTokenAmount(100.5, 9); // 100500000000n
```

#### `isProjectPaused(project)`

Checks if a project is paused.

```typescript
if (isProjectPaused(project)) {
  console.log('Migration is currently paused');
}
```

#### `isProjectActive(project)`

Checks if a project is in active migration phase.

```typescript
if (isProjectActive(project)) {
  console.log('Migration is active');
}
```

---

## React Hooks API

### `useLoadedProject(projectId, connection, options?)`

Loads project metadata with automatic caching.

**Returns:**
```typescript
{
  project: LoadedProject | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}
```

**Options:**
- `network?: Network`
- `enabled?: boolean` - Disable auto-fetch (default: true)
- `refetchInterval?: number` - Auto-refetch interval in ms
- `onSuccess?: (project: LoadedProject) => void`
- `onError?: (error: Error) => void`

**Example:**
```typescript
const { project, isLoading, error, refetch } = useLoadedProject(
  projectId,
  connection,
  {
    network: 'devnet',
    refetchInterval: 60000, // Refresh every minute
    onSuccess: (proj) => console.log('Project loaded:', proj.projectId)
  }
);

// Manual refetch
<button onClick={refetch}>Refresh Project</button>
```

---

### `useBalances(projectId, user, connection, options?)`

Watches user balances in real-time.

**Returns:**
```typescript
{
  balances: BalanceSnapshot | null;
  formatted: FormattedBalances | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface FormattedBalances {
  sol: number;
  oldToken: number;
  newToken: number;
  mft: number;
}
```

**Options:**
- `project?: LoadedProject` - Pre-loaded project
- `network?: Network`
- `enabled?: boolean`
- `refetchInterval?: number` - Polling interval (default: 150ms)
- `onBalanceChange?: (balances: BalanceSnapshot) => void`

**Example:**
```typescript
const { balances, formatted, isLoading } = useBalances(
  projectId,
  wallet.publicKey,
  connection,
  {
    project,
    refetchInterval: 1000,
    onBalanceChange: (bal) => {
      if (bal.oldToken > previousBalance) {
        toast.success('Tokens received!');
      }
    }
  }
);

<div>SOL: {formatted?.sol.toFixed(4)}</div>
```

---

### `useMigrate(connection, wallet, options?)`

Executes migration transactions with status tracking.

**Returns:**
```typescript
{
  migrate: (projectId: PublicKey, amount: bigint, project?: LoadedProject) => Promise<string>;
  isLoading: boolean;
  status: MigrateStatus;
  signature: string | null;
  error: Error | null;
}

type MigrateStatus =
  | 'idle'
  | 'preparing'
  | 'signing'
  | 'sending'
  | 'confirming'
  | 'confirmed'
  | 'error';
```

**Options:**
- `onSuccess?: (signature: string) => void`
- `onError?: (error: Error) => void`
- `onStatusChange?: (status: MigrateStatus) => void`
- `computeBudget?: number`

**Example:**
```typescript
const { migrate, isLoading, status, signature, error } = useMigrate(
  connection,
  wallet,
  {
    onSuccess: (sig) => {
      toast.success(`Migration successful! ${sig}`);
      router.push('/success');
    },
    onError: (err) => {
      if (err.code === 'INSUFFICIENT_BALANCE') {
        toast.error('Insufficient balance');
      }
    },
    onStatusChange: (status) => {
      console.log('Migration status:', status);
    }
  }
);

const handleMigrate = async () => {
  try {
    const amount = parseTokenAmount(100, project.oldTokenDecimals);
    const sig = await migrate(projectId, amount, project);
    console.log('Signature:', sig);
  } catch (err) {
    // Error already handled by onError callback
  }
};
```

---

### `useProjectSession(projectId, connection, user, options?)`

Unified hook combining project loading, balance watching, and claim eligibility detection.

**Returns:**
```typescript
{
  project: LoadedProject | null;
  balances: BalanceSnapshot | null;
  formatted: FormattedBalances | null;
  claimType: ClaimType; // 'mft' | 'merkle' | 'refund' | null
  claimEligibility: ClaimEligibility | null;
  redirect: ProjectRedirectIntent | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}
```

**Options:**
- `network?: Network`
- `refetchInterval?: number` - Auto-refetch interval (default: 5000ms)
- `enabled?: boolean`

**Example:**
```typescript
import { useProjectSession } from '@migratefun/sdk/react';

const {
  project,
  balances,
  formatted,
  claimType,
  isLoading
} = useProjectSession(projectId, connection, wallet.publicKey);

if (isLoading) return <div>Loading...</div>;

// Automatically determine which UI to show
switch (claimType) {
  case 'mft':
    return <MftClaimButton />;
  case 'merkle':
    return <MerkleClaimButton />;
  case 'refund':
    return <RefundClaimButton />;
  default:
    return <div>No claims available</div>;
}
```

---

### `useClaim(connection, wallet, options?)`

Unified hook for executing all types of claim transactions.

**Returns:**
```typescript
{
  claimMft: (projectId: string, amount: bigint, project: LoadedProject) => Promise<string>;
  claimMerkle: (projectId: string, amount: bigint, proof: Buffer[], project: LoadedProject) => Promise<string>;
  claimRefund: (projectId: string, project: LoadedProject) => Promise<string>;
  isLoading: boolean;
  status: ClaimStatus;
  error: Error | null;
  signature: string | null;
  reset: () => void;
}

type ClaimStatus =
  | 'idle'
  | 'preparing'
  | 'signing'
  | 'sending'
  | 'confirming'
  | 'confirmed'
  | 'error';
```

**Options:**
- `onSuccess?: (result: TransactionResult) => void`
- `onError?: (error: Error) => void`
- `onStatusChange?: (status: ClaimStatus) => void`

**Example:**
```typescript
import { useClaim, useProjectSession } from '@migratefun/sdk/react';

function ClaimButton() {
  const { project, balances, claimType } = useProjectSession(projectId, connection, wallet.publicKey);
  const { claimMft, claimMerkle, claimRefund, isLoading, status } = useClaim(
    connection,
    wallet,
    {
      onSuccess: (result) => {
        toast.success(`Claim successful! ${result.signature}`);
      }
    }
  );

  const handleClaim = async () => {
    if (!project || !balances) return;

    if (claimType === 'mft') {
      await claimMft(projectId, balances.mft, project);
    } else if (claimType === 'merkle') {
      const proof = await getMerkleProof(wallet.publicKey);
      await claimMerkle(projectId, balances.oldToken, proof, project);
    } else if (claimType === 'refund') {
      await claimRefund(projectId, project);
    }
  };

  return (
    <button onClick={handleClaim} disabled={isLoading}>
      {isLoading ? `${status}...` : 'Claim Tokens'}
    </button>
  );
}
```

---

## Error Handling

The SDK provides typed errors with user-friendly messages and recovery actions.

### Error Types

```typescript
enum SdkErrorCode {
  // Wallet errors
  WALLET_NOT_CONNECTED = 'WALLET_NOT_CONNECTED',
  WALLET_SIGNATURE_REJECTED = 'WALLET_SIGNATURE_REJECTED',

  // Network errors
  RPC_ERROR = 'RPC_ERROR',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  NETWORK_ERROR = 'NETWORK_ERROR',

  // Program errors
  PROJECT_PAUSED = 'PROJECT_PAUSED',
  MIGRATION_WINDOW_CLOSED = 'MIGRATION_WINDOW_CLOSED',
  INSUFFICIENT_BALANCE = 'INSUFFICIENT_BALANCE',
  INVALID_AMOUNT = 'INVALID_AMOUNT',
  UNAUTHORIZED = 'UNAUTHORIZED',

  // Other
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}
```

### Using Errors

```typescript
import { parseError, isSdkError, SdkErrorCode } from '@migratefun/sdk';

try {
  const tx = await buildMigrateTx({ ... });
  await wallet.sendTransaction(tx, connection);
} catch (err) {
  const sdkError = parseError(err);

  if (isSdkError(sdkError)) {
    console.error(sdkError.message); // User-friendly message
    console.log(sdkError.code);      // Error code
    console.log(sdkError.details);   // Additional context

    // Handle specific errors
    if (sdkError.code === SdkErrorCode.PROJECT_PAUSED) {
      alert('Migration is temporarily paused. Please try again later.');
    } else if (sdkError.code === SdkErrorCode.INSUFFICIENT_BALANCE) {
      alert('You do not have enough tokens to migrate this amount.');
    }
  }
}
```

### Error Details

Each error includes:
- `message` - User-friendly description
- `code` - Typed error code
- `details` - Additional context
- `isRetryable` - Whether the operation can be retried
- `originalError` - Original error for debugging

---

## Environment Configuration

The SDK respects these environment variables:

```bash
# Network selection (default: mainnet-beta)
SOLANA_NETWORK=devnet

# Override default program ID (optional)
MIGRATION_PROGRAM_OVERRIDE=your-program-id

# IDL source preference (optional)
MIGRATEFUN_IDL_SOURCE=bundle  # or 'onchain'
```

---

## Framework Integration

### Next.js (App Router)

The SDK works seamlessly with Next.js 13+ App Router. Use React hooks in Client Components:

```tsx
// app/migrate/page.tsx
'use client';

import { useLoadedProject, useBalances } from '@migratefun/sdk/react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

export default function MigratePage() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const { project } = useLoadedProject(projectId, connection);
  const { formatted } = useBalances(projectId, wallet.publicKey, connection);

  return <div>Old Token: {formatted?.oldToken}</div>;
}
```

**Important:** Always use `'use client'` directive when using React hooks.

**RPC Proxy Pattern (Recommended):**

Create an API route to proxy RPC requests and protect API keys:

```typescript
// app/api/rpc/route.ts
import { Connection } from '@solana/web3.js';

export async function POST(request: Request) {
  const { method, params } = await request.json();

  const connection = new Connection(
    process.env.HELIUS_RPC_URL!, // Server-side only
    'confirmed'
  );

  // Forward RPC call
  const result = await connection._rpcRequest(method, params);
  return Response.json(result);
}
```

Then use the proxy on client side:

```typescript
const connection = new Connection('/api/rpc');
```

---

### Vite

The SDK works out-of-the-box with Vite. No special configuration needed.

**Optional optimization** for faster builds:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    include: [
      '@migratefun/sdk',
      '@coral-xyz/anchor',
      '@solana/web3.js',
      '@solana/spl-token'
    ]
  }
});
```

---

### React Native (Experimental)

The SDK is browser-safe and should work in React Native with proper polyfills:

```bash
yarn add react-native-get-random-values
```

```typescript
// index.js (before other imports)
import 'react-native-get-random-values';
```

> Note: React Native support is experimental. Please report issues.

---

## Advanced Usage

### Custom RPC Connection

```typescript
import { Connection } from '@solana/web3.js';
import { loadProject } from '@migratefun/sdk';

const connection = new Connection(
  'https://your-custom-rpc-endpoint.com',
  {
    commitment: 'confirmed',
    confirmTransactionInitialTimeout: 60000
  }
);

const project = await loadProject(projectId, connection);
```

### Transaction Simulation

```typescript
import { simulateTransaction } from '@migratefun/sdk';

const transaction = await buildMigrateTx({ ... });

const simulation = await simulateTransaction(
  transaction,
  connection,
  wallet.publicKey
);

console.log('Logs:', simulation.logs);
console.log('Units consumed:', simulation.unitsConsumed);
console.log('Error:', simulation.err);
```

### Custom Compute Budget

```typescript
const transaction = await buildMigrateTx({
  projectId,
  user: wallet.publicKey,
  amount,
  connection,
  computeBudget: 400000 // Custom compute units
});
```

### Batch Operations

```typescript
import { Connection, Transaction } from '@solana/web3.js';
import { buildMigrateTx } from '@migratefun/sdk';

// Build multiple migration transactions
const tx1 = await buildMigrateTx({ projectId: project1, ... });
const tx2 = await buildMigrateTx({ projectId: project2, ... });

// Combine into single transaction (if compute units allow)
const batchTx = new Transaction()
  .add(...tx1.instructions)
  .add(...tx2.instructions);

await wallet.sendTransaction(batchTx, connection);
```

---

## Performance Optimization

### Caching Strategy

The SDK implements intelligent caching:

- **Balances**: 30-second TTL
- **Metadata**: 5-minute TTL
- **Project configs**: 1-hour TTL

Caching is automatic and requires no configuration.

### RPC Throttling

Built-in throttling prevents rate limiting:

- Minimum 100ms delay between RPC calls
- Automatic request coalescing
- Batch-friendly design

### Bundle Size

| Package | Size (gzipped) |
|---------|----------------|
| Core SDK | ~50KB |
| React Adapter | ~10KB |

Enable tree-shaking in your bundler for optimal sizes.

---

## Troubleshooting

### Common Issues

#### "Cannot find module '@migratefun/sdk/react'"

**Solution:** Make sure React is installed as a peer dependency.

```bash
yarn add react@^18
```

---

#### "Hydration mismatch" in Next.js

**Solution:** Use `'use client'` directive in components using hooks.

```tsx
'use client';

import { useLoadedProject } from '@migratefun/sdk/react';
```

---

#### "Insufficient funds" error

**Solution:** Check that the user has enough SOL for transaction fees and enough tokens for the migration amount.

```typescript
const balances = await getBalances(projectId, wallet.publicKey, connection);

if (balances.sol < 5000n) {
  console.error('Need at least 0.000005 SOL for fees');
}

if (balances.oldToken < amount) {
  console.error('Insufficient token balance');
}
```

---

#### Rate limiting errors

**Solution:** Use an RPC proxy (Next.js) or premium RPC provider (Helius, Alchemy).

```typescript
// Use API route proxy
const connection = new Connection('/api/rpc');
```

---

#### Transaction fails with "Project is paused"

**Solution:** Check project status before attempting migration.

```typescript
const project = await loadProject(projectId, connection);

if (project.isPaused) {
  alert('Migration is currently paused by the project authority.');
  return;
}
```

---

## Examples

### Full-Featured Demo

A complete demo application is available in the `demo/` directory:

- **Complete Demo App** - [`demo/`](./demo/) - Production-ready Next.js 15 app showcasing all SDK features with clean component architecture

### Simple Examples

Minimal examples are available in the `examples/` directory:

- **Next.js Example** - [`examples/nextjs-demo/`](./examples/nextjs-demo/) - Basic Next.js integration
- **Vite Example** - [`examples/vite-demo/`](./examples/vite-demo/) - Basic Vite integration

---

## TypeScript Support

The SDK is written in TypeScript and includes comprehensive type definitions.

```typescript
import type {
  LoadedProject,
  BalanceSnapshot,
  SdkError,
  Network
} from '@migratefun/sdk';

const handleProject = (project: LoadedProject) => {
  console.log(project.exchangeRatio); // Type-safe access
};
```

---

## Testing

Run SDK tests:

```bash
cd sdk
yarn test
```

Run tests in watch mode:

```bash
yarn test:watch
```

---

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

---

## License

MIT License - see [LICENSE](../LICENSE) for details.

---

## Support

- **Documentation**: [https://docs.migrate.fun](https://docs.migrate.fun)
- **Issues**: [GitHub Issues](https://github.com/EmblemCompany/migratefun/issues)
- **Discord**: [Join our community](https://discord.gg/migrate-fun)

---

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for version history.

---

## Acknowledgments

Built with:
- [Anchor](https://www.anchor-lang.com/) - Solana smart contract framework
- [Solana Web3.js](https://solana.com/docs/clients/javascript) - Solana JavaScript SDK
- [tsup](https://tsup.egoist.dev/) - TypeScript bundler

---

**Made with ❤️ by the migrate.fun team**
