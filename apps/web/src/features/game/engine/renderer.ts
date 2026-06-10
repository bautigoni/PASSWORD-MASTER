import type { WorldState } from './types';
import { TILE, COLS, ROWS } from './board';
import { ENEMY_COLORS, TOWER_COLORS } from './reducer';

const ENV_BG: Record<string, [string, string, string]> = {
  city: ['#0f172a', '#1e293b', '#7c5cff'],
  school: ['#0c1a3a', '#1e3a8a', '#22d3ee'],
  bank: ['#1a1a2e', '#312e81', '#f59e0b'],
  hospital: ['#0f172a', '#0e7490', '#ec4899'],
  datacenter: ['#020617', '#1e1b4b', '#a855f7'],
};

export function drawBoard(ctx: CanvasRenderingContext2D, world: WorldState) {
  const env = (world.path[0]?.y ?? 1) >= 0 ? 'city' : 'city';
  const envKey = guessEnv(world);
  const [bg1, bg2, accent] = ENV_BG[envKey] ?? ENV_BG.city;
  void env;

  // background grid
  const grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
  grad.addColorStop(0, bg1);
  grad.addColorStop(1, bg2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // hex pattern
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1;
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      ctx.strokeRect(x * TILE, y * TILE, TILE, TILE);
    }
  }
  ctx.restore();

  // path glow
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.shadowColor = accent;
  ctx.shadowBlur = 14;
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.lineWidth = TILE * 0.85;
  ctx.beginPath();
  for (let i = 0; i < world.path.length; i++) {
    const p = world.path[i];
    if (i === 0) ctx.moveTo(p.x * TILE + TILE / 2, p.y * TILE + TILE / 2);
    else ctx.lineTo(p.x * TILE + TILE / 2, p.y * TILE + TILE / 2);
  }
  ctx.stroke();
  ctx.restore();
}

function guessEnv(world: WorldState): string {
  // heuística: ciudad por defecto
  void world;
  return 'city';
}

export function drawTowers(ctx: CanvasRenderingContext2D, world: WorldState) {
  for (const t of world.towers) {
    const color = TOWER_COLORS[t.kind];
    // range on hover later
    // aura ring
    if (t.isAura) {
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = color + '22';
      ctx.arc(t.pos.x, t.pos.y, t.range, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = color + '66';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.stroke();
      ctx.restore();
    }
    // base
    ctx.save();
    ctx.translate(t.pos.x, t.pos.y);
    const grd = ctx.createRadialGradient(0, 0, 4, 0, 0, TILE * 0.45);
    grd.addColorStop(0, color);
    grd.addColorStop(1, '#0b1020');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(0, 0, TILE * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#fff';
    ctx.stroke();
    // label
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px Inter, system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(labelFor(t.kind), 0, 0);
    ctx.restore();
  }
}

function labelFor(kind: string): string {
  return {
    basic_password: 'P',
    strong_password: 'S',
    mfa: 'M',
    password_manager: 'G',
    phishing_detector: 'Φ',
    firewall: 'F',
    soc_center: '⌖',
  }[kind] ?? '?';
}

export function drawEnemies(ctx: CanvasRenderingContext2D, world: WorldState) {
  for (const e of world.enemies) {
    if (!e.revealed) continue;
    const { primary, glow } = ENEMY_COLORS[e.kind];
    ctx.save();
    ctx.translate(e.pos.x, e.pos.y);
    // shadow
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(0, TILE * 0.3, TILE * 0.35, TILE * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();
    // body
    const r = e.isBoss ? TILE * 0.55 : TILE * 0.32;
    const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, r);
    grad.addColorStop(0, glow);
    grad.addColorStop(1, primary);
    ctx.fillStyle = grad;
    ctx.shadowColor = glow;
    ctx.shadowBlur = e.isBoss ? 30 : 12;
    ctx.beginPath();
    if (e.isBoss) {
      // polygon boss
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const rr = i % 2 === 0 ? r : r * 0.7;
        const x = Math.cos(a) * rr;
        const y = Math.sin(a) * rr;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
    } else {
      ctx.arc(0, 0, r, 0, Math.PI * 2);
    }
    ctx.fill();
    // eye
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(0, -r * 0.2, r * 0.18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0b1020';
    ctx.beginPath();
    ctx.arc(0, -r * 0.2, r * 0.08, 0, Math.PI * 2);
    ctx.fill();
    // hp bar
    if (e.hp < e.maxHp) {
      const w = TILE * 0.7;
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(-w / 2, -r - 12, w, 5);
      ctx.fillStyle = primary;
      ctx.fillRect(-w / 2, -r - 12, w * Math.max(0, e.hp / e.maxHp), 5);
    }
    ctx.restore();
  }
}

export function drawProjectiles(ctx: CanvasRenderingContext2D, world: WorldState) {
  for (const p of world.projectiles) {
    ctx.save();
    ctx.strokeStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 16;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(p.from.x, p.from.y);
    ctx.lineTo(p.to.x, p.to.y);
    ctx.stroke();
    // head
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.from.x, p.from.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export function drawParticles(ctx: CanvasRenderingContext2D, world: WorldState) {
  for (const p of world.particles) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 2));
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(p.pos.x, p.pos.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export function drawFloatingTexts(ctx: CanvasRenderingContext2D, world: WorldState) {
  for (const t of world.texts) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, t.life));
    ctx.fillStyle = t.color;
    ctx.font = 'bold 16px Fredoka, Inter, system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(t.text, t.pos.x, t.pos.y - (1 - t.life) * 30);
    ctx.restore();
  }
}
