import { defineStore } from "pinia";
import { IntervalType } from "@domain-model";

/**
 * A list of allowed interval values for each of the interval types.
 * @todo Need to implement the check in the API too.
 */
const allIntervalValues = {
  [IntervalType.day]: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
  [IntervalType.week]: [2, 3, 4, 5, 6, 7, 8, 9, 10],
  [IntervalType.month]: [2, 3, 4, 5, 6],
  [IntervalType.year]: [2, 3],
};

/**
 * The default interval value for each of the interval types.
 */
const defaultIntervals = {
  [IntervalType.day]: 7,
  [IntervalType.week]: 5,
  [IntervalType.month]: 3,
  [IntervalType.year]: 2,
};

/**
 * Type of this pinia store's state.
 */
interface State {
  intervals: number;
  intervalType: IntervalType;
}

/**
 * Use this 'store' to control the PMF Chart
 */
export const useChart = defineStore("chart", {
  // Defaults to a daily chart for 1 week total
  state: (): State => ({
    intervals: 7,
    intervalType: IntervalType.day,
  }),

  getters: {
    intervalValues(state) {
      // Using getter hook on `state.intervalType` reactive state change to
      // update the default intervals value based on the new intervalType.
      state.intervals = defaultIntervals[state.intervalType];
      return allIntervalValues[state.intervalType];
    },
  },

  /**
   * Persist user's chart settings/preference locally
   */
  persist: true,
});
