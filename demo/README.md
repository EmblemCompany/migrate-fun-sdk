# MigrateFun SDK Demo

A simple, single-page Next.js application demonstrating all core features of the **@migratefun/sdk** for Solana token migrations.

## Quick Start

**1. Copy environment variables:**
```bash
cp .env.local.example .env.local
```

**2. Install dependencies:**
```bash
npm install
```

**3. Run the demo:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features Demonstrated

This demo showcases the complete token migration journey in a single page:

### 1. Wallet Connection
- Solana Wallet Adapter integration
- Support for Phantom, Solflare, and other wallets
- Auto-connect on page load

### 2. Project Info & Balances (`useProjectSession`)
- Load project metadata by ID
- Real-time balance updates (SOL, old token, new token, MFT)
- Auto-refresh every 3 seconds
- Claim eligibility detection
- Project phase and status display

### 3. Token Migration (`useMigrate`)
- Migrate old tokens for new tokens
- Amount validation
- Transaction status tracking (preparing → signing → sending → confirming → confirmed)
- Solana Explorer links
- Auto-refresh balances after success

### 4. Token Claims (`useClaim`)
- **Auto-detection** of available claim types:
  - **MFT Claim:** Claim new tokens using MFT (no penalty)
  - **Merkle Claim:** Late claim with merkle proof (with penalty)
  - **Refund Claim:** Get old tokens back if migration failed
- Penalty calculation display
- Transaction status tracking
- Solana Explorer links

## SDK Hooks Used

| Hook | Purpose | Key Features |
|------|---------|--------------|
| `useProjectSession` | Project metadata + balances + eligibility | Combines three data sources in one hook with 3s polling |
| `useMigrate` | Execute token migrations | Status tracking, callbacks, auto-refetch |
| `useClaim` | Execute all claim types | Auto-detection, MFT/Merkle/Refund support |

## Environment Variables

Create `.env.local` from `.env.local.example` and configure:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `NEXT_PUBLIC_SOLANA_NETWORK` | No | `devnet` | Network: `devnet` or `mainnet-beta` |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | No | Public RPC | Custom RPC endpoint (recommended for production) |
| `NEXT_PUBLIC_DEFAULT_PROJECT_ID` | No | - | Auto-load a project on page load |

**Example `.env.local`:**
```bash
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_DEFAULT_PROJECT_ID=your-project-id-here
```

## Testing Instructions

### Prerequisites
- Node.js v20.10.0+
- A Solana wallet (Phantom, Solflare, etc.)
- Devnet SOL (get from [https://faucet.solana.com](https://faucet.solana.com))
- A test project ID on devnet

### Testing Flow

1. **Load Project:**
   - Enter a valid project ID
   - Click "Refresh" or let it auto-load
   - Verify project details display correctly

2. **Connect Wallet:**
   - Click "Select Wallet" button (top right)
   - Connect with Phantom or Solflare
   - Verify balances display

3. **Test Migration:**
   - Ensure you have old tokens in your wallet
   - Enter an amount to migrate
   - Click "Migrate Tokens"
   - Approve transaction in wallet
   - Verify success message and Explorer link
   - Check balances auto-refresh

4. **Test Claim (if eligible):**
   - If claim section appears, verify claim type is correct
   - Click "Claim {Type} Tokens"
   - Approve transaction
   - Verify success and balance update

### Expected Behavior

- **Loading States:** Show "Loading..." while fetching
- **Error States:** Display clear error messages
- **Success States:** Show transaction signature with Explorer link
- **Auto-Refresh:** Balances update every 3 seconds
- **Disabled States:** Buttons disabled when project paused or during transactions

## Troubleshooting

### Common Issues

**Issue: "Project not found"**
- Verify the project ID is correct
- Check you're on the right network (devnet vs mainnet)
- Ensure the project exists on-chain

**Issue: "Wallet connection failed"**
- Ensure wallet extension is installed
- Try refreshing the page
- Try a different wallet
- Check browser console for errors

**Issue: "Transaction failed"**
- **Insufficient SOL:** Need ~0.01 SOL for transaction fees
- **Insufficient balance:** Check old token balance
- **Project paused:** Wait for project to unpause
- **Wrong phase:** Migration only works in active phase

**Issue: "RPC rate limiting"**
- Use a custom RPC endpoint (Helius, QuickNode)
- Add RPC URL to `.env.local`
- SDK has built-in throttling, but public RPCs are limited

**Issue: "Balances not updating"**
- Check wallet is connected
- Verify project ID is loaded
- Wait 3 seconds for polling interval
- Click "Refresh" button manually

**Issue: "Claim section not appearing"**
- You may not be eligible for claims yet
- Check if you've migrated tokens
- Verify you're in the correct project phase
- Some claims only available during grace period

### Debug Tips

1. **Check Browser Console:**
   - Open DevTools (F12)
   - Look for errors in Console tab
   - SDK logs transaction details

2. **Verify Network:**
   - Ensure wallet is on correct network (devnet/mainnet)
   - Check `.env.local` network setting matches wallet

3. **Check Solana Explorer:**
   - Search your wallet address
   - Verify token accounts exist
   - Check recent transactions

4. **RPC Issues:**
   - Try different RPC endpoint
   - Check RPC status at [status.solana.com](https://status.solana.com)
   - Consider using paid RPC for better reliability

## Project Structure

```
demo/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Main demo (all features in ~350 lines)
│   └── globals.css         # Tailwind imports
├── components/
│   └── WalletProvider.tsx  # Solana wallet adapter setup
├── .env.local.example      # Environment template
├── .env.local              # Your config (create from template)
├── package.json            # Dependencies
└── README.md               # This file
```

**Total custom code:** ~400 lines across 2 main files (`page.tsx` + `WalletProvider.tsx`)

## Architecture Notes

### Why Single Page?
- **Simplicity:** All code in one file makes it easy to understand
- **Copy-paste ready:** Take sections you need for your app
- **Complete example:** See full integration pattern

### Why `useProjectSession`?
- **Efficiency:** Combines project + balances + eligibility
- **Performance:** Built-in caching and polling
- **Simplicity:** One hook instead of three

### Why Auto-detect Claims?
- **Better UX:** Users don't need to know claim types
- **Error prevention:** Can't submit wrong claim type
- **Flexibility:** Handles all three claim types automatically

## Local SDK Development

This demo uses the SDK via `file:..` in `package.json`, so changes to the parent SDK are instantly available:

1. Make changes in `../src/` or `../react/`
2. Run `yarn build` in SDK root
3. Refresh demo (no reinstall needed)

## Next Steps

- **Production:** Add error boundaries and loading skeletons
- **Features:** Add transaction history, multi-project view
- **Testing:** Add E2E tests with Playwright
- **Styling:** Replace Tailwind with component library

## Links

- **SDK Repository:** [https://github.com/EmblemCompany/migrate-fun-sdk](https://github.com/EmblemCompany/migrate-fun-sdk)
- **Solana Docs:** [https://docs.solana.com](https://docs.solana.com)
- **Wallet Adapter:** [https://github.com/anza-xyz/wallet-adapter](https://github.com/anza-xyz/wallet-adapter)

## License

See parent SDK repository for license information.
