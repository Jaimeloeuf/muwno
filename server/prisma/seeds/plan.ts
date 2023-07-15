import type { PrismaClient } from '@prisma/client';

export async function seedPlan(prisma: PrismaClient) {
  await prisma.plan.createMany({
    data: [
      { name: 'Beta Trial' },
      { name: 'Basic' },
      { name: 'Professional' },
      { name: 'Enterprise' },
    ],
  });
}
