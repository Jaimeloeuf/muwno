import type { PrismaClient } from '@prisma/client';

/**
 * Utility for generating ISODateTime strings
 */
const generateIsoDateTimeString = (differenceInMilliseconds = 0) =>
  new Date(new Date().getTime() + differenceInMilliseconds).toISOString();

export async function seedProduct(prisma: PrismaClient) {
  await prisma.product.createMany({
    data: [
      {
        orgID: '__TEST_ORG_ID__',
        createdAt: generateIsoDateTimeString(-246400000),
        name: 'Product X',
      },
      {
        orgID: '__TEST_ORG_ID__',
        createdAt: generateIsoDateTimeString(-246400000),
        name: 'thepmftool',
      },
    ],
  });
}
