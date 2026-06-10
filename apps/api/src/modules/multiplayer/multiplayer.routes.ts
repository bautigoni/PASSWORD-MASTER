import { Router } from 'express';
import { z } from 'zod';
import { customAlphabet } from 'nanoid';
import { prisma } from '../../config/prisma';
import { requireAuth } from '../../shared/infrastructure/authMiddleware';
import { HttpError } from '../../app/errorHandler';
import { LEVELS } from '@pm/shared/catalog';

const code = customAlphabet('ABCDEFGHJKMNPQRSTUVWXYZ23456789', 6);

export const multiplayerRouter = Router();

const createSchema = z.object({
  mode: z.enum(['coop', 'versus']),
  levelId: z.string(),
});

multiplayerRouter.post('/rooms', requireAuth, async (req, res, next) => {
  try {
    const body = createSchema.parse(req.body);
    if (!LEVELS.find((l) => l.id === body.levelId)) {
      throw new HttpError(404, 'LEVEL_NOT_FOUND', 'Level not found');
    }
    const room = await prisma.multiplayerRoom.create({
      data: {
        code: code(),
        hostId: req.user!.sub,
        mode: body.mode,
        levelId: body.levelId,
        seed: Math.random().toString(36).slice(2, 10),
      },
    });
    res.status(201).json({ code: room.code, levelId: room.levelId, mode: room.mode, seed: room.seed });
  } catch (e) {
    next(e);
  }
});

multiplayerRouter.post('/rooms/:code/join', requireAuth, async (req, res, next) => {
  try {
    const room = await prisma.multiplayerRoom.findUnique({ where: { code: req.params.code } });
    if (!room) throw new HttpError(404, 'NOT_FOUND', 'Room not found');
    if (room.status !== 'open') throw new HttpError(409, 'ROOM_CLOSED', 'Room not open');
    res.json({ code: room.code, levelId: room.levelId, mode: room.mode });
  } catch (e) {
    next(e);
  }
});

multiplayerRouter.get('/rooms/:code', requireAuth, async (req, res, next) => {
  try {
    const room = await prisma.multiplayerRoom.findUnique({ where: { code: req.params.code } });
    if (!room) throw new HttpError(404, 'NOT_FOUND', 'Room not found');
    res.json(room);
  } catch (e) {
    next(e);
  }
});

multiplayerRouter.post('/rooms/:code/finish', requireAuth, async (req, res, next) => {
  try {
    const won = !!req.body?.won;
    const room = await prisma.multiplayerRoom.update({
      where: { code: req.params.code },
      data: { status: 'finished', finishedAt: new Date() },
    });
    if (room.mode === 'versus') {
      const user = await prisma.user.findUnique({ where: { id: req.user!.sub } });
      if (user) {
        const stats = await prisma.multiplayerStats.upsert({
          where: { userId: user.id },
          update: {
            wins: won ? { increment: 1 } : undefined,
            losses: won ? undefined : { increment: 1 },
            elo: { increment: won ? 15 : -10 },
          },
          create: { userId: user.id, wins: won ? 1 : 0, losses: won ? 0 : 1, elo: won ? 1015 : 990 },
        });
        res.json({ ok: true, stats });
        return;
      }
    }
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});
