# MigrateFun SDK Demo

A complete, production-ready demo application showcasing the `@migratefun/sdk` for Solana token migrations.

## Features

- ✅ Complete SDK integration with all React hooks
- ✅ Real-time balance watching
- ✅ Transaction status tracking
- ✅ Clean component architecture (refactored to 2 components)
- ✅ Network switching (devnet/mainnet)
- ✅ Comprehensive error handling
- ✅ TypeScript type safety

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment (Optional)

```bash
cp .env.example .env.local
# Edit .env.local with your settings
```

See [`ENV.md`](./ENV.md) for complete configuration guide.

### 3. Run the Demo

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Using the Demo

1. **Connect Wallet** - Click "Select Wallet" button
2. **Load Project** - Enter a migration project ID
3. **View Balances** - See your token balances in real-time
4. **Migrate Tokens** - Test the migration flow with a specified amount

### Finding Project IDs

Use the included utility script to find available projects on devnet:

```bash
node scripts/find-projects.js
```

This will list all migration projects and their IDs that you can use for testing.

## Development Workflow

This demo uses a local reference to the SDK via `"@migratefun/sdk": "file:.."` in package.json.

**When you modify the SDK:**

```bash
# 1. Rebuild the SDK (from SDK root)
cd ..
npm run build

# 2. Reinstall in demo (from demo directory)
cd demo
npm install
npm run dev
```

The demo automatically picks up changes from the parent SDK package.

## Project Structure

```
demo/
├── app/
│   ├── page.tsx              # Clean 21-line orchestration
│   ├── layout.tsx            # Root layout with wallet provider
│   └── globals.css           # Global styles
├── components/
│   ├── MigrationDemo.tsx     # Core SDK showcase (274 lines)
│   └── WalletProvider.tsx    # Wallet adapter configuration
├── scripts/
│   └── find-projects.js      # Utility to find devnet projects
├── public/                   # Static assets
├── package.json              # Local SDK reference
├── ENV.md                    # Environment configuration guide
└── QUICK_START.md            # Quick setup instructions
```

## SDK Hooks Demonstrated

### `useLoadedProject`
Loads project metadata with automatic caching.

### `useBalances`
Watches user balances in real-time with configurable polling.

### `useMigrate`
Executes migration transactions with comprehensive status tracking.

## Configuration

The demo supports environment-based configuration:

```bash
# Network selection
NEXT_PUBLIC_SOLANA_NETWORK=devnet          # or mainnet-beta

# RPC endpoint
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

# Optional default project
NEXT_PUBLIC_DEFAULT_PROJECT_ID=your-project-id
```

**Full configuration guide:** See [`ENV.md`](./ENV.md) for:
- RPC provider recommendations (Helius, Alchemy, QuickNode)
- Security best practices
- RPC proxy setup for Next.js
- Troubleshooting common issues

## Troubleshooting

### "Cannot find module '@migratefun/sdk'"

The SDK needs to be built first:

```bash
cd ..
npm run build
cd demo
npm install
```

### Wallet Not Connecting

- Install a Solana wallet extension (Phantom, Solflare)
- Ensure you're on the correct network (check `.env.local`)
- Check browser console for errors

### Rate Limiting Errors

Use a premium RPC provider (Helius, Alchemy) or set up an RPC proxy. See [`ENV.md`](./ENV.md) for details.

### Build Errors

If you encounter TypeScript or build errors after updating the SDK:

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Getting Test SOL

For devnet testing:
- Visit [https://faucet.solana.com](https://faucet.solana.com)
- Connect your wallet and request SOL airdrop
- You'll need ~0.1 SOL for testing migrations

## Additional Resources

- **SDK Documentation**: [`../README.md`](../README.md)
- **Simple Examples**: [`../examples/`](../examples/)
- **SDK Source**: [`../src/`](../src/)

## Tech Stack

- [Next.js 15](https://nextjs.org/) - React framework
- [Solana Wallet Adapter](https://github.com/solana-labs/wallet-adapter) - Wallet integration
- [@migratefun/sdk](../) - Migration SDK (local reference)
- [Tailwind CSS](https://tailwindcss.com/) - Styling

---

**Production-ready demo built with ❤️ by the migrate.fun team**
