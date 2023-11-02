import dayjs from 'dayjs';
import type { IntervalType } from 'domain-model';

/**
 * Get the start and end dates of a given time period interval number using
 * rolling time windows.
 */
export function intervalDates(intervals: number, intervalType: IntervalType) {
  // Always subtract one more because the 0 interval should end TODAY
  const start = dayjs().subtract(intervals + 1, intervalType);

  // End is `start` plus length of 1 interval type
  const end = start.add(1, intervalType);

  return { start: start.toISOString(), end: end.toISOString() };
}

/**
 * Get the start and end dates of a given time period interval number using
 * fixed time window.
 */
export function intervalDates_fixed(
  intervals: number,
  intervalType: IntervalType,
) {
  const startingPoint = dayjs().startOf(intervalType);

  const start = dayjs(startingPoint).subtract(intervals, intervalType);

  // End is `start` plus length of 1 interval type
  const end = start.add(1, intervalType);

  return { start: start.toISOString(), end: end.toISOString() };
}
