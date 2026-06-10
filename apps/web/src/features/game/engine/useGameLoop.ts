import { useEffect, useRef } from 'react';
import type { WorldState } from './types';

export function useGameLoop(worldRef: React.MutableRefObject<WorldState | null>, step: (w: WorldState, dt: number) => void) {
  const raf = useRef<number | null>(null);
  const last = useRef(performance.now());
  useEffect(() => {
    const tick = (t: number) => {
      const dt = Math.min(0.05, (t - last.current) / 1000);
      last.current = t;
      if (worldRef.current) step(worldRef.current, dt);
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [step, worldRef]);
}
