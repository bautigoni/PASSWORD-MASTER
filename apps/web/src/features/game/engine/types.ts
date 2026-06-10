import type { EnemyKind, TowerKind, WaveManifest } from '@pm/shared/types';

export interface Point {
  x: number;
  y: number;
}

export interface EnemyInstance {
  id: string;
  kind: EnemyKind;
  pos: Point;
  hp: number;
  maxHp: number;
  speed: number; // tiles per second
  armor: number;
  pathIndex: number; // segment of path
  distance: number; // distance along current segment (0..segmentLen)
  bounty: number;
  damage: number;
  isBoss?: boolean;
  isHidden?: boolean;
  revealed: boolean;
  slowMs: number; // accumulated slow
  stun: number;
}

export interface TowerInstance {
  id: string;
  kind: TowerKind;
  pos: Point;
  level: number;
  damage: number;
  range: number;
  fireRate: number;
  splash: number;
  cooldown: number;
  targetId?: string;
  isAura: boolean;
  auraMultiplier: number;
}

export interface Projectile {
  id: string;
  from: Point;
  to: Point;
  targetId: string;
  damage: number;
  speed: number; // px/s
  splash: number;
  trail: { x: number; y: number; t: number }[];
  color: string;
}

export interface Particle {
  id: string;
  pos: Point;
  vel: Point;
  life: number; // seconds remaining
  color: string;
  size: number;
}

export interface FloatingText {
  id: string;
  pos: Point;
  text: string;
  color: string;
  life: number;
}

export interface WorldState {
  path: Point[];
  enemies: EnemyInstance[];
  towers: TowerInstance[];
  projectiles: Projectile[];
  particles: Particle[];
  texts: FloatingText[];
  coins: number;
  lives: number;
  wave: number;
  status: 'idle' | 'running' | 'won' | 'lost';
  startTime: number;
  duration: number;
  spawnQueue: SpawnJob[];
  board: { cols: number; rows: number; tile: number };
}

export interface SpawnJob {
  kind: EnemyKind;
  pos?: Point; // optional override (boss entry)
  delay: number; // seconds from now
  isBoss?: boolean;
}

export interface RunResult {
  score: number;
  won: boolean;
  killedEnemies: number;
  lostLives: number;
  durationSec: number;
  seed: string;
}
