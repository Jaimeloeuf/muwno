/**
 * DB Seeding entry file
 */

import { PrismaClient } from '@prisma/client';

// Individual seed files
// import { seedItem } from './item';

async function main() {
  const prisma = new PrismaClient();

  try {
    // await seedItem(prisma);

    await prisma.$disconnect();
  } catch (error) {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
