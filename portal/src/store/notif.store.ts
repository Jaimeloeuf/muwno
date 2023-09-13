import { defineStore } from "pinia";

/**
 * Type of this pinia store's state.
 */
interface State {
  /**
   * Boolean flag to show or hide snack bar
   */
  showSnackbar: boolean;

  /**
   * String message to display on snack bar when shown
   */
  snackBarMessage: string;

  /**
   * How long will the snackbar be shown for, used for animation duration.
   */
  _timeoutInMilliSeconds: number;

  // @todo Allow component to set current percentage and a hook to call when it is done
}

/**
 * Use this 'store' to manage in app local notifications
 */
export const useNotif = defineStore("notif", {
  state: (): State => ({
    showSnackbar: false,
    snackBarMessage: "",
    _timeoutInMilliSeconds: 0,
  }),

  actions: {
    /**
     * Display a snack bar notification
     */
    setSnackbar(message: string, timeoutInSeconds = 3) {
      this.showSnackbar = true;
      this.snackBarMessage = message;
      this._timeoutInMilliSeconds = timeoutInSeconds * 1000;

      setTimeout(() => {
        this.showSnackbar = false;
      }, this._timeoutInMilliSeconds);
    },

    hideSnackbar() {
      this.showSnackbar = false;
    },
  },
});
