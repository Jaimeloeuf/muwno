import { Role } from "./Roles.js";

/**
 * Utility to map a Role enum variant to a String
 */
export const roleMapper: Record<Role, string> = {
  [Role.OrgUser]: "User",
  [Role.OrgAdmin]: "Organisation Admin",
  [Role.OrgOwner]: "Organisation Owner",
};
