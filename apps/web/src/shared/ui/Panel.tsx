import { clsx } from 'clsx';
import type { PropsWithChildren } from 'react';

export function Panel({ children, className }: PropsWithChildren<{ className?: string }>) {
  return <div className={clsx('panel', className)}>{children}</div>;
}
