import type { PrismaClient } from '@prisma/client';

export async function seedOrg(prisma: PrismaClient) {
  await prisma.org.create({
    data: {
      id: '__TEST_ORG_ID__',
      name: 'HB30',
      email: 'test@thepmftool.com',
      plan: 'Standard',
      subscribed: true,
      verified: true,
    },
  });
}
