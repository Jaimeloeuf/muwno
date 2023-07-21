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
        name: 'Superhuman',
        daysPerSprint: 7,
        firstSprint: generateIsoDateTimeString(-246400000),
      },
      {
        orgID: '__TEST_ORG_ID__',
        createdAt: generateIsoDateTimeString(-246400000),
        name: 'theprodtool',
        daysPerSprint: 14,
        firstSprint: generateIsoDateTimeString(-246400000),
      },

      {
        orgID: '__TEST_ORG_ID__',
        createdAt: generateIsoDateTimeString(-246400000),
        name: 'HAS',
        daysPerSprint: 14,
        firstSprint: generateIsoDateTimeString(-246400000),
      },
    ],
  });
}
