import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Panel } from '@/shared/ui/Panel';
import { Button } from '@/shared/ui/Button';
import { ProgressBar } from '@/shared/ui/ProgressBar';

const COMMON = ['123456', 'password', 'qwerty', 'iloveyou', 'admin'];
const STRONG = 'Tr0p!c4l-Órbita-2026-🦄';
const PASSPHRASE = 'correct horse battery staple';

function charsetPool(pw: string) {
  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/[0-9]/.test(pw)) pool += 10;
  if (/[^A-Za-z0-9]/.test(pw)) pool += 33;
  return Math.max(1, pool);
}

function entropy(pw: string) {
  return Math.log2(charsetPool(pw) ** pw.length);
}

function crackTime(ent: number, guessesPerSec = 1e10) {
  // average guesses = 2^(ent-1) -> seconds
  return (2 ** Math.max(0, ent - 1)) / guessesPerSec;
}

function fmtTime(sec: number) {
  if (!isFinite(sec) || sec > 1e20) return 'siglos';
  if (sec < 1e-3) return 'instantáneo';
  if (sec < 60) return `${sec.toFixed(2)} s`;
  if (sec < 3600) return `${(sec / 60).toFixed(1)} min`;
  if (sec < 86400) return `${(sec / 3600).toFixed(1)} h`;
  if (sec < 86400 * 30) return `${(sec / 86400).toFixed(1)} días`;
  if (sec < 86400 * 365) return `${(sec / (86400 * 30)).toFixed(1)} meses`;
  if (sec < 86400 * 365 * 1000) return `${(sec / (86400 * 365)).toFixed(1)} años`;
  if (sec < 86400 * 365 * 1e6) return `${(sec / (86400 * 365 * 1e3)).toFixed(1)} mil años`;
  if (sec < 86400 * 365 * 1e9) return `${(sec / (86400 * 365 * 1e6)).toFixed(1)} millones de años`;
  if (sec < 86400 * 365 * 1e12) return `${(sec / (86400 * 365 * 1e9)).toFixed(1)} mil millones de años`;
  return 'más que la edad del universo';
}

export function LaboratoryPage() {
  const [pw, setPw] = useState('123456');
  const [mfa, setMfa] = useState(false);
  const [reuse, setReuse] = useState(true);

  const ent = useMemo(() => entropy(pw), [pw]);
  const ct = useMemo(() => crackTime(ent), [ent]);
  const strength = Math.min(100, (ent / 80) * 100);

  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl title-grad">Laboratorio</h1>
        <a href="/"><Button variant="ghost" size="sm">← Volver</Button></a>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Panel>
          <h2 className="font-display text-xl mb-2">Probador de contraseñas</h2>
          <input
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 mb-3 outline-none focus:border-accent2"
            placeholder="Escribe una contraseña…"
          />
          <div className="space-y-2">
            <Row label="Entropía" value={`${ent.toFixed(1)} bits`} />
            <Row label="Tiempo medio de crackeo" value={fmtTime(ct)} />
            <Row label="Fuerza" value={<ProgressBar value={strength} max={100} />} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {[...COMMON, STRONG, PASSPHRASE].map((p) => (
              <button key={p} onClick={() => setPw(p)} className="chip hover:bg-white/10">
                {p}
              </button>
            ))}
          </div>
        </Panel>

        <Panel>
          <h2 className="font-display text-xl mb-2">Defensas activas</h2>
          <Toggle label="Activar MFA" value={mfa} onChange={setMfa} hint="Multiplica por 1.000x el coste para el atacante." />
          <Toggle label="Reutilizo la contraseña en varios sitios" value={reuse} onChange={setReuse} hint="Si un sitio se filtra, todos caen." />
          <motion.div layout className="mt-4 p-3 rounded-2xl border border-white/10 bg-white/5">
            <div className="text-sm text-muted">Tu nivel defensivo</div>
            <div className="font-display text-2xl">
              {mfa && !reuse && ent > 60 ? 'Fortaleza digital' : mfa || ent > 60 ? 'Defendido' : reuse ? 'En riesgo' : 'Vulnerable'}
            </div>
          </motion.div>
        </Panel>
      </div>

      <Panel className="mt-4">
        <h2 className="font-display text-xl mb-2">Conceptos clave</h2>
        <ul className="grid sm:grid-cols-2 gap-3 text-sm">
          {[
            ['Longitud', 'Cada carácter adicional dobla el trabajo del atacante.'],
            ['Variedad', 'Combina mayúsculas, minúsculas, números y símbolos.'],
            ['Unicidad', 'Una contraseña por cuenta. Un gestor lo hace fácil.'],
            ['MFA', 'Un segundo factor invalida el 99% de los ataques.'],
            ['Filtraciones', 'Comprueba HaveIBeenPwned y rota claves.'],
            ['Phishing', 'Verifica remitente, dominio y enlaces antes de clicar.'],
          ].map(([t, d]) => (
            <li key={t} className="p-3 rounded-2xl border border-white/10 bg-white/5">
              <div className="font-display text-base">{t}</div>
              <div className="text-muted">{d}</div>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted text-sm">{label}</span>
      <span className="font-display">{value}</span>
    </div>
  );
}

function Toggle({ label, value, onChange, hint }: { label: string; value: boolean; onChange: (v: boolean) => void; hint: string }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="w-full text-left p-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 mb-2"
    >
      <div className="flex items-center justify-between">
        <span className="font-display">{label}</span>
        <span className={`chip ${value ? 'bg-success/20 border-success' : ''}`}>{value ? 'ON' : 'OFF'}</span>
      </div>
      <div className="text-sm text-muted">{hint}</div>
    </button>
  );
}
