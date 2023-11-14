import type { OrgID, CreateOneOrgDTO } from 'domain-model';

/**
 * Notify admin about a new Org created.
 */
export const orgCreatedNotifBuilder = (
  orgID: OrgID,
  createOneOrgDTO: CreateOneOrgDTO,
) => `<b>New Org created</b>

ID: ${orgID}
Name: ${createOneOrgDTO.name}
Email: ${createOneOrgDTO.email}
Phone: ${createOneOrgDTO.phone}
Address: ${createOneOrgDTO.address}`;
