import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { CustomClaimsKeys } from 'domain-model';

import { RequestJwtKey } from '../express-req-extension.js';

// Service layer Exceptions
import { InvalidInternalStateException } from '../../exceptions/index.js';

/**
 * Custom decorator to get user's auth JWT set on `req[RequestJwtKey]` in
 * `roles.guard.ts`.
 *
 * Unfortunately, NestJS param decorators cannot actually infer the return type,
 * so all params that use this decorator still need to use the `ServerJWT` type.
 * Ref: https://stackoverflow.com/questions/68662938/nestjs-param-decorator-return-type
 */
export const JWT = createParamDecorator<string>((_, ctx: ExecutionContext) => {
  const jwt = ctx.switchToHttp().getRequest<Request>()[RequestJwtKey];
  if (jwt === undefined)
    throw new InvalidInternalStateException(
      `Org not set on API Key protected route`,
    );

  return jwt;
});

/**
 * Get a specific field on the jwt instead of the whole jwt.
 *
 * Unfortunately, NestJS param decorators cannot actually infer the return type,
 * so all params that use this decorator still need to annotate the type.
 * Ref: https://stackoverflow.com/questions/68662938/nestjs-param-decorator-return-type
 */
export const JWTProperty = createParamDecorator(
  (propertyKey: string, ctx: ExecutionContext) =>
    ctx.switchToHttp().getRequest<Request>()[RequestJwtKey]?.[propertyKey],
);

/**
 * Wrapper around `JWTProperty` decorator to get the `uid: FirebaseAuthUID`
 * property from the JWT, as this is a common use case, it is added here so it
 * does not need to be duplicated everywhere.
 *
 * Unfortunately, NestJS param decorators cannot actually infer the return type,
 * so all params that use this decorator still need to annotate the type.
 * Ref: https://stackoverflow.com/questions/68662938/nestjs-param-decorator-return-type
 */
export const JWT_uid = JWTProperty('uid');

/**
 * Wrapper around `JWTProperty` decorator to get the `roles: Array<Role>`
 * property from the JWT, as this is a common use case, it is added here so it
 * does not need to be duplicated everywhere.
 *
 * Unfortunately, NestJS param decorators cannot actually infer the return type,
 * so all params that use this decorator still need to annotate the type.
 * Ref: https://stackoverflow.com/questions/68662938/nestjs-param-decorator-return-type
 */
export const JWT_roles = JWTProperty(CustomClaimsKeys.roles);
