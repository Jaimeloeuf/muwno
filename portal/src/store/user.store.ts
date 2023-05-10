import { defineStore } from "pinia";
import { oof } from "simpler-fetch";
import type { User as FirebaseAuthUser } from "firebase/auth";
import type {} from "domain-model";

import { getAuthHeader } from "../firebase";
import { validateCustomClaimsOnJWT } from "../utils/validateCustomClaimsOnJWT";
import { logout } from "../utils/logout";

/**
 * Type of this pinia store's state.
 */
interface State {
  /**
   * Save the whole User object in store to use in UIs, this value is set by a Store
   * Admin during user creation process and retrieved from API during initialisation.
   *
   * This is required/not-optional and readonly because this should not be modified
   * anywhere else, and is only set after the user logged with `initOnLogin` method.
   *
   * See the `state` method of the store for more info.
   */
  readonly user: User;
}

/**
 * Type of the state whereby every value is set to any, this is used to enforce that
 * the original state object must at the very least have all the same keys defined!
 *
 * Without the same keys being defined in the original state function, the assignment
 * to this.$state in `initOnLogin` method will not be reactive and it will fail.
 */
type UnsetState = Record<keyof State, any>;

/**
 * Main store for user data
 */
export const useUserStore = defineStore("user", {
  /**
   * State function that returns the initial state object, however since the store
   * will create the state object before it is initialized using the `init` mehtod
   * there will be many missing values, which will mean they have to be typed as
   * optional, making every place that access these values do an extra check or
   * use the non-null assertion operator which is not very safe.
   *
   * Therefore since every place can only use these data AFTER login and `init`
   * method is ran, State type is typed to make every value non-optional. However
   * this state function still needs to return a valid value, therefore the
   * `UnsetState` type is used, to ensure that all a state object with all the keys
   * required is used, so that when this.$state is used to set the actual state
   * after initialization, it will still work and the values will be reactive.
   * The value is then type casted to `State` once it satisfies `UnsetState` type.
   */
  state: (): State =>
    ({
      user: undefined,
    } satisfies UnsetState as unknown as State),

  /**
   * Since both user types are supported by this single user store,
   * this getter allows you to use the user type as is needed for
   * the particular view, and for views that can handle both user
   * types, such as the Profile view, it can use the `isFsUser` flag
   * to choose what to use.
   */
  getters: {
    //
  },

  actions: {
    /**
     * Get User Entity object from API
     */
    async _getCurrentUser() {
      const { res, err } = await oof
        .useDefault()
        .GET("/user/self")
        .header(getAuthHeader)
        .runJSON<ReadOneUserDTO>();

      // @todo Handle this failure instead of just throwing an error
      if (err) throw new Error("Failed to get user account.");

      return res;
    },

    /**
     * Initialise the store with values from the API server on login
     */
    async initOnLogin(firebaseAuthUser: FirebaseAuthUser) {
      await validateCustomClaimsOnJWT(firebaseAuthUser);

      const res = await this._getCurrentUser();

      // Throw error if the user account does not actually exists, which the caller
      // should handle by logging the user out.
      if (!res.ok) throw new Error("Account does not exist");

      const user = res.data.user;

      // Verify that the user's email is correct.
      // Get current user's email from firebase auth and the non-null assertion operator is
      // used since it is assumed to always be available since only accepting Google Logins.
      if (user.email !== firebaseAuthUser.email!)
        throw new Error(
          `Internal Error: Gmail does not match User.email!\n\nFound: ${
            user.email
          }\nfirebaseAuthUser.email!: ${firebaseAuthUser.email!}`
        );

      // Save the User Entity object locally.
      // Doing this instead of `this.user = user;` as the user property is readonly.
      // Assigning to `this.$state` directly to reset state will only work if the original
      // state object returned by the `state` method defined all the properties already, if
      // not all defined, then the values will not be reactive and fail to work.
      this.$state = { ...this.$state, user };
    },

    /**
     * Refresh by loading User from API server to check if it is
     * still a valid account and save User object locally if so,
     * else log user out.
     */
    async refreshUser() {
      const res = await this._getCurrentUser();

      // Handle account loading failure and return early to prevent saving undefined to store.
      if (!res.ok) return this._handleAccountLoadingFailure(res);

      // Save the User Entity object locally.
      // Doing this instead of `this.user = res.data.user;` as the user property is readonly.
      this.$state = { ...this.$state, user: res.data.user };
    },

    /**
     * Auto log user out if API call to get user account failed.
     * This also attempts to print out the reason for logging user out first.
     */
    async _handleAccountLoadingFailure<T extends { status: number }>(res: T) {
      switch (res.status) {
        case 403:
          // Crude way to detect if their account is deactivated
          if (((res as any).message as string)?.includes("deactivated"))
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
