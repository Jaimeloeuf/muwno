import { defineStore } from "pinia";
import { sf, type ApiResponse } from "simpler-fetch";
import type { User, CreateOneUserDTO, ReadOneUserDTO } from "domain-model";

import { getAuthHeader } from "../firebase";
import { logout } from "../utils/logout";

/**
 * Type of this pinia store's state.
 */
interface State {
  /**
   * Save the whole User object in store to use in UIs, this value is retrieved
   * from API during initialisation.
   *
   * This is required/not-optional and readonly because this should not be
   * modified anywhere else, and is only set after the user logged with
   * `initOnLogin` method.
   *
   * See the `state` method of the store for more info.
   */
  readonly user: User;
}

/**
 * Type of the state whereby every value is set to unknown, this is used to
 * enforce that the original state object must at the very least have all the
 * same keys defined! Without the same keys being defined in the original state
 * function, the assignment to this.$state in `initOnLogin` method will not be
 * reactive and it will fail.
 */
type UnsetState = Record<keyof State, unknown>;

/**
 * Main store for user data
 */
export const useUserStore = defineStore("user", {
  /**
   * State function that returns the initial state object, however since the
   * store will create the state object before it is initialized using the
   * `init` mehtod there will be many missing values, which will mean they have
   * to be typed as optional, making every place that access these values do an
   * extra check or use the non-null assertion operator which is not very safe.
   *
   * Therefore since every place can only use these data AFTER login and `init`
   * method is ran, State type is typed to make every value non-optional.
   * However this state function still needs to return a valid value, therefore
   * the `UnsetState` type is used, to ensure that all a state object with all
   * the keys required is used, so that when this.$state is used to set the
   * actual state after initialization, it will still work and the values will
   * be reactive. The value is then type casted to `State` once it satisfies
   * `UnsetState` type.
   */
  state: (): State =>
    ({ user: undefined } satisfies UnsetState as unknown as State),

  actions: {
    /**
     * Get User Entity object from API
     */
    async _getCurrentUser() {
      const { res, err } = await sf
        .useDefault()
        .GET("/user/self")
        .useHeader(getAuthHeader)
        .runJSON<ReadOneUserDTO>();

      // @todo Handle this failure instead of just throwing an error
      if (err) throw new Error("Failed to get user account.");

      return res;
    },

    /**
     * Set User Entity onto store
     */
    async _setUser(user: User) {
      // Save the User Entity object locally.
      // Doing this instead of `this.user = user;` as the user property is readonly.
      // Assigning to `this.$state` directly to reset state will only work if
      // the original state object returned by the `state` method defined all
      // the properties already, if not all defined, then the values will not be
      // reactive and fail to work.
      this.$state = { ...this.$state, user };
    },

    /**
     * Initialise the store with values from the API server on login
     */
    async initOnLogin() {
      const res = await this._getCurrentUser();

      // Throw error if the user account does not actually exists, which the
      // caller should handle by logging the user out.
      if (!res.ok) throw new Error("Account does not exist");

      this._setUser(res.data.user);

      return res.data.user;
    },

    /**
     * Refresh by loading User from API server to check if it is still a valid
     * account and save User object locally if so, else log user out.
     */
    async refreshUser() {
      const res = await this._getCurrentUser();

      // Handle account loading failure and return early to prevent saving undefined to store.
      if (!res.ok) return this._handleAccountLoadingFailure(res);

      this._setUser(res.data.user);
    },

    /**
     * Create a new User Entity
     */
    async createUser(name: string) {
      const { res, err } = await sf
        .useDefault()
        .POST("/user/create")
        .useHeader(getAuthHeader)
        .bodyJSON<CreateOneUserDTO>({ name })
        .runJSON<ReadOneUserDTO>();

      // @todo Handle these failures instead of just throwing an error
      if (err) throw err;
      if (!res.ok) throw new Error("Failed to create user account.");

      this._setUser(res.data.user);
    },

    /**
     * Auto log user out if API call to get user account failed.
     * This also attempts to print out the reason for logging user out first.
     */
    async _handleAccountLoadingFailure<T>(res: ApiResponse<T>) {
      switch (res.status) {
        case 403:
          // Crude way to detect if their account is deactivated
          if (((res.data as any)?.message as string)?.includes("deactivated"))
            console.log("[user.store] Account is deactivated");

          break;

        default:
          console.log("[user.store] Unknown account loading failure");
          console.log(`[user.store] Server Error Msg: ${(res as any).message}`);
      }

      console.log("[user.store] Signing out of user account now");

      // Sign user out without getting their confirmation
      await logout(false);
    },
  },

  /**
   * Persists this store's state in localStorage to reuse across sessions.
   * Reference: https://www.npmjs.com/package/pinia-plugin-persistedstate
   */
  persist: true,
});
