import { describe, it, expect } from 'vitest';
import { createWorld, step } from './reducer';
import { LEVELS } from '@pm/shared/catalog';

const level = LEVELS[0];

describe('engine reducer', () => {
  it('creates a world with starting coins and lives', () => {
    const w = createWorld(level, 200, 20, 'test-seed', []);
    expect(w.coins).toBe(200);
    expect(w.lives).toBe(20);
    expect(w.status).toBe('running');
    expect(w.spawnQueue.length).toBeGreaterThan(0);
  });

  it('loses lives when an enemy reaches the end', () => {
    const w = createWorld({ ...level, waves: [] }, 100, 5, 's', []);
    // Insertar enemigo al final del path manualmente
    const last = w.path[w.path.length - 1];
    w.enemies.push({
      id: 'e1',
      kind: 'script_kiddie',
      pos: { x: last.x * 48 + 24, y: last.y * 48 + 24 },
      hp: 10,
      maxHp: 10,
      speed: 100,
      armor: 0,
      pathIndex: w.path.length - 1,
      distance: 9999,
      bounty: 0,
      damage: 3,
      revealed: true,
      slowMs: 0,
      stun: 0,
    });
    step(w, 0.1);
    expect(w.lives).toBe(2);
  });

  it('produces coins when an enemy is killed by damage', () => {
    const w = createWorld({ ...level, waves: [] }, 0, 10, 's', []);
    w.enemies.push({
      id: 'e1',
      kind: 'script_kiddie',
      pos: { x: 0, y: 48 + 24 },
      hp: 1,
      maxHp: 1,
      speed: 0,
      armor: 0,
      pathIndex: 0,
      distance: 0,
      bounty: 7,
      damage: 0,
      revealed: true,
      slowMs: 0,
      stun: 0,
    });
    // añadir torreta
    w.towers.push({
      id: 't1',
      kind: 'basic_password',
      pos: { x: 0, y: 0 },
      level: 1,
      damage: 10,
      range: 200,
      fireRate: 1,
      splash: 0,
      cooldown: 0,
      isAura: false,
      auraMultiplier: 1,
    });
    step(w, 0.016);
    step(w, 1.0);
    expect(w.coins).toBe(7);
    expect(w.enemies.length).toBe(0);
  });
});
