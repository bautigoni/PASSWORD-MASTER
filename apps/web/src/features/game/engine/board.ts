import type { Point } from './types';

export const TILE = 48;
export const COLS = 18;
export const ROWS = 10;

export const PATHS: Record<string, Point[]> = {
  city: [
    { x: -1, y: 1 },
    { x: 4, y: 1 },
    { x: 4, y: 4 },
    { x: 9, y: 4 },
    { x: 9, y: 1 },
    { x: 14, y: 1 },
    { x: 14, y: 7 },
    { x: COLS, y: 7 },
  ],
  school: [
    { x: -1, y: 2 },
    { x: 6, y: 2 },
    { x: 6, y: 7 },
    { x: 12, y: 7 },
    { x: 12, y: 3 },
    { x: COLS, y: 3 },
  ],
  bank: [
    { x: -1, y: 5 },
    { x: 3, y: 5 },
    { x: 3, y: 2 },
    { x: 8, y: 2 },
    { x: 8, y: 8 },
    { x: 15, y: 8 },
    { x: 15, y: 4 },
    { x: COLS, y: 4 },
  ],
  hospital: [
    { x: -1, y: 1 },
    { x: 2, y: 1 },
    { x: 2, y: 6 },
    { x: 7, y: 6 },
    { x: 7, y: 3 },
    { x: 13, y: 3 },
    { x: 13, y: 8 },
    { x: COLS, y: 8 },
  ],
  datacenter: [
    { x: -1, y: 8 },
    { x: 5, y: 8 },
    { x: 5, y: 4 },
    { x: 10, y: 4 },
    { x: 10, y: 1 },
    { x: COLS, y: 1 },
  ],
};

export function tileCenter(p: Point): Point {
  return { x: p.x * TILE + TILE / 2, y: p.y * TILE + TILE / 2 };
}

export function worldToTile(p: Point): Point {
  return { x: Math.floor(p.x / TILE), y: Math.floor(p.y / TILE) };
}

export function isOnPath(p: Point, path: Point[]): boolean {
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i];
    const b = path[i + 1];
    if (a.x === b.x) {
      if (p.x === a.x && p.y > Math.min(a.y, b.y) - 0.1 && p.y < Math.max(a.y, b.y) + 0.1) return true;
    } else if (a.y === b.y) {
      if (p.y === a.y && p.x > Math.min(a.x, b.x) - 0.1 && p.x < Math.max(a.x, b.x) + 0.1) return true;
    }
  }
  return false;
}
