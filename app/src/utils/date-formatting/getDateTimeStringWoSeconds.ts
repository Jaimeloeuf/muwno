import { createFormatter } from "./createFormatter";

/**
 * Get a formatted date time string for the given ISO DateTime String.
 * Show "Today" if the date is today, else use a formatted date time string without seconds.
 */
export const getDateTimeStringWoSeconds = createFormatter(
  new Intl.DateTimeFormat("default", {
    hour: "numeric",
    minute: "numeric",
  }),

  new Intl.DateTimeFormat("default", {
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  })
);
