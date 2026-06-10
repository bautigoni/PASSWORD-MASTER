import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, type AccessTokenPayload } from './prisma';
import { HttpError } from '../../app/errorHandler';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.header('authorization');
  if (!header?.startsWith('Bearer ')) {
    return next(new HttpError(401, 'UNAUTHORIZED', 'Missing access token'));
  }
  try {
    req.user = verifyAccessToken(header.slice(7));
    next();
  } catch {
    next(new HttpError(401, 'UNAUTHORIZED', 'Invalid access token'));
  }
}

export function requireRole(role: AccessTokenPayload['role']) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(new HttpError(401, 'UNAUTHORIZED', 'No user'));
    if (req.user.role !== role && req.user.role !== 'ADMIN') {
      return next(new HttpError(403, 'FORBIDDEN', `Requires ${role}`));
    }
    next();
  };
}
