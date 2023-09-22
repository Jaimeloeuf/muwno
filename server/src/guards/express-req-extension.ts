import type { ServerJWT } from '../types/index.js';
import type { Org } from 'domain-model';

/**
 * Shared key for the JWT attached to the Request object so that
 * all access of it will be synchronized across the application.
 * With this being the single source of truth.
 */
export const RequestJwtKey = 'jwt';

/**
 * Shared key for the Org Entity attached to the Request object in the
 * ApiKeyGuard so that all access of it will be synchronized across the
 * application. With this being the single source of truth.
 */
export const RequestOrgKey = 'org';

declare module 'Express' {
  /**
   * Extend `Request` so that guards can attach data to the request object to
   * use downstream.
   *
   * Using computed property names so that all access of it will be synchronized
   * across the application using the shared key.
   */
  export interface Request {
    /**
     * This is optional since not all routes have this set. Use the specific
     * decorator to extract it as it will check to ensure that this is set.
     */
    [RequestJwtKey]?: ServerJWT;

    /**
     * This is optional since not all routes have this set. Use the specific
     * decorator to extract it as it will check to ensure that this is set.
     */
    [RequestOrgKey]?: Org;
  }
}
