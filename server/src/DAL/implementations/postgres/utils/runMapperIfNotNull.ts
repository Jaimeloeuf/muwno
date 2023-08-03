/**
 * Utility function to handle null value bubble through, by only mapping the
 * value with the mapper function if it is not null or undefined. It returns
 * null if the value is either null or undefined.
 */
export const runMapperIfNotNull =
  <T, Q>(mapper: (data: T) => Q) =>
  (data: T | null | undefined): Q | null =>
    data === null || data === undefined ? null : mapper(data);
