import { reloadPage } from "../utils/reloadPage";

/**
 * Sets a timer to automatically call `reloadPage` after 24 hours, as a simple
 * mechanism to prevent version skewing if somehow the user keeps the app open
 * for a long time.
 */
setTimeout(reloadPage, 8.64e7);
