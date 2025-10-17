"use client";

import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { useEffect, useMemo, useState } from "react";

// Import wallet adapter styles
import "@solana/wallet-adapter-react-ui/styles.css";

export function SolanaWalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Delay autoConnect until after client mount to avoid SSR/hydration races
  // that can leave the adapter in a weird state on hard reloads.
  const [autoConnectReady, setAutoConnectReady] = useState(false);
  useEffect(() => {
    setAutoConnectReady(true);
  }, []);

  // Get RPC endpoint from environment variables
  const endpoint = useMemo(() => {
    const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
    const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet";

    // Use custom RPC if provided, otherwise fall back to cluster API URL
    return rpcUrl || clusterApiUrl(network as "devnet" | "mainnet-beta");
  }, []);

  // Configure wallets
  const wallets = useMemo(
    () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
    [],
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={autoConnectReady}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
