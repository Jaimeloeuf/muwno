import type {
  api_key as DBApiKeyModel,
  user as UserModel,
} from '@prisma/client';
import type { ApiKeyDetail } from 'domain-model';

type ApiKeyModel = DBApiKeyModel & { createdBy: Pick<UserModel, 'name'> };

export const mapApiKeyModelToEntity = (
  apiKeyModel: ApiKeyModel,
): ApiKeyDetail => ({
  id: apiKeyModel.id,
  createdAt: apiKeyModel.createdAt.toISOString(),
  prefix: apiKeyModel.prefix,
  productID: apiKeyModel.productID,
  createdBy: apiKeyModel.createdBy.name,
});

export const mapApiKeyModelsToEntity = (
  apiKeyModels: Array<ApiKeyModel>,
): Array<ApiKeyDetail> => apiKeyModels.map(mapApiKeyModelToEntity);
