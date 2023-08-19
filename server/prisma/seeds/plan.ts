import type { PrismaClient } from '@prisma/client';

export async function seedPlan(prisma: PrismaClient) {
  await prisma.plan.createMany({
    data: [
      { name: 'Beta Trial', active: true },
      { name: 'Basic', active: true },
      { name: 'Professional', active: true },
      { name: 'Enterprise', active: true },
    ],
  });
}
