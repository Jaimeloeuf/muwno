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
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';
import type { Stripe } from 'stripe';

import { ConfigService } from '@nestjs/config';
import type { EnvironmentVariables } from '../../../config/types.js';

import {
  IStripeWebhookEventRepo,
  IStripeCustomerRepo,
} from '../../../DAL/index.js';
import { Stripe as StripeClient } from '../infra/stripe.infra.js';
import { SubscriptionService } from '../services/subscription.service.js';
import { StripeSetupintentService } from '../services/stripe-setupintent.service.js';

// Entity Types
import type {
  Invoice,
  SetupIntent,
  Subscription,
} from '../../../types/index.js';

// Exception Filters
import { UseHttpControllerFilters } from '../../../exception-filters/index.js';

/**
 * HTTP Webhook Controller for Stripe webhooks.
 * https://stripe.com/docs/webhooks#register-webhook
 */
@Controller('subscription')
@UseHttpControllerFilters
@Throttle(300, 3) // Relax throttler to ensure events are not missed
export class StripeWebhookController {
  constructor(
    private readonly logger: Logger,
    private readonly stripeWebhookEventRepo: IStripeWebhookEventRepo,
    private readonly stripeCustomerRepo: IStripeCustomerRepo,
    private readonly stripe: StripeClient,
    private readonly subscriptionService: SubscriptionService,
    private readonly stripeSetupintentService: StripeSetupintentService,

    configService: ConfigService<EnvironmentVariables, true>,
  ) {
    // Log all events that have event handlers attached conditionally to
    // register them on Stripe dashboard's webhook endpoint setup.
    // https://stripe.com/docs/webhooks#register-webhook
    if (configService.get('NODE_ENV', { infer: true }) !== 'production')
      logger.verbose(
        `Listening to these Stripe Webhook Events`,
        Object.keys(this.eventHandlerMapping),
        StripeWebhookController.name,
      );

    this.stripeWebhookSecret = configService.get('STRIPE_WEBHOOK_SECRET', {
      infer: true,
    });
  }

  /**
   * Hold the `STRIPE_WEBHOOK_SECRET` env var after reading it in constructor.
   */
  private readonly stripeWebhookSecret: string;

  /**
   * URL --> $HOSTNAME/v1/subscription/stripe/webhook
   *
   * ### Event Ordering
   * Stripe doesn’t guarantee delivery of events in the order in which they’re
   * generated. For example, creating a subscription might generate events like
   * 'customer.subscription.created', 'invoice.created' and 'invoice.paid', and
   * these are not guaranteed to be delivered in order so the handler needs to
   * deal with this accordingly.
   *
   * Stripe suggests calling its API to load missing objects as needed if the
   * received event does not have enough information to fulfil the request.
   * Reference: https://stripe.com/docs/webhooks#even-ordering
   */
  @Post('stripe/webhook')
  @HttpCode(200) // Stripe needs this for receipt of event acknowledgement
  async stripeWebhookHandler(
    @Headers('stripe-signature') stripeSignature: string,
    @Req() req: RawBodyRequest<Request>,
  ): Promise<void> {
    if (!stripeSignature)
      throw new BadRequestException(`Missing 'stripe-signature' header`);

    if (req.rawBody === undefined)
      throw new BadRequestException(`Missing request body`);

    /**
     * Verify a Stripe webhook event by checking its signature before creating
     * `Event` object to process. If this throws, the caller will get it.
     */
    const event = await this.stripe.webhooks.constructEvent(
      req.rawBody,
      stripeSignature,
      this.stripeWebhookSecret,
    );

    // Use setTimeout to simulate a 'defer' operation so that this can respond
    // back to Stripe ASAP with a 200 status code as specified by Stripe's
    // Webhook best practices.
    //
    // Reference: https://stripe.com/docs/webhooks#webhook-endpoint-def
    // 'Quickly returns successful status code (2xx) prior to any complex logic
    // that could cause a timeout. For example, you must return a 200 response
    // before updating a customer's invoice as paid in your accounting system.'
    setTimeout(() => this.handleEvent(event));
  }

