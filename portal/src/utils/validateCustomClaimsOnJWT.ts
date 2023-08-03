import type { User } from "firebase/auth";
import { Role } from "domain-model";

/**
 * Utility function to validate JWT's custom claims object.
 * This will throw an error if the object fails validation.
 */
export async function validateCustomClaimsOnJWT(firebaseAuthUser: User) {
  const { claims } = await firebaseAuthUser.getIdTokenResult();

  if (claims.roles === undefined || claims.roles === null)
    throw new Error("'roles' is not set on claims");

  if (!Array.isArray(claims.roles))
    throw new Error(`'roles' is not an array: ${claims.roles}`);

  if (!claims.roles.every((role) => Object.values(Role).includes(role)))
    throw new Error(`'roles' is not valid: ${claims.roles}`);
}
