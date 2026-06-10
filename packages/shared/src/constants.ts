export const TICK_RATE = 60; // logical ticks per second

export const BOARD_TILE_SIZE = 48;

export const BOARD_COLS = 18;
export const BOARD_ROWS = 10;

export const STARTING_COINS = 200;
export const STARTING_LIVES = 20;

export const TOWER_SLOT_COSTS = {
  build: 0, // grid slot is free
  sellRefundRatio: 0.6,
} as const;

export const AUTH = {
  accessTokenTtlSec: 60 * 15,
  refreshTokenTtlSec: 60 * 60 * 24 * 7,
} as const;

export const RATE_LIMIT = {
  auth: { windowMs: 60_000, max: 5 },
  global: { windowMs: 60_000, max: 120 },
} as const;

export const XP_PER_LEVEL_BASE = 100;
export const XP_PER_LEVEL_GROWTH = 1.15;

export const COLORS = {
  bg: '#0b1020',
  panel: '#11183a',
  panel2: '#1a2350',
  accent: '#7c5cff',
  accent2: '#22d3ee',
  success: '#22c55e',
  danger: '#ef4444',
  warning: '#f59e0b',
  text: '#e6e9ff',
  textMuted: '#8b91c5',
} as const;

export const XP_REWARDS = {
  enemyKill: 5,
  waveClear: 25,
  levelComplete: 100,
  bossKill: 250,
  achievementClaim: 50,
} as const;
