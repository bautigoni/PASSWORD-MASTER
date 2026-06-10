import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, signAccessToken, verifyAccessToken, signRefreshToken, hashToken, verifyRefreshToken } from '../../shared/infrastructure/prisma';

describe('crypto/auth utils', () => {
  it('hashes and verifies passwords with argon2id', async () => {
    const h = await hashPassword('S3cur3!Pa55');
    expect(h).not.toBe('S3cur3!Pa55');
    expect(await verifyPassword(h, 'S3cur3!Pa55')).toBe(true);
    expect(await verifyPassword(h, 'wrong')).toBe(false);
  });

  it('round-trips JWT access tokens', () => {
    const t = signAccessToken({ sub: 'u_1', role: 'STUDENT' });
    const p = verifyAccessToken(t);
    expect(p.sub).toBe('u_1');
    expect(p.role).toBe('STUDENT');
  });

  it('hashes refresh tokens deterministically', () => {
    const t = signRefreshToken({ sub: 'u_1', jti: 'abc' });
    expect(hashToken(t)).toBe(hashToken(t));
    const p = verifyRefreshToken(t);
    expect(p.jti).toBe('abc');
  });
});
