import type { ApiKeyDetail } from "../ApiKey/index.js";

/**
 * Read one API Key Detail object and get back the API key itself from API service.
 */
export type ReadOneApiKeyDTO = ApiKeyDetail & {
  key: string;
};
