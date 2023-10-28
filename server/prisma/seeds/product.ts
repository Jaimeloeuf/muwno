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
        org_id: '__TEST_ORG_ID__',
        created_at: generateIsoDateTimeString(-246400000),
        name: 'Product X',
        description: 'sample description',
      },
      {
        id: ulid(),
        org_id: '__TEST_ORG_ID__',
        created_at: generateIsoDateTimeString(-246400000),
        name: 'thepmftool',
        description: 'sample description',
      },
    ],
  });
}
