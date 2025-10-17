/**
 * useAutoRetry Hook
 *
 * Handles automatic retry logic with exponential backoff.
 * Extracts the retry logic from the main component.
 */

import { useEffect, useState } from 'react';

interface UseAutoRetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  backoffMultiplier?: number;
}

export function useAutoRetry(
  error: Error | null | undefined,
  refetch: () => void | Promise<void>,
  options: UseAutoRetryOptions = {}
) {
  const {
    maxRetries = 3,
    baseDelay = 3000,
    backoffMultiplier = 1.5
  } = options;

  const [retryCount, setRetryCount] = useState(0);

  // Check if error is retriable
  const isRetriableError = (err: Error) => {
    const message = err.message.toLowerCase();
    return (
      message.includes('timeout') ||
      message.includes('connection') ||
      message.includes('rate limit') ||
      message.includes('network')
    );
  };

  useEffect(() => {
    if (!error || retryCount >= maxRetries) return;

    if (!isRetriableError(error)) {
      // Reset retry count for non-retriable errors
      setRetryCount(0);
      return;
    }

    const delay = baseDelay * Math.pow(backoffMultiplier, retryCount);
    console.log(
      `[Auto-retry] Retrying after error (attempt ${retryCount + 1}/${maxRetries}) in ${delay}ms...`
    );

    const timer = setTimeout(() => {
      setRetryCount(prev => prev + 1);
      refetch();
    }, delay);

    return () => clearTimeout(timer);
  }, [error, retryCount, maxRetries, baseDelay, backoffMultiplier, refetch]);

  const resetRetry = () => setRetryCount(0);

  return {
    retryCount,
    resetRetry,
    isRetrying: retryCount > 0 && retryCount < maxRetries,
    canRetry: retryCount < maxRetries,
    retriesRemaining: maxRetries - retryCount
  };
}