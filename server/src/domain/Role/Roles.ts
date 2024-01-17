/**
 * All possible user roles in this RBAC system defined with a TS Enum.
 *
 * All values of this string enum is initialized instead of relying on
 * randomly generated values by tsc, because these are the same static/
 * constant values assigned to user's JWTs too, which must match for
 * runtime checks.
 *
 * Most of the string values are abbrevations and shortforms to store as
 * little data on the JWT custom claim object as possible to reduce data
 * transferred over the network.
 *
 * Note that since TS does not check the enum values, this MUST BE set
 * to different values, else there will be errors when discerning between
 * the enum types during runtime.
 * Ref: https://stackoverflow.com/questions/51170387/duplicate-string-values-in-ts-enum-does-not-cause-compilation-error
 */
export enum Role {
  /**
   * A normal user's account used by most users.
   * This gives them access to the app mainly for using the dashboard.
   *
   * `o-u` short for `org-user`
   */
  OrgUser = 'o-u',

  /**
   * Org admins have rights to some non-idempotent / destructive APIs.
   *
   * `o-a` short for `org-admin`
   */
  OrgAdmin = 'o-a',

  /**
   * Org Owner have rights to all non-idempotent / destructive APIs.
   *
   * `o-o` short for `org-owner`
   */
  OrgOwner = 'o-o',
}
