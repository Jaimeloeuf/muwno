import { defineStore } from "pinia";

/**
 * Type of this pinia store's state.
 */
interface State {
  /**
   * Internal Boolean flag to track if loop is running to show all the
   * notifications one by one so that the loop is not ran twice.
   */
  _inLoop: boolean;

  /**
   * Boolean flag to show or hide snack bar
   */
  showSnackbar: boolean;

  /**
   * FIFO Queue of snack bar messages to show.
   */
  snackBarMessages: Array<{
    /**
     * String message to display on snack bar when shown
     */ msg: string;

    /**
     * Timeout in milliseconds.
     * How long will the snackbar be shown for, used for animation duration.
     */
    timeout: number;
  }>;

  // @todo Allow component to set current percentage and a hook to call when it is done
}

/**
 * Use this 'store' to manage in app local notifications
 */
export const useNotif = defineStore("notif", {
  state: (): State => ({
    _inLoop: false,
    showSnackbar: false,
    snackBarMessages: [],
  }),

  actions: {
    /**
     * Display a snack bar notification
     */
    setSnackbar(msg: string, timeoutInSeconds = 3) {
      this.snackBarMessages.push({ msg, timeout: timeoutInSeconds * 1000 });
      this._displayNotif();
    },

    async _displayNotif() {
      // If already running, skip this
      if (this._inLoop) return;

      this._inLoop = true;

      // Loop to display the notifs one by one starting from the oldest first.
      while (this.snackBarMessages.length > 0) {
        const snackBarMessage = this.snackBarMessages[0];
        if (snackBarMessage === undefined) break;

        this.showSnackbar = true;
        await new Promise((res) => setTimeout(res, snackBarMessage.timeout));

        // Hide the snackbar and remove it from the array
        this.showSnackbar = false;
        this.snackBarMessages.shift();

        // Add a delay before showing another notif for the animation of it
        // going down and up again to visually indicate there is a new notif.
        await new Promise((res) => setTimeout(res, 250));
      }

      this._inLoop = false;
    },

    hideSnackbar() {
      this.showSnackbar = false;
    },
  },
});
