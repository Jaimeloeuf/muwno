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
     * A unique `id` is used as the Vue component key to ensure that the
     * component re-renders even if the message and timeout are the same across
     * 2 sequential `snackBarMessages` value, and also to ensure that it does
     * not get re-rendered across page changes.
     */
    id: number;

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
      this.snackBarMessages.push({
        id: Math.random(),
        msg,
        timeout: timeoutInSeconds * 1000,
      });
    },

    removeMessage(id: number) {
      const index = this.snackBarMessages.findIndex((msg) => msg.id === id);

      if (index === -1) {
        console.error(`Cannot find snackbar message with ID ${index}`);
        return;
      }

      this.snackBarMessages.splice(index, 1);
    },
  },
});
