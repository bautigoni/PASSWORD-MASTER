import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export function Button({ variant = 'primary', size = 'md', icon, className, children, ...rest }: PropsWithChildren<Props>) {
  return (
    <motion.button
      whileHover={{ y: -1, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      className={clsx(
        variant === 'primary' && 'btn-primary',
        variant === 'ghost' && 'btn-ghost',
        variant === 'danger' && 'btn bg-danger/90 text-white hover:bg-danger',
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'lg' && 'px-7 py-3 text-lg',
        className,
      )}
      {...(rest as any)}
    >
      {icon}
      {children}
    </motion.button>
  );
}
