import { describe, it, expect } from 'vitest';
import { LEVELS, ACHIEVEMENTS, PETS } from './catalog';
import { TOWERS as BAL_TOWERS, ENEMIES as BAL_ENEMIES } from './balance';

describe('shared catalog', () => {
  it('catalog references balance keys', () => {
    for (const level of LEVELS) {
      for (const wave of level.waves) {
        for (const g of wave.groups) {
          expect(BAL_ENEMIES[g.kind]).toBeDefined();
        }
        if (wave.boss) expect(BAL_ENEMIES[wave.boss.kind]).toBeDefined();
      }
    }
  });

  it('every achievement references a valid id', () => {
    for (const a of ACHIEVEMENTS) {
      expect(a.id).toBeTruthy();
      expect(a.reward).toBeDefined();
    }
  });

  it('every pet has a passive', () => {
    for (const p of PETS) {
      expect(p.passive.kind).toBeTruthy();
    }
  });

  it('all towers and enemies have stats', () => {
    expect(Object.keys(BAL_TOWERS).length).toBeGreaterThan(0);
    expect(Object.keys(BAL_ENEMIES).length).toBeGreaterThan(0);
  });
});
