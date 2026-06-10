import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../config/prisma';
import { requireAuth } from '../../shared/infrastructure/authMiddleware';
import { HttpError } from '../../app/errorHandler';
import { XP_PER_LEVEL_BASE, XP_PER_LEVEL_GROWTH, XP_REWARDS } from '@pm/shared/constants';
import { LEVELS } from '@pm/shared/catalog';

export const progressRouter = Router();

progressRouter.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.sub } });
    if (!user) throw new HttpError(404, 'NOT_FOUND', 'User not found');
    res.json({
      xp: user.xp,
      level: user.level,
      xpToNext: xpFor(user.level + 1) - user.xp,
      coins: user.coins,
      gems: user.gems,
    });
  } catch (e) {
    next(e);
  }
});

const reportSchema = z.object({
  levelId: z.string(),
  mode: z.enum(['campaign', 'sandbox', 'challenge', 'coop', 'versus']),
  score: z.number().int().min(0),
  won: z.boolean(),
  killedEnemies: z.number().int().min(0),
  lostLives: z.number().int().min(0),
  durationSec: z.number().int().min(0),
  seed: z.string().min(4),
  payload: z.record(z.unknown()).default({}),
});

progressRouter.post('/run', requireAuth, async (req, res, next) => {
  try {
    const body = reportSchema.parse(req.body);
    const level = LEVELS.find((l) => l.id === body.levelId);
    if (!level) throw new HttpError(404, 'LEVEL_NOT_FOUND', 'Unknown level');

    let xpGain = XP_REWARDS.levelComplete;
    if (!body.won) xpGain = Math.floor(xpGain * 0.4);
    xpGain += body.killedEnemies * XP_REWARDS.enemyKill;

    const coinGain = body.won ? 50 + body.score * 0.1 : body.killedEnemies * 2;

    const user = await prisma.user.findUnique({ where: { id: req.user!.sub } });
    if (!user) throw new HttpError(404, 'NOT_FOUND', 'User not found');

    let { level: userLevel, xp } = user;
    xp += xpGain;
    while (xp >= xpFor(userLevel + 1)) userLevel += 1;

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        xp,
        level: userLevel,
        coins: { increment: coinGain },
      },
    });

    const progress = await prisma.userProgress.upsert({
      where: { userId_levelId: { userId: user.id, levelId: body.levelId } },
      update: {
        bestScore: { set: body.score },
        attempts: { increment: 1 },
        completedAt: body.won ? new Date() : undefined,
        stars: { set: body.won ? Math.max(1, Math.min(3, Math.ceil(body.score / 1000))) : undefined },
      },
      create: {
        userId: user.id,
        levelId: body.levelId,
        bestScore: body.score,
        attempts: 1,
        completedAt: body.won ? new Date() : null,
        stars: body.won ? 1 : 0,
      },
    });

    await prisma.run.create({
      data: {
        userId: user.id,
        levelId: body.levelId,
        environment: level.environment.toUpperCase() as
          | 'CITY'
          | 'SCHOOL'
          | 'BANK'
          | 'HOSPITAL'
          | 'DATACENTER',
        mode: body.mode,
        score: body.score,
        won: body.won,
        killedEnemies: body.killedEnemies,
        lostLives: body.lostLives,
        durationSec: body.durationSec,
        seed: body.seed,
        payload: body.payload,
      },
    });

    res.json({ user: updated, progress, xpGained: xpGain, coinsGained: coinGain });
  } catch (e) {
    next(e);
  }
});

export function xpFor(level: number): number {
  // cumulative XP required to *reach* `level`
  let total = 0;
  for (let l = 1; l < level; l++) total += Math.floor(XP_PER_LEVEL_BASE * Math.pow(XP_PER_LEVEL_GROWTH, l - 1));
  return total;
}
