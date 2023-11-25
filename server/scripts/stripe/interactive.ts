import { getCreds } from './utils/getCreds';
import { createStripeClient } from './utils/createStripeClient';

async function interactiveScript() {
  const { STRIPE_SECRET_KEY } = await getCreds();
  const stripe = await createStripeClient(STRIPE_SECRET_KEY);

  // Run any test / interative code with this script
  console.log(await stripe.products.list());
}

interactiveScript();
