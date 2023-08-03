import { SetMetadata } from '@nestjs/common';

/**
 * The key used for RBAC strictness requirement MetaData on classes/method.
 * This is for rbac module internal use only, route definition users should
 * not use this.
 *
 * Using a Symbol to ensure that it will not clash with any other MetaData key.
 */
export const STRICT_RBAC_KEY = Symbol('strict-rbac');

/**
 * Decorator for explicitly setting the RBAC requirement for a specific route or
 * controller to be strict, which means that the RBAC RolesGuard authorization
 * class will check against the auth service API to see if the user's JWT has
 * been revoked or not.
 *
 * This is not a function as there is no need for a custom unique MetaData
 * decorator for every route or controller that uses this.
 *
 * If strictness requirement is specified for both the route method and its
 * parent controller, the role specified on the route method takes precedence.
 */
export const StrictRBAC = SetMetadata(STRICT_RBAC_KEY, true);
