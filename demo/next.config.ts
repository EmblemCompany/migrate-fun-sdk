import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  transpilePackages: ['@migratefun/sdk'],
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');

    // Ensure peer dependencies are resolved from the app's node_modules
    config.resolve.alias = {
      ...config.resolve.alias,
      '@solana/web3.js': path.resolve(__dirname, 'node_modules/@solana/web3.js'),
      '@solana/spl-token': path.resolve(__dirname, 'node_modules/@solana/spl-token'),
      '@coral-xyz/anchor': path.resolve(__dirname, 'node_modules/@coral-xyz/anchor'),
    };

    return config;
  },
};

export default nextConfig;
