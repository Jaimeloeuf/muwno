import { sf } from "simpler-fetch";

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
const baseApiUrl =
  import.meta.env.MODE !== "production"
    ? "http://localhost:3000"
    : import.meta.env.VITE_API_URL;

// Configure API library base Urls
sf.addBase(API.vNeutral, baseApiUrl)
  .addBase(API.v1, `${baseApiUrl}/v1`)

  // Defaults to v1
  .setDefault(API.v1);
