/**
 * All possible plan types defined with a TS Enum.
 *
 * All values of this string enum is initialized instead of relying on randomly
 * generated values by tsc, because these are the same static/ constant values
 * stored in the DB too, which must match for runtime use/checks.
 *
 * Note that since TS does not check the enum values, this MUST BE set
 * to different values, else there will be errors when discerning between
 * the enum types during runtime.
 * Ref: https://stackoverflow.com/questions/51170387/duplicate-string-values-in-ts-enum-does-not-cause-compilation-error
 */
export enum SubscriptionPlan {
  /**
   * Note that `standard` plan is a single plan regardless if subscription
   * payment schedule is yearly or monthly because that is a payment detail
   * and not a plan detail.
   */
  Standard = "Standard",
}
