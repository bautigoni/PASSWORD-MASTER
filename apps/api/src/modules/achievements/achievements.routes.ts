import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../config/prisma';
import { requireAuth } from '../../shared/infrastructure/authMiddleware';
import { HttpError } from '../../app/errorHandler';

export const achievementsRouter = Router();

achievementsRouter.get('/me', requireAuth, async (req, res, next) => {
  try {
    const items = await prisma.userAchievement.findMany({ where: { userId: req.user!.sub } });
    res.json(items);
  } catch (e) {
    next(e);
  }
});

const claimSchema = z.object({ id: z.string() });

achievementsRouter.post('/claim', requireAuth, async (req, res, next) => {
  try {
    const body = claimSchema.parse(req.body);
    const ach = await prisma.achievement.findUnique({ where: { id: body.id } });
    if (!ach) throw new HttpError(404, 'NOT_FOUND', 'Achievement not found');
    const already = await prisma.userAchievement.findUnique({
      where: { userId_achievementId: { userId: req.user!.sub, achievementId: ach.id } },
    });
    if (already) throw new HttpError(409, 'ALREADY_CLAIMED', 'Achievement already claimed');
    await prisma.$transaction([
      prisma.userAchievement.create({ data: { userId: req.user!.sub, achievementId: ach.id } }),
      prisma.user.update({
        where: { id: req.user!.sub },
        data: {
          coins: { increment: ach.rewardCoins },
          gems: { increment: ach.rewardGems },
          xp: { increment: ach.rewardXp },
        },
      }),
    ]);
    res.status(201).json({ claimed: ach.id });
  } catch (e) {
    next(e);
  }
});
