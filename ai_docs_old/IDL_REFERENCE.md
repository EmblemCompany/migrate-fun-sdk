# Hustle Migration SDK - IDL Reference

> **Essential documentation for building third-party migration portals and SDKs**

## 🎯 Purpose

This document covers **only the 4 instructions** needed to build a complete user-facing migration portal. All admin/platform functionality is excluded.

## 📦 What You Need

### Required Program Instructions (4 total)

| Instruction | Purpose | Priority |
|-------------|---------|----------|
| `migrate` | Old Token → MFT | ⭐ **CRITICAL** |
| `claim_with_mft` | MFT → New Token (no penalty) | ⭐ **CRITICAL** |
| `claim_with_merkle` | Late claims with penalty | 🔶 HIGH |
| `claim_refund` | Failed migration refunds | 🔶 HIGH |

### Required Query Operations

- `getProjectConfig()` - Fetch project details
- `getTokenBalances()` - User balance checking
- `getClaimEligibility()` - Determine available claim types


---

## 🔧 Core Instructions

### 1. `migrate` - Token Migration

**What it does**: Converts old tokens to MFT (Migration Finalization Tokens)

**Flow**: `Old Token → MFT`

**When to use**: During active migration period (`startTs` ≤ now < `endTs`)

#### Instruction Details

```typescript
{
  name: "migrate",
  discriminator: [155, 234, 231, 146, 236, 158, 162, 30],

  accounts: {
    user: PublicKey,              // ✅ Provide: User wallet (signer)
    projectConfig: PublicKey,     // ✅ Provide: Derived from findProjectConfigPDA(projectId)
    userOldTokenAta: PublicKey,   // ✅ Provide: getAssociatedTokenAddress(oldTokenMint, user)
    userMftAta: PublicKey,        // ✅ Provide: getAssociatedTokenAddress(mftMint, user)
    oldTokenMint: PublicKey,      // ✅ Provide: From project config
    mftMint: PublicKey,           // ✅ Provide: Derived from findMftMintPDA(projectId)
    oldTokenProgram: PublicKey,   // ✅ Provide: Only if different from TOKEN_PROGRAM_ID
    // ❌ DO NOT provide: oldTokenVault, userMigration (PDAs auto-derived by Anchor 0.31.0)
    // ❌ DO NOT provide: tokenProgram, associatedTokenProgram, systemProgram (auto-included)
  },

  args: {
    project_id: string,    // Project identifier (e.g., "bonk-migration")
    amount: u64            // Amount in token base units (with decimals applied)
  }
}
```

#### SDK Implementation

```typescript
async function buildMigrateTx(
  connection: Connection,
  user: PublicKey,
  projectId: string,
  amount: bigint,
  project: LoadedProject
): Promise<Transaction> {

  // 1. Validate project status
  if (project.isPaused) {
    throw new Error('Project is paused');
  }

  const now = Date.now() / 1000;
  if (now < project.startTs || now >= project.endTs) {
    throw new Error('Migration window closed');
  }

  // 2. Resolve accounts
  const oldTokenProgram = project.oldTokenProgram || TOKEN_PROGRAM_ID;

  const userOldTokenAta = getAssociatedTokenAddressSync(
    project.oldTokenMint,
    user,
    false,
    oldTokenProgram
  );

  const userMftAta = getAssociatedTokenAddressSync(
    project.mftMint,
    user,
    false,
    TOKEN_PROGRAM_ID
  );

  // 3. Build accounts object - CRITICAL: Only provide these
  const accounts = {
    user,
    projectConfig: project.pdas.projectConfig,
    userOldTokenAta,
    userMftAta,
    oldTokenMint: project.oldTokenMint,
    mftMint: project.mftMint,
    // Only include oldTokenProgram if different from standard
    ...(oldTokenProgram.toString() !== TOKEN_PROGRAM_ID.toString() && {
      oldTokenProgram
    })
  };

  // 4. Build transaction
  const instruction = await program.methods
    .migrate(projectId, new BN(amount.toString()))
    .accounts(accounts)
    .instruction();

  const transaction = new Transaction().add(instruction);

  const { blockhash } = await connection.getLatestBlockhash('confirmed');
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = user;

  return transaction;
}
```

#### Usage Example

```typescript
import { HustleMigrationClient } from '@migratefun/sdk';

const client = new HustleMigrationClient({
  connection,
  wallet,
  network: 'mainnet-beta'
});

// User wants to migrate 100.5 tokens
const userInput = 100.5;
const project = await client.getProjectConfig('my-project');

// Convert to base units
const amount = BigInt(
  Math.floor(userInput * 10 ** project.oldTokenDecimals)
);

// Execute migration
const result = await client.migrate({
  projectId: 'my-project',
  amount
});

console.log('Migration successful!');
console.log('TX:', result.signature);
console.log('MFT received:', result.mftReceived);
```

