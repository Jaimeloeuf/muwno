import type { UserID, CustomClaims } from 'domain-model';
import type { ServerJWT } from '../../types/ServerJWT.js';

/**
 * Abstract interface for an Auth Provider Service.
 * Implement this and use this as the DI key to provide Auth service.
 */
export abstract class IAuthService {
  /**
   * Verify JWT, pass in checkRevoked to verify with auth provider
   */
  abstract verifyJWT(
    jwtString: string,
    checkRevoked?: boolean,
  ): Promise<ServerJWT>;

  /**
   * Get a user's `UserID` using their email
   * @throws `FirebaseAuthException`
   */
  abstract getUserIdWithEmail(email: string): Promise<string>;

  /**
   * Set custom claims
   * @throws `FirebaseAuthException`
   */
  abstract setCustomClaims(
    userID: UserID,
    customClaims: CustomClaims,
  ): Promise<void>;

  /**
   * Delete the entire custom claims object
   * @throws `FirebaseAuthException`
   */
  abstract clearCustomClaims(userID: UserID): Promise<void>;
}
