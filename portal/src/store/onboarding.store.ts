import { defineStore } from "pinia";
import unixseconds from "unixseconds";
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../firebase";
import { prettyJSON } from "../utils";

/**
 * Type of this pinia store's state.
 */
interface State {
  /**
   * User's onboarding status. Is null when it has not been loaded from API yet.
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
          `Failed to check onboarding status: ${prettyJSON(res)}`
        );

      this.onboarding = res.data.onboarding;
      this.cacheTime = unixseconds();

      return res.data.onboarding;
    },

    // @todo
    // Might add a method to set 'onboarding' as completed locally.
    // For now it works without it since user needs to pay first for onboarding
    // to complete and during payment it will redirect causing a site reload,
    // which will cause this cached onboarding state to update too.
    // Alternatively, call isOnboarding with force refresh in setup payment
    // success page to avoid the need for building a local `onboarded` method.
  },
});