#### Common Issues

**❌ Error: "Invalid account data"**
- Cause: Manually providing PDA accounts (oldTokenVault, userMigration)
- Fix: Remove them - Anchor 0.31.0 derives PDAs automatically

**❌ Error: "Project is paused"**
- Cause: Project admin paused migrations
- Fix: Check `project.isPaused` before calling

**❌ Error: "Migration window not active"**
- Cause: Called before `startTs` or after `endTs`
- Fix: Check timestamps before migrating

---

### 2. `claim_with_mft` - MFT to New Token Claim

**What it does**: Burns MFT tokens to receive new tokens (1:1 ratio, no penalty)

**Flow**: `MFT → New Token`

**When to use**: After migration ends and admin enables claims (`claimsEnabled = true`)

#### Instruction Details

```typescript
{
  name: "claim_with_mft",
  discriminator: [232, 162, 178, 244, 170, 169, 199, 205],

  accounts: {
    user: PublicKey,              // ✅ Provide: User wallet (signer)
    projectConfig: PublicKey,     // ✅ Provide: Derived from findProjectConfigPDA(projectId)
    userMftAta: PublicKey,        // ✅ Provide: getAssociatedTokenAddress(mftMint, user)
    userNewTokenAta: PublicKey,   // ✅ Provide: getAssociatedTokenAddress(newTokenMint, user)
    newTokenMint: PublicKey,      // ✅ Provide: From project config
    mftMint: PublicKey,           // ✅ Provide: Derived from findMftMintPDA(projectId)
    newTokenProgram: PublicKey,   // ✅ Provide: Only if different from TOKEN_PROGRAM_ID
    // ❌ DO NOT provide: newTokenVault (PDA auto-derived)
    // ❌ DO NOT provide: tokenProgram, associatedTokenProgram, systemProgram
  },

  args: {
    project_id: string,    // Project identifier
    amount: u64            // MFT amount to burn (in base units)
  }
}
```

#### SDK Implementation

```typescript
async function buildClaimMftTx(
  connection: Connection,
  user: PublicKey,
  projectId: string,
  mftAmount: bigint,
  project: LoadedProject
): Promise<Transaction> {

  // 1. Validate claims are enabled
  if (!project.claimsEnabled) {
    throw new Error('Claims not enabled yet');
  }

  // 2. Resolve accounts
  const newTokenProgram = project.newTokenProgram || TOKEN_PROGRAM_ID;

  const userMftAta = getAssociatedTokenAddressSync(
    project.mftMint,
    user,
    false,
    TOKEN_PROGRAM_ID
  );

  const userNewTokenAta = getAssociatedTokenAddressSync(
    project.newTokenMint,
    user,
    false,
    newTokenProgram
  );

  // 3. Build accounts object
  const accounts = {
    user,
    projectConfig: project.pdas.projectConfig,
    userMftAta,
    userNewTokenAta,
    newTokenMint: project.newTokenMint,
    mftMint: project.mftMint,
    ...(newTokenProgram.toString() !== TOKEN_PROGRAM_ID.toString() && {
      newTokenProgram
    })
  };

  // 4. Build transaction
  const instruction = await program.methods
    .claimWithMft(projectId, new BN(mftAmount.toString()))
    .accounts(accounts)
    .instruction();

  const transaction = new Transaction().add(instruction);

  const { blockhash } = await connection.getLatestBlockhash('confirmed');
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = user;

  return transaction;
}
```

#### Usage Example

```typescript
// Check MFT balance
const balances = await client.getBalances({
  wallet: userPublicKey,
  projectId: 'my-project'
});

if (balances.mft === 0n) {
  console.log('No MFT tokens to claim');
  return;
}

// Claim all MFT
const result = await client.claimWithMft({
  projectId: 'my-project',
  mftAmount: balances.mft
});

console.log('Claim successful!');
console.log('TX:', result.signature);
console.log('New tokens received:', result.newTokensReceived);
```

#### Key Points

- ✅ **Best option for users** - No penalty, 1:1 exchange
- ✅ MFT has fixed 9 decimals
- ✅ New tokens adjusted for decimal differences automatically
- ⚠️ Requires admin to enable claims first (`claimsEnabled = true`)

---

### 3. `claim_with_merkle` - Late Claims with Penalty

**What it does**: Allows late claims for users who didn't migrate during active period (with haircut)

**Flow**: `Old Token → New Token (with penalty deduction)`

