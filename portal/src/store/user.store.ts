import { defineStore } from "pinia";
import unixseconds from "unixseconds";
import { sf } from "simpler-fetch";
import { auth, getAuthHeader } from "../firebase";
import { validateCustomClaimsOnJWT } from "../utils/validateCustomClaimsOnJWT";
import { logout } from "../utils/logout";
import type { User, CreateOneUserDTO, ReadOneUserDTO } from "@domain-model";

/**
 * Type of this pinia store's state.
 */
interface State {
  /**
   * `User` entity object, access this using `getUser` method.
   */
  user: User | null;

  /**
   * Time of caching the `user` property used to prevent stale cache.
   */
  userCacheTime: number | null;
}

/**
 * Main store for user data
 */
export const useUser = defineStore("user", {
  state: (): State => ({ user: null, userCacheTime: null }),

  actions: {
    /**
     * Utility method to check if cached User is fresh (less than 24 hours old).
     * Returns false if `user`/`userCacheTime` is not cached.
     */
    isCachedUserFresh() {
      if (this.userCacheTime === null) return false;

      // Get Unix Seconds of 24 hours ago
      const oneDayAgo = unixseconds() - 8.64e7;

      // Check if time of cache is newer than the one day old threshold
      return this.userCacheTime > oneDayAgo;
    },

    /**
     * Get currently logged in `User`. User will be cached for current session
     * (24hrs) till a refresh or if force reload flag passed in.
     */
    async getUser(forceRefresh = false) {
      // Return User immediately if caller did not ask for a forced refresh,
      // `user` is cached and the cache is still fresh.
      if (!forceRefresh && this.user !== null && this.isCachedUserFresh())
        return this.user;

      const { res, err } = await sf
        .useDefault()
        .GET("/user/self")
        .useHeader(getAuthHeader)
        .runJSON<ReadOneUserDTO, { message: string }>();

      if (err) throw new Error("Failed to get account.");

      // Handle account loading failure and return early.
      // Auto log user out for certain type of API call errors.
      // This also attempts to print out the reason for logging user out first.
      if (!res.ok) {
        switch (res.status) {
          case 403:
            // Crude way to detect if their account is deactivated
            if (res.data?.message?.includes("deactivated"))
              console.log("[user.store] Account is deactivated");

            console.log("[user.store] Signing out of user account now");

            // Sign user out without getting their confirmation
            await logout();

            break;

          case 404:
            console.log("[user.store] Account not found");
            console.log("[user.store] Signing out of user account now");

            // Sign user out without getting their confirmation
            await logout();

            break;

          default:
            console.log("[user.store] Unknown account loading failure");
        }

        throw new Error(`Failed to get account: ${JSON.stringify(res)}`);
      }

      this.user = res.data.user;
      this.userCacheTime = unixseconds();

      return res.data.user;
    },

    /**
     * Refresh a user's JWT with Firebase Auth and optionally validate custom
     * claims set on JWT. Call this method when claims is expected to be updated.
     */
    async refreshJWT(validateClaims: boolean) {
      // Force refresh JWT since creating Org will add to JWT's 'roles' claim
      await auth.currentUser?.getIdToken(true);
      if (auth.currentUser === null)
        throw new Error("Invalid State: User is logged out on token refresh");

      // Optionally validate the custom claims, will throw if invalid.
      if (validateClaims) await validateCustomClaimsOnJWT(auth.currentUser);
    },

    /**
     * Create a new User Entity
     */
    async createUser(name: string) {
      const { res, err } = await sf
        .useDefault()
        .POST("/user")
        .useHeader(getAuthHeader)
        .bodyJSON<CreateOneUserDTO>({ name })
        .runJSON<ReadOneUserDTO>();

      if (err) throw err;
      if (!res.ok)
        throw new Error(`Failed to create account: ${JSON.stringify(res)}`);

      this.user = res.data.user;
      this.userCacheTime = unixseconds();

      return res.data.user;
    },
  },
});
