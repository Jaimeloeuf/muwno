import { ref } from "vue";

/**
 * Boolean flag to control if SideDrawer should be shown
 */
const showDrawer = ref(false);
const show = () => (showDrawer.value = true);
const hide = () => (showDrawer.value = false);

/**
 * Doing this instead of using a singleton class / literal object for
 * definitions since using the methods in vue template will fail as using it for
 * `@click` for example messes with the `this` binding which causes it to fail
 * when trying to access the showDrawer variable.
 */
export const sideDrawer = { showDrawer, show, hide };