**When to use**: After migration ends, for users not in MFT system but in merkle snapshot

#### Instruction Details

```typescript
{
  name: "claim_with_merkle",
  discriminator: [42, 70, 30, 26, 71, 71, 164, 16],

  accounts: {
    user: PublicKey,              // ✅ Provide: User wallet (signer)
    config: PublicKey,            // ✅ Provide: Project config PDA
    userOldTokenAta: PublicKey,   // ✅ Provide: User's old token ATA
    userNewTokenAta: PublicKey,   // ✅ Provide: User's new token ATA
    oldTokenMint: PublicKey,      // ✅ Provide: Old token mint
    newTokenMint: PublicKey,      // ✅ Provide: New token mint
    oldTokenProgram: PublicKey,   // ✅ Provide: Old token program
    newTokenProgram: PublicKey,   // ✅ Provide: New token program
    // ❌ DO NOT provide: userClaim, oldTokenVault, newTokenVault (auto-derived)
  },

  args: {
    project_id: string,           // Project identifier
    amount: u64,                  // Claimable amount (from merkle tree)
    proof: Vec<[u8; 32]>          // Merkle proof (array of 32-byte hashes)
  }
}
```

#### SDK Implementation

```typescript
async function buildClaimMerkleTx(
  connection: Connection,
  user: PublicKey,
  projectId: string,
  amount: bigint,
  proof: Buffer[],
  project: LoadedProject
): Promise<Transaction> {

  // 1. Validate merkle root is set
  const hasMerkleRoot = project.merkleRoot.some(b => b !== 0);
  if (!hasMerkleRoot) {
    throw new Error('Merkle claims not enabled');
  }

  // 2. Check penalty
  const penaltyBps = project.lateClaimHaircutBps;
  if (penaltyBps === 10000) {
    throw new Error('Late claims disabled (100% penalty)');
  }

  const penalty = (amount * BigInt(penaltyBps)) / 10000n;
  const willReceive = amount - penalty;

  // 3. Resolve accounts
  const oldTokenProgram = project.oldTokenProgram || TOKEN_PROGRAM_ID;
  const newTokenProgram = project.newTokenProgram || TOKEN_PROGRAM_ID;

  const userOldTokenAta = getAssociatedTokenAddressSync(
    project.oldTokenMint,
    user,
    false,
    oldTokenProgram
  );

  const userNewTokenAta = getAssociatedTokenAddressSync(
    project.newTokenMint,
    user,
    false,
    newTokenProgram
  );

  // 4. Build accounts object
  const accounts = {
    user,
    config: project.pdas.projectConfig,
    userOldTokenAta,
    userNewTokenAta,
    oldTokenMint: project.oldTokenMint,
    newTokenMint: project.newTokenMint,
    oldTokenProgram,
    newTokenProgram,
  };

  // 5. Convert proof to correct format
  const proofArray = proof.map(p => Array.from(p));

  // 6. Build transaction
  const instruction = await program.methods
    .claimWithMerkle(projectId, new BN(amount.toString()), proofArray)
    .accounts(accounts)
    .instruction();

  const transaction = new Transaction().add(instruction);

  const { blockhash } = await connection.getLatestBlockhash('confirmed');
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = user;

  return transaction;
}
```

#### Merkle Proof Generation

```typescript
// Off-chain proof generation (typically done by project admin)
import { MerkleTree } from 'merkletreejs';
import { keccak256 } from 'js-sha3';

interface SnapshotEntry {
  address: string;
  amount: string;  // In base units
}

function generateMerkleTree(snapshot: SnapshotEntry[]): {
  root: Buffer;
  getProof: (address: string) => Buffer[];
} {
  // Create leaf nodes
  const leaves = snapshot.map(entry => {
    const leaf = Buffer.concat([
      new PublicKey(entry.address).toBuffer(),
      new BN(entry.amount).toArrayLike(Buffer, 'le', 8)
    ]);
    return keccak256(leaf);
  });

  // Build tree
  const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
  const root = tree.getRoot();

  return {
    root,
    getProof: (address: string) => {
      const entry = snapshot.find(e => e.address === address);
      if (!entry) throw new Error('Address not in snapshot');

      const leaf = Buffer.concat([
        new PublicKey(address).toBuffer(),
        new BN(entry.amount).toArrayLike(Buffer, 'le', 8)
      ]);

      const leafHash = keccak256(leaf);
      return tree.getProof(Buffer.from(leafHash)).map(p => p.data);
    }
  };
}
```

#### Usage Example

