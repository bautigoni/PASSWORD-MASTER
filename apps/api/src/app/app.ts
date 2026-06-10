import express, { type Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { RATE_LIMIT } from '@pm/shared/constants';
import { errorHandler } from './errorHandler';
import { authRouter } from '../modules/auth/auth.routes';
import { usersRouter } from '../modules/users/users.routes';
import { progressRouter } from '../modules/progress/progress.routes';
import { catalogRouter } from '../modules/catalog/catalog.routes';
import { achievementsRouter } from '../modules/achievements/achievements.routes';
import { multiplayerRouter } from '../modules/multiplayer/multiplayer.routes';
import { teacherRouter } from '../modules/teacher/teacher.routes';

export function buildApp(): Express {
  const app = express();

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors({ origin: env.CORS_ORIGIN.split(','), credentials: true }));
  app.use(express.json({ limit: '256kb' }));
  app.use(pinoHttp({ logger }));

  app.use(
    rateLimit({
      windowMs: RATE_LIMIT.global.windowMs,
      max: RATE_LIMIT.global.max,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.get('/api/v1/health', (_req, res) => res.json({ status: 'ok', version: '0.1.0' }));

  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/users', usersRouter);
  app.use('/api/v1/progress', progressRouter);
  app.use('/api/v1/catalog', catalogRouter);
  app.use('/api/v1/achievements', achievementsRouter);
  app.use('/api/v1/multiplayer', multiplayerRouter);
  app.use('/api/v1/teacher', teacherRouter);

  app.use((req, res) => res.status(404).json({ error: { code: 'NOT_FOUND', message: 'No route' } }));
  app.use(errorHandler);
  return app;
}
