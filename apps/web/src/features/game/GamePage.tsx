import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LEVELS } from '@pm/shared/catalog';
import { useGame } from '@/shared/state/gameStore';
import { GameCanvas, EducationalTip } from './GameCanvas';
import { GameHUD } from './GameHUD';
import { Button } from '@/shared/ui/Button';
import { api } from '@/shared/api/client';
import { useToast } from '@/shared/ui/Toast';

export function GamePage({ mode }: { mode: 'campaign' | 'sandbox' | 'challenge' }) {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const level = LEVELS.find((l) => l.id === levelId) ?? LEVELS[0];
  const pause = useGame((s) => s.pause);
  const isPaused = useGame((s) => s.isPaused);
  const isPlaying = useGame((s) => s.isPlaying);
  const [result, setResult] = useState<null | { score: number; won: boolean; killedEnemies: number; lostLives: number; durationSec: number }>(null);
  const [educational, setEducational] = useState<{ kind: import('@pm/shared/types').TowerKind } | null>(null);
  const push = useToast((s) => s.push);

  // para sandbox/challenge con seed: si el id es dinámico generamos
  useEffect(() => {
    return () => {
      pause(false);
    };
  }, [pause]);

  const handleResult = async (r: { score: number; won: boolean; killedEnemies: number; lostLives: number; durationSec: number }) => {
    if (result) return;
    setResult(r);
    try {
      await api('/progress/run', {
        method: 'POST',
        body: JSON.stringify({
          levelId: level.id,
          mode,
          ...r,
          seed: `${level.id}-${Date.now()}`,
        }),
      });
      push({ title: r.won ? '¡Victoria!' : 'Derrota', description: `Puntaje: ${r.score}`, kind: r.won ? 'success' : 'warning' });
    } catch {
      // offline-safe: no fallar UI
    }
  };

  return (
    <div className="min-h-screen p-6 flex flex-col gap-4 relative">
      <GameHUD onPause={() => pause(!isPaused)} onRestart={() => window.location.reload()} paused={isPaused} />
      <div className="flex-1 grid place-items-center relative">
        <GameCanvas
          level={level}
          onExit={() => navigate(-1)}
          onResult={handleResult}
          onSelect={(k) => setEducational({ kind: k })}
        />
        <AnimatePresence>
          {educational && (
            <EducationalTip key={educational.kind} kind={educational.kind} />
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {isPaused && isPlaying && !result && (
          <motion.div className="fixed inset-0 z-40 grid place-items-center bg-black/60 backdrop-blur">
            <div className="panel text-center">
              <h2 className="text-2xl font-display title-grad mb-2">Pausa</h2>
              <Button onClick={() => pause(false)}>Reanudar</Button>
            </div>
          </motion.div>
        )}
        {result && (
          <motion.div
            className="fixed inset-0 z-40 grid place-items-center bg-black/60 backdrop-blur p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="panel max-w-md text-center">
              <h2 className={`text-3xl font-display ${result.won ? 'text-success' : 'text-danger'}`}>
                {result.won ? '¡Victoria!' : 'Derrota'}
              </h2>
              <div className="my-3 text-muted text-sm">{level.name}</div>
              <div className="grid grid-cols-3 gap-2 my-4">
                <Stat label="Puntaje" value={result.score} />
                <Stat label="Kills" value={result.killedEnemies} />
                <Stat label="Tiempo" value={`${result.durationSec}s`} />
              </div>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => navigate(-1)}>Volver</Button>
                <Button variant="ghost" onClick={() => window.location.reload()}>Reintentar</Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="panel py-2">
      <div className="text-xs text-muted uppercase">{label}</div>
      <div className="text-xl font-display">{value}</div>
    </div>
  );
}
