import { create } from 'zustand';
import type { TowerKind, EnemyKind, PetKind, AchievementKind } from '@pm/shared/types';

export interface RunSummary {
  levelId: string;
  score: number;
  won: boolean;
  killedEnemies: number;
  lostLives: number;
  durationSec: number;
  seed: string;
}

interface GameState {
  selectedTower: TowerKind | null;
  placedTowers: { id: string; kind: TowerKind; x: number; y: number; level: number }[];
  coins: number;
  lives: number;
  wave: number;
  isPlaying: boolean;
  isPaused: boolean;
  lastRun?: RunSummary;
  equippedPet: PetKind | null;
  claimedAchievements: AchievementKind[];
  setSelected: (t: TowerKind | null) => void;
  placeTower: (kind: TowerKind, x: number, y: number, cost: number) => boolean;
  addCoins: (n: number) => void;
  takeDamage: (n: number) => void;
  startRun: (coins: number, lives: number) => void;
  endRun: (summary: RunSummary) => void;
  pause: (b: boolean) => void;
  setPet: (p: PetKind | null) => void;
  claimAchievement: (a: AchievementKind) => void;
  reset: () => void;
}

export const useGame = create<GameState>((set, get) => ({
  selectedTower: null,
  placedTowers: [],
  coins: 0,
  lives: 0,
  wave: 0,
  isPlaying: false,
  isPaused: false,
  equippedPet: null,
  claimedAchievements: [],
  setSelected: (t) => set({ selectedTower: t }),
  placeTower: (kind, x, y, cost) => {
    const s = get();
    if (s.coins < cost) return false;
    set({
      coins: s.coins - cost,
      placedTowers: [...s.placedTowers, { id: crypto.randomUUID(), kind, x, y, level: 1 }],
    });
    return true;
  },
  addCoins: (n) => set((s) => ({ coins: s.coins + n })),
  takeDamage: (n) => set((s) => ({ lives: Math.max(0, s.lives - n) })),
  startRun: (coins, lives) => set({ coins, lives, wave: 0, isPlaying: true, isPaused: false, placedTowers: [] }),
  endRun: (summary) => set({ isPlaying: false, lastRun: summary }),
  pause: (b) => set({ isPaused: b }),
  setPet: (p) => set({ equippedPet: p }),
  claimAchievement: (a) =>
    set((s) => (s.claimedAchievements.includes(a) ? s : { claimedAchievements: [...s.claimedAchievements, a] })),
  reset: () => set({ placedTowers: [], coins: 0, lives: 0, wave: 0, isPlaying: false, isPaused: false }),
}));
