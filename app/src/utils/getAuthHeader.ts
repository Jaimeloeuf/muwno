import { auth } from "./firebaseAuth";

/**
 * Get authentication header if user is authenticated.
 * Will not throw if user is unauthenticated,
 * it just returns `{ Authorization: 'Bearer undefined' }`
 */
export const getAuthHeader = async () => ({
  Authorization: `Bearer ${await auth.currentUser?.getIdToken()}`,
});
