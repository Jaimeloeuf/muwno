/**
 * FF for Utility function to create idempotency key with prefix for debugging.
 */
export const createIndempotentKeyFF = (keyPrefix: string) => (key: string) =>
  `${keyPrefix}:${key}`;

export type CreateIndempotentKey = (key: string) => string;
