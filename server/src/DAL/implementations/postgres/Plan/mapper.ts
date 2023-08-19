import type { plan as PlanModel } from '@prisma/client';
import type { Plan } from 'domain-model';

export const mapPlanModelToEntity = (planModel: PlanModel): Plan => ({
  ...planModel,
  createdAt: planModel.createdAt.toISOString(),
});

export const mapPlanModelsToEntity = (
  planModels: Array<PlanModel>,
): Array<Plan> => planModels.map(mapPlanModelToEntity);
