import { router, LoginRoute } from "../router";
import { auth } from "./firebaseAuth";

import { resetAllPiniaStores } from "./resetAllPiniaStores";

/**
 * Signout current user, clear local state and redirect to login view.
 * @function logout
 */
export async function logout(getConfirmation?: true) {
  if (getConfirmation && !confirm("Logout?")) return;

  // Signout current user
  await auth.signOut();

  // Reset all the stores, so that no data is still kept in memory!
  resetAllPiniaStores();

  // Clear local storage mediums to prevent another user from signing
  // in and still being able to access data from the past user.
  localStorage.clear();
  sessionStorage.clear();

  // Redirect to login view
  router.push({ name: LoginRoute.name });
}