```typescript
// 1. Check if user is eligible for merkle claim
const eligibility = await client.getClaimEligibility({
  wallet: userPublicKey,
  projectId: 'my-project'
});

if (!eligibility.canClaimMerkle) {
  console.log('Not eligible for merkle claim');
  return;
}

// 2. Fetch merkle proof from API
const proofData = await fetch(
  `https://api.yourproject.com/merkle-proof/${userPublicKey.toBase58()}`
).then(r => r.json());

// proofData = { amount: "1000000000", proof: ["0x123...", "0x456..."] }

// 3. Execute claim
const result = await client.claimWithMerkle({
  projectId: 'my-project',
  amount: BigInt(proofData.amount),
  proof: proofData.proof.map(h => Buffer.from(h.slice(2), 'hex'))
});

console.log('Merkle claim successful!');
console.log('Received:', result.newTokensReceived);
console.log('Penalty:', result.penaltyAmount);
```

#### Key Points

- ⚠️ **Penalty applied** - `lateClaimHaircutBps` determines penalty (0-10000 bps)
- ⚠️ Each user can only claim once
- ⚠️ Proof must be valid and match merkle root on-chain
- 💡 Typically 10-50% penalty depending on project config

---

### 4. `claim_refund` - Failed Migration Refunds

**What it does**: Returns original tokens + proportional fees if migration failed

**Flow**: `MFT → Old Token + SOL/USDC refund`

**When to use**: When `migrationFailed = true` (protection targets not met)

#### Instruction Details

```typescript
{
  name: "claim_refund",
  discriminator: [15, 16, 30, 161, 255, 228, 97, 60],

  accounts: {
    user: PublicKey,              // ✅ Provide: User wallet (signer)
    // ❌ DO NOT provide: projectConfig, userMigration, quoteTokenVault, etc.
    // All derived automatically by Anchor 0.31.0
  },

  args: {
    project_id: string    // Project identifier only
  }
}
```

#### SDK Implementation

```typescript
async function buildClaimRefundTx(
  connection: Connection,
  user: PublicKey,
  projectId: string,
  project: LoadedProject
): Promise<Transaction> {

  // 1. Validate migration failed
  if (!project.migrationFailed) {
    throw new Error('Migration did not fail - refunds not available');
  }

  // 2. Check user has MFT (proof of participation)
  const balances = await getBalances(connection, user, project);
  if (balances.mft === 0n) {
    throw new Error('No MFT tokens - did not participate in migration');
  }

  // 3. Build transaction
  // CRITICAL: Only provide user and project_id
  // Anchor derives all other accounts automatically
  const instruction = await program.methods
    .claimRefund(projectId)
    .accounts({
      user
    })
    .instruction();

  const transaction = new Transaction().add(instruction);

  const { blockhash } = await connection.getLatestBlockhash('confirmed');
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = user;

  return transaction;
}
```

#### Usage Example

```typescript
// Check if refunds are available
const project = await client.getProjectConfig('my-project');

if (!project.migrationFailed) {
  console.log('Migration successful - no refunds available');
  return;
}

// Check user participated
const balances = await client.getBalances({
  wallet: userPublicKey,
  projectId: 'my-project'
});

if (balances.mft === 0n) {
  console.log('Did not participate in migration');
  return;
}

// Claim refund
const result = await client.claimRefund({
  projectId: 'my-project'
});

console.log('Refund successful!');
console.log('Old tokens returned:', result.oldTokensReturned);
console.log('SOL/fees returned:', result.feesReturned);
```

#### Key Points

- ✅ **Safety mechanism** - Protects users if migration fails
- ✅ Returns original tokens + proportional SOL/USDC fees
- ✅ Burns user's MFT tokens
- ⚠️ Only available if `migrationFailed = true`
- ⚠️ Can only claim once per user
- 💡 Typically happens if protection targets (liquidity, holder count) not met

---

## 🔍 Query Operations

### Project Configuration

```typescript
interface ProjectConfig {
  // Identity
  projectId: string;
  projectName: string;
  admin: PublicKey;

  // Token configuration
  oldTokenMint: PublicKey;
  newTokenMint: PublicKey;
  oldTokenDecimals: number;
  newTokenDecimals: number;
  mftDecimals: number;  // Always 9

  // Exchange rate (basis points: 10000 = 1:1)
  exchangeRateBasisPoints: number;

  // Timing
  startTs: number;  // Unix timestamp
  endTs: number;    // Unix timestamp

  // Penalties and fees
  lateClaimHaircutBps: number;  // 0-10000
  platformFeeBps: number;

  // Status flags
  isPaused: boolean;
  isInitialized: boolean;
  vaultsInitialized: boolean;
  claimsEnabled: boolean;
  migrationFailed: boolean;

  // Statistics
  totalMigrated: bigint;
  totalMftIssued: bigint;

