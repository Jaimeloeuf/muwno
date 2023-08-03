import { Role } from 'domain-model';

export const ArrayOfRoleEnums = Object.values(Role);

/**
 * Type Predicate to check if all the roles in a given JWT's `roles` claim is
 * actually defined in the array of Role enum variants.
 */
export const isRoles = (roles: any): roles is Array<Role> =>
  Array.isArray(roles) &&
  roles.every((role) => ArrayOfRoleEnums.includes(role));
