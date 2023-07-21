/**
 * Barrel file used to export only the things required by a router user.
 */

export { router } from "./Router";

// ReExport all the RouteObjects for router user to import and use, for the route names.
export * from "./PublicRoutes";
