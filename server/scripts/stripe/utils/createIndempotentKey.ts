/**
 * Utility function to create idempotency key with prefix for debugging.
 */
export const createIndempotentKey = (key: string) =>
  `cli-setup-idempotent-key:${key}`;
