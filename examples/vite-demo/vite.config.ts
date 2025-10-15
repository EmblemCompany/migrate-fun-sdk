import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      '@migratefun/sdk',
      '@coral-xyz/anchor',
      '@solana/web3.js',
      '@solana/spl-token',
    ],
  },
});
