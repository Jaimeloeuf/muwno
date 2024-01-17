import { defineStore } from "pinia";

/**
 * Type of this pinia store's state.
 */
interface State {
  /**
   * Boolean flag to control if SideDrawer should be shown
   */
  showDrawer: boolean;
}

/**
 * Use this 'store' to control the global SideDrawer
 */
export const useSidedrawer = defineStore("drawer", {
  state: (): State => ({ showDrawer: false }),

  actions: {
    show() {
      this.showDrawer = true;
    },
    hide() {
      this.showDrawer = false;
    },
  },
});
