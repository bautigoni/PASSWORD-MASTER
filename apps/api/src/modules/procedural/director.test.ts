import { describe, it, expect } from 'vitest';
import { generateWaves, mulberry32, seedFromString, generateDailyChallenge } from './director';

describe('director', () => {
  it('is deterministic for the same seed', () => {
    const a = generateWaves({ seed: 'demo-2026', difficulty: 3, waves: 5 });
    const b = generateWaves({ seed: 'demo-2026', difficulty: 3, waves: 5 });
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it('produces more enemies on higher difficulty', () => {
    const easy = generateWaves({ seed: 'x', difficulty: 1, waves: 4 });
    const hard = generateWaves({ seed: 'x', difficulty: 5, waves: 4 });
    const sum = (ws: ReturnType<typeof generateWaves>) =>
      ws.reduce((acc, w) => acc + w.groups.reduce((a2, g) => a2 + g.count, 0), 0);
    expect(sum(hard)).toBeGreaterThan(sum(easy));
  });

  it('places a boss every N waves', () => {
    const waves = generateWaves({ seed: 'x', difficulty: 4, waves: 10, bossEvery: 3 });
    const bossWaves = waves.filter((w) => w.boss).length;
    expect(bossWaves).toBeGreaterThanOrEqual(3);
  });

  it('mulberry32 produces values in [0,1)', () => {
    const rng = mulberry32(42);
    for (let i = 0; i < 100; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it('seedFromString is stable', () => {
    expect(seedFromString('hello')).toBe(seedFromString('hello'));
  });

  it('daily challenge returns a valid LevelManifest', () => {
    const level = generateDailyChallenge('2026-06-10', 3);
    expect(level.waves.length).toBe(10);
    expect(level.isProcedural).toBe(true);
  });
});
