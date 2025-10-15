/**
 * Test helpers and utilities
 */

import { PublicKey } from "@solana/web3.js";

// Well-known valid PublicKeys for testing
export const TEST_PROGRAM_ID = new PublicKey(
  "migK824DsBMp2eZXdhSBAWFS6PbvA6UN8DV15HfmstR",
);
export const TEST_PROJECT_ID = new PublicKey(
  "11111111111111111111111111111112",
); // System program
export const TEST_USER = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
); // Token program
export const TEST_MINT = new PublicKey(
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
); // USDC mint
export const TEST_MINT_2 = new PublicKey(
  "So11111111111111111111111111111111111111112",
); // Wrapped SOL
export const TEST_USER_2 = new PublicKey(
  "9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin",
); // Random valid key
export const TEST_PLATFORM_CONFIG = new PublicKey(
  "Config1111111111111111111111111111111111111",
); // Config program
