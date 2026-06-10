import { Router } from 'express';
import { z } from 'zod';
import { customAlphabet } from 'nanoid';
import { prisma } from '../../config/prisma';
import { requireAuth, requireRole } from '../../shared/infrastructure/authMiddleware';
import { HttpError } from '../../app/errorHandler';

const code = customAlphabet('ABCDEFGHJKMNPQRSTUVWXYZ23456789', 6);

export const teacherRouter = Router();

const createClass = z.object({ name: z.string().min(2).max(60) });

teacherRouter.post('/classes', requireAuth, requireRole('TEACHER'), async (req, res, next) => {
  try {
    const body = createClass.parse(req.body);
    const joinCode = code();
    const klass = await prisma.classRoom.create({
      data: { name: body.name, joinCode, teacherId: req.user!.sub },
    });
    res.status(201).json(klass);
  } catch (e) {
    next(e);
  }
});

teacherRouter.get('/classes', requireAuth, requireRole('TEACHER'), async (req, res, next) => {
  try {
    const classes = await prisma.classRoom.findMany({
      where: { teacherId: req.user!.sub },
      include: { enrollments: true },
    });
    res.json(classes);
  } catch (e) {
    next(e);
  }
});

const joinSchema = z.object({ joinCode: z.string().length(6) });

teacherRouter.post('/classes/join', requireAuth, async (req, res, next) => {
  try {
    const body = joinSchema.parse(req.body);
    const klass = await prisma.classRoom.findUnique({ where: { joinCode: body.joinCode } });
    if (!klass) throw new HttpError(404, 'NOT_FOUND', 'Class not found');
    await prisma.enrollment.upsert({
      where: { classId_userId: { classId: klass.id, userId: req.user!.sub } },
      update: {},
      create: { classId: klass.id, userId: req.user!.sub },
    });
    res.json({ classId: klass.id });
  } catch (e) {
    next(e);
  }
});

teacherRouter.get('/classes/:id/progress', requireAuth, requireRole('TEACHER'), async (req, res, next) => {
  try {
    const klass = await prisma.classRoom.findUnique({
      where: { id: req.params.id },
      include: {
        enrollments: { include: { user: { include: { progress: true } } } },
      },
    });
    if (!klass || klass.teacherId !== req.user!.sub) throw new HttpError(404, 'NOT_FOUND', 'Class not found');
    const summary = klass.enrollments.map((e) => ({
      userId: e.user.id,
      username: e.user.username,
      level: e.user.level,
      xp: e.user.xp,
      progress: e.user.progress,
    }));
    res.json({ classId: klass.id, name: klass.name, students: summary });
  } catch (e) {
    next(e);
  }
});

teacherRouter.get('/classes/:id/concepts', requireAuth, requireRole('TEACHER'), async (req, res, next) => {
  try {
    const klass = await prisma.classRoom.findUnique({
      where: { id: req.params.id },
      include: { enrollments: { include: { user: { include: { runs: true } } } } },
    });
    if (!klass || klass.teacherId !== req.user!.sub) throw new HttpError(404, 'NOT_FOUND', 'Class not found');
    // Mapear runs -> conceptos (levelId -> conceptos)
    const conceptMap: Record<string, string[]> = {
      'city-01': ['Contraseña Básica', 'Entropía'],
      'city-02': ['Brute Force'],
      'city-03': ['Phishing'],
      'city-04': ['Filtraciones de datos'],
      'city-05': ['Contraseñas débiles'],
      'school-01': ['Phishing en educación'],
      'bank-01': ['Deepfakes'],
      'bank-02': ['Reutilización de contraseñas'],
      'hospital-01': ['Ransomware'],
      'datacenter-01': ['Zero-day'],
      'datacenter-02': ['Filtraciones de datos'],
      'datacenter-03': ['Ingeniería social'],
    };
    const counters: Record<string, number> = {};
    for (const e of klass.enrollments) {
      for (const run of e.user.runs) {
        if (run.won) {
          for (const c of conceptMap[run.levelId] ?? []) counters[c] = (counters[c] ?? 0) + 1;
        }
      }
    }
    res.json({ classId: klass.id, concepts: counters });
  } catch (e) {
    next(e);
  }
});
