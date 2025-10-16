'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { MigrationDemo } from '@/components/MigrationDemo';

export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">MigrateFun SDK Demo</h1>
          <WalletMultiButton />
        </div>

        {/* Core SDK Demo */}
        <MigrationDemo />
      </main>
    </div>
  );
}
