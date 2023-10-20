import { getArgv } from './utils/getArgv';
import { getCreds } from './utils/getCreds';
import { createStripeClient } from './utils/createStripeClient';
import { noOp, createIdempotentKeyFF } from './utils/createIdempotentKeyFF';

import { createStandard } from './createStandard';
import { createResponse } from './createResponse';
import { createEmail } from './createEmail';

async function main() {
  const { ik } = getArgv();

  const { STRIPE_SECRET_KEY } = await getCreds();
  const stripe = await createStripeClient(STRIPE_SECRET_KEY);

  // Create with utility function with factory function
  const createIdempotentKey =
    ik === undefined ? noOp : createIdempotentKeyFF(ik);

  // Create the products and their prices one by one
  await createStandard(stripe, createIdempotentKey);
  await createResponse(stripe, createIdempotentKey);
  await createEmail(stripe, createIdempotentKey);
}

main();
