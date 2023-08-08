import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createFirebaseApp } from './createFirebaseApp.js';

import type { IAuthService } from '../../abstractions/IAuthService.js';

import type { App } from 'firebase-admin/app';
import { type Auth, getAuth } from 'firebase-admin/auth';
import type { CustomClaims, UserID } from 'domain-model';
import type { ServerJWT } from '../../../types/ServerJWT.js';

// Service layer Exceptions
import { FirebaseAuthException } from './FirebaseAuthException.js';

/**
 * This service wraps around the Firebase Auth service,
 * to provide a Error to custom FirebaseAuthException
 * mapping, to ensure that Exception Filters work.
 *
 * Use the IAuthService abstract class to get this auth service injected.
 */
@Injectable()
export class FirebaseAuthService implements IAuthService {
  private readonly auth: Auth;

  /**
   * Static async factory method to create firebase app first,
   * before constructing the `FirebaseAuthService` with it.
   */
  static async create(): Promise<FirebaseAuthService> {
    const firebaseApp = await createFirebaseApp();
    return new FirebaseAuthService(firebaseApp);
  }

  constructor(firebaseApp: App) {
    this.auth = getAuth(firebaseApp);
  }

  async verifyJWT(jwtString: string, checkRevoked?: boolean) {
    return (
      this.auth
        .verifyIdToken(jwtString, checkRevoked)
        // Catch and rethrow errors to use more specific error messages and
        // types based on the specific error code instead of just letting the
        // error bubble through and letting NestJS convert it to the generic 500
        // internal server error for all error types!
        .catch((err) => {
          if (err.code === 'auth/id-token-expired')
            throw new UnauthorizedException(
              'JWT expired, please reauthenticate',
            );
          if (err.code === 'auth/id-token-revoked')
            throw new UnauthorizedException(
              'JWT revoked, please reauthenticate',
            );

          // Re-throw as 401 error if it is none of the specified firebase auth
          // error codes, which is at least better than the default 500 internal
          // server error which does not specify the reason for failure.
          throw new UnauthorizedException(
            `JWT Verification failed: ${err.code}`,
          );

          // Type cast as simple alternative to type predicate.
          // Type casting it to include custom claims object keys, which should
          // be validated by the caller so this can be assumed to be safe.
        }) as Promise<ServerJWT>
    );
  }

  async getUserIdWithEmail(email: string) {
    return this.auth
      .getUserByEmail(email)
      .then(({ uid }) => uid)
      .catch((err) => {
        throw new FirebaseAuthException(err);
      });
  }

  async setCustomClaims(userID: UserID, customClaims: Partial<CustomClaims>) {
    await this.auth
      .setCustomUserClaims(userID, customClaims)
      // Re throw error as `FirebaseAuthException` for Exception Filter to work
      .catch((err) => {
        throw new FirebaseAuthException(err);
      });
  }

  async clearCustomClaims(userID: UserID) {
    await this.auth
      .setCustomUserClaims(userID, null)
      // Re throw error as `FirebaseAuthException` for Exception Filter to work
      .catch((err) => {
        throw new FirebaseAuthException(err);
      });
  }
}
