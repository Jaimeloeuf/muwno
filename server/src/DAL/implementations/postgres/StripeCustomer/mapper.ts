import type { stripe_customer as StripeCustomerModel } from '@prisma/client';
import type { Customer } from '../../../../types/index.js';

export const mapStripeCustomerModelToEntity = (
  stripeCustomerModel: StripeCustomerModel,
): Customer => ({
  id: stripeCustomerModel.id,
  meteredSubscriptionID: stripeCustomerModel.metered_subscription_id,
  createdAt: stripeCustomerModel.created_at.toISOString(),
  orgID: stripeCustomerModel.org_id,
});
