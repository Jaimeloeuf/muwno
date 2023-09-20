/**
 * Throw Generic NotFoundException if Service Layer cannot find a resource that
 * it expects to exists, or if the data that is requested is not found.
 *
 * This should only be used for errors that are one off so that it does not need
 * a custom Error class and exception filter. Any service specific error that
 * are used multiple times should ideally be a custom error class instead.
 *
 * The exception filter used should convert this to HTTP not found exception.
 */
export class NotFoundException extends Error {
  /**
   * Accepts an `optionalMessage` to override the default exception message.
   */
  constructor(optionalMessage?: string) {
    super(optionalMessage ? optionalMessage : `Data Not Found`);
  }
}
