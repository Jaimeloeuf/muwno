import type { ISODateTimeString } from "@domain-model";

/**
 * Factor function for creating formatters, which will return a formatted
 * date time string for given ISO DateTime String. Shows "Today" if the
 * date is today, else use the given formatter to generate the date time string.
 */
export const createFormatter = (
  timeFormatter: Intl.DateTimeFormat,
  dateTimeFormatter: Intl.DateTimeFormat
) =>
  function (isoDateTimeString: ISODateTimeString) {
    const date = new Date(isoDateTimeString);

    return new Date().toDateString() === date.toDateString()
      ? "Today, " + timeFormatter.format(date)
      : dateTimeFormatter.format(date);
  };
