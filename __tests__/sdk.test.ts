import { describe, it, expect } from 'vitest';
import { PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
  getProjectConfigPda,
  getUserAta,
  getProjectPdas,
} from '../src/pdas';
import { formatTokenAmount, parseTokenAmount } from '../src/balances';
import { SdkError, SdkErrorCode, isSdkError } from '../src/types';

// Valid test values
const TEST_PROJECT_ID = 'test-project';
const TEST_USER = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
const TEST_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

describe('SDK Core Functionality', () => {
  describe('PDA Derivations', () => {
    it('should derive project config PDA deterministically', () => {
      const [pda1, bump1] = getProjectConfigPda(TEST_PROJECT_ID);
      const [pda2, bump2] = getProjectConfigPda(TEST_PROJECT_ID);

      expect(pda1.toString()).toBe(pda2.toString());
      expect(bump1).toBe(bump2);
      expect(bump1).toBeGreaterThanOrEqual(0);
      expect(bump1).toBeLessThanOrEqual(255);
    });

    it('should derive user ATA correctly', () => {
      const ata1 = getUserAta(TEST_USER, TEST_MINT, TOKEN_PROGRAM_ID);
      const ata2 = getUserAta(TEST_USER, TEST_MINT, TOKEN_PROGRAM_ID);

      expect(ata1.toString()).toBe(ata2.toString());
      expect(ata1).toBeInstanceOf(PublicKey);
    });

    it('should derive all project PDAs in batch', () => {
      const pdas = getProjectPdas(TEST_PROJECT_ID);

      expect(pdas.projectConfig).toBeInstanceOf(PublicKey);
      expect(pdas.oldTokenVault).toBeInstanceOf(PublicKey);
      expect(pdas.newTokenVault).toBeInstanceOf(PublicKey);
      expect(pdas.mftMint).toBeInstanceOf(PublicKey);

      // All PDAs should be unique
      const pdaStrings = Object.values(pdas).map((p) => p.toString());
      const uniquePdas = new Set(pdaStrings);
      expect(uniquePdas.size).toBe(pdaStrings.length);
    });
  });

  describe('Token Amount Formatting', () => {
    it('should format amounts correctly', () => {
      expect(formatTokenAmount(1000000n, 6)).toBe(1);
      expect(formatTokenAmount(1500000n, 6)).toBe(1.5);
      expect(formatTokenAmount(0n, 6)).toBe(0);
    });

    it('should parse amounts correctly', () => {
      expect(parseTokenAmount(1, 6)).toBe(1000000n);
      expect(parseTokenAmount(1.5, 6)).toBe(1500000n);
      expect(parseTokenAmount(0, 6)).toBe(0n);
    });

    it('should handle round-trip conversions', () => {
      const original = 1500000n;
      const formatted = formatTokenAmount(original, 6);
      const parsed = parseTokenAmount(formatted, 6);
      expect(parsed).toBe(original);
    });
  });

  describe('Error Handling', () => {
    it('should create SDK errors with correct properties', () => {
      const error = new SdkError(
        SdkErrorCode.INSUFFICIENT_BALANCE,
        'Not enough tokens'
      );

      expect(error).toBeInstanceOf(Error);
      expect(error.code).toBe(SdkErrorCode.INSUFFICIENT_BALANCE);
      expect(error.message).toBe('Not enough tokens');
    });

    it('should identify SDK errors correctly', () => {
      const sdkError = new SdkError(SdkErrorCode.PROJECT_PAUSED, 'Paused');
      const regularError = new Error('Regular');

      expect(isSdkError(sdkError)).toBe(true);
      expect(isSdkError(regularError)).toBe(false);
      expect(isSdkError(null)).toBe(false);
      expect(isSdkError(undefined)).toBe(false);
    });
  });

  describe('TypeScript Types', () => {
    it('should export all required error codes', () => {
      expect(SdkErrorCode.PROJECT_PAUSED).toBeDefined();
      expect(SdkErrorCode.INSUFFICIENT_BALANCE).toBeDefined();
      expect(SdkErrorCode.RPC_ERROR).toBeDefined();
      expect(SdkErrorCode.PROJECT_NOT_FOUND).toBeDefined();
      expect(SdkErrorCode.INVALID_AMOUNT).toBeDefined();
    });
  });
});
