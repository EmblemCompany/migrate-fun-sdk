# Demo Refactoring Guide

How to refactor the 595-line demo into modular components for better maintainability.

## Current Structure (Monolith)
```
demo/app/page.tsx (595 lines) - Everything in one file
```

## Recommended Modular Structure

```
demo/
├── app/
│   ├── page.tsx                   # Main orchestration (~100 lines)
│   └── layout.tsx                  # Providers
├── components/
│   ├── WalletProvider.tsx         # ✅ Already exists
│   ├── LoadingStates.tsx          # ✅ Already exists
│   ├── ProjectLoader.tsx          # NEW: Project input & loading
│   ├── ProjectInfo.tsx            # NEW: Project details display
│   ├── BalancesDisplay.tsx        # NEW: Token balances
│   ├── MigrationForm.tsx          # NEW: Migration UI
│   └── ClaimInterface.tsx         # NEW: Claims UI
└── hooks/
    ├── useAutoRetry.ts             # NEW: Extract retry logic
    └── useComposedData.ts          # NEW: Data composition
```

## Step-by-Step Refactoring

### Step 1: Extract Project Loader Component

**Create `components/ProjectLoader.tsx`:**
```typescript
interface ProjectLoaderProps {
  projectId: string
  onProjectIdChange: (id: string) => void
  onRefresh: () => void
  isLoading: boolean
  error?: Error
  connectionStatus: 'connected' | 'connecting' | 'disconnected'
}

export function ProjectLoader({
  projectId,
  onProjectIdChange,
  onRefresh,
  isLoading,
  error,
  connectionStatus
}: ProjectLoaderProps) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">1. Load Project</h2>

      <div className="flex gap-3">
        <input
          type="text"
          value={projectId}
          onChange={(e) => onProjectIdChange(e.target.value.trim())}
          placeholder="Enter Project ID"
          className="flex-1 px-4 py-2 bg-gray-800"
        />
        <button
          onClick={onRefresh}
          disabled={isLoading || !projectId}
        >
          {isLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <ConnectionStatus status={connectionStatus} />

      {error && <ErrorDisplay error={error} onRetry={onRefresh} />}
    </div>
  )
}
```

### Step 2: Extract Balances Display

**Create `components/BalancesDisplay.tsx`:**
```typescript
interface BalancesDisplayProps {
  project: LoadedProject | null
  balances: FormattedBalances | null
  isLoading: boolean
  error?: Error
  walletConnected: boolean
}

export function BalancesDisplay({
  project,
  balances,
  isLoading,
  error,
  walletConnected
}: BalancesDisplayProps) {
  if (!project) return null

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">
        2. Project Info & Balances
      </h2>

      {/* Project metadata */}
      <ProjectInfo project={project} />

      {/* Balances */}
      {walletConnected ? (
        isLoading ? (
          <BalancesSkeleton />
        ) : balances ? (
          <BalancesList balances={balances} />
        ) : error ? (
          <ErrorDisplay error={error} />
        ) : null
      ) : (
        <p className="text-yellow-400">
          Connect wallet to view balances
        </p>
      )}
    </div>
  )
}
```

### Step 3: Extract Migration Form

**Create `components/MigrationForm.tsx`:**
```typescript
interface MigrationFormProps {
  project: LoadedProject
  availableBalance: string
  onMigrate: (amount: string) => Promise<void>
  isLoading: boolean
  status?: string
  error?: Error
  signature?: string
}

export function MigrationForm({
  project,
  availableBalance,
  onMigrate,
  isLoading,
  status,
  error,
  signature
}: MigrationFormProps) {
  const [amount, setAmount] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await onMigrate(amount)
    if (signature) setAmount('') // Clear on success
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">3. Migrate Tokens</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount to migrate"
          disabled={isLoading || project.paused}
        />

        <p className="text-xs text-gray-500">
          Available: {availableBalance} tokens
        </p>

        <button
          type="submit"
          disabled={isLoading || project.paused || !amount}
        >
          {isLoading ? status : `Migrate ${amount || '0'} Tokens`}
        </button>
      </form>

      {error && <ErrorMessage error={error} />}
      {signature && <SuccessMessage signature={signature} />}
    </div>
  )
}
```

### Step 4: Extract Claims Interface

**Create `components/ClaimInterface.tsx`:**
```typescript
interface ClaimInterfaceProps {
  eligibility: ClaimEligibility | null
  claimType: string | null
  onClaim: () => Promise<void>
  isLoading: boolean
  status?: string
  error?: Error
  signature?: string
}

export function ClaimInterface({
  eligibility,
  claimType,
  onClaim,
  isLoading,
  status,
  error,
  signature
}: ClaimInterfaceProps) {
  if (!eligibility || !claimType) return null

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">4. Claim Tokens</h2>

      <ClaimTypeInfo type={claimType} eligibility={eligibility} />

      <button
        onClick={onClaim}
        disabled={isLoading}
      >
        {isLoading ? status : `Claim ${claimType.toUpperCase()}`}
      </button>

      {error && <ErrorMessage error={error} />}
      {signature && <SuccessMessage signature={signature} />}
    </div>
  )
}
```

