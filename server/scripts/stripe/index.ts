import { getArgv } from './utils/getArgv';
import { loadEnvVarFromFile } from './utils/loadEnvVarFromFile';
import { createStripeClient } from './utils/createStripeClient';
import { noOp, createIdempotentKeyFF } from './utils/createIdempotentKeyFF';

import { createStandard } from './createStandard';
import { createResponse } from './createResponse';
import { createEmail } from './createEmail';

async function main() {
  const { nodeEnv, ik } = getArgv();

  loadEnvVarFromFile(nodeEnv);

  const stripe = await createStripeClient();

  // Create with utility function with factory function
  const createIdempotentKey =
    ik === undefined ? noOp : createIdempotentKeyFF(ik);

  // Create the products and their prices one by one
  await createStandard(stripe, createIdempotentKey);
  await createResponse(stripe, createIdempotentKey);
  await createEmail(stripe, createIdempotentKey);
}

main();
