import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../../config/prisma';
import { requireAuth } from '../../shared/infrastructure/authMiddleware';
import { HttpError } from '../../app/errorHandler';

export const usersRouter = Router();

usersRouter.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user!.sub } });
    if (!user) throw new HttpError(404, 'NOT_FOUND', 'User not found');
    res.json(serialize(user));
  } catch (e) {
    next(e);
  }
});

const patchSchema = z.object({
  username: z.string().min(3).max(24).regex(/^[a-zA-Z0-9_]+$/).optional(),
  avatar: z.string().max(280).url().optional(),
  equippedPet: z.enum(['BYTE', 'FIREWALL_DOG', 'CYBER_OWL', 'PASSWORD_PANDA', 'HACK_HUNTER']).optional(),
});

usersRouter.patch('/me', requireAuth, async (req, res, next) => {
  try {
    const body = patchSchema.parse(req.body);
    const user = await prisma.user.update({ where: { id: req.user!.sub }, data: body });
    res.json(serialize(user));
  } catch (e) {
    next(e);
  }
});

usersRouter.get('/me/full', requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.sub },
      include: {
        progress: true,
        achievements: true,
        pets: true,
        multiplayerStats: true,
      },
    });
    if (!user) throw new HttpError(404, 'NOT_FOUND', 'User not found');
    res.json(serialize(user, true));
  } catch (e) {
    next(e);
  }
});

function serialize(u: Record<string, unknown>, full = false) {
  const base = {
    id: u.id,
    email: u.email,
    username: u.username,
    avatar: u.avatar,
    level: u.level,
    xp: u.xp,
    coins: u.coins,
    gems: u.gems,
    equippedPet: u.equippedPet,
    role: (u.role as string)?.toLowerCase(),
  };
  if (!full) return base;
  return {
    ...base,
    progress: u.progress,
    achievements: u.achievements,
    pets: u.pets,
    multiplayerStats: u.multiplayerStats,
    createdAt: u.createdAt,
  };
}
