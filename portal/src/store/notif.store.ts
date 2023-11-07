import { defineStore } from "pinia";

/**
 * Type of this pinia store's state.
 */
interface State {
  /**
   * FIFO Queue of snack bar messages to show.
   */
  snackBarMessages: Array<{
    /**
     * String message to display on snack bar when shown
     */
    msg: string;

    /**
     * Timeout in milliseconds.
     * How long will the snackbar be shown for, used for animation duration.
     */
    timeout: number;
  }>;
}

/**
 * Use this 'store' to manage in app local notifications
 */
export const useNotif = defineStore("notif", {
  state: (): State => ({ snackBarMessages: [] }),

  actions: {
    /**
     * Display a snack bar notification
     */
    setSnackbar(msg: string, timeoutInSeconds = 5) {
      this.snackBarMessages.push({ msg, timeout: timeoutInSeconds * 1000 });
    },

    removeOldestMessage() {
      this.snackBarMessages.shift();
    },
  },
});
