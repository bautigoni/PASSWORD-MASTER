import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { LevelManifest, TowerKind } from '@pm/shared/types';
import { TOWERS } from '@pm/shared/balance';
import { TILE, COLS, ROWS, worldToTile, isOnPath } from './engine/board';
import {
  createWorld,
  step,
  TOWER_COLORS,
  ENEMY_COLORS,
  computeScore,
} from './engine/reducer';
import {
  drawBoard,
  drawTowers,
  drawEnemies,
  drawProjectiles,
  drawParticles,
  drawFloatingTexts,
} from './engine/renderer';
import { useGame } from '@/shared/state/gameStore';
import { useGameLoop } from './engine/useGameLoop';
import { Button } from '@/shared/ui/Button';

interface Props {
  level: LevelManifest;
  onExit: () => void;
  onResult: (r: { score: number; won: boolean; killedEnemies: number; lostLives: number; durationSec: number }) => void;
  onSelect?: (kind: import('@pm/shared/types').TowerKind) => void;
}

export function GameCanvas({ level, onExit, onResult, onSelect }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const worldRef = useRef<ReturnType<typeof createWorld> | null>(null);
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null);
  const [selected, setSelected] = useState<TowerKind | null>(null);
  const [showResult, setShowResult] = useState<null | { score: number; won: boolean; killedEnemies: number; lostLives: number; durationSec: number }>(null);
  const placed = useGame((s) => s.placedTowers);
  const placeTower = useGame((s) => s.placeTower);
  const addCoins = useGame((s) => s.addCoins);
  const startRun = useGame((s) => s.startRun);
  const setCoins = useGame.setState;
  const setLives = useGame.setState;
  const setWave = useGame.setState;

  useEffect(() => {
    startRun(level.startingCoins, level.startingLives);
  }, [level, startRun]);

  // init world
  useEffect(() => {
    const seed = `${level.id}-${Date.now()}`;
    worldRef.current = createWorld(level, level.startingCoins, level.startingLives, seed, placed);
    return () => {
      worldRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level.id]);

  useGameLoop(worldRef, step);

  // render loop
  useEffect(() => {
    let raf = 0;
    const render = () => {
      const c = canvasRef.current;
      const w = worldRef.current;
      if (c && w) {
        const ctx = c.getContext('2d');
        if (ctx) {
          drawBoard(ctx, w);
          drawTowers(ctx, w);
          drawEnemies(ctx, w);
          drawProjectiles(ctx, w);
          drawParticles(ctx, w);
          drawFloatingTexts(ctx, w);
          // hover ghost
          if (hover && selected) {
            ctx.save();
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = TOWER_COLORS[selected];
            ctx.beginPath();
            ctx.arc(hover.x, hover.y, TILE * 0.4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
        setCoins({ coins: w.coins });
        setLives({ lives: w.lives });
        setWave({ wave: w.wave });
        if ((w.status === 'won' || w.status === 'lost') && !showResult) {
          const initialLives = level.startingLives;
          const result = {
            score: computeScore(w, initialLives),
            won: w.status === 'won',
            killedEnemies: 0, // simplificado, se calcula fuera
            lostLives: initialLives - w.lives,
            durationSec: Math.floor(w.duration),
          };
          setShowResult(result);
          onResult(result);
        }
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => cancelAnimationFrame(raf);
  }, [hover, selected, level.startingLives, onResult, setCoins, setLives, setWave, showResult]);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!;
    const rect = c.getBoundingClientRect();
    setHover({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const c = canvasRef.current!;
      const rect = c.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (!selected) return;
      const tile = worldToTile({ x, y });
      if (isOnPath(tile, worldRef.current!.path)) return;
      if (tile.x < 0 || tile.y < 0 || tile.x >= COLS || tile.y >= ROWS) return;
      const cost = TOWERS[selected].cost;
      const ok = placeTower(selected, x, y, cost);
      if (ok) {
        worldRef.current!.towers.push({
          id: crypto.randomUUID(),
          kind: selected,
          pos: { x, y },
          level: 1,
          damage: TOWERS[selected].damage,
          range: TOWERS[selected].range * TILE,
          fireRate: TOWERS[selected].fireRate,
          splash: (TOWERS[selected].splash ?? 0) * TILE,
          cooldown: 0,
          isAura: selected === 'password_manager',
          auraMultiplier: 1.2,
        });
        addCoins(-cost);
      }
    },
    [selected, placeTower, addCoins],
  );

  return (
    <div className="relative w-full h-full grid place-items-center p-4">
      <motion.div
        className="relative panel p-3"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <canvas
          ref={canvasRef}
          width={COLS * TILE}
          height={ROWS * TILE}
          className="rounded-2xl cursor-crosshair"
          onMouseMove={onMouseMove}
          onMouseLeave={() => setHover(null)}
          onClick={onClick}
        />
        <GameOverlay
          selected={selected}
          setSelected={(k) => {
            setSelected(k);
            if (k && onSelect) onSelect(k);
          }}
          onExit={onExit}
        />
      </motion.div>
    </div>
  );
}

const TOWER_ORDER: TowerKind[] = [
  'basic_password',
  'strong_password',
  'mfa',
  'password_manager',
  'phishing_detector',
  'firewall',
  'soc_center',
];

function GameOverlay({
  selected,
  setSelected,
  onExit,
}: {
  selected: TowerKind | null;
  setSelected: (t: TowerKind | null) => void;
  onExit: () => void;
}) {
  return (
    <div className="absolute -bottom-24 left-0 right-0 flex flex-wrap gap-2 justify-center">
      {TOWER_ORDER.map((k) => (
        <motion.button
          key={k}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSelected(selected === k ? null : k)}
          className={`relative flex flex-col items-center w-24 p-2 rounded-2xl border ${
            selected === k ? 'border-accent shadow-glow' : 'border-white/10 bg-panel/90'
          }`}
        >
          <span
            className="w-8 h-8 rounded-full mb-1"
            style={{ background: TOWER_COLORS[k], boxShadow: `0 0 12px ${TOWER_COLORS[k]}` }}
          />
          <span className="text-xs font-display">{k.replace(/_/g, ' ')}</span>
          <span className="text-[10px] text-muted">{TOWERS[k].cost} ¢</span>
        </motion.button>
      ))}
      <Button variant="danger" onClick={onExit}>
        Salir
      </Button>
    </div>
  );
}

export function EducationalTip({ kind }: { kind: TowerKind }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute -top-20 left-1/2 -translate-x-1/2 panel max-w-md text-sm"
    >
      <div className="flex items-center gap-2 mb-1">
        <span
          className="w-3 h-3 rounded-full"
          style={{ background: TOWER_COLORS[kind], boxShadow: `0 0 8px ${ENEMY_COLORS.script_kiddie.glow}` }}
        />
        <span className="font-display">{TOWERS[kind].description}</span>
      </div>
      <p className="text-muted">{TOWERS[kind].educational}</p>
    </motion.div>
  );
}
