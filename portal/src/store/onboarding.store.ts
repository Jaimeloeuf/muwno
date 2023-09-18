import { defineStore } from "pinia";
import unixseconds from "unixseconds";
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../firebase";

/**
 * Type of this pinia store's state.
 */
interface State {
  /**
   */
  onboarding: boolean | null;

  /**
   * Time of caching the `onboarding` property used to prevent stale cache.
   */
  cacheTime: number | null;
}

/**
 * Main store for onboarding state.
 */
export const useOnboarding = defineStore("onboarding", {
  state: (): State => ({ onboarding: null, cacheTime: null }),

  actions: {
    /**
     * Utility method to check if cached data is fresh (less than 24 hours old).
     * Returns false if data is not cached.
     */
    isCacheStillFresh() {
      if (this.cacheTime === null) return false;

      // Get Unix Seconds of 24 hours ago
      const oneDayAgo = unixseconds() - 8.64e7;

      // Check if time of cache is newer than the one day old threshold
      return this.cacheTime > oneDayAgo;
    },

    /**
     * Check if the currently logged in `User` is still doing onboarding.
     * Onboarding status will be cached for current session (24hrs) till a
     * refresh or if force reload flag passed in.
     */
    async isOnboarding(forceRefresh = false) {
      // Return status immediately if caller did not ask for a forced refresh,
      // status is cached and the cache is still fresh.
      if (!forceRefresh && this.onboarding !== null && this.isCacheStillFresh())
        return this.onboarding;

      const { res, err } = await sf
        .useDefault()
        .GET("/user/onboarding/status")
        .useHeader(getAuthHeader)
        .runJSON<{ onboarding: boolean }>();

      if (err) throw new Error("Failed to check onboarding status.");
      if (!res.ok)
        throw new Error(
          `Failed to check onboarding status: ${JSON.stringify(res)}`
        );

      this.onboarding = res.data.onboarding;
      this.cacheTime = unixseconds();

      return res.data.onboarding;
    },
  },
});
