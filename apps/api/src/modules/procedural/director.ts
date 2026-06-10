import { createHash } from 'node:crypto';
import type { EnemyKind, LevelManifest, WaveManifest } from '@pm/shared/types';

const ENEMY_POOL: EnemyKind[] = [
  'script_kiddie',
  'botnet',
  'brute_force',
  'phisher',
  'breach_ghost',
  'deepfake',
  'ransomware_knight',
  'zero_day_phantom',
];

/**
 * Mulberry32 PRNG. Determinístico por seed.
 * https://stackoverflow.com/a/47593316
 */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seedFromString(s: string): number {
  const h = createHash('sha256').update(s).digest();
  return h.readUInt32BE(0);
}

export interface DirectorOpts {
  difficulty: 1 | 2 | 3 | 4 | 5;
  waves: number;
  bossEvery?: number; // poner un jefe cada N oleadas
  bannedEnemies?: EnemyKind[];
  seed: string;
}

export function generateWaves(opts: DirectorOpts): WaveManifest[] {
  const rng = mulberry32(seedFromString(opts.seed));
  const bossEvery = opts.bossEvery ?? 5;
  const pool = ENEMY_POOL.filter((e) => !opts.bannedEnemies?.includes(e));
  const waves: WaveManifest[] = [];

  for (let i = 0; i < opts.waves; i++) {
    const isBoss = (i + 1) % bossEvery === 0;
    const isClimax = i === opts.waves - 1;
    const groupCount = isBoss ? 2 : 1 + Math.floor(rng() * 2);
    const groups: WaveManifest['groups'] = [];
    for (let g = 0; g < groupCount; g++) {
      const kind = pool[Math.floor(rng() * pool.length)];
      const baseCount = 6 + i * 2 + opts.difficulty * 2;
      const count = Math.max(3, Math.round(baseCount * (0.7 + rng() * 0.6)));
      const interval = Math.max(0.25, 1.0 - i * 0.05 - rng() * 0.2);
      groups.push({ kind, count, interval, delay: g === 0 ? 0 : 1 + rng() * 2 });
    }
    const bossKind = isClimax
      ? 'boss_breach_master'
      : (['boss_weak_passwords', 'boss_lord_reuse', 'boss_phisher_king'][
          Math.floor(rng() * 3)
        ] as EnemyKind);
    waves.push({
      delay: 3 + Math.floor(rng() * 4),
      groups,
      boss: isBoss ? { kind: bossKind, count: 1, interval: 1 } : undefined,
    });
  }
  return waves;
}

export function generateDailyChallenge(seed: string, difficulty: 1 | 2 | 3 | 4 | 5 = 3): LevelManifest {
  return {
    id: `daily-${seed}`,
    name: `Reto Diario · ${seed}`,
    environment: 'city',
    difficulty,
    startingCoins: 250 + difficulty * 30,
    startingLives: 20,
    isProcedural: true,
    waves: generateWaves({ difficulty, waves: 10, seed }),
  };
}
