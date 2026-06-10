import { Router } from 'express';
import { z } from 'zod';
import rateLimit from 'express-rate-limit';
import { RATE_LIMIT } from '@pm/shared/constants';
import { prisma } from '../../config/prisma';
import { HttpError } from '../../app/errorHandler';
import {
  hashPassword,
  verifyPassword,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
  generateRefreshTokenId,
} from '../../shared/infrastructure/prisma';

export const authRouter = Router();

const registerSchema = z.object({
  email: z.string().email().max(120),
  username: z.string().min(3).max(24).regex(/^[a-zA-Z0-9_]+$/),
  password: z.string().min(8).max(128),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const refreshSchema = z.object({ refreshToken: z.string() });

const authLimiter = rateLimit({
  windowMs: RATE_LIMIT.auth.windowMs,
  max: RATE_LIMIT.auth.max,
  standardHeaders: true,
  legacyHeaders: false,
});

authRouter.post('/register', authLimiter, async (req, res, next) => {
  try {
    const body = registerSchema.parse(req.body);
    const exists = await prisma.user.findFirst({
      where: { OR: [{ email: body.email }, { username: body.username }] },
    });
    if (exists) throw new HttpError(409, 'USER_EXISTS', 'Email or username already in use');
    const passwordHash = await hashPassword(body.password);
    const user = await prisma.user.create({
      data: { email: body.email, username: body.username, passwordHash },
    });
    const tokens = await issueTokens(user.id, user.role);
    res.status(201).json({ user: publicUser(user), ...tokens });
  } catch (e) {
    next(e);
  }
});

authRouter.post('/login', authLimiter, async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) throw new HttpError(401, 'INVALID_CREDENTIALS', 'Invalid credentials');
    const ok = await verifyPassword(user.passwordHash, body.password);
    if (!ok) throw new HttpError(401, 'INVALID_CREDENTIALS', 'Invalid credentials');
    const tokens = await issueTokens(user.id, user.role);
    res.json({ user: publicUser(user), ...tokens });
  } catch (e) {
    next(e);
  }
});

authRouter.post('/refresh', async (req, res, next) => {
  try {
    const body = refreshSchema.parse(req.body);
    const payload = verifyRefreshToken(body.refreshToken);
    const tokenHash = hashToken(body.refreshToken);
    const stored = await prisma.refreshToken.findUnique({ where: { tokenHash } });
    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new HttpError(401, 'INVALID_REFRESH', 'Refresh token invalid or expired');
    }
    // rotation
    await prisma.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } });
    const user = await prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) throw new HttpError(401, 'INVALID_REFRESH', 'User not found');
    const tokens = await issueTokens(user.id, user.role);
    res.json(tokens);
  } catch (e) {
    next(e);
  }
});

authRouter.post('/logout', async (req, res, next) => {
  try {
    const body = refreshSchema.parse(req.body);
    const tokenHash = hashToken(body.refreshToken);
    await prisma.refreshToken.updateMany({ where: { tokenHash, revokedAt: null }, data: { revokedAt: new Date() } });
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

async function issueTokens(userId: string, role: 'STUDENT' | 'TEACHER' | 'ADMIN') {
  const accessToken = signAccessToken({ sub: userId, role });
  const jti = generateRefreshTokenId();
  const refreshToken = signRefreshToken({ sub: userId, jti });
  const tokenHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({ data: { userId, tokenHash, expiresAt } });
  return { accessToken, refreshToken };
}

function publicUser(u: {
  id: string;
  username: string;
  avatar: string | null;
  level: number;
  xp: number;
  coins: number;
  gems: number;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  equippedPet: string | null;
}) {
  return {
    id: u.id,
    username: u.username,
    avatar: u.avatar ?? undefined,
    level: u.level,
    xp: u.xp,
    coins: u.coins,
    gems: u.gems,
    equippedPet: u.equippedPet ?? undefined,
    role: u.role.toLowerCase() as 'student' | 'teacher' | 'admin',
  };
}
