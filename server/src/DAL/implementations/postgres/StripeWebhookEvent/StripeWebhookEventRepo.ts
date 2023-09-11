import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import type { IStripeWebhookEventRepo } from '../../../abstraction/index.js';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class StripeWebhookEventRepo implements IStripeWebhookEventRepo {
  constructor(private readonly db: PrismaService) {}

  // @todo
  // Might explore other data sources like firestore instead of hitting the main
  // postgres database.
  async isUnprocessed(id: string, type: string, livemode: boolean) {
    return (
      this.db.stripe_webhook_event
        .create({ data: { id, type, livemode, processed: false } })

        // Cast to true on success to indicate that the event is unprocessed.
        .then(() => true)

        .catch((err) => {
          // Check to ensure it is primary key constraint violation, if it is,
          // it means that the event has already been sent by Stripe and
          // received by the webhook, therefore there is no need to process it
          // again. Return false to indicate that the event is processed before.
          if (
            err instanceof Prisma.PrismaClientKnownRequestError &&
            err.code === 'P2002' // 'unique constraint violation'
          )
            return false;

          // If it is some other error, re throw the error since this method
          // should return neither true nor false.
          throw err;
        })
    );
  }

  async markAsProcessed(id: string) {
    await this.db.stripe_webhook_event.update({
      where: { id },
      data: { processed: true },
    });
  }
}
