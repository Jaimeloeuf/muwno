import {
  Controller,
  Logger,
  Post,
  HttpCode,
  Headers,
  RawBodyRequest,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import type { Stripe } from 'stripe';

import { IStripeWebhookEventRepo } from '../../../DAL/index.js';
import { SubscriptionService } from '../services/subscription.service.js';
import { StripeService } from '../../../infra/index.js';

// Exception Filters
import { UseHttpControllerFilters } from '../../../exception-filters/index.js';

/**
 */
@Controller('subscription')
@UseHttpControllerFilters
export class StripeWebhookController {
  constructor(
    private readonly logger: Logger,
    private readonly stripeWebhookEventRepo: IStripeWebhookEventRepo,
    private readonly subscriptionService: SubscriptionService,
    private readonly stripeService: StripeService,
  ) {}

  /**
   * URL --> $HOSTNAME/v1/subscription/stripe/webhook
   */
  @Post('stripe/webhook')
  @HttpCode(200) // Stripe needs this for receipt of event acknowledgement
  async stripeWebhookHandler(
    @Headers('stripe-signature') stripeSignature: string,
    @Req() req: RawBodyRequest<Request>,
  ): Promise<void> {
    if (!stripeSignature)
      throw new BadRequestException(`Missing 'stripe-signature' header`);

    const rawRequestBody = req.rawBody;

    if (rawRequestBody === undefined)
      throw new BadRequestException(`Missing request body`);

    // Use setTimeout to simulate a 'defer' operation so that this can respond
    // back to Stripe ASAP with a 200 status code as specified by Stripe's
    // Webhook best practices.
    //
    // Reference: https://stripe.com/docs/webhooks#webhook-endpoint-def
    // 'Quickly returns successful status code (2xx) prior to any complex logic
    // that could cause a timeout. For example, you must return a 200 response
    // before updating a customer’s invoice as paid in your accounting system.'
    setTimeout(() => this.handleEvent(rawRequestBody, stripeSignature));
  }

  /**
   * Handle a Stripe Webhook Event
   *
   * 1. Validate event using webhook signatures
   * 1. Ensure indempotency of event processing
   * 1. Dispatch specific event's handlers
   */
  private async handleEvent(rawRequestBody: Buffer, stripeSignature: string) {
    const event = await this.stripeService.verifyAndConstructEvent(
      rawRequestBody,
      stripeSignature,
    );

    // Check with data persistence layer if the event has been processed before.
    // Doing this because this method should be indempotent.
    // Reference: https://stripe.com/docs/webhooks#handle-duplicate-events
    const eventIsUnprocessed = await this.stripeWebhookEventRepo.isUnprocessed(
      event.id,
    );

    // Do indempotency check, if event is already processed before, ignore it.
    if (!eventIsUnprocessed) {
      // @todo
      // Indempotency check might also trigger a background job with setTimeout
      // to delete events older than X (e.g. 30) days so that the DB does not
      // grow unconstrained overtime.
      return;
    }

    await this.processEvent(event);
  }

  /**
   * Process event
   *
   * 1. Logging (log event.id and event.type)
   * 1. Dispatch specific event's handlers
   */
  private async processEvent(event: Stripe.Event) {
    this.logger.verbose(
      `Processing Stripe event: ${event.id} -> ${event.type}`,
      StripeWebhookController.name,
    );
  }
}
