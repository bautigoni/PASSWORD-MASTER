import { Link, useNavigate } from 'react-router-dom';
import { LEVELS } from '@pm/shared/catalog';
import { Panel } from '@/shared/ui/Panel';
import { Button } from '@/shared/ui/Button';
import { useState } from 'react';
import { useGame } from '@/shared/state/gameStore';

export function SandboxPage() {
  const [levelId, setLevelId] = useState(LEVELS[0].id);
  const nav = useNavigate();
  const reset = useGame((s) => s.reset);
  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl title-grad">Sandbox</h1>
        <Link to="/"><Button variant="ghost" size="sm">← Volver</Button></Link>
      </div>
      <Panel>
        <p className="text-muted mb-4">
          Construye libremente. Monedas y vidas infinitas. Experimenta con composiciones de torres.
        </p>
        <label className="block mb-4">
          <span className="text-xs text-muted uppercase">Mapa</span>
          <select
            value={levelId}
            onChange={(e) => setLevelId(e.target.value)}
            className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 outline-none focus:border-accent2"
          >
            {LEVELS.map((l) => <option key={l.id} value={l.id}>{l.environment.toUpperCase()} — {l.name}</option>)}
          </select>
        </label>
        <Button
          onClick={() => {
            reset();
            nav(`/play/sandbox/${levelId}`);
          }}
        >
          Entrar al Sandbox
        </Button>
      </Panel>
    </div>
  );
}
