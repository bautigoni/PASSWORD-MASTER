import { motion } from 'framer-motion';
import { ACHIEVEMENTS } from '@pm/shared/catalog';
import { Panel } from '@/shared/ui/Panel';

const ICONS: Record<string, string> = {
  shield: '🛡️',
  firewall: '🔥',
  key: '🔑',
  mfa: '🔐',
  trophy: '🏆',
  sword: '⚔️',
  heart: '💖',
  bolt: '⚡',
  star: '🌟',
  mask: '🎭',
};

export function AchievementsPage() {
  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto">
      <h1 className="font-display text-3xl title-grad mb-6">Logros</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ACHIEVEMENTS.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Panel>
              <div className="flex items-center gap-3">
                <div className="text-3xl">{ICONS[a.icon] ?? '🏅'}</div>
                <div>
                  <div className="font-display text-lg">{a.name}</div>
                  <div className="text-muted text-sm">{a.description}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                {a.reward.coins && <span className="chip">🪙 {a.reward.coins}</span>}
                {a.reward.gems && <span className="chip">💎 {a.reward.gems}</span>}
                {a.reward.xp && <span className="chip">⭐ {a.reward.xp} XP</span>}
              </div>
            </Panel>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
