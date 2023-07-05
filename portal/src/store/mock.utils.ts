/**
 * Utility for generating ISODateTime strings
 */
export const generateIsoDateTimeString = (differenceInMilliseconds = 0) =>
  new Date(new Date().getTime() + differenceInMilliseconds).toISOString();

/**
 * Utility for generating random strings to mock IDs
 */
export const generateRandomID = () =>
  (Math.random() + 1).toString(36).substring(2);
