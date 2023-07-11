/**
 * Throw Generic Exception if Service Layer encounters a Forbidden action,
 * usually due to lack of authorization / permission to perform said action.
 */
export class ForbiddenException extends Error {
  /**
   * Accepts an `optionalMessage` to override the default exception message.
   */
  constructor(optionalMessage?: string) {
    const message = optionalMessage
      ? optionalMessage
      : `Forbidden Service Request`;

    super(message);
  }
}
