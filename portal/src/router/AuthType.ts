/**
 * An enum of all possible authentication requirements types for the routes.
 * When performing checks and running router gaurd functions, check against this AuthType enum.
 */
export enum AuthType {
  /**
   * All User can access route regardless of current auth status.
   */
  Public,

  /**
   * Only accessible if user is not logged in. Example would be the login route.
   */
  PublicOnly,

  /**
   * Accessible to users after authentication.
   * This does not mean the user is authorized to access some data.
   */
  Private,
}
