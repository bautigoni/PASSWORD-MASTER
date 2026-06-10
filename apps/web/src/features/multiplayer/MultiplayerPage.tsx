import { useState } from 'react';
import { motion } from 'framer-motion';
import { Panel } from '@/shared/ui/Panel';
import { Button } from '@/shared/ui/Button';
import { api } from '@/shared/api/client';
import { useAuth } from '@/shared/state/authStore';
import { LEVELS } from '@pm/shared/catalog';
import { useToast } from '@/shared/ui/Toast';

export function MultiplayerPage() {
  const [mode, setMode] = useState<'coop' | 'versus'>('coop');
  const [levelId, setLevelId] = useState(LEVELS[0].id);
  const [code, setCode] = useState<string | null>(null);
  const [joinCode, setJoinCode] = useState('');
  const accessToken = useAuth((s) => s.accessToken);
  const push = useToast((s) => s.push);

  const create = async () => {
    try {
      const r = await api<{ code: string }>('/multiplayer/rooms', {
        method: 'POST',
        body: JSON.stringify({ mode, levelId }),
      });
      setCode(r.code);
      push({ title: 'Sala creada', description: `Código: ${r.code}`, kind: 'success' });
    } catch {
      push({ title: 'Sala creada (offline)', description: `Código: DEMO-${levelId}`, kind: 'info' });
      setCode(`DEMO-${levelId}`);
    }
  };

  const join = async () => {
    try {
      await api(`/multiplayer/rooms/${joinCode}/join`, { method: 'POST' });
      push({ title: 'Unido a la sala', description: joinCode, kind: 'success' });
    } catch {
      push({ title: 'Modo demo', description: `Unido a ${joinCode}`, kind: 'info' });
    }
  };

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">
      <h1 className="font-display text-3xl title-grad mb-6">Multijugador</h1>

      <div className="grid md:grid-cols-2 gap-4">
        <Panel>
          <h2 className="font-display text-xl mb-3">Crear sala</h2>
          <div className="flex gap-2 mb-3">
            <Button variant={mode === 'coop' ? 'primary' : 'ghost'} size="sm" onClick={() => setMode('coop')}>Cooperativo</Button>
            <Button variant={mode === 'versus' ? 'primary' : 'ghost'} size="sm" onClick={() => setMode('versus')}>Versus</Button>
          </div>
          <label className="block mb-3">
            <span className="text-xs text-muted uppercase">Mapa</span>
            <select value={levelId} onChange={(e) => setLevelId(e.target.value)} className="mt-1 w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2">
              {LEVELS.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
            </select>
          </label>
          <Button onClick={create} disabled={!accessToken}>Crear</Button>
          {code && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4">
              <div className="text-muted text-sm">Comparte este código con tu equipo:</div>
              <div className="font-display text-3xl tracking-widest text-center my-2">{code}</div>
            </motion.div>
          )}
        </Panel>

        <Panel>
          <h2 className="font-display text-xl mb-3">Unirse a una sala</h2>
          <input
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder="CÓDIGO"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 mb-3 outline-none focus:border-accent2 tracking-widest"
          />
          <Button onClick={join} disabled={!accessToken || joinCode.length < 4}>Unirme</Button>
          {!accessToken && (
            <div className="text-muted text-sm mt-3">Inicia sesión para jugar en línea. (Demo offline funcional sin login)</div>
          )}
        </Panel>
      </div>

      <Panel className="mt-6 text-sm text-muted">
        En cooperativo, hasta 4 jugadores defienden Cyber Fortress sincronizando torres y oleadas.
        En versus, compites por aguantar más tiempo con ELO.
      </Panel>
    </div>
  );
}
