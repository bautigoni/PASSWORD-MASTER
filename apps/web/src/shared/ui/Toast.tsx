import { AnimatePresence, motion } from 'framer-motion';
import { create } from 'zustand';

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  kind?: 'info' | 'success' | 'warning' | 'danger';
}

interface ToastState {
  items: ToastItem[];
  push: (t: Omit<ToastItem, 'id'>) => void;
  remove: (id: string) => void;
}

export const useToast = create<ToastState>((set) => ({
  items: [],
  push: (t) => {
    const id = crypto.randomUUID();
    set((s) => ({ items: [...s.items, { id, kind: 'info', ...t }] }));
    setTimeout(() => set((s) => ({ items: s.items.filter((i) => i.id !== id) })), 3500);
  },
  remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
}));

export function ToastViewport() {
  const { items, remove } = useToast();
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {items.map((t) => (
          <motion.div
            key={t.id}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            className={`panel py-3 px-4 flex items-start gap-3 border-l-4 ${
              t.kind === 'success' ? 'border-success' : t.kind === 'warning' ? 'border-warning' : t.kind === 'danger' ? 'border-danger' : 'border-accent2'
            }`}
          >
            <div className="flex-1">
              <div className="font-display font-semibold">{t.title}</div>
              {t.description && <div className="text-sm text-muted">{t.description}</div>}
            </div>
            <button onClick={() => remove(t.id)} className="text-muted hover:text-text">×</button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
