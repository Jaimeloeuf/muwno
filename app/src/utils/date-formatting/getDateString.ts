import type { ISODateTimeString } from "@domain-model";

/**
 * Simple utility function to convert isoDateTimeString to localeDateString
 */
export const getDateString = (isoDateTimeString: ISODateTimeString) =>
  new Date(isoDateTimeString).toLocaleDateString();
