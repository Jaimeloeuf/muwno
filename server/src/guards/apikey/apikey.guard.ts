import {
  UseGuards,
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';

import { IApiKeyRepo } from '../../DAL/index.js';
import { RequestOrgKey } from '../express-req-extension.js';

// Utils
import { sha256hash } from '../../utils/index.js';

/**
 * Decorator for Controller classes to protect API routes with API Keys.
 *
 * Although this can be controller-scoped or method-scoped, recommend to use
 * this on controllers as public API endpoints should use their own controllers.
 */
export const GuardWithApiKey = () => UseGuards(ApiKeyGuard);

/**
 * The ApiKeyGuard Class guard against requests with invalid API Keys.
 *
 * This is not exported since this Guard is expected to be used through the
 * GuardWithApiKey decorator as defined above, since it is easier to use as
 * module users do not need to import `UseGuards` too.
 */
@Injectable()
class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly logger: Logger,
    private readonly apiKeyRepo: IApiKeyRepo,
  ) {}

  /**
   * Ensure API Key validity by checking against the data source using the DAL
   * and attaching the API Key's corresponding `Org` on validation success.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get the underlying Express request object
    const req = context.switchToHttp().getRequest<Request>();

    // Get API Key from header, note that headers are all lowercased by express
    const apiKey = req.headers['x-api-key'];

    // Check if API Key is sent
    if (apiKey === undefined || typeof apiKey !== 'string' || apiKey === '')
      throw new UnauthorizedException('Missing / Invalid API key in header');

    const org = await this.apiKeyRepo.getApiKeyOrg(sha256hash(apiKey));

    // If no `Org` returned, it means that the API Key hash is not stored in DB
    // which means that it is not a valid API Key.
    if (org === null) {
      this.logger.verbose(`Invalid API Key ${apiKey}`, ApiKeyGuard.name);
      return false;
    }

    // Attach `Org` so that it can be accessible downstream using decorators.
    req[RequestOrgKey] = org;

    return true;
  }
}