### Step 5: Extract Custom Hooks

**Create `hooks/useAutoRetry.ts`:**
```typescript
export function useAutoRetry(
  error: Error | null,
  refetch: () => void,
  maxRetries = 3
) {
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    if (!error || retryCount >= maxRetries) return

    const isRetriable =
      error.message.includes('timeout') ||
      error.message.includes('rate limit')

    if (!isRetriable) return

    const delay = 3000 * Math.pow(1.5, retryCount)
    const timer = setTimeout(() => {
      setRetryCount(prev => prev + 1)
      refetch()
    }, delay)

    return () => clearTimeout(timer)
  }, [error, retryCount, maxRetries, refetch])

  return { retryCount, resetRetry: () => setRetryCount(0) }
}
```

**Create `hooks/useComposedData.ts`:**
```typescript
export function useComposedData(
  projectId: string,
  connection: Connection,
  publicKey: PublicKey | null
) {
  // All the data fetching logic
  const project = useLoadedProject(projectId, connection)
  const balances = useBalances(projectId, publicKey, connection)
  const eligibility = useEligibility(projectId, publicKey, connection)

  // Composed refresh
  const refresh = useCallback(async () => {
    await Promise.all([
      project.refetch(),
      publicKey && balances.refetch(),
      publicKey && eligibility.refetch()
    ])
  }, [project, balances, eligibility, publicKey])

  return {
    project,
    balances,
    eligibility,
    refresh,
    isLoading: project.isLoading || balances.isLoading
  }
}
```

### Step 6: Simplified Main Page

**Update `app/page.tsx`:**
```typescript
export default function Home() {
  const { connection } = useConnection()
  const wallet = useWallet()
  const [projectId, setProjectId] = useState('')

  // Use composed data hook
  const { project, balances, eligibility, refresh } = useComposedData(
    projectId,
    connection,
    wallet.publicKey
  )

  // Use transaction hooks
  const migration = useMigrate(connection, wallet, {
    onSuccess: refresh
  })

  const claim = useClaim(connection, wallet, {
    onSuccess: refresh
  })

  return (
    <div className="min-h-screen p-8">
      <Header />

      <ProjectLoader
        projectId={projectId}
        onProjectIdChange={setProjectId}
        onRefresh={refresh}
        isLoading={project.isLoading}
        error={project.error}
        connectionStatus={wallet.connected ? 'connected' : 'disconnected'}
      />

      {project.data && (
        <>
          <BalancesDisplay
            project={project.data}
            balances={balances.formatted}
            isLoading={balances.isLoading}
            error={balances.error}
            walletConnected={!!wallet.publicKey}
          />

          {wallet.publicKey && (
            <MigrationForm
              project={project.data}
              availableBalance={balances.formatted?.oldToken || '0'}
              onMigrate={async (amount) => {
                const tokenAmount = parseTokenAmount(
                  parseFloat(amount),
                  project.data.oldTokenDecimals
                )
                await migration.migrate(projectId, tokenAmount, project.data)
              }}
              isLoading={migration.isLoading}
              status={migration.status}
              error={migration.error}
              signature={migration.signature}
            />
          )}

          {eligibility.claimType && (
            <ClaimInterface
              eligibility={eligibility.data}
              claimType={eligibility.claimType}
              onClaim={async () => {
                // Claim logic here
              }}
              isLoading={claim.isLoading}
              status={claim.status}
              error={claim.error}
              signature={claim.signature}
            />
          )}
        </>
      )}
    </div>
  )
}
```

## Benefits of Modularization

### Before (Monolith)
- 595 lines in one file
- Hard to test individual parts
- Difficult to reuse components
- Complex to maintain
- High cognitive load

### After (Modular)
- ~100 lines in main file
- 50-100 lines per component
- Testable units
- Reusable components
- Clear separation of concerns
- Lower cognitive load

## Testing Strategy

With modular components, testing becomes easier:

```typescript
// Easy to test individual components
describe('MigrationForm', () => {
  it('disables submit when project is paused', () => {
    const { getByRole } = render(
      <MigrationForm
        project={{ paused: true }}
        // ... other props
      />
    )
    expect(getByRole('button')).toBeDisabled()
  })
})

// Easy to test hooks
describe('useAutoRetry', () => {
  it('retries on timeout errors', () => {
    const refetch = jest.fn()
    renderHook(() => useAutoRetry(
      new Error('timeout'),
      refetch
    ))

    jest.runAllTimers()
    expect(refetch).toHaveBeenCalled()
  })
})
```

## Migration Path

1. **Start with hooks** - Extract logic first
2. **Create components** - One at a time
3. **Update main page** - Wire everything together
4. **Add tests** - Now that components are isolated
5. **Optimize** - Now that structure is clear

## Key Principles

1. **Single Responsibility** - Each component does one thing
2. **Props over State** - Let parent control state when possible
3. **Composition over Inheritance** - Use hooks and components
4. **Testability** - If it's hard to test, refactor it
5. **Progressive Enhancement** - Start simple, add complexity as needed