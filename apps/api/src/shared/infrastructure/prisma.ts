import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { createHash, randomBytes } from 'node:crypto';
import { env } from '../../config/env';
import { AUTH } from '@pm/shared/constants';

export interface AccessTokenPayload {
  sub: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
}

export interface RefreshTokenPayload {
  sub: string;
  jti: string;
}

export async function hashPassword(plain: string): Promise<string> {
  return argon2.hash(plain, { type: argon2.argon2id });
}

export async function verifyPassword(hash: string, plain: string): Promise<boolean> {
  return argon2.verify(hash, plain);
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: AUTH.accessTokenTtlSec });
}

export function signRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: AUTH.refreshTokenTtlSec });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function generateRefreshTokenId(): string {
  return randomBytes(16).toString('hex');
}
