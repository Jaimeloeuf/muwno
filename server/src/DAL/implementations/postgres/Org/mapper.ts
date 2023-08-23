import type { org as OrgModel, plan as PlanModel } from '@prisma/client';
import type { Org } from 'domain-model';

export const mapOrgModelToEntity = (
  orgModel: OrgModel & { plan: Pick<PlanModel, 'name'> },
): Org => ({
  id: orgModel.id,
  createdAt: orgModel.createdAt.toISOString(),
  name: orgModel.name,
  email: orgModel.email,
  plan: orgModel.plan.name,
});
