import { createStripeClient } from './utils/createStripeClient';

import { createStandard } from './createStandard';
import { createResponse } from './createResponse';
import { createEmail } from './createEmail';

async function main() {
  const stripe = await createStripeClient();

  // Create the products and their prices one by one
  await createStandard(stripe);
  await createResponse(stripe);
  await createEmail(stripe);
}

main();
