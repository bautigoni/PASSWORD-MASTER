import { TOWERS, ENEMIES } from '@pm/shared/balance';
import type { EnemyKind, LevelManifest, TowerKind, WaveManifest } from '@pm/shared/types';
import type {
  EnemyInstance,
  Particle,
  Point,
  Projectile,
  SpawnJob,
  TowerInstance,
  WorldState,
} from './types';
import { COLS, ROWS, TILE, PATHS, tileCenter } from './board';
import { mulberry32, hashSeed } from './prng';

export const TOWER_COLORS: Record<TowerKind, string> = {
  basic_password: '#94a3b8',
  strong_password: '#22d3ee',
  mfa: '#7c5cff',
  password_manager: '#22c55e',
  phishing_detector: '#f59e0b',
  firewall: '#ef4444',
  soc_center: '#ec4899',
};

export const ENEMY_COLORS: Record<EnemyKind, { primary: string; glow: string }> = {
  script_kiddie: { primary: '#10b981', glow: '#34d399' },
  botnet: { primary: '#06b6d4', glow: '#22d3ee' },
  brute_force: { primary: '#f97316', glow: '#fb923c' },
  phisher: { primary: '#eab308', glow: '#facc15' },
  breach_ghost: { primary: '#a78bfa', glow: '#c4b5fd' },
  deepfake: { primary: '#f43f5e', glow: '#fb7185' },
  ransomware_knight: { primary: '#dc2626', glow: '#f87171' },
  zero_day_phantom: { primary: '#8b5cf6', glow: '#a78bfa' },
  boss_weak_passwords: { primary: '#71717a', glow: '#a1a1aa' },
  boss_lord_reuse: { primary: '#65a30d', glow: '#84cc16' },
  boss_breach_master: { primary: '#7e22ce', glow: '#a855f7' },
  boss_phisher_king: { primary: '#be185d', glow: '#ec4899' },
};

export function createWorld(
  level: LevelManifest,
  startingCoins: number,
  startingLives: number,
  seed: string,
  towers: { id: string; kind: TowerKind; x: number; y: number; level: number }[],
): WorldState {
  const path = PATHS[level.environment] ?? PATHS.city;
  const rng = mulberry32(hashSeed(seed));
  const world: WorldState = {
    path,
    enemies: [],
    towers: [],
    projectiles: [],
    particles: [],
    texts: [],
    coins: startingCoins,
    lives: startingLives,
    wave: 0,
    status: 'running',
    startTime: performance.now(),
    duration: 0,
    spawnQueue: [],
    board: { cols: COLS, rows: ROWS, tile: TILE },
  };
  for (const t of towers) {
    world.towers.push(makeTower(t.id, t.kind, { x: t.x, y: t.y }, t.level));
  }
  // build spawn queue from waves
  let t = 2;
  for (const w of level.waves) {
    enqueueWave(world, w, t, rng);
    t += w.delay + 8;
  }
  return world;
}

function enqueueWave(world: WorldState, w: WaveManifest, startAt: number, rng: () => number) {
  for (const g of w.groups) {
    for (let i = 0; i < g.count; i++) {
      world.spawnQueue.push({ kind: g.kind, delay: startAt + i * g.interval });
    }
  }
  if (w.boss) {
    for (let i = 0; i < w.boss.count; i++) {
      world.spawnQueue.push({ kind: w.boss.kind, delay: startAt + w.groups.length * 0.5 + i * 1.5, isBoss: true });
    }
  }
  void rng;
}

function makeTower(id: string, kind: TowerKind, pos: Point, level: number): TowerInstance {
  const stat = TOWERS[kind];
  const isAura = kind === 'password_manager';
  const dmg = stat.damage * (1 + (level - 1) * 0.4);
  return {
    id,
    kind,
    pos,
    level,
    damage: dmg,
    range: stat.range * TILE,
    fireRate: stat.fireRate,
    splash: (stat.splash ?? 0) * TILE,
    cooldown: 0,
    isAura,
    auraMultiplier: isAura ? 1.2 : 1,
  };
}