  /**
   * Handle a Stripe Webhook Event
   * 1. Ensure indempotency of event processing
   * 1. Logging (log event.id and event.type)
   * 1. Dispatch specific event's handlers
   * 1. Mark event as processed once its handler completes
   */
  private async handleEvent(event: Stripe.Event) {
    // Check with data persistence layer if the event has been processed before.
    // Doing this to ensure our method is idempotent.
    // Reference: https://stripe.com/docs/webhooks#handle-duplicate-events
    const eventIsUnprocessed = await this.stripeWebhookEventRepo.isUnprocessed(
      event.id,
      event.type,
      event.livemode,
    );

    // Do indempotency check, if event is already processed before, ignore it.
    if (!eventIsUnprocessed) {
      // @todo
      // Indempotency check might also trigger a background job with setTimeout
      // to delete events older than X (e.g. 30) days so that the DB does not
      // grow unconstrained overtime.
      return;
    }

    const modeString = event.livemode ? 'live' : 'test';

    this.logger.verbose(
      `Processing '${modeString}' Stripe event: ${event.id} -> ${event.type}`,
      StripeWebhookController.name,
    );

    // Use `eventHandlerMapping` to get specific event handler with `event.type`
    // in a dynamic dispatch style.
    const eventHandler = this.eventHandlerMapping[event.type];

    // If there is a event handler registered for the event.type, run handler
    // and await for completion before marking it as processed.
    if (eventHandler !== undefined) {
      await eventHandler(event);

      // Once event handler exits and did not throw, event is assumed to be
      // fully handled/processed, mark it in the DB for diagnostics.
      await this.stripeWebhookEventRepo.markAsProcessed(event.id);
    }

    // If no event handler is registered for the event.type but Stripe is
    // configured to send a event of that event.type, log it out as a potential
    // issue / warning. Configure what events to be sent to the Webhook endpoint
    // in Stripe to ensure only required events are sent.
    else
      this.logger.warn(
        `Unhandled '${modeString}' Stripe event: ${event.id} -> ${event.type}`,
        StripeWebhookController.name,
      );
  }

