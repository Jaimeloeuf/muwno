import type { org as OrgModel } from '@prisma/client';
import type { Org, SubscriptionPlan, OrgSize } from 'domain-model';

export const mapOrgModelToEntity = (orgModel: OrgModel): Org => ({
  id: orgModel.id,
  createdAt: orgModel.created_at.toISOString(),
  name: orgModel.name,
  email: orgModel.email,
  phone: orgModel.phone,
  address: orgModel.address,
  size: orgModel.size as OrgSize | null,
  plan: orgModel.plan as SubscriptionPlan | null,
  verified: orgModel.verified,
});
