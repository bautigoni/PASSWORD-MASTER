import { io, type Socket } from 'socket.io-client';

const URL = import.meta.env.VITE_WS_URL ?? 'http://localhost:4001';

let socket: Socket | null = null;

export function getSocket(token: string) {
  if (socket) return socket;
  socket = io(URL, { auth: { token }, transports: ['websocket'] });
  return socket;
}
