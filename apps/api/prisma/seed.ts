import { PrismaClient } from '@prisma/client';
import { ACHIEVEMENTS } from '@pm/shared/catalog';

const prisma = new PrismaClient();

async function main() {
  for (const a of ACHIEVEMENTS) {
    await prisma.achievement.upsert({
      where: { id: a.id },
      update: {
        name: a.name,
        description: a.description,
        rewardCoins: a.reward.coins ?? 0,
        rewardGems: a.reward.gems ?? 0,
        rewardXp: a.reward.xp ?? 0,
        icon: a.icon,
      },
      create: {
        id: a.id,
        name: a.name,
        description: a.description,
        rewardCoins: a.reward.coins ?? 0,
        rewardGems: a.reward.gems ?? 0,
        rewardXp: a.reward.xp ?? 0,
        icon: a.icon,
      },
    });
  }
  console.log(`Seeded ${ACHIEVEMENTS.length} achievements.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
