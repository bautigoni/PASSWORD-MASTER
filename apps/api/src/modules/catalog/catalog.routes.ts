import { Router } from 'express';
import { TOWERS, ENEMIES } from '@pm/shared/balance';
import { LEVELS, ACHIEVEMENTS, PETS } from '@pm/shared/catalog';
import { prisma } from '../../config/prisma';

export const catalogRouter = Router();

catalogRouter.get('/towers', (_req, res) => res.json(TOWERS));
catalogRouter.get('/enemies', (_req, res) => res.json(ENEMIES));
catalogRouter.get('/levels', (req, res) => {
  const env = req.query.env;
  const filtered = env ? LEVELS.filter((l) => l.environment === env) : LEVELS;
  res.json(filtered);
});
catalogRouter.get('/achievements', async (_req, res, next) => {
  try {
    const db = await prisma.achievement.findMany();
    res.json(db.length ? db : ACHIEVEMENTS);
  } catch (e) {
    next(e);
  }
});
catalogRouter.get('/pets', (_req, res) => res.json(PETS));
