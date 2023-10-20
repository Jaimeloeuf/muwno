import { createInterface } from 'readline/promises';

export async function getCreds() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const STRIPE_SECRET_KEY = await rl.question('STRIPE_SECRET_KEY: ');

  rl.close();

  return { STRIPE_SECRET_KEY };
}
