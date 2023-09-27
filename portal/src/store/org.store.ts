import { defineStore } from "pinia";
import unixseconds from "unixseconds";
import { sf } from "simpler-fetch";
import { getAuthHeader } from "../firebase";
import type { Org, ReadOneOrgDTO, CreateOneOrgDTO } from "@domain-model";

import { useUserStore } from "./user.store";

/**
 * Type of this pinia store's state.
 */
interface State {
  /**
   * Org Details of the org the currently logged in user belongs to.
   * Defaults to undefined if user is not logged in yet or does not have an org.
   */
  org: Org | undefined;

  /**
   * Time of caching the `org` property used to prevent stale cache.
   */
  orgCacheTime: number | undefined;
}

/**
 * Use this 'store' for org data.
 */
export const useOrg = defineStore("org", {
  state: (): State => ({ org: undefined, orgCacheTime: undefined }),

  actions: {
    /**
     * Utility method to check if cached Org is fresh (less than 24 hours old).
     * Returns false if `org`/`orgCacheTime` is not cached.
     */
    isCachedOrgFresh() {
      if (this.orgCacheTime === undefined) return false;

      // Get Unix Seconds of 24 hours ago
      const oneDayAgo = unixseconds() - 8.64e7;

      // Check if time of cache is newer than the one day old threshold
      return this.orgCacheTime > oneDayAgo;
    },

    /**
     * Get Org of currently logged in user. Org will be cached for current
     * session (24hrs) till a refresh or if force reload flag passed in.
     */
    async getOrg(forceRefresh = false) {
      // Return Org immediately if user did not ask for a forced refresh, `org`
      // is cached and the cache is still fresh.
      if (!forceRefresh && this.org !== undefined && this.isCachedOrgFresh())
        return this.org;

      const { res, err } = await sf
        .useDefault()
        .GET("/org/self")
        .useHeader(getAuthHeader)
        .runJSON<ReadOneOrgDTO>();

      if (err) throw err;
      if (!res.ok)
        throw new Error(`Failed to load Organisation: ${JSON.stringify(res)}`);

      this.org = res.data.org;
      this.orgCacheTime = unixseconds();

      return res.data.org;
    },

    /**
     * Check if the currently logged in user belongs to any Org.
     */
    async doesUserHaveOrg() {
      const { res, err } = await sf
        .useDefault()
        .GET("/org/self")
        .useHeader(getAuthHeader)
        .runJSON<ReadOneOrgDTO>();

      if (err) throw err;

      // If user has an Org, cache the data first so subsequent calls to
      // `getOrg` would be cached instead of making another round trip.
      if (res.ok) {
        this.org = res.data.org;
        this.orgCacheTime = unixseconds();

        return true;
      }

      if (res.status === 404) return false;
      else
        throw new Error(
          `Failed to check if user have an Org: ${JSON.stringify(res)}`
        );
    },

    /**
     * Create a new Org.
     */
    async createOrg(createOneOrgDTO: CreateOneOrgDTO) {
      const { res, err } = await sf
        .useDefault()
        .POST("/org/create")
        .useHeader(getAuthHeader)
        .bodyJSON<CreateOneOrgDTO>(createOneOrgDTO)
        .runJSON<ReadOneOrgDTO>();

      if (err) throw err;
      if (!res.ok)
        throw new Error(
          `Failed to create Organisation: ${JSON.stringify(res)}`
        );

      await useUserStore().refreshJWT(true);

      this.org = res.data.org;
      this.orgCacheTime = unixseconds();

      return res.data.org;
    },
  },
});