  // Merkle
  merkleRoot: number[];  // 32 bytes

  // PDAs
  pdas: {
    projectConfig: PublicKey;
    mftMint: PublicKey;
    oldTokenVault: PublicKey;
    newTokenVault: PublicKey;
  };
}
```

### Load Project

```typescript
async function getProjectConfig(
  connection: Connection,
  projectId: string
): Promise<ProjectConfig> {

  // 1. Derive project config PDA
  const [projectConfigPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from('project_config'), Buffer.from(projectId)],
    PROGRAM_ID
  );

  // 2. Fetch account
  const provider = new AnchorProvider(connection, dummyWallet, {});
  const program = getProgram(provider);

  const rawConfig = await program.account.projectConfig.fetch(
    projectConfigPDA
  );

  // 3. Derive related PDAs
  const [mftMint] = PublicKey.findProgramAddressSync(
    [Buffer.from('mft_mint'), Buffer.from(projectId)],
    PROGRAM_ID
  );

  const [oldTokenVault] = PublicKey.findProgramAddressSync(
    [Buffer.from('old_token_vault'), Buffer.from(projectId)],
    PROGRAM_ID
  );

  const [newTokenVault] = PublicKey.findProgramAddressSync(
    [Buffer.from('new_token_vault'), Buffer.from(projectId)],
    PROGRAM_ID
  );

  // 4. Normalize and return
  return {
    ...rawConfig,
    pdas: {
      projectConfig: projectConfigPDA,
      mftMint,
      oldTokenVault,
      newTokenVault
    }
  };
}
```

### Get Token Balances

```typescript
interface TokenBalances {
  oldToken: bigint;
  newToken: bigint;
  mft: bigint;
  sol: bigint;
}

async function getTokenBalances(
  connection: Connection,
  wallet: PublicKey,
  project: ProjectConfig
): Promise<TokenBalances> {

  // 1. Get SOL balance
  const solBalance = await connection.getBalance(wallet);

  // 2. Get old token balance
  const oldTokenAta = getAssociatedTokenAddressSync(
    project.oldTokenMint,
    wallet,
    false,
    project.oldTokenProgram || TOKEN_PROGRAM_ID
  );

  let oldTokenBalance = 0n;
  try {
    const account = await connection.getTokenAccountBalance(oldTokenAta);
    oldTokenBalance = BigInt(account.value.amount);
  } catch {
    // ATA doesn't exist
  }

  // 3. Get new token balance
  const newTokenAta = getAssociatedTokenAddressSync(
    project.newTokenMint,
    wallet,
    false,
    project.newTokenProgram || TOKEN_PROGRAM_ID
  );

  let newTokenBalance = 0n;
  try {
    const account = await connection.getTokenAccountBalance(newTokenAta);
    newTokenBalance = BigInt(account.value.amount);
  } catch {
    // ATA doesn't exist
  }

  // 4. Get MFT balance
  const mftAta = getAssociatedTokenAddressSync(
    project.pdas.mftMint,
    wallet,
    false,
    TOKEN_PROGRAM_ID
  );

  let mftBalance = 0n;
  try {
    const account = await connection.getTokenAccountBalance(mftAta);
    mftBalance = BigInt(account.value.amount);
  } catch {
    // ATA doesn't exist
  }

  return {
    oldToken: oldTokenBalance,
    newToken: newTokenBalance,
    mft: mftBalance,
    sol: BigInt(solBalance)
  };
}
```

### Check Claim Eligibility

```typescript
interface ClaimEligibility {
  canMigrate: boolean;
  canClaimMft: boolean;
  canClaimMerkle: boolean;
  canRefund: boolean;
  reason?: string;
}

async function getClaimEligibility(
  connection: Connection,
  wallet: PublicKey,
  projectId: string
): Promise<ClaimEligibility> {

  const project = await getProjectConfig(connection, projectId);
  const balances = await getTokenBalances(connection, wallet, project);
  const now = Date.now() / 1000;

  // Check migration eligibility
  const canMigrate =
    !project.isPaused &&
    project.vaultsInitialized &&
    now >= project.startTs &&
    now < project.endTs &&
    balances.oldToken > 0n;

  // Check MFT claim eligibility
  const canClaimMft =
    project.claimsEnabled &&
    balances.mft > 0n;

  // Check merkle claim eligibility
  const hasMerkleRoot = project.merkleRoot.some(b => b !== 0);
  const canClaimMerkle =
    hasMerkleRoot &&
    project.lateClaimHaircutBps < 10000 &&
    balances.oldToken > 0n;

  // Check refund eligibility
  const canRefund =
    project.migrationFailed &&
    balances.mft > 0n;

  // Determine reason if nothing available
  let reason: string | undefined;
  if (!canMigrate && !canClaimMft && !canClaimMerkle && !canRefund) {
    if (project.isPaused) {
      reason = 'Project is paused';
    } else if (now < project.startTs) {
      reason = 'Migration not started yet';
    } else if (now >= project.endTs && !project.claimsEnabled) {
      reason = 'Migration ended, claims not enabled yet';
    } else if (balances.oldToken === 0n && balances.mft === 0n) {
      reason = 'No tokens to migrate or claim';
    } else {
      reason = 'No claim options available';
    }
  }

  return {
    canMigrate,
    canClaimMft,
    canClaimMerkle,
    canRefund,
    reason
  };
}
```

---

## 📐 PDA Derivation Reference

All PDAs use the same program ID and standard derivation:

```typescript
import { PublicKey } from '@solana/web3.js';

