import { describe, it, expect, vi } from 'vitest';
import { getSocket } from './multiplayerClient';

vi.mock('socket.io-client', () => ({
  io: vi.fn(() => ({ id: 'fake-socket' })),
}));

describe('multiplayerClient', () => {
  it('returns a singleton socket', () => {
    const a = getSocket('token-a');
    const b = getSocket('token-b');
    expect(a).toBe(b);
  });
});
