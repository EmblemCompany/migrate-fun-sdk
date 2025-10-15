# Next.js SDK Demo

Minimal Next.js 15 application demonstrating @migratefun/sdk integration.

## Features

- React hooks for project loading and balance tracking
- Wallet adapter integration (Phantom, Solflare, Coinbase Wallet)
- Real-time balance updates
- Migration transaction execution
- Error handling with user-friendly messages

## Setup

1. Install dependencies:

```bash
yarn install
```

2. Create `.env.local`:

```bash
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PROJECT_ID=your-devnet-project-id
```

3. Run development server:

```bash
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Integration Points

This example demonstrates:

- `useLoadedProject` - Automatic project loading with caching
- `useBalances` - Real-time balance tracking
- `useMigrate` - Migration transaction flow
- Wallet connection handling
- Error state management
- Loading state indicators

## Code Structure

- `app/layout.tsx` - Wallet adapter providers
- `app/page.tsx` - Main migration interface
- `app/providers.tsx` - Client-side providers wrapper

## Learn More

- [@migratefun/sdk Documentation](../../README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Solana Wallet Adapter](https://github.com/anza-xyz/wallet-adapter)
