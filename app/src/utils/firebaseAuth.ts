/**
 * Re-export firebase auth from setup/ since no code should import from setup/
 * directly other than main.ts when starting the app.
 */

export { auth } from "../setup/firebase";
