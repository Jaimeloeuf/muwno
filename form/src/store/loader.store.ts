import { defineStore } from "pinia";

/**
 * Type of this pinia store's state.
 */
interface State {
  /**
   * Boolean flag to control if loader should be shown
   */
  showLoader: boolean;
}

/**
 * Use this 'store' to control the global loader UI
 */
export const useLoader = defineStore("loader", {
  state: (): State => ({ showLoader: false }),

  actions: {
    show() {
      this.showLoader = true;
    },
    hide() {
      this.showLoader = false;
    },
  },
});