const PROGRAM_ID = new PublicKey('migK824DsBMp2eZXdhSBAWFS6PbvA6UN8DV15HfmstR');

// Project Config
function findProjectConfigPDA(projectId: string): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('project_config'), Buffer.from(projectId)],
    PROGRAM_ID
  );
}

// MFT Mint
function findMftMintPDA(projectId: string): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('mft_mint'), Buffer.from(projectId)],
    PROGRAM_ID
  );
}

// User Migration Record
function findUserMigrationPDA(
  user: PublicKey,
  projectId: string
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('user_migration'), Buffer.from(projectId), user.toBuffer()],
    PROGRAM_ID
  );
}

// Old Token Vault
function findOldTokenVaultPDA(projectId: string): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('old_token_vault'), Buffer.from(projectId)],
    PROGRAM_ID
  );
}

// New Token Vault
function findNewTokenVaultPDA(projectId: string): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('new_token_vault'), Buffer.from(projectId)],
    PROGRAM_ID
  );
}

// User Merkle Claim
function findUserMerkleClaimPDA(
  user: PublicKey,
  projectId: string
): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from('user_merkle_claim'), user.toBuffer(), Buffer.from(projectId)],
    PROGRAM_ID
  );
}
```

---

## 🎯 Complete Integration Example

### Minimal SDK Client

```typescript
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { AnchorProvider } from '@coral-xyz/anchor';

export class HustleMigrationClient {
  private connection: Connection;
  private wallet?: WalletAdapter;
  private program: Program<HustleMigration>;

  constructor(config: {
    connection: Connection;
    wallet?: WalletAdapter;
    network?: 'mainnet-beta' | 'devnet';
  }) {
    this.connection = config.connection;
    this.wallet = config.wallet;

    const provider = new AnchorProvider(
      this.connection,
      config.wallet || this.createDummyWallet(),
      { commitment: 'confirmed' }
    );

    this.program = getProgram(provider, { network: config.network });
  }

  // ===== Core Methods =====

  async migrate(params: {
    projectId: string;
    amount: bigint;
  }): Promise<{ signature: string; mftReceived: bigint }> {
    if (!this.wallet) throw new Error('Wallet required');

    const project = await this.getProjectConfig(params.projectId);
    const tx = await buildMigrateTx(
      this.connection,
      this.wallet.publicKey!,
      params.projectId,
      params.amount,
      project
    );

    const signed = await this.wallet.signTransaction(tx);
    const signature = await this.connection.sendRawTransaction(
      signed.serialize()
    );

    await this.connection.confirmTransaction(signature, 'confirmed');

    const mftReceived = this.calculateMftAmount(
      params.amount,
      project.exchangeRateBasisPoints,
      project.oldTokenDecimals
    );

    return { signature, mftReceived };
  }

  async claimWithMft(params: {
    projectId: string;
    mftAmount: bigint;
  }): Promise<{ signature: string; newTokensReceived: bigint }> {
    if (!this.wallet) throw new Error('Wallet required');

    const project = await this.getProjectConfig(params.projectId);
    const tx = await buildClaimMftTx(
      this.connection,
      this.wallet.publicKey!,
      params.projectId,
      params.mftAmount,
      project
    );

    const signed = await this.wallet.signTransaction(tx);
    const signature = await this.connection.sendRawTransaction(
      signed.serialize()
    );

    await this.connection.confirmTransaction(signature, 'confirmed');

    const newTokensReceived = this.adjustForDecimals(
      params.mftAmount,
      project.mftDecimals,
      project.newTokenDecimals
    );

    return { signature, newTokensReceived };
  }

