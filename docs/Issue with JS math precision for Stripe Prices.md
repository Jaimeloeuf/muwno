# Issue with JS math precision for Stripe Prices
- Stripe will reject prices with more than 12 decimal places.
- Since using usage based pricing, many product's unit cost is extremely small and when handled in JS, it can end up having decimal values that are not exact because of how precise JS stores the numbers.

Currently there isn't anymore issue since all unit prices are single digits, perfectly representable by fractions and doesn't compute to anything extra at the tail end.

This could potentially be worked around with the `toPrecision` method but since it isn't causing much issues now it is left as is for now.

<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toPrecision>