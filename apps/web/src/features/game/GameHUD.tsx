import { motion } from 'framer-motion';
import { Heart, Trophy } from 'lucide-react';
import { useGame } from '@/shared/state/gameStore';
import { Coin } from '@/shared/ui/Coin';
import { Button } from '@/shared/ui/Button';

export function GameHUD({ onPause, onRestart, paused }: { onPause: () => void; onRestart: () => void; paused: boolean }) {
  const coins = useGame((s) => s.coins);
  const lives = useGame((s) => s.lives);
  const wave = useGame((s) => s.wave);
  return (
    <div className="flex items-center justify-between w-full gap-3">
      <div className="flex items-center gap-2">
        <Chip icon={<Heart className="w-4 h-4" />} label="Vidas" value={lives} color="text-danger" />
        <Chip icon={<span className="inline-block"><Coin /></span>} label="Monedas" value={coins} color="text-warning" />
        <Chip icon={<Trophy className="w-4 h-4" />} label="Oleada" value={wave + 1} />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onPause}>
          {paused ? 'Reanudar' : 'Pausar'}
        </Button>
        <Button variant="ghost" size="sm" onClick={onRestart}>
          Reiniciar
        </Button>
      </div>
    </div>
  );
}

function Chip({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color?: string }) {
  return (
    <motion.div
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="panel px-3 py-1.5 flex items-center gap-2"
    >
      {icon}
      <span className="text-xs uppercase tracking-wider text-muted">{label}</span>
      <span className={`font-display text-lg ${color ?? 'text-text'}`}>{value}</span>
    </motion.div>
  );
}
