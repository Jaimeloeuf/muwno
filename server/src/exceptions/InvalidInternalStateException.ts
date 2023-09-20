/**
 * Throw Generic InvalidInternalStateException if Service Layer encounters an
 * invalid internal state, e.g. if a User from data repo has no userID.
 *
 * The exception filter for this should ideally convert the error
 * into a HTTP InternalServerErrorException.
 */
export class InvalidInternalStateException extends Error {
  /**
   * Accepts an `optionalMessage` to override the default exception message.
   */
  constructor(optionalMessage?: string) {
    const message = optionalMessage
      ? optionalMessage
      : `Invalid Internal State in Service`;

    super(message);
  }
}
