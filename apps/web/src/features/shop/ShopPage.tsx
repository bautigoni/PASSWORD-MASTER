import { motion } from 'framer-motion';
import { Panel } from '@/shared/ui/Panel';
import { Button } from '@/shared/ui/Button';
import { useAuth } from '@/shared/state/authStore';
import { useToast } from '@/shared/ui/Toast';
import { Coin, Gem } from '@/shared/ui/Coin';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  priceCoins?: number;
  priceGems?: number;
  color: string;
}

const SKINS: ShopItem[] = [
  { id: 'skin-neon', name: 'Neon Grid', description: 'Patrón cyberpunk para torres.', priceCoins: 1500, color: 'from-cyan-400 to-fuchsia-500' },
  { id: 'skin-aurora', name: 'Aurora', description: 'Ondas de color para proyectiles.', priceGems: 30, color: 'from-emerald-400 to-cyan-500' },
  { id: 'skin-pixel', name: 'Pixel Hero', description: 'Estilo retro 16-bit.', priceCoins: 1200, color: 'from-amber-400 to-rose-500' },
];

const EFFECTS: ShopItem[] = [
  { id: 'fx-snow', name: 'Nieve Digital', description: 'Copos de bits caen sobre el tablero.', priceGems: 20, color: 'from-sky-300 to-white' },
  { id: 'fx-glitch', name: 'Glitch Wave', description: 'Distorsión RGB en impactos.', priceGems: 25, color: 'from-rose-500 to-violet-500' },
  { id: 'fx-aurora', name: 'Aurora Boreal', description: 'Resplandor en el cielo del mapa.', priceCoins: 2000, color: 'from-teal-400 to-violet-500' },
];

export function ShopPage() {
  const user = useAuth((s) => s.user);
  const push = useToast((s) => s.push);
  const buy = (i: ShopItem) => push({ title: 'Comprado', description: `${i.name} ahora está en tu inventario.`, kind: 'success' });

  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl title-grad">Tienda</h1>
        <div className="flex items-center gap-2">
          <span className="chip"><Coin /> {user?.coins ?? 0}</span>
          <span className="chip"><Gem /> {user?.gems ?? 0}</span>
        </div>
      </div>

      <Section title="Skins" items={SKINS} onBuy={buy} />
      <Section title="Efectos visuales" items={EFFECTS} onBuy={buy} />

      <Panel className="mt-6 text-sm text-muted">
        Las compras son cosméticas. Nunca pay-to-win: el juego se gana con estrategia, no con billetera.
      </Panel>
    </div>
  );
}

function Section({ title, items, onBuy }: { title: string; items: ShopItem[]; onBuy: (i: ShopItem) => void }) {
  return (
    <section className="mb-6">
      <h2 className="font-display text-xl mb-3">{title}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((i, idx) => (
          <motion.div
            key={i.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
          >
            <Panel>
              <div className={`h-20 rounded-xl mb-3 bg-gradient-to-br ${i.color} shadow-glow`} />
              <div className="font-display text-lg">{i.name}</div>
              <div className="text-muted text-sm mb-3">{i.description}</div>
              <div className="flex items-center justify-between">
                <span className="chip">
                  {i.priceCoins && <><Coin /> {i.priceCoins}</>}
                  {i.priceGems && <><Gem /> {i.priceGems}</>}
                </span>
                <Button size="sm" onClick={() => onBuy(i)}>Comprar</Button>
              </div>
            </Panel>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
