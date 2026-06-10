import { describe, it, expect } from 'vitest';
import { isOnPath, PATHS, TILE, tileCenter } from './board';

describe('board utilities', () => {
  it('detects a tile on the path', () => {
    expect(isOnPath({ x: 4, y: 1 }, PATHS.city)).toBe(true);
  });
  it('detects a tile off the path', () => {
    expect(isOnPath({ x: 5, y: 5 }, PATHS.city)).toBe(false);
  });
  it('converts a tile to a world center', () => {
    expect(tileCenter({ x: 2, y: 3 })).toEqual({ x: 2 * TILE + TILE / 2, y: 3 * TILE + TILE / 2 });
  });
});
