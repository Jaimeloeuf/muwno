/**
 * FF for Utility function to create idempotency key with prefix for debugging.
 */
export const createIdempotentKeyFF = (keyPrefix: string) => (key: string) =>
  `${keyPrefix}:${key}`;

/**
 * A no-op function that conforms to the `CreateIdempotentKey` type when users
 * want to setup without using any indempotency key.
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const noOp = (key: string) => undefined;

export type CreateIdempotentKey = (key: string) => string | undefined;
