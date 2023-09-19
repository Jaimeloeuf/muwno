import type { stripe_customer as StripeCustomerModel } from '@prisma/client';
import type { StripeCustomer } from '../../../../types/index.js';

export const mapStripeCustomerModelToEntity = (
  stripeCustomerModel: StripeCustomerModel,
): StripeCustomer => ({
  id: stripeCustomerModel.id,
  createdAt: stripeCustomerModel.createdAt.toISOString(),
  orgID: stripeCustomerModel.orgID,
});
