import type { User } from "../User/index.js";

/**
 * DTO data used to create a single User Entity.
 */
export type CreateOneUserDTO = Omit<
  User,
  "id" | "createdAt" | "role" | "email" | "orgID" | "deactivated"
>;
