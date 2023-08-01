import { auth0 } from "../auth0";

import { resetAllPiniaStores } from "./resetAllPiniaStores";

/**
 * Clear local state, logout current user and redirect to landing page.
 * @function logout
 */
export async function logout(getConfirmation = true) {
  if (getConfirmation && !confirm("Logout?")) return;

  // Reset all the stores, so that no data is still kept in memory!
  resetAllPiniaStores();

  // Clear local storage mediums to prevent another user from signing
  // in and still being able to access data from the past user.
  localStorage.clear();
  sessionStorage.clear();

  // Run this last because this will redirect to a different page, so all other
  // JS logic must be ran first before this.
  await auth0.logout({ logoutParams: { returnTo: "https://thepmftool.com" } });
}
