/**
 * Throw Generic InvalidOperationException if Service Layer encounters an
 * invalid operation, such as creating a resource that already exists.
 *
 * The exception filter used should convert this to HTTP bad request exception.
 */
export class InvalidOperationException extends Error {
  /**
   * Accepts an `optionalMessage` to override the default exception message.
   */
  constructor(optionalMessage?: string) {
    const message = optionalMessage
      ? optionalMessage
      : `Invalid Operation in Service`;

    super(message);
  }
}
