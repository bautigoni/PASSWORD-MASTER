import { useEffect } from 'react';

export function useHotkeys(map: Record<string, (e: KeyboardEvent) => void>) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      const handler = map[k] ?? map[`${e.shiftKey ? 'shift+' : ''}${k}`];
      if (handler) {
        handler(e);
      }
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [map]);
}
