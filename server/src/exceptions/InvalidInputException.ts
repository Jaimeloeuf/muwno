/**
 * Throw Generic `InvalidInputException` if Service Layer encounters an invalid
 * input, e.g. such as trying to read some data of a negative range.
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
