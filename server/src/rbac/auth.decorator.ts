import { SetMetadata } from '@nestjs/common';

export const ALLOW_UNAUTHENTICATED_REQ__KEY = 'AllowUnauthenticatedRequest';

/**
 * # Warning
 * Decorator to indicate that a controller or route method can be accessed
 * without any authentication by the client.
 *
 * Do not use this unless absolutely sure that the route is meant to be publicly
 * accessible without any role guard checks.
 */
export const AllowUnauthenticatedRequest = SetMetadata(
  ALLOW_UNAUTHENTICATED_REQ__KEY,
  true,
);
