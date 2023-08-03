import type { DecodedIdToken } from 'firebase-admin/auth';
import type { CustomClaims } from 'domain-model';

/**
 * Custom ServerJWT type that merges the `DecodedIdToken` type and the
 * CustomClaims object type from the domain-model.
 */
export interface ServerJWT extends DecodedIdToken, CustomClaims {}
