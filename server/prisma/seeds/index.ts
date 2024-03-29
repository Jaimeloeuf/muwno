/**
 * DB Seeding entry file
 */

import { PrismaClient } from '@prisma/client';

// Individual seed files
import { seedOrg } from './org.js';
import { seedProduct } from './product.js';

async function main() {
  const prisma = new PrismaClient();

  try {
    await seedOrg(prisma);
    await seedProduct(prisma);

    await prisma.$disconnect();
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
