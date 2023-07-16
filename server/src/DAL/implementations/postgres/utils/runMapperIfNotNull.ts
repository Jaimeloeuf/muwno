/**
 * Utility function to handle null value bubble through,
 * by only mapping the value with the mapper function
 * if it is not null.
 */
export const runMapperIfNotNull =
  <T, Q>(mapper: (data: T) => Q) =>
  (data: T | null): Q | null =>
    data === null ? null : mapper(data);
