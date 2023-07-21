/**
 * Throw Generic `InvalidInputException` if Service Layer encounters an invalid
 * input, e.g. such as trying to read some data of a negative range.
 *
 * This should only be used for exceptions that are one off so that it does not
 * need a custom exception class and exception filter. Any service specific
 * exception that is used multiple times should use a custom class instead.
 *
 * The exception filter for this should ideally convert the exception into a
 * HTTP bad request exception.
 */
export class InvalidInputException extends Error {
  /**
   * Accepts an `optionalMessage` to override the default exception message.
   */
  constructor(optionalMessage?: string) {
    const message = optionalMessage
      ? optionalMessage
      : `Invalid Input in Service Layer`;

    super(message);
  }
}