  /**
   * A mapping of `event.type` strings to event handler methods.
   *
   * To add a new mapping, make sure the event is sent by Stripe by configuring
   * the webhook settings in Stripe dashboard.
   *
   * Main events to listen to for subscription model like ours
   * https://stripe.com/docs/billing/subscriptions/webhooks
   *
   * All the possible Webhook event types
   * https://stripe.com/docs/api/events/types
   */
  private readonly eventHandlerMapping: Record<
    string,
    (event: Stripe.Event) => void | Promise<void>
  > = {
    // ======================== Payment related Events ========================

    /**
     * When an SetupIntent has successfully setup a payment method, call setup
     * intent service method to handle it.
     *
     * ### Note
     * This might be called twice for a single SetupIntent created on our end
     * because Stripe might create the `Stripe Link` payment method for user if
     * they allow it in SetupPaymentMethod view.
     */
    'setup_intent.succeeded': async (event) => {
      /**
       * Stripe library does not define concrete type for this so it needs to be
       * type casted manually. Type only includes data of what is needed.
       * @todo Parse with Zod or smth
       */
      const setupIntent = event.data.object as SetupIntent;

      // @todo
      // Alternatively, use `setupIntentSucceededEvent.metadata` to reflect
      // `StripeSetupNext` instead of storing and loading it.

      await this.stripeSetupintentService.onSetupIntentSuccess(setupIntent);
    },

    // ===================== Activate Subscription Events =====================

    /**
     * TLDR, user has paid for subscription, provision access to product.
     *
     * Event sent when invoice is paid, the system can provision access to the
     * product once it receives this event and after checking to ensure that the
     * subscription status is active.
     *
     * This event is sent both on the first time the subscription is paid for,
     * and also after every subsequent successful payment, so system should
     * continue to provision access to the product as payments continue to be
     * made. Store the status in database and check when a user accesses your
     * service to avoid hitting Stripe API rate limits.
     */
    'invoice.paid': async (event) => {
      /**
       * Stripe library does not define concrete type for this so it needs to be
       * type casted manually. Type only includes data of what is needed.
       * @todo Parse with Zod or smth
       */
      const invoice = event.data.object as Invoice;

      const stripeCustomer =
        await this.stripeCustomerRepo.getCustomerWithStripeCustomerID(
          invoice.customer,
        );

      // @todo Send admins details to investigate and manually recouncil this
      if (stripeCustomer === null) {
        throw new Error(
          `${event.id}-${event.type}-${invoice.subscription}-${invoice.customer}-${invoice.customer_email}`,
        );
      }

      // Provision access to the product
      await this.subscriptionService.activateSubscription(stripeCustomer.orgID);

      this.logger.verbose(
        `Stripe Customer ${stripeCustomer.id}, Org ${stripeCustomer.orgID}, paid for ${invoice.subscription}`,
        StripeWebhookController.name,
      );
    },

    // ==================== Deactivate Subscription Events ====================

    /**
     * TLDR, subscription payment failed, stop provisioning access to product.
     *
     * Event sent when a payment for an invoice failed, either because the
     * payment failed or the customer does not have a valid payment method.
     * The subscription becomes past_due. Stripe suggests to notify customer and
     * send them to the Stripe Customer Billing portal to update their payment
     * information and revoke their access to the product
     *
     * If a payment fails, there are several possible actions to take:
     * 1. Notify the customer, configure subscription settings to enable Smart
     *    Retries and other revenue recovery features.
     * 1. https://stripe.com/docs/billing/subscriptions/overview#settings
     * 1. https://stripe.com/docs/billing/revenue-recovery/smart-retries
     */
    'invoice.payment_failed': async (event) => {
      /**
       * Stripe library does not define concrete type for this so it needs to be
       * type casted manually. Type only includes data of what is needed.
       * @todo Parse with Zod or smth
       */
      const invoice = event.data.object as Invoice;

      const stripeCustomer =
        await this.stripeCustomerRepo.getCustomerWithStripeCustomerID(
          invoice.customer,
        );

      // @todo Send admins details to investigate and manually recouncil this
      if (stripeCustomer === null) {
        throw new Error(
          `${event.id}-${event.type}-${invoice.id}-${invoice.customer}`,
        );
      }

      this.logger.verbose(
        `Stripe Customer ${stripeCustomer.id}, Org ${stripeCustomer.orgID}, did not pay invoice ${invoice.id}`,
        StripeWebhookController.name,
      );

      // Stop provisioning access to the product
      await this.subscriptionService.deactivateSubscription(
        stripeCustomer.orgID,
      );
    },

    /**
     * Customer's subscription ended, stop provisioning access to product.
     */
    'customer.subscription.deleted': async (event) => {
      /**
       * Stripe library does not define concrete type for this so it needs to be
       * type casted manually. Type only includes data of what is needed.
       * @todo Parse with Zod or smth
       */
      const subscription = event.data.object as Subscription;

      const stripeCustomer =
        await this.stripeCustomerRepo.getCustomerWithStripeCustomerID(
          subscription.customer,
        );

      // @todo Send admins details to investigate and manually recouncil this
      if (stripeCustomer === null) {
        throw new Error(
          `${event.id}-${event.type}-${subscription.id}-${subscription.customer}`,
        );
      }

      this.logger.verbose(
        `Stripe Customer ${stripeCustomer.id}, Org ${stripeCustomer.orgID}, ended their subscription ${subscription.id}`,
        StripeWebhookController.name,
      );

      // Stop provisioning access to the product
      await this.subscriptionService.deactivateSubscription(
        stripeCustomer.orgID,
      );
    },

    /**
     * When customer's subscription schedule is canceled, which also cancels any
     * active associated subscription, stop provisioning access to product.
     */
    'subscription_schedule.canceled': (event) => {
      event;
    },

    // =================== Other Subscription related Events ===================

    /**
     * TLDR, customer's subscription status updated.
     *
     * Event sent when a subscription starts or changes. For example, renewing a
     * subscription, adding a coupon, applying a discount, adding an invoice
     * item, switching from one plan to another, or changing the status from
     * trial to active all trigger this event.
     * https://stripe.com/docs/billing/subscriptions/change
     *
     * @todo
     * Currently not handling this event since the example use cases are all not
     * supported yet. The most important usecase is probably 'change of plans'.
     * Technically for other events like created/cancelled, the specific event
     * itself will be sent anyways so dont have to handle those cases here.
     */
    'customer.subscription.updated': (event) => {
      this.logger.warn(
        `Unhandled but registered webhook method called: ${event.type} -> ${event.id}`,
        StripeWebhookController.name,
      );
    },
  };
}
