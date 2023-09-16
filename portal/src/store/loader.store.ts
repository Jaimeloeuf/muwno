import { defineStore } from "pinia";

/**
 * Type of this pinia store's state.
 */
interface State {
  /**
   * Boolean flag to control if loader should be shown
   */
  showLoader: boolean;

  /**
   * Optional loader message to show instead of 'loading'
   */
  customLoaderMessage: null | string;
}

/**
 * Use this 'store' to control the global loader UI
 */
export const useLoader = defineStore("loader", {
  state: (): State => ({ showLoader: false, customLoaderMessage: null }),

  actions: {
    show(customLoaderMessage: null | string = null) {
      this.customLoaderMessage = customLoaderMessage;

      this.showLoader = true;
    },
    hide() {
      this.showLoader = false;

      // Clear the custom loader message after each use
      this.customLoaderMessage = null;
    },
  },
});
