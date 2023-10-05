/**
 * Throw Generic ServiceException if Service Layer encounters an Error. This is
 * service level's `Internal Server Exception`, where the difference between
 * throwing this and `Error` is that this can be filtered and error message can
 * be returned to the API caller instead of an opaque error message.
 *
 * The exception filter for this should convert this to HTTP ServiceException.
 */
export class ServiceException extends Error {
  /**
   * Accepts an `optionalMessage` to override the default exception message.
   */
  constructor(optionalMessage?: string) {
    const message = optionalMessage ? optionalMessage : `Service Exception!`;

    super(message);
  }
}
