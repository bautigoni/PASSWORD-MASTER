import { motion } from 'framer-motion';

export function Coin({ className = '' }: { className?: string }) {
  return (
    <motion.span
      className={`inline-block ${className}`}
      animate={{ rotateY: [0, 360] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      style={{ display: 'inline-block' }}
    >
      <span className="inline-block w-5 h-5 rounded-full bg-gradient-to-br from-warning to-amber-300 border-2 border-yellow-200 shadow-[0_0_10px_rgba(245,158,11,0.6)]" />
    </motion.span>
  );
}

export function Gem({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-block w-4 h-4 rotate-45 bg-gradient-to-br from-accent2 to-accent border border-white/40 ${className}`} />
  );
}
