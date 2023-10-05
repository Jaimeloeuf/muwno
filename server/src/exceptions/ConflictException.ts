/**
 * Throw Generic ConflictException if Service Layer encounters a conflict, such
 * as creating a resource that already exists.
 *
 * The exception filter for this should ideally convert the error into a HTTP
 * Conflict Exception.
 */
export class ConflictException extends Error {
  /**
   * Accepts an `optionalMessage` to override the default exception message.
   */
  constructor(optionalMessage?: string) {
    const message = optionalMessage
      ? optionalMessage
      : `Conflicting data in Service`;

    super(message);
  }
}
