/**
 * Throw Generic InvalidOperationException if Service Layer encounters an
 * invalid operation, such as creating a resource that already exists.
 *
 * This should only be used for errors that are one off so that it does not need
 * a custom Error class and exception filter. Any service specific error that
 * are used multiple times should ideally be a custom error class instead.
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
