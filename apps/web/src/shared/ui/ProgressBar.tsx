import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export function ProgressBar({
  value,
  max,
  color = 'accent',
  className,
}: {
  value: number;
  max: number;
  color?: 'accent' | 'success' | 'danger' | 'warning';
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / Math.max(1, max)) * 100));
  const colorClass = {
    accent: 'from-accent to-accent2',
    success: 'from-success to-emerald-400',
    danger: 'from-danger to-rose-400',
    warning: 'from-warning to-amber-300',
  }[color];

  return (
    <div className={clsx('h-3 w-full rounded-full bg-white/10 overflow-hidden', className)}>
      <motion.div
        className={clsx('h-full rounded-full bg-gradient-to-r', colorClass)}
        animate={{ width: `${pct}%` }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      />
    </div>
  );
}
