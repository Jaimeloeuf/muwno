import type { Org, ReadOneOrgDTO } from 'domain-model';

/**
 * Map a single Org Entity object to Read One Org DTO
 */
export const mapOrgEntityToDTO = (org: Org): ReadOneOrgDTO => ({ org });