  async claimWithMerkle(params: {
    projectId: string;
    amount: bigint;
    proof: Buffer[];
  }): Promise<{ signature: string; newTokensReceived: bigint; penaltyAmount: bigint }> {
    if (!this.wallet) throw new Error('Wallet required');

    const project = await this.getProjectConfig(params.projectId);
    const tx = await buildClaimMerkleTx(
      this.connection,
      this.wallet.publicKey!,
      params.projectId,
      params.amount,
      params.proof,
      project
    );

    const signed = await this.wallet.signTransaction(tx);
    const signature = await this.connection.sendRawTransaction(
      signed.serialize()
    );

    await this.connection.confirmTransaction(signature, 'confirmed');

    const penalty = (params.amount * BigInt(project.lateClaimHaircutBps)) / 10000n;
    const newTokensReceived = params.amount - penalty;

    return { signature, newTokensReceived, penaltyAmount: penalty };
  }

  async claimRefund(params: {
    projectId: string;
  }): Promise<{ signature: string; oldTokensReturned: bigint; feesReturned: bigint }> {
    if (!this.wallet) throw new Error('Wallet required');

    const project = await this.getProjectConfig(params.projectId);
    const tx = await buildClaimRefundTx(
      this.connection,
      this.wallet.publicKey!,
      params.projectId,
      project
    );

    const signed = await this.wallet.signTransaction(tx);
    const signature = await this.connection.sendRawTransaction(
      signed.serialize()
    );

    await this.connection.confirmTransaction(signature, 'confirmed');

    // Fetch actual amounts from transaction logs
    // (simplified for example)
    return {
      signature,
      oldTokensReturned: 0n,
      feesReturned: 0n
    };
  }

  // ===== Query Methods =====

  async getProjectConfig(projectId: string): Promise<ProjectConfig> {
    return getProjectConfig(this.connection, projectId);
  }

  async getBalances(params: {
    wallet: PublicKey;
    projectId: string;
  }): Promise<TokenBalances> {
    const project = await this.getProjectConfig(params.projectId);
    return getTokenBalances(this.connection, params.wallet, project);
  }

  async getClaimEligibility(params: {
    wallet: PublicKey;
    projectId: string;
  }): Promise<ClaimEligibility> {
    return getClaimEligibility(
      this.connection,
      params.wallet,
      params.projectId
    );
  }

  // ===== Utility Methods =====

  parseTokenAmount(amount: number, decimals: number): bigint {
    return BigInt(Math.floor(amount * 10 ** decimals));
  }

  formatTokenAmount(amount: bigint, decimals: number): string {
    const divisor = BigInt(10 ** decimals);
    const whole = amount / divisor;
    const remainder = amount % divisor;
    const fraction = Number(remainder) / 10 ** decimals;
    return (Number(whole) + fraction).toFixed(decimals);
  }

  private calculateMftAmount(
    oldAmount: bigint,
    exchangeRateBps: number,
    oldDecimals: number
  ): bigint {
    return (oldAmount * BigInt(exchangeRateBps)) / 10000n;
  }

  private adjustForDecimals(
    amount: bigint,
    fromDecimals: number,
    toDecimals: number
  ): bigint {
    if (fromDecimals === toDecimals) return amount;

    const diff = toDecimals - fromDecimals;
    return diff > 0
      ? amount * BigInt(10 ** diff)
      : amount / BigInt(10 ** Math.abs(diff));
  }

  private createDummyWallet() {
    return {
      publicKey: new PublicKey('11111111111111111111111111111111'),
      signTransaction: async () => {
        throw new Error('Read-only wallet');
      },
      signAllTransactions: async () => {
        throw new Error('Read-only wallet');
      }
    };
  }
}
```

### Usage Example

```typescript
import { Connection, clusterApiUrl } from '@solana/web3.js';
import { HustleMigrationClient } from './client';

// Initialize
const connection = new Connection(clusterApiUrl('mainnet-beta'));
const client = new HustleMigrationClient({
  connection,
  wallet: yourWalletAdapter,
  network: 'mainnet-beta'
});

