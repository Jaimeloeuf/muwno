/**
 * Export the list of identifiers for the different base Urls.
 */
export const API = {
  /** Neutral Version, where this is the raw baseApiUrl without any postfix versioning */
  vNeutral: "vn",

  /** Version 1 */
  v1: "v1",
};

/**
 * Create the standard base API Url,
 * since most of the different base Urls will be for postfix versioning.
 */
export const baseApiUrl =
  import.meta.env.MODE !== "production"
    ? "http://localhost:3000"
    : import.meta.env.VITE_API_URL;
