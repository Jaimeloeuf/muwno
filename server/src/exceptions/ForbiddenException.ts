/**
 * Throw Generic ForbiddenException if Service Layer encounters a forbidden
 * action / operation, usually due to the fact that the requestor of that
 * operation does not have authorization or sufficient permission to do so,
 * such as deleting other organisation's acc.
 *
 * The exception filter used should convert this to HTTP UnauthorizedException.
 */
export class ForbiddenException extends Error {
  /**
   * Accepts an `optionalMessage` to override the default exception message.
   */
  constructor(optionalMessage?: string) {
    const message = optionalMessage
      ? optionalMessage
      : `Forbidden/Unauthorized Service Request`;

    super(message);
  }
}
