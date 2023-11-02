/**
 * Enum to represent types of Time Period Intervals.
 *
 * Inspired by the dayjs interval types
 * https://day.js.org/docs/en/manipulate/start-of#docsNav
 *
 * For each of the interval types, whether they all use rolling time windows or
 * fixed time windows is dependent of the PMF score service calculation, this
 * only provides the definition of the different interval types.
 */
export enum IntervalType {
  day = 'day',
  week = 'week',
  month = 'month',
  year = 'year',

  /**
   * This is dependent QuarterOfYear plugin of dayjs and currently unimplemented
   */
  // quarter = 'quarter',
}

export const isValidIntervalType = (s: string): s is IntervalType =>
  s in IntervalType;
