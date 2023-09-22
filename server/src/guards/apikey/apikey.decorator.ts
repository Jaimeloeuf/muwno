import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

import { RequestOrgKey } from '../express-req-extension.js';

// Service layer Exceptions
import { InvalidInternalStateException } from '../../exceptions/index.js';

/**
 * Custom decorator to get Org set on `req[RequestOrgKey]` in `apikey.guard.ts`.
 *
 * This checks to ensure that `Org` is set, if `Org` is not set, it means that
 * either this is used on a route that is not protected by the API Key guard or
 * it was not set properly in the guard, either ways its an internal error.
 *
 * Unfortunately, NestJS param decorators cannot actually infer the return type,
 * so all params that use this decorator still need to type annotate with `Org`.
 * Ref: https://stackoverflow.com/questions/68662938/nestjs-param-decorator-return-type
 */
export const ApiKeyOrg = createParamDecorator<string>(
  (_, ctx: ExecutionContext) => {
    const org = ctx.switchToHttp().getRequest<Request>()[RequestOrgKey];
    if (org === undefined)
      throw new InvalidInternalStateException(
        `Org not set on API Key protected route`,
      );

    return org;
  },
);
