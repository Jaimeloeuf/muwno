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
export const baseApiUrl =
  import.meta.env.MODE !== "production"
    ? "http://localhost:3000"
    : import.meta.env.VITE_API_URL;

// This needs to be a plugin to ensure that this is always ran for every single
// time the app is mounted on the client instead of just on page load / app start
// since the context is shared across all SSR/SSG sites and it may run multiple
// times which will throw an error. So this ensures that it always only run once
// and only once on the client once it is hydrated!
export default defineNuxtPlugin({
  name: "simpler-fetch",
  enforce: "pre",

  hooks: {
    "app:mounted"() {
      // Configure API library base Urls
      sf.addBase(API.vNeutral, baseApiUrl)
        .addBase(API.v1, `${baseApiUrl}/v1`)

        // Defaults to v1
        .setDefault(API.v1);
    },
  },
});
