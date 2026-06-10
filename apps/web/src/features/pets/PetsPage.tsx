import { motion } from 'framer-motion';
import { PETS } from '@pm/shared/catalog';
import { Panel } from '@/shared/ui/Panel';
import { Button } from '@/shared/ui/Button';
import { useGame } from '@/shared/state/gameStore';
import { useToast } from '@/shared/ui/Toast';

const ICONS: Record<string, string> = {
  drone: '🛸',
  dog: '🐕',
  owl: '🦉',
  panda: '🐼',
  bot: '🤖',
};

export function PetsPage() {
  const equipped = useGame((s) => s.equippedPet);
  const setPet = useGame((s) => s.setPet);
  const push = useToast((s) => s.push);

  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto">
      <h1 className="font-display text-3xl title-grad mb-6">Mascotas</h1>
      <p className="text-muted mb-4 max-w-2xl">
        Cada mascota ofrece una pasiva global. Solo puedes equipar una a la vez.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {PETS.map((p, i) => {
          const isEquipped = equipped === p.id;
          return (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Panel className={isEquipped ? 'border-accent shadow-glow' : ''}>
                <div className="flex items-center gap-3">
                  <div className="text-5xl animate-floaty">{ICONS[p.icon]}</div>
                  <div>
                    <div className="font-display text-lg">{p.name}</div>
                    <div className="text-muted text-sm">{p.description}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="chip">+{Math.round(p.passive.value * 100)}% {p.passive.kind.replace(/_/g, ' ')}</span>
                  <Button
                    size="sm"
                    variant={isEquipped ? 'ghost' : 'primary'}
                    onClick={() => {
                      setPet(isEquipped ? null : p.id);
                      push({ title: isEquipped ? 'Mascota desequipada' : '¡Mascota equipada!', description: p.name, kind: 'success' });
                    }}
                  >
                    {isEquipped ? 'Quitar' : 'Equipar'}
                  </Button>
                </div>
              </Panel>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
