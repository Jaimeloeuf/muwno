import dayjs from 'dayjs';
import type { IntervalType } from 'domain-model';

/**
 * Get the start and end dates of a given time period interval number.
 */
export function intervalDates(intervals: number, intervalType: IntervalType) {
  const startingPoint = dayjs().startOf(intervalType);

  const start = dayjs(startingPoint).subtract(intervals, intervalType);

  // End is `start` plus length of 1 interval type
  const end = start.add(1, intervalType);

  return { start: start.toISOString(), end: end.toISOString() };
}
