export const numberFormatter = Intl.NumberFormat().format;

/** Currency formatter to format up to 2dp */
export const normalMoneyFormatter = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "SGD",
  minimumFractionDigits: 0,
}).format;

/** Currency formatter with support up to 3dp instead of the default 2dp */
export const smallMoneyFormatter = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "SGD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 3,
}).format;
