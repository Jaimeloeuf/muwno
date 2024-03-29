import {
  UseGuards,
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { IAuthService } from '../../infra/index.js';
import type { Request } from 'express';
import type { Role } from 'domain-model';
import { CustomClaimsKeys } from 'domain-model';

import { ROLES_KEY } from './roles.decorator.js';
import { STRICT_RBAC_KEY } from './rbac-strictness.decorator.js';
import { isRoles } from './roles.utils.js';
import { RequestJwtKey } from '../express-req-extension.js';
import { ALLOW_UNAUTHENTICATED_REQ__KEY } from './auth.decorator.js';

/**
 * Decorator for Controller classes to protect API routes with RBAC. Any
 * controller that uses this decorator will need to explicitly set a role
 * requirement for all the routes using the `RolesRequired` or `NoRolesRequired`
 * decorators from 'roles.decorator.ts' if not the service will error out and
 * exit on the first request to the route without any explicit role requirement.
 *
 * Although this can be controller-scoped or method-scoped, it is recommended to
 * use this on controllers only, because a single resource should have a common
 * guard requirement, and controllerS usually groups different access methods
 * of the same resource together, it is better to apply this Guard decorator to
 * the controller to denote that the specific resource is protected with RBAC.
 */
export const GuardWithRBAC = () => UseGuards(RolesGuard);

/**
 * The RBAC Guard Class that compare role(s) assigned to the current user making
 * the request to the actual roles required by the current route being processed.
 *
 * This is not exported since this Guard is expected to be used through the
 * GuardWithRBAC decorator as defined above, since it is easier to use as module
 * users do not need to import `UseGuards` too.
 *
 * This can be exported to use this Guard in the global scope like so
 * ```TypeScript
 * const app = await NestFactory.create(AppModule);
 * app.useGlobalGuards(new RolesGuard());
 * ```
 */
@Injectable()
class RolesGuard implements CanActivate {
  constructor(
    private readonly logger: Logger,
    private readonly reflector: Reflector,
    private readonly auth: IAuthService,
  ) {}

  /**
   * Compare role(s) assigned to the current user to the actual roles required
   * by the current route being processed.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get the roles required by the current route being processed as specified
    // by the Roles decorator. This checks for any roles specified on both the
    // route method itself and its parent controller class. If there is a role
    // specified on both the route method and the parent controller, the role
    // specified on the route method itself will take precedence.
    // It can be undefined if there is no roles set with the decorators.
    const requiredRoles = this.reflector.getAllAndOverride<
      undefined | Array<Role>
    >(ROLES_KEY, [context.getHandler(), context.getClass()]);

    // Check if `requiredRoles` is set.
    if (requiredRoles === undefined) {
      // Check for an explicitly set publicly accessible property. If it is set,
      // treat the route as publicly accessible and allow all requests to access
      // it by returning true here.
      //
      // This checks for any roles specified on both the route method itself and
      // its parent controller class. If it is specified on both the route
      // method and the parent controller, the value set on the route method
      // will take precedence.
      if (
        this.reflector.getAllAndOverride<undefined | true>(
          ALLOW_UNAUTHENTICATED_REQ__KEY,
          [context.getHandler(), context.getClass()],
        )
      )
        return true;

      // If `requiredRoles` is not set and the route is not explicitly labelled
      // to be publicly accessible, then throw an error as all routes need to
      // have role requirements or publicly accessible property set explicitly.
      this.logger.error(
        `INTERNAL ERROR: Missing Authz Role for ${context.getClass().name}'s ${
          context.getHandler().name
        } method`,
        RolesGuard.name,
      );

      this.logger.error('Killing Process now', RolesGuard.name);

      // Not the best way but the simplest way that will always work.
      // Alternative is to call app.close() in main.ts with a event.
      // Ref: https://stackoverflow.com/questions/57146395/how-to-trigger-application-shutdown-from-a-service-in-nest-js
      return process.exit(1);
    }

    // Get the underlying Express request object
    const req = context.switchToHttp().getRequest<Request>();

    // Check if auth token is set, note that headers are lowercased by express
    if (!req.headers.authorization)
      throw new UnauthorizedException('Missing auth header');

    // Get authentication scheme and encoded token from header
    const [authScheme, jwtString] = req.headers.authorization.split(' ');

    // Check if Bearer Authentication Scheme used, end request on invalid scheme
    if (authScheme !== 'Bearer')
      throw new UnauthorizedException('Expected Bearer Authentication Scheme');

    // Throw error on missing token string. Although auth service can also throw
    // an error on empty jwtString, it throws a generic error type, therefore
    // this guard clause is used to have a more accurate error response message.
    if (jwtString === '' || jwtString === undefined)
      throw new UnauthorizedException('Missing auth token');

    // Get optional RBAC strictness requirement of route, where `true` means
    // the route requires a round trip to auth service provider to check if
    // token is revoked to ensure the token's RBAC claims is accurate.
    //
    // This checks for strictness requirement specified on both route method
    // itself and its parent controller class. If it is specified on both route
    // method and controller, the strictness requirement specified on the route
    // method itself will take precedence.
    const checkRevoked = this.reflector.getAllAndOverride<true | undefined>(
      STRICT_RBAC_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Verify JWT string using Auth service.
    const jwt = await this.auth.verifyJWT(jwtString, checkRevoked);

    // Attach decoded token to req object to use downstream.
    req[RequestJwtKey] = jwt;

    // If there is no roles required, allow request immediately
    if (requiredRoles.length === 0) return true;

    // Get the roles value out from the custom claims object on the JWT
    const roles = jwt[CustomClaimsKeys.roles];

    // Validate the JWT `roles` claim with a type predicate
    if (!isRoles(roles))
      throw new UnauthorizedException('Invalid "roles" claim in JWT');

    // Check if user's role(s) matches any one of the required roles.
    // Return true on first matching role
    for (const requiredRole of requiredRoles)
      if (roles.includes(requiredRole)) return true;

    // None of the user's role(s) match any of the required roles
    return false;
  }
}
