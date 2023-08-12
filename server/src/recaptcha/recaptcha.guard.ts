import {
  UseGuards,
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from '../config/types.js';

import type { Request } from 'express';

import TinyJsonHttp from 'tiny-json-http';

/**
 * Decorator for Controller classes to protect controller routes with Recaptcha.
 *
 * Although this can be controller-scoped or method-scoped, it is recommended to
 * use this on methods only, and specifically methods that are publicly callable
 * without any authentication / authorisation requirements only.
 */
export const GuardWithRecaptcha = () => UseGuards(RecaptchaGuard);

/**
 * The recaptcha Guard Class guard rotes by ensuring that the requests are made
 * by humans with recaptcha validation.
 *
 * This is not exported since the expected use through the GuardWithRecaptcha
 * function as defined as above, as it is easier to use since module users do
 * not need to import UseGuards too.
 *
 * This can be exported to use this Guard in the global scope like so
 * ```TypeScript
 * const app = await NestFactory.create(AppModule);
 * app.useGlobalGuards(new RolesGuard());
 * ```
 */
@Injectable()
class RecaptchaGuard implements CanActivate {
  constructor(configService: ConfigService<EnvironmentVariables, true>) {
    const secret = configService.get('RECAPTCHA_SECRET', { infer: true });
    this.baseUrl = `https://www.recaptcha.net/recaptcha/api/siteverify?secret=${secret}`;
  }

  /**
   * Base URL of the recaptcha API service
   */
  private readonly baseUrl: string;

  /**
   * Compare role(s) assigned to the current user to the actual roles required by the current route being processed.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get the underlying Express request object
    const req = context.switchToHttp().getRequest<Request>();

    // Get the remote IP address of the user, since this service will be ran
    // behind a proxy, `x-forwarded-for` is used first to prevent using the
    // proxy's IP address as the value since it is always the same.
    const remoteIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // Get recaptcha token passed in as header (express lowercases all headers)
    const token = req.headers['x-recaptcha-token'];

    // If no token found return 401 Missing recaptcha token thus unauthorised
    if (token === undefined || token === '')
      throw new UnauthorizedException('Missing recaptcha token');

    const { body } = (await TinyJsonHttp.post({
      url: `${this.baseUrl}&response=${token}&remoteip=${remoteIP}`,
    })) as { body: { success: string; score: number; ['error-codes']: any } };

    if (!body.success) throw new UnauthorizedException(body['error-codes']);

    // @todo Allow guard user to customise this through the constructor
    if (body.score < 0.65)
      throw new UnauthorizedException(`Recaptcha score too low: ${body.score}`);

    return true;
  }
}
