import { describe, it, expect, beforeEach } from 'vitest';
import { useGame } from './gameStore';

describe('gameStore', () => {
  beforeEach(() => {
    useGame.getState().reset();
  });

  it('places a tower if enough coins', () => {
    const s = useGame.getState();
    s.startRun(500, 20);
    const ok = useGame.getState().placeTower('basic_password', 100, 100, 50);
    expect(ok).toBe(true);
    expect(useGame.getState().coins).toBe(450);
    expect(useGame.getState().placedTowers.length).toBe(1);
  });

  it('refuses to place a tower if not enough coins', () => {
    useGame.getState().startRun(0, 20);
    const ok = useGame.getState().placeTower('mfa', 0, 0, 180);
    expect(ok).toBe(false);
    expect(useGame.getState().placedTowers.length).toBe(0);
  });

  it('clamps lives to 0', () => {
    useGame.getState().startRun(0, 2);
    useGame.getState().takeDamage(10);
    expect(useGame.getState().lives).toBe(0);
  });
});
