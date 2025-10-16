/**
 * Utility functions for token exchange rate and penalty calculations
 *
 * This module provides pure functions for calculating token amounts, penalties,
 * and exchange rates. All functions are side-effect free and operate on bigint
 * to preserve precision.
 *
 * @module calculations
 * @see IDL_REFERENCE.md:1133-1152 for calculation logic
 */

import { SdkError, SdkErrorCode } from './types';

/**
 * Calculate MFT amount from old tokens
 *
 * Uses banker's rounding (round half to even) to prevent systematic bias.
 * This is the same calculation used internally by buildMigrateTx.
 *
 * @param {bigint} oldTokenAmount - Amount of old tokens (in base units)
 * @param {bigint} exchangeRateBps - Exchange rate in basis points (10000 = 1:1, 20000 = 2:1)
 * @param {number} oldTokenDecimals - Old token decimals
 * @param {number} mftDecimals - MFT token decimals (always 9)
 * @returns {bigint} Expected MFT amount (in base units)
 * @throws {SdkError} If calculation would overflow u64 limit
 *
 * @example
 * ```typescript
 * import { calculateMftAmount } from '@migratefun/sdk';
 *
 * // 100 old tokens @ 1:1 exchange rate
 * const mftAmount = calculateMftAmount(
 *   100_000_000_000n,  // 100 tokens with 9 decimals
 *   10000n,            // 1:1 exchange rate
 *   9,                 // old token decimals
 *   9                  // MFT decimals
 * );
 *
 * console.log(mftAmount); // => 100_000_000_000n (100 MFT)
 * ```
 *
 * @example
 * ```typescript
 * // 100 old tokens @ 2:1 exchange rate (receive 200 MFT)
 * const mftAmount = calculateMftAmount(
 *   100_000_000_000n,  // 100 tokens
 *   20000n,            // 2:1 exchange rate
 *   9,
 *   9
 * );
 *
 * console.log(mftAmount); // => 200_000_000_000n (200 MFT)
 * ```
 */
export function calculateMftAmount(
  oldTokenAmount: bigint,
  exchangeRateBps: bigint,
  oldTokenDecimals: number,
  mftDecimals: number
): bigint {
  // Solana uses u64 for token amounts (max: 18,446,744,073,709,551,615)
  const MAX_U64 = BigInt('18446744073709551615');

  // Validate inputs are within bounds
  if (oldTokenAmount > MAX_U64) {
    throw new SdkError(
      SdkErrorCode.INVALID_AMOUNT,
      `Amount ${oldTokenAmount} exceeds maximum supported value (u64 limit)`
    );
  }

  // Exchange rate is in basis points (10000 = 1:1, 20000 = 2:1)
  // MFT amount = (old_amount * exchange_rate) / 10000
  const numerator = oldTokenAmount * exchangeRateBps;
  const denominator = 10000n;

  // Use banker's rounding (round half to even) for fairness
  const quotient = numerator / denominator;
  const remainder = numerator % denominator;

  // Round up if remainder >= half, using banker's rounding for exact half
  let mftAmount: bigint;
  if (remainder * 2n > denominator) {
    // Remainder > half: always round up
    mftAmount = quotient + 1n;
  } else if (remainder * 2n === denominator) {
    // Remainder == half: round to nearest even (banker's rounding)
    mftAmount = quotient % 2n === 0n ? quotient : quotient + 1n;
  } else {
    // Remainder < half: round down
    mftAmount = quotient;
  }

  // Adjust for decimal differences
  if (oldTokenDecimals !== mftDecimals) {
    const decimalDiff = mftDecimals - oldTokenDecimals;
    if (decimalDiff > 0) {
      const result = mftAmount * BigInt(10 ** decimalDiff);
      // Check for overflow after decimal adjustment
      if (result > MAX_U64) {
        throw new SdkError(
          SdkErrorCode.INVALID_AMOUNT,
          'Calculated MFT amount exceeds maximum supported value (u64 limit)'
        );
      }
      return result;
    } else {
      return mftAmount / BigInt(10 ** Math.abs(decimalDiff));
    }
  }

  return mftAmount;
}

/**
 * Calculate penalty amount for late claims
 *
 * Penalty is applied as a percentage reduction from the claim amount.
 *
 * @param {bigint} amount - Base amount before penalty (in token base units)
 * @param {number} penaltyBps - Penalty in basis points (1000 = 10%, 5000 = 50%)
 * @returns {bigint} Penalty amount (in token base units)
 *
 * @example
 * ```typescript
 * import { calculatePenaltyAmount } from '@migratefun/sdk';
 *
 * // 10% penalty on 100 tokens
 * const penalty = calculatePenaltyAmount(
 *   100_000_000_000n,  // 100 tokens (9 decimals)
 *   1000               // 10% penalty
 * );
 *
 * console.log(penalty); // => 10_000_000_000n (10 tokens)
 * ```
 *
 * @example
 * ```typescript
 * // 50% penalty on 100 tokens
 * const penalty = calculatePenaltyAmount(
 *   100_000_000_000n,
 *   5000
 * );
 *
 * console.log(penalty); // => 50_000_000_000n (50 tokens)
 * ```
 */
export function calculatePenaltyAmount(amount: bigint, penaltyBps: number): bigint {
  // Penalty = (amount * penaltyBps) / 10000
  return (amount * BigInt(penaltyBps)) / 10000n;
}

