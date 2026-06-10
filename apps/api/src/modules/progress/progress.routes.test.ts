import { describe, it, expect } from 'vitest';
import { xpFor } from './progress.routes';

describe('xp curve', () => {
  it('grows monotonically', () => {
    let prev = -1;
    for (let l = 1; l <= 50; l++) {
      const v = xpFor(l);
      expect(v).toBeGreaterThan(prev);
      prev = v;
    }
  });
  it('xpFor(1) is 0', () => {
    expect(xpFor(1)).toBe(0);
  });
});
