import type { api_key as ApiKeyModel } from '@prisma/client';
import type { ApiKeyDetail } from 'domain-model';

export const mapApiKeyModelToEntity = (
  apiKeyModel: ApiKeyModel,
): ApiKeyDetail => ({
  id: apiKeyModel.id,
  createdAt: apiKeyModel.created_at.toISOString(),
  orgID: apiKeyModel.org_id,
  prefix: apiKeyModel.prefix,
  createdBy: apiKeyModel.created_by,
  description: apiKeyModel.description,
});

export const mapApiKeyModelsToEntity = (
  apiKeyModels: Array<ApiKeyModel>,
): Array<ApiKeyDetail> => apiKeyModels.map(mapApiKeyModelToEntity);