/**
 * Calculate amount after applying penalty
 *
 * Convenience function that calculates both penalty and final amount.
 *
 * @param {bigint} amount - Base amount before penalty (in token base units)
 * @param {number} penaltyBps - Penalty in basis points (1000 = 10%, 5000 = 50%)
 * @returns {{ penalty: bigint; amountAfterPenalty: bigint }} Penalty and final amount
 *
 * @example
 * ```typescript
 * import { calculateAmountAfterPenalty } from '@migratefun/sdk';
 *
 * const result = calculateAmountAfterPenalty(
 *   100_000_000_000n,  // 100 tokens
 *   1000               // 10% penalty
 * );
 *
 * console.log(result.penalty);            // => 10_000_000_000n (10 tokens)
 * console.log(result.amountAfterPenalty); // => 90_000_000_000n (90 tokens)
 * ```
 */
export function calculateAmountAfterPenalty(
  amount: bigint,
  penaltyBps: number
): { penalty: bigint; amountAfterPenalty: bigint } {
  const penalty = calculatePenaltyAmount(amount, penaltyBps);
  const amountAfterPenalty = amount - penalty;

  return {
    penalty,
    amountAfterPenalty,
  };
}

/**
 * Format exchange rate for display
 *
 * Converts basis points to human-readable ratio (e.g., "1:1", "1:2", "2:1")
 *
 * @param {bigint} exchangeRateBps - Exchange rate in basis points
 * @returns {string} Formatted exchange rate
 *
 * @example
 * ```typescript
 * import { formatExchangeRate } from '@migratefun/sdk';
 *
 * console.log(formatExchangeRate(10000n)); // => "1:1"
 * console.log(formatExchangeRate(20000n)); // => "2:1"
 * console.log(formatExchangeRate(5000n));  // => "1:2"
 * console.log(formatExchangeRate(15000n)); // => "1.5:1"
 * ```
 */
export function formatExchangeRate(exchangeRateBps: bigint): string {
  // Exchange rate is in basis points (10000 = 1:1)
  const rate = Number(exchangeRateBps) / 10000;

  if (rate === 1) {
    return '1:1';
  } else if (rate > 1) {
    // e.g., 2:1 (receive 2 MFT for 1 old token)
    if (Number.isInteger(rate)) {
      return `${rate}:1`;
    } else {
      return `${rate.toFixed(1)}:1`;
    }
  } else {
    // e.g., 1:2 (receive 0.5 MFT for 1 old token)
    const inverse = 1 / rate;
    if (Number.isInteger(inverse)) {
      return `1:${inverse}`;
    } else {
      return `1:${inverse.toFixed(1)}`;
    }
  }
}

/**
 * Adjust token amount for decimal differences
 *
 * Converts an amount from one token decimal to another.
 *
 * @param {bigint} amount - Amount in source token base units
 * @param {number} fromDecimals - Source token decimals
 * @param {number} toDecimals - Target token decimals
 * @returns {bigint} Amount in target token base units
 *
 * @example
 * ```typescript
 * import { adjustForDecimals } from '@migratefun/sdk';
 *
 * // Convert 100 tokens from 6 decimals to 9 decimals
 * const amount = adjustForDecimals(
 *   100_000_000n,  // 100 tokens with 6 decimals
 *   6,             // from 6 decimals
 *   9              // to 9 decimals
 * );
 *
 * console.log(amount); // => 100_000_000_000n (100 tokens with 9 decimals)
 * ```
 *
 * @example
 * ```typescript
 * // Convert 100 tokens from 9 decimals to 6 decimals
 * const amount = adjustForDecimals(
 *   100_000_000_000n,  // 100 tokens with 9 decimals
 *   9,                 // from 9 decimals
 *   6                  // to 6 decimals
 * );
 *
 * console.log(amount); // => 100_000_000n (100 tokens with 6 decimals)
 * ```
 */
export function adjustForDecimals(
  amount: bigint,
  fromDecimals: number,
  toDecimals: number
): bigint {
  if (fromDecimals === toDecimals) {
    return amount;
  }

  const decimalDiff = toDecimals - fromDecimals;
  if (decimalDiff > 0) {
    // Increasing decimals (e.g., 6 → 9): multiply
    return amount * BigInt(10 ** decimalDiff);
  } else {
    // Decreasing decimals (e.g., 9 → 6): divide
    return amount / BigInt(10 ** Math.abs(decimalDiff));
  }
}

/**
 * Format percentage from basis points
 *
 * Converts basis points to human-readable percentage (e.g., "10%", "2.5%")
 *
 * @param {number} bps - Basis points (100 = 1%, 1000 = 10%)
 * @returns {string} Formatted percentage
 *
 * @example
 * ```typescript
 * import { formatPercentage } from '@migratefun/sdk';
 *
 * console.log(formatPercentage(1000));  // => "10%"
 * console.log(formatPercentage(250));   // => "2.5%"
 * console.log(formatPercentage(10000)); // => "100%"
 * ```
 */
export function formatPercentage(bps: number): string {
  const percentage = bps / 100;

  if (Number.isInteger(percentage)) {
    return `${percentage}%`;
  } else {
    return `${percentage.toFixed(1)}%`;
  }
}
