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
 */
export const loader = { showLoader, show, hide };
