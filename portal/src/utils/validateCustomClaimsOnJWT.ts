import type { User } from "firebase/auth";

/**
 * Utility function to validate JWT's custom claims object.
 * This will throw an error if the object fails validation.
 */
export async function validateCustomClaimsOnJWT(firebaseAuthUser: User) {
  const { claims } = await firebaseAuthUser.getIdTokenResult();

  if (claims.role === undefined) throw new Error("Role is not set on claims");
}
