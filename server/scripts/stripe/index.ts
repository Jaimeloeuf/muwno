import { getArgv } from './utils/getArgv';
import { loadEnvVarFromFile } from './utils/loadEnvVarFromFile';
import { createStripeClient } from './utils/createStripeClient';
import { noOp, createIndempotentKeyFF } from './utils/createIndempotentKeyFF';

import { createStandard } from './createStandard';
import { createResponse } from './createResponse';
import { createEmail } from './createEmail';

async function main() {
  const { nodeEnv, ik } = getArgv();

  loadEnvVarFromFile(nodeEnv);

  const stripe = await createStripeClient();

  // Create with utility function with factory function
  const createIndempotentKey =
    ik === undefined ? noOp : createIndempotentKeyFF(ik);

  // Create the products and their prices one by one
  await createStandard(stripe, createIndempotentKey);
  await createResponse(stripe, createIndempotentKey);
  await createEmail(stripe, createIndempotentKey);
}

main();
