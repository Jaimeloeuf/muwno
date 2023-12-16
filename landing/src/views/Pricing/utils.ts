import { computed, type Ref } from "vue";

export const numberFormatter = Intl.NumberFormat().format;

/** Currency formatter to format up to 2dp */
export const normalMoneyFormatter = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
}).format;

/** Currency formatter with support up to 3dp instead of the default 2dp */
export const smallMoneyFormatter = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 3,
}).format;

const supportedCurrencies = ["USD", "SGD"];

/** Currency formatter to format up to 2dp */
export const normalMoneyFormatterReactive = (
  currency: Ref<(typeof supportedCurrencies)[number]>,
) =>
  computed(
    () =>
      Intl.NumberFormat("en-US", {
        currency: currency.value,
        style: "currency",
        minimumFractionDigits: 0,
      }).format,
  );

/** Currency formatter with support up to 3dp instead of the default 2dp */
export const smallMoneyFormatterReactive = (
  currency: Ref<(typeof supportedCurrencies)[number]>,
) =>
  computed(
    () =>
      Intl.NumberFormat("en-US", {
        currency: currency.value,
        style: "currency",
        minimumFractionDigits: 0,
        maximumFractionDigits: 3,
      }).format,
  );
