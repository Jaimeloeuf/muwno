import { ref } from "vue";

/**
 * Boolean flag to control if Loader should be shown
 */
const showLoader = ref(false);
const show = () => (showLoader.value = true);
const hide = () => (showLoader.value = false);

/**
 * Doing this instead of using a singleton class / literal object for
 * definitions since using the methods in vue template will fail as using it for
 * `@click` for example messes with the `this` binding which causes it to fail
 * when trying to access the showLoader variable.
 *
 * @todo
 * There is no use for this right now since there is no script controlled
 * loading triggers in form/ right now. Even submit is instant UI change and the
 * API call runs in the background without needing to show user the loader.
 */
export const loader = { showLoader, show, hide };
