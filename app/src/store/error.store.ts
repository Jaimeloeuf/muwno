import { defineStore } from "pinia";

/**
 * Type of this pinia store's state.
 */
interface State {
  /**
   * FIFO Queue of errors to process.
   */
  errors: Array<{
    /**
     * A unique `id` is used as the Vue component key to ensure that the
     * component re-renders even if the Error is the same across 2 sequential
     * `errors` value, and also to ensure that it does not get re-rendered
     * across page changes.
     */
    id: number;

    /**
     * The exception type. Different exception UIs will be shown to user
     * depending on exception type and how they can recover from it. Set `null`
     * to indicate generic unexpected error type.
     */
    type: null | "user";

    /**
     * The actual Error object or error message.
     */
    error: Error | string;
  }>;
}

/**
 * Use this 'store' to manage errors.
 */
export const useError = defineStore("error", {
  state: (): State => ({ errors: [] }),

  actions: {
    /**
     * Record a new generic unexpected error to track and display.
     */
    newError(error: Error | string) {
      this.errors.push({ id: Math.random(), type: null, error });

      // @todo Should add a sentry or whatever tracker here
    },

    /**
     * Record a new user error to track and display.
     */
    newUserError(error: Error | string) {
      this.errors.push({ id: Math.random(), type: "user", error });

      // @todo Should add a sentry or whatever tracker here
    },

    /**
     * Remove the oldest error stored so that the next error can be processed.
     */
    clearOldestError() {
      this.errors.shift();
    },
  },
});
