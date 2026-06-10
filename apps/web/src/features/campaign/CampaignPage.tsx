import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LEVELS } from '@pm/shared/catalog';
import { Panel } from '@/shared/ui/Panel';
import { Button } from '@/shared/ui/Button';
import { Lock, Star, Trophy } from 'lucide-react';

const ENV_NAMES: Record<string, string> = {
  city: 'Ciudad',
  school: 'Escuela',
  bank: 'Banco',
  hospital: 'Hospital',
  datacenter: 'Centro de Datos',
};

const ENV_GRADIENTS: Record<string, string> = {
  city: 'from-violet-500/30 to-cyan-500/20',
  school: 'from-blue-500/30 to-emerald-500/20',
  bank: 'from-amber-500/30 to-yellow-500/20',
  hospital: 'from-rose-500/30 to-pink-500/20',
  datacenter: 'from-fuchsia-500/30 to-purple-500/20',
};

export function CampaignPage() {
  const groups = LEVELS.reduce<Record<string, typeof LEVELS>>((acc, l) => {
    (acc[l.environment] ??= []).push(l);
    return acc;
  }, {});

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl title-grad">Campaña</h1>
        <Link to="/"><Button variant="ghost" size="sm">← Volver</Button></Link>
      </div>

      {Object.entries(groups).map(([env, levels]) => (
        <section key={env} className="mb-8">
          <h2 className="font-display text-xl mb-3">{ENV_NAMES[env] ?? env}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {levels.map((l, i) => {
              const prev = levels[i - 1];
              const locked = !!prev && !LEVELS.find((x) => x.id === prev.id); // simulado
              return (
                <motion.div
                  key={l.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link to={`/play/${l.id}`}>
                    <div className={`relative panel overflow-hidden bg-gradient-to-br ${ENV_GRADIENTS[env] ?? 'from-white/10 to-white/0'} hover:shadow-glow transition-shadow`}>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-xs text-muted uppercase">Nivel {i + 1}</div>
                          <div className="font-display text-lg leading-tight">{l.name}</div>
                        </div>
                        <div className="flex items-center gap-1 text-warning">
                          <Star />
                          <span className="text-xs">{l.difficulty}/5</span>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-xs text-muted">
                        <Trophy /> {l.waves.length} oleadas · {l.startingLives} ❤
                      </div>
                      {locked && <div className="absolute inset-0 grid place-items-center bg-black/40"><Lock /></div>}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
