import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Panel } from '@/shared/ui/Panel';
import { Button } from '@/shared/ui/Button';
import { mulberry32, hashSeed } from '@/features/game/engine/prng';
import type { EnemyKind, LevelManifest, WaveManifest } from '@pm/shared/types';
import { ENEMIES } from '@pm/shared/balance';

const POOL: EnemyKind[] = ['script_kiddie', 'botnet', 'brute_force', 'phisher', 'breach_ghost', 'deepfake', 'ransomware_knight', 'zero_day_phantom'];
const BOSSES: EnemyKind[] = ['boss_weak_passwords', 'boss_lord_reuse', 'boss_breach_master', 'boss_phisher_king'];

export function ChallengePage() {
  const nav = useNavigate();
  const [seed, setSeed] = useState(dailySeed());
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5>(3);
  const level = useMemo(() => generate(seed, difficulty), [seed, difficulty]);

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto">
      <h1 className="font-display text-3xl title-grad mb-2">Modo Desafío</h1>
      <p className="text-muted mb-4">Cada partida es única, generada con un motor procedural. Comparte la semilla.</p>

      <Panel>
        <div className="grid sm:grid-cols-2 gap-3 mb-4">
          <Field label="Semilla">
            <input value={seed} onChange={(e) => setSeed(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 outline-none focus:border-accent2" />
          </Field>
          <Field label="Dificultad">
            <select value={difficulty} onChange={(e) => setDifficulty(Number(e.target.value) as 1 | 2 | 3 | 4 | 5)} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 outline-none focus:border-accent2">
              {[1, 2, 3, 4, 5].map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </Field>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Button variant="ghost" size="sm" onClick={() => setSeed(dailySeed())}>Semilla diaria</Button>
          <Button variant="ghost" size="sm" onClick={() => setSeed(Math.random().toString(36).slice(2, 10))}>Aleatoria</Button>
        </div>

        <motion.div layout className="p-3 rounded-2xl border border-white/10 bg-white/5 mb-4">
          <div className="font-display text-lg">{level.name}</div>
          <div className="text-muted text-sm">{level.waves.length} oleadas · {Object.keys(ENEMIES).length} tipos · 1-2 jefes</div>
        </motion.div>

        <Button onClick={() => nav(`/play/challenge/${level.id}`)}>Jugar</Button>
      </Panel>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs text-muted uppercase">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function dailySeed(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;
}

function generate(seed: string, difficulty: 1 | 2 | 3 | 4 | 5): LevelManifest {
  const rng = mulberry32(hashSeed(seed));
  const waves: WaveManifest[] = [];
  let t = 2;
  for (let i = 0; i < 10; i++) {
    const isBoss = (i + 1) % 3 === 0;
    const groupCount = 1 + Math.floor(rng() * 2);
    const groups: WaveManifest['groups'] = [];
    for (let g = 0; g < groupCount; g++) {
      const kind = POOL[Math.floor(rng() * POOL.length)];
      const count = Math.max(3, Math.round(6 + i * 2 + difficulty * 2 + rng() * 6));
      const interval = Math.max(0.25, 1.0 - i * 0.05 - rng() * 0.2);
      groups.push({ kind, count, interval, delay: g === 0 ? 0 : 1 + rng() * 2 });
    }
    const bossKind = BOSSES[Math.floor(rng() * BOSSES.length)];
    waves.push({
      delay: 3 + Math.floor(rng() * 4),
      groups,
      boss: isBoss ? { kind: bossKind, count: 1, interval: 1 } : undefined,
    });
    t += 8;
  }
  return {
    id: `challenge-${seed}-${difficulty}`,
    name: `Desafío · ${seed} · D${difficulty}`,
    environment: 'city',
    difficulty,
    startingCoins: 250 + difficulty * 30,
    startingLives: 20,
    isProcedural: true,
    waves,
  };
}