function makeEnemy(kind: EnemyKind, isBoss?: boolean): EnemyInstance {
  const s = ENEMIES[kind];
  return {
    id: crypto.randomUUID(),
    kind,
    pos: { x: 0, y: 0 },
    hp: s.hp * (isBoss ? 1.5 : 1),
    maxHp: s.hp * (isBoss ? 1.5 : 1),
    speed: s.speed * TILE,
    armor: s.armor,
    pathIndex: 0,
    distance: 0,
    bounty: s.bounty,
    damage: s.damage,
    isBoss,
    isHidden: s.isHidden,
    revealed: !s.isHidden,
    slowMs: 0,
    stun: 0,
  };
}

function spawnAtPathHead(world: WorldState, kind: EnemyKind, isBoss?: boolean): EnemyInstance {
  const e = makeEnemy(kind, isBoss);
  e.pos = tileCenter(world.path[0]);
  e.pos.x -= TILE * 0.2;
  world.enemies.push(e);
  return e;
}

function dist(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function segmentLength(a: Point, b: Point) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function findNearestEnemy(tower: TowerInstance, enemies: EnemyInstance[]): EnemyInstance | undefined {
  let best: EnemyInstance | undefined;
  let bestD = tower.range;
  for (const e of enemies) {
    if (!e.revealed && e.isHidden) continue;
    const d = dist(tower.pos, e.pos);
    if (d <= bestD) {
      bestD = d;
      best = e;
    }
  }
  return best;
}

function fireTower(world: WorldState, tower: TowerInstance, dt: number) {
  if (tower.isAura) {
    // aura no dispara, multiplica daño de torres cercanas
    return;
  }
  if (tower.cooldown > 0) {
    tower.cooldown -= dt;
    return;
  }
  const target = findNearestEnemy(tower, world.enemies);
  if (!target) return;
  // phisher detector: stunea phishers y deepfakes
  if (tower.kind === 'phishing_detector' && (target.kind === 'phisher' || target.kind === 'deepfake')) {
    target.stun = Math.max(target.stun, 1.2);
  }
  const proj: Projectile = {
    id: crypto.randomUUID(),
    from: { ...tower.pos },
    to: { ...target.pos },
    targetId: target.id,
    damage: tower.damage,
    speed: 720,
    splash: tower.splash,
    trail: [],
    color: TOWER_COLORS[tower.kind],
  };
  world.projectiles.push(proj);
  tower.cooldown = 1 / Math.max(0.1, tower.fireRate);
}

function applyAuras(world: WorldState) {
  for (const t of world.towers) {
    if (!t.isAura) continue;
    for (const other of world.towers) {
      if (other === t) continue;
      if (dist(t.pos, other.pos) <= t.range) {
        other.damage = (TOWERS[other.kind].damage) * (1 + (other.level - 1) * 0.4) * t.auraMultiplier;
      } else {
        other.damage = (TOWERS[other.kind].damage) * (1 + (other.level - 1) * 0.4);
      }
    }
  }
}

function spawnDue(world: WorldState, now: number) {
  const remaining: SpawnJob[] = [];
  for (const j of world.spawnQueue) {
    if (j.delay <= now) {
      spawnAtPathHead(world, j.kind, j.isBoss);
    } else {
      remaining.push(j);
    }
  }
  world.spawnQueue = remaining;
}

function moveEnemies(world: WorldState, dt: number) {
  for (const e of world.enemies) {
    if (e.hp <= 0) continue;
    if (e.stun > 0) {
      e.stun = Math.max(0, e.stun - dt);
      continue;
    }
    let speed = e.speed;
    if (e.slowMs > 0) {
      speed *= 0.6;
      e.slowMs = Math.max(0, e.slowMs - dt * 1000);
    }
    while (e.pathIndex < world.path.length - 1 && e.distance >= segmentLength(world.path[e.pathIndex], world.path[e.pathIndex + 1])) {
      e.distance -= segmentLength(world.path[e.pathIndex], world.path[e.pathIndex + 1]);
      e.pathIndex += 1;
    }
    if (e.pathIndex >= world.path.length - 1) {
      // reached end
      e.hp = 0;
      world.lives = Math.max(0, world.lives - e.damage);
      world.texts.push({ id: crypto.randomUUID(), pos: { ...e.pos }, text: `-${e.damage} ❤`, color: '#ef4444', life: 1 });
      continue;
    }
    const a = world.path[e.pathIndex];
    const b = world.path[e.pathIndex + 1];
    const len = segmentLength(a, b) || 1;
    const dir = { x: (b.x - a.x) / len, y: (b.y - a.y) / len };
    e.distance += speed * dt;
    const step = Math.min(e.distance, len);
    e.pos.x = a.x * TILE + TILE / 2 + dir.x * step;
    e.pos.y = a.y * TILE + TILE / 2 + dir.y * step;
  }
}

function moveProjectiles(world: WorldState, dt: number) {
  for (const p of world.projectiles) {
    const target = world.enemies.find((e) => e.id === p.targetId);
    if (target) p.to = { ...target.pos };
    p.trail.push({ x: p.from.x, y: p.from.y, t: 0.25 });
    const dx = p.to.x - p.from.x;
    const dy = p.to.y - p.from.y;
    const d = Math.hypot(dx, dy) || 1;
    const step = Math.min(d, p.speed * dt);
    p.from.x += (dx / d) * step;
    p.from.y += (dy / d) * step;
    if (d <= step + 2) {
      // hit
      p.damage = p.damage;
      applyHit(world, p);
      p.damage = -1;
    }
  }
  world.projectiles = world.projectiles.filter((p) => p.damage > 0);
}

function applyHit(world: WorldState, p: Projectile) {
  const target = world.enemies.find((e) => e.id === p.targetId);
  if (!target) return;
  const dmg = Math.max(1, p.damage - target.armor);
  target.hp -= dmg;
  // reveal
  if (target.isHidden) target.revealed = true;
  // particles
  for (let i = 0; i < 6; i++) {
    world.particles.push({
      id: crypto.randomUUID(),
      pos: { ...p.to },
      vel: { x: (Math.random() - 0.5) * 200, y: (Math.random() - 0.5) * 200 },
      life: 0.5,
      color: p.color,
      size: 3 + Math.random() * 2,
    });
  }
  // splash
  if (p.splash > 0) {
    for (const e of world.enemies) {
      if (e === target) continue;
      if (dist(e.pos, p.to) <= p.splash) {
        const sd = Math.max(1, p.damage * 0.6 - e.armor);
        e.hp -= sd;
      }
    }
  }
  if (target.hp <= 0) {
    world.coins += target.bounty;
    world.texts.push({ id: crypto.randomUUID(), pos: { ...target.pos }, text: `+${target.bounty}`, color: '#fbbf24', life: 0.8 });
  }
}

function cullAndScore(world: WorldState) {
  const before = world.enemies.length;
  world.enemies = world.enemies.filter((e) => e.hp > 0);
  // floating texts
  for (const t of world.texts) t.life -= 0.016;
  world.texts = world.texts.filter((t) => t.life > 0);
  for (const p of world.particles) {
    p.pos.x += p.vel.x * 0.016;
    p.pos.y += p.vel.y * 0.016;
    p.life -= 0.016;
  }
  world.particles = world.particles.filter((p) => p.life > 0);
  return before - world.enemies.length;
}

export function step(world: WorldState, dt: number) {
  if (world.status !== 'running') return;
  world.duration += dt;
  applyAuras(world);
  spawnDue(world, world.duration);
  for (const t of world.towers) fireTower(world, t, dt);
  moveProjectiles(world, dt);
  moveEnemies(world, dt);
  cullAndScore(world);
  // check end conditions
  if (world.lives <= 0) world.status = 'lost';
  if (world.spawnQueue.length === 0 && world.enemies.length === 0 && world.wave === 0) {
    // wave++ tracking simplified: detect last wave completed if all queues empty & no enemies
    if (world.spawnQueue.length === 0) world.status = 'won';
  }
}

export function isLevelOver(world: WorldState): boolean {
  if (world.status === 'lost') return true;
  if (world.status === 'won') return true;
  return false;
}

export function computeScore(world: WorldState, initialLives: number): number {
  const dmgTaken = initialLives - world.lives;
  const enemiesKilled =
    world.enemies.length === 0 ? Math.max(0, 1) : 0; // heurística — el caller sumará desde el run
  void enemiesKilled;
  return Math.max(0, Math.floor(world.coins * 5 + (initialLives - dmgTaken) * 50 - world.duration * 2));
}
