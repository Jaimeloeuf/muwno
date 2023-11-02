/**
 * Enum to represent types of Time Period Intervals.
 *
 * Inspired by the dayjs interval types
 * https://day.js.org/docs/en/manipulate/start-of#docsNav
 */
export enum IntervalType {
  /**
   * 24 hours, starting at 00:00 (locale aware)
   */
  day = 'day',

  /**
   * First day of the current week, 00:00 (locale aware)
   */
  week = 'week',

  /**
   * First day of the current month, 00:00
   */
  month = 'month',

  /**
   * Beginning of the current quarter, 1st day of months, 00:00
   *
   * This is dependent QuarterOfYear plugin of dayjs and currently unimplemented
   */
  // quarter = 'quarter',

  /**
   * January 1st, 00:00 of the current year
   */
  year = 'year',
}

export const isValidIntervalType = (s: string): s is IntervalType =>
  s in IntervalType;
