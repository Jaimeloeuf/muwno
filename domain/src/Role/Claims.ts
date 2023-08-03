import type { Role } from "./Roles.js";

/**
 * A readonly object of literal string keys that are expected to be found
 * on a custom claims object of the user's auth JWT. This is exported so
 * that all access of the claims object using the keys are kept in sync
 * and consistent by all relying on this single source of truth rather
 * than using unchecked strings everywhere.
 */
export const CustomClaimsKeys = Object.freeze(<const>{
  roles: "roles",
});

/**
 * Use this type by creating a custom `AppJWT` and `ServerJWT` types in
 * their respective subrepos, instead of defining the auth JWT type here
 * because the JWT type exposed is different amongst the `firebase/auth`
 * and `firebase-admin/auth` packages. So instead of defining the custom
 * JWT types here, it is easier for the subrepos to create the type by
 * extending both their native JWT types and this CustomClaims object.
 *
 * Expected type of the custom claims object set on the user's auth JWT.
 * The extended properties all use computed property name using the
 * `CustomClaimsKeys` so that it is always consistent across usage, and
 * the custom claim object's keys wont be out of sync with whats actually
 * defined on the JWT.
 */
export interface CustomClaims {
  /**
   * The user's Role(s). A user must have at least one role and can also have
   * more than one role.
   */
  readonly [CustomClaimsKeys.roles]: Array<Role>;
}