// Example 1: Migrate tokens
async function migrateTokens() {
  try {
    // Check eligibility
    const eligibility = await client.getClaimEligibility({
      wallet: wallet.publicKey,
      projectId: 'bonk-migration'
    });

    if (!eligibility.canMigrate) {
      console.log('Cannot migrate:', eligibility.reason);
      return;
    }

    // Get balances
    const balances = await client.getBalances({
      wallet: wallet.publicKey,
      projectId: 'bonk-migration'
    });

    // Migrate all old tokens
    const result = await client.migrate({
      projectId: 'bonk-migration',
      amount: balances.oldToken
    });

    console.log('Migration successful!');
    console.log('TX:', result.signature);
    console.log('MFT received:', client.formatTokenAmount(result.mftReceived, 9));
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Example 2: Claim with MFT
async function claimMft() {
  try {
    const balances = await client.getBalances({
      wallet: wallet.publicKey,
      projectId: 'bonk-migration'
    });

    if (balances.mft === 0n) {
      console.log('No MFT to claim');
      return;
    }

    const result = await client.claimWithMft({
      projectId: 'bonk-migration',
      mftAmount: balances.mft
    });

    console.log('Claim successful!');
    console.log('TX:', result.signature);
    console.log('New tokens:', client.formatTokenAmount(result.newTokensReceived, 9));
  } catch (error) {
    console.error('Claim failed:', error);
  }
}

// Example 3: Smart eligibility check
async function smartClaim() {
  const eligibility = await client.getClaimEligibility({
    wallet: wallet.publicKey,
    projectId: 'bonk-migration'
  });

  if (eligibility.canClaimMft) {
    // Best option - no penalty
    await claimMft();
  } else if (eligibility.canClaimMerkle) {
    // Late claim with penalty
    const proof = await fetchMerkleProof(wallet.publicKey.toBase58());
    await client.claimWithMerkle({
      projectId: 'bonk-migration',
      amount: proof.amount,
      proof: proof.proof
    });
  } else if (eligibility.canRefund) {
    // Migration failed
    await client.claimRefund({ projectId: 'bonk-migration' });
  } else {
    console.log('No claims available:', eligibility.reason);
  }
}
```

---

## 🚨 Common Errors & Solutions

### 1. "Invalid account data for instruction"

**Cause**: Manually providing PDA accounts that Anchor 0.31.0 derives automatically

**Solution**: Remove these from accounts object:
- `oldTokenVault`
- `newTokenVault`
- `userMigration`
- `userClaim`
- `systemProgram`
- `tokenProgram` (unless custom)
- `associatedTokenProgram`

### 2. "Project is paused"

**Cause**: Admin paused migrations

**Solution**: Check `project.isPaused` before calling instructions

### 3. "Migration window not active"

**Cause**: Called before `startTs` or after `endTs`

**Solution**:
```typescript
const now = Date.now() / 1000;
if (now < project.startTs || now >= project.endTs) {
  throw new Error('Migration window closed');
}
```

### 4. "Claims not enabled"

**Cause**: Admin hasn't called `enable_claims` yet

**Solution**: Check `project.claimsEnabled` before `claim_with_mft`

### 5. "Insufficient token balance"

**Cause**: User doesn't have enough tokens

**Solution**: Always check balances first:
```typescript
const balances = await client.getBalances({ wallet, projectId });
if (amount > balances.oldToken) {
  throw new Error('Insufficient balance');
}
```

### 6. "Invalid merkle proof"

**Cause**: Proof doesn't match on-chain merkle root

**Solution**:
- Ensure proof is generated from same snapshot as on-chain root
- Verify proof format (array of 32-byte buffers)
- Check address and amount match snapshot exactly

---

## ✅ Implementation Checklist

### Core Functionality
- [ ] Load program IDL for correct network
- [ ] Implement PDA derivation functions
- [ ] Build `migrate` transaction
- [ ] Build `claim_with_mft` transaction
- [ ] Build `claim_with_merkle` transaction
- [ ] Build `claim_refund` transaction

### Query Functions
- [ ] Fetch project configuration
- [ ] Get user token balances
- [ ] Check claim eligibility
- [ ] List all projects (optional)

### Error Handling
- [ ] Parse Anchor errors
- [ ] Handle transaction timeouts
- [ ] Retry logic for RPC failures
- [ ] User-friendly error messages

### Utilities
- [ ] Token amount parsing (decimals → base units)
- [ ] Token amount formatting (base units → decimals)
- [ ] Exchange rate calculations
- [ ] Penalty calculations

### Testing
- [ ] Test migration flow on devnet
- [ ] Test MFT claim flow
- [ ] Test merkle claim with proof
- [ ] Test refund flow
- [ ] Test error cases

### Documentation
- [ ] API reference
- [ ] Integration examples
- [ ] Troubleshooting guide
- [ ] Migration patterns

---

## 📦 Recommended Dependencies

```json
{
  "dependencies": {
    "@coral-xyz/anchor": "^0.31.0",
    "@solana/web3.js": "^1.95.0",
    "@solana/spl-token": "^0.4.0",
    "bn.js": "^5.2.1"
  },
  "devDependencies": {
    "@types/bn.js": "^5.1.5",
    "typescript": "^5.0.0"
  }
}
```

---

**Last Updated**: 2025-01-16
**For SDK Version**: 1.0.0
**Program**: Hustle Migration (Anchor 0.31.0)
