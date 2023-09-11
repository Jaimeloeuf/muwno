import { defineStore } from "pinia";
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
  orgDetails: Org | undefined;
}

/**
 * Use this 'store' for org data.
 */
export const useOrg = defineStore("org", {
  state: (): State => ({ orgDetails: undefined }),

  actions: {
    /**
     * Get Org Details of the org the currently logged in user belongs to. Org
     * details will be cached for the current session till a refresh or if force
     * reload flag passed in.
     */
    async getOrg(forceRefresh = false) {
      // If user did not ask for a forced refresh, and `orgDetails` is already
      // cached, return it immediately.
      if (!forceRefresh && this.orgDetails !== undefined)
        return this.orgDetails;

      const { res, err } = await sf
        .useDefault()
        .GET("/org/self")
        .useHeader(getAuthHeader)
        .runJSON<ReadOneOrgDTO>();

      if (err) throw err;
      if (!res.ok)
        throw new Error(`Failed to load Organisation: ${JSON.stringify(res)}`);

      this.orgDetails = res.data.org;

      return res.data.org;
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

      this.orgDetails = res.data.org;

      return res.data.org;
    },
  },
});
