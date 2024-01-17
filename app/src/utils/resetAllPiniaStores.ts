import type { Store, Pinia } from "pinia";
import { getActivePinia } from "pinia";

/**
 * Reset all pinia stores by calling all of their $reset methods.
 *
 * There are 2 ways to do this, one being a plugin style, whereas this
 * current version relies on a internal API `_s` which may or may not
 * break in the future, but is much easier to implement.
 *
 * References:
 * https://github.com/vuejs/pinia/discussions/911#discussioncomment-3516647
 * https://github.com/vuejs/pinia/discussions/1859
 */
export async function resetAllPiniaStores() {
  // Need to type `_s` since it is not typed to prevent exposing it as part of the public API
  interface ExtendedPinia extends Pinia {
    _s: Map<string, Store>;
  }

  // map through that list and use the **$reset** fn to reset the state
  (getActivePinia() as ExtendedPinia)?._s.forEach((store) => store.$reset());
}
