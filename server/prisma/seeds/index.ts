/**
 * DB Seeding entry file
 */

import { PrismaClient } from '@prisma/client';

// Individual seed files
import { seedPlan } from './plan';
import { seedOrg } from './org';

async function main() {
  const prisma = new PrismaClient();

  try {
    await seedPlan(prisma);
    await seedOrg(prisma);

    await prisma.$disconnect();
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
