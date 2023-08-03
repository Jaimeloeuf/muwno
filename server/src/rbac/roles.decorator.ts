import { SetMetadata } from '@nestjs/common';
import { Role } from 'domain-model';
import { ArrayOfRoleEnums } from './roles.utils.js';

/**
 * The key used for the RBAC MetaData on classes/method. This is for rbac
 * module internal use only, route definition users should not use this.
 *
 * Using a Symbol to ensure that it will not clash with any other MetaData key.
 */
export const ROLES_KEY = Symbol('roles');

/**
 * Decorator for explicitly assigning Role(s) required for a specific route
 * or controller. This is required for all routes, without this, the role
 * guard will error out on the first request to the route without explicit
 * role definition.
 *
 * This can accept multiple Roles as its argument, a request will be allowed
 * as long as the user's role matches any one of the required roles.
 *
 * If there are role(s) specified on both the route method and its parent
 * controller, the role specified on the route method itself will take precedence.
 */
export const RolesRequired = (...roles: Role[]) =>
  SetMetadata(ROLES_KEY, roles);

/**
 * Decorator to indicate that a controller or route method can be accessed
 * by any of the Roles defined in the Domain Model's `Role` enum.
 */
export const AllowAllRoles = SetMetadata(ROLES_KEY, ArrayOfRoleEnums);
