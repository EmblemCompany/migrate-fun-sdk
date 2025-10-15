# Changelog

All notable changes to the @migratefun/sdk will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0-next.0] - 2025-10-15

### Added

#### Core SDK
- **Project Discovery**: `loadProject()` function to fetch complete project configuration
- **Balance Fetching**: `getBalances()` function for retrieving user token balances
- **Real-time Updates**: `watchBalances()` function for polling balance changes
- **Transaction Builders**: `buildMigrateTx()` and `buildClaimMftTx()` for transaction construction
- **PDA Derivations**: Complete set of PDA derivation functions for all program accounts
- **Error Handling**: Comprehensive error parsing and user-friendly messages
- **Caching System**: Built-in RPC request caching with configurable TTLs
- **Network Support**: Full devnet and mainnet-beta compatibility
- **IDL Resolution**: Support for both bundled and on-chain IDL sources

#### React Adapter
- **useLoadedProject**: React hook for project loading with automatic caching
- **useBalances**: React hook for real-time balance tracking with formatted display values
- **useMigrate**: React hook for migration transaction flow with status tracking
- **TypeScript Support**: Full type safety with comprehensive type definitions

#### Utilities
- **formatTokenAmount**: Convert token base units to human-readable format
- **parseTokenAmount**: Convert human-readable amounts to base units
- **isProjectPaused**: Check if migration project is paused
- **isProjectActive**: Check if migration project is in active phase

#### Documentation
- Comprehensive README with API reference
- JSDoc comments on all public APIs
- Next.js integration example
- Vite integration example
- Framework-specific guides (Next.js, Vite, React Native)
- Troubleshooting section with common issues

#### Build Configuration
- Dual-format output (ESM + CJS)
- TypeScript declarations (.d.ts)
- Tree-shakable exports
- Subpath exports for React adapter
- Source maps for debugging

### Technical Details

**Bundle Sizes:**
- Core SDK (ESM): 320 KB (~50 KB gzipped)
- React Adapter (ESM): 316 KB (~20 KB gzipped additional)
- TypeScript Declarations: 237 KB

**Dependencies:**
- Peer dependencies only (Anchor, Web3.js, SPL Token, React)
- Zero runtime dependencies
- Browser-safe with no Node.js built-ins

**Compatibility:**
- Node.js 18+
- Next.js 13+ (App Router)
- Vite 4+
- React 18+
- Modern browsers (Chrome, Firefox, Safari, Edge)

### Architecture

**Core Modules:**
- `src/program.ts` - Program ID resolution and IDL management
- `src/pdas.ts` - PDA derivations for all program accounts
- `src/types.ts` - TypeScript type definitions
- `src/balances.ts` - Balance fetching and watching
- `src/builders.ts` - Transaction building
- `src/errors.ts` - Error handling and normalization
- `src/utils/cache.ts` - RPC caching and throttling

**React Modules:**
- `react/useLoadedProject.ts` - Project loading hook
- `react/useBalances.ts` - Balance tracking hook
- `react/useMigrate.ts` - Migration execution hook

### Performance

**Caching Strategy:**
- Balance queries: 30-second TTL
- Metadata queries: 5-minute TTL
- Project configs: 1-hour TTL

**RPC Optimization:**
- Minimum 100ms throttling between calls
- Automatic request coalescing
- Batch-friendly design

### Security

- No private keys or sensitive data logged
- Input validation on all public APIs
- Decimal handling prevents rounding errors
- RPC URLs can be proxied via API routes

---

## [Unreleased]

### Planned Features

#### v0.2.0
- Merkle claim transaction builder (`buildMerkleClaimTx`)
- Merkle proof verification (`verifyMerkleProof`)
- Batch migration support
- Transaction simulation with detailed breakdown
- Fee estimation utilities

#### v0.3.0
- WebSocket subscriptions for real-time balance updates
- Transaction compression support (Solana v1.18+)
- Project statistics querying
- Event emission for analytics
- Plugin system for custom functionality

#### Future
- React Native full compatibility testing
- Vue.js adapter
- Svelte adapter
- CLI tools for project management
- Advanced error recovery strategies

---

## Version History

### Pre-release Versions

**0.1.0-next.0** (2025-10-15)
- Initial SDK implementation
- Core functionality complete
- React adapter included
- Documentation and examples
- Production-ready for early adopters

---

## Migration Guides

### From Demo Code to SDK

If you're migrating from the demo implementation to the SDK:

**Before (Demo Code):**
```typescript
import { executeMigration } from '@/lib/migration-contract';

await executeMigration(
  connection,
  wallet,
  projectId,
  amount,
  project
);
```

**After (SDK):**
```typescript
import { useMigrate } from '@migratefun/sdk/react';

const { migrate } = useMigrate(connection, wallet);
await migrate(projectId, amount, project);
```

**Benefits:**
- Automatic error handling
- Loading state management
- Type safety improvements
- Built-in caching
- Better RPC optimization

---

## Support

- **Documentation**: [README.md](./README.md)
- **Issues**: [GitHub Issues](https://github.com/EmblemCompany/migratefun/issues)
- **Discord**: [Join our community](https://discord.gg/migrate-fun)

---

**License**: MIT
