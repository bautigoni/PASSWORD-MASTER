import { useState } from 'react';
import { motion } from 'framer-motion';
import { Panel } from '@/shared/ui/Panel';
import { Button } from '@/shared/ui/Button';
import { api } from '@/shared/api/client';
import { useAuth } from '@/shared/state/authStore';
import { useToast } from '@/shared/ui/Toast';

interface StudentProgress {
  userId: string;
  username: string;
  level: number;
  xp: number;
  progress: { levelId: string; stars: number; bestScore: number; attempts: number; completedAt: string | null }[];
}

export function TeacherPage() {
  const user = useAuth((s) => s.user);
  const [classId, setClassId] = useState<string | null>(null);
  const [students, setStudents] = useState<StudentProgress[]>([]);
  const [concepts, setConcepts] = useState<Record<string, number>>({});
  const push = useToast((s) => s.push);

  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

  const createClass = async () => {
    try {
      const r = await api<{ id: string }>('/teacher/classes', {
        method: 'POST',
        body: JSON.stringify({ name: `Clase de ${user?.username ?? 'Demo'}` }),
      });
      setClassId(r.id);
      push({ title: 'Clase creada', description: r.id, kind: 'success' });
    } catch {
      // demo offline
      setClassId('demo-class');
      setStudents(demoStudents());
      setConcepts({ 'Contraseñas débiles': 5, 'MFA': 3, 'Phishing': 4, 'Reutilización': 2 });
      push({ title: 'Clase demo cargada', kind: 'info' });
    }
  };

  const load = async () => {
    if (!classId) return;
    try {
      const r = await api<{ students: StudentProgress[] }>(`/teacher/classes/${classId}/progress`);
      setStudents(r.students);
      const c = await api<{ concepts: Record<string, number> }>(`/teacher/classes/${classId}/concepts`);
      setConcepts(c.concepts);
    } catch {
      setStudents(demoStudents());
      setConcepts({ 'Contraseñas débiles': 5, 'MFA': 3, 'Phishing': 4 });
    }
  };

  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto">
      <h1 className="font-display text-3xl title-grad mb-6">Panel Docente</h1>
      {!isTeacher && (
        <Panel className="mb-4 text-sm text-muted">
          Vista demo. Para datos reales, regístrate como profesor o contacta al equipo.
        </Panel>
      )}
      <div className="flex gap-2 mb-4">
        <Button onClick={createClass}>Crear clase</Button>
        <Button variant="ghost" onClick={load} disabled={!classId}>Cargar progreso</Button>
      </div>

      {students.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Panel className="mb-4">
            <h2 className="font-display text-xl mb-3">Estudiantes</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted">
                  <th>Usuario</th>
                  <th>Nivel</th>
                  <th>XP</th>
                  <th>Niveles completados</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.userId} className="border-t border-white/5">
                    <td className="py-2 font-display">{s.username}</td>
                    <td>{s.level}</td>
                    <td>{s.xp}</td>
                    <td>{s.progress.filter((p) => p.completedAt).length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>

          <Panel>
            <h2 className="font-display text-xl mb-3">Conceptos dominados</h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {Object.entries(concepts).map(([c, n]) => (
                <div key={c} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
                  <span className="font-display">{c}</span>
                  <span className="chip">{n} estudiantes</span>
                </div>
              ))}
            </div>
          </Panel>
        </motion.div>
      )}
    </div>
  );
}

function demoStudents(): StudentProgress[] {
  return [
    { userId: '1', username: 'ana_dev', level: 8, xp: 1820, progress: [{ levelId: 'city-01', stars: 3, bestScore: 1240, attempts: 1, completedAt: '2026-05-12' }] },
    { userId: '2', username: 'luis_22', level: 5, xp: 760, progress: [{ levelId: 'city-01', stars: 2, bestScore: 800, attempts: 3, completedAt: '2026-05-14' }] },
    { userId: '3', username: 'sofia.q', level: 12, xp: 3210, progress: [{ levelId: 'city-01', stars: 3, bestScore: 1500, attempts: 1, completedAt: '2026-05-15' }] },
  ];
}
