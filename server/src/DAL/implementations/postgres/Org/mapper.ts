import type { org as OrgModel } from '@prisma/client';
import type { Org, SubscriptionPlan } from 'domain-model';

export const mapOrgModelToEntity = (orgModel: OrgModel): Org => ({
  id: orgModel.id,
  createdAt: orgModel.createdAt.toISOString(),
  name: orgModel.name,
  email: orgModel.email,
  plan: orgModel.plan as SubscriptionPlan | null,
});
