import type { ServerJWT } from '../../types/index.js';

/**
 * Shared key for the JWT attached to the Request object so that
 * all access of it will be synchronized across the application.
 * With this being the single source of truth.
 */
export const RequestJwtKey = 'jwt';

declare module 'Express' {
  /**
   * Extend `Request` so that the user's auth JWT can be attached
   * to the request object in roles.guard to be used downstream.
   *
   * Using a computed property name so that all access of it will
   * be synchronized across the application using the shared key.
   */
  export interface Request {
    [RequestJwtKey]: ServerJWT;
  }
}
