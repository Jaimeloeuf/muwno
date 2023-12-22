/**
 * Converts a unix second to ISO DateTime string.
 */
export const unixSecondsToIsoString = (time: number) =>
  new Date(time * 1000).toISOString();
