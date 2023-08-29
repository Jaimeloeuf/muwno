import type { ApiKeyDetail } from "../ApiKey/index.js";

/**
 * Read many API Key Detail objects from API service.
 */
export type ReadManyApiKeyDTO = {
  details: Array<ApiKeyDetail>;
};
