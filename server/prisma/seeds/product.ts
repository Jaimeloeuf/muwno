import type { PrismaClient } from '@prisma/client';
import { ulid } from 'ulid';

/**
 * Utility for generating ISODateTime strings
 */
const generateIsoDateTimeString = (differenceInMilliseconds = 0) =>
  new Date(new Date().getTime() + differenceInMilliseconds).toISOString();

export async function seedProduct(prisma: PrismaClient) {
  await prisma.product.createMany({
    data: [
      {
        id: ulid(),
        orgID: '__TEST_ORG_ID__',
        createdAt: generateIsoDateTimeString(-246400000),
        name: 'Product X',
      },
      {
        id: ulid(),
        orgID: '__TEST_ORG_ID__',
        createdAt: generateIsoDateTimeString(-246400000),
        name: 'thepmftool',
      },
    ],
  });
}
