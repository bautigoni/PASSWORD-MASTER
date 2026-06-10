import type { Server as HttpServer } from 'node:http';
import { Server, type Socket } from 'socket.io';
import { env } from '../../config/env';
import { verifyAccessToken } from '../../shared/infrastructure/prisma';
import { logger } from '../../config/logger';
import { prisma } from '../../config/prisma';

interface Player {
  id: string;
  username: string;
}

const rooms = new Map<string, Set<Socket>>();

export function attachSockets(http: HttpServer) {
  const io = new Server(http, {
    cors: { origin: env.CORS_ORIGIN.split(','), credentials: true },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) return next(new Error('unauthorized'));
    try {
      const payload = verifyAccessToken(token);
      (socket.data as { userId: string }).userId = payload.sub;
      next();
    } catch {
      next(new Error('unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    logger.info({ userId: (socket.data as { userId: string }).userId }, 'socket connected');

    socket.on('room:join', async ({ code }: { code: string }) => {
      const set = rooms.get(code) ?? new Set<Socket>();
      set.add(socket);
      rooms.set(code, set);
      socket.join(code);
      const room = await prisma.multiplayerRoom.findUnique({ where: { code } });
      io.to(code).emit('room:state', { code, players: set.size, levelId: room?.levelId });
    });

    socket.on('wave:start', ({ code, wave }: { code: string; wave: number }) => {
      io.to(code).emit('wave:start', { wave, at: Date.now() });
    });

    socket.on('tower:place', ({ code, tower, x, y }: { code: string; tower: string; x: number; y: number }) => {
      io.to(code).emit('tower:place', { tower, x, y, by: socket.id });
    });

    socket.on('enemy:hit', ({ code, enemyId, dmg }: { code: string; enemyId: string; dmg: number }) => {
      io.to(code).emit('enemy:hit', { enemyId, dmg });
    });

    socket.on('match:end', async ({ code, won }: { code: string; won: boolean }) => {
      io.to(code).emit('match:end', { won });
      const set = rooms.get(code);
      if (set) {
        for (const s of set) s.leave(code);
        rooms.delete(code);
      }
      await prisma.multiplayerRoom.update({
        where: { code },
        data: { status: 'finished', finishedAt: new Date() },
      });
    });

    socket.on('disconnect', () => {
      for (const [code, set] of rooms) {
        if (set.has(socket)) {
          set.delete(socket);
          io.to(code).emit('room:state', { code, players: set.size });
        }
      }
    });
  });

  return io;
}
