import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '@/shared/state/authStore';
import { Button } from '@/shared/ui/Button';
import { Coin, Gem } from '@/shared/ui/Coin';

const NAV = [
  { to: '/campaign', label: 'Campaña', desc: '50+ niveles · 4 entornos', color: 'from-accent to-accent2' },
  { to: '/challenge', label: 'Desafío', desc: 'Procedural · semilla diaria', color: 'from-pink-500 to-rose-500' },
  { to: '/sandbox', label: 'Sandbox', desc: 'Libre · infinito', color: 'from-emerald-500 to-teal-500' },
  { to: '/laboratory', label: 'Laboratorio', desc: 'Entropía · MFA · filtraciones', color: 'from-amber-500 to-orange-500' },
  { to: '/multiplayer', label: 'Multijugador', desc: 'Co-op y Versus', color: 'from-fuchsia-500 to-purple-600' },
  { to: '/achievements', label: 'Logros', desc: '10+ achievements', color: 'from-yellow-500 to-amber-500' },
  { to: '/pets', label: 'Mascotas', desc: 'Byte, Owl, Panda…', color: 'from-cyan-500 to-blue-500' },
  { to: '/shop', label: 'Tienda', desc: 'Skins y efectos', color: 'from-violet-500 to-indigo-500' },
  { to: '/teacher', label: 'Docente', desc: 'Panel de clases', color: 'from-slate-500 to-slate-700' },
];

export function MainMenuPage() {
  const user = useAuth((s) => s.user);
  const logout = useAuth((s) => s.logout);
  return (
    <main className="min-h-screen p-6 md:p-10 max-w-6xl mx-auto">
      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-3">
          <Logo />
          <h1 className="font-display text-3xl title-grad">PASSWORD MASTER</h1>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="chip"><Coin /> {user.coins}</span>
              <span className="chip"><Gem /> {user.gems}</span>
              <span className="chip">Nivel {user.level}</span>
              <Button variant="ghost" size="sm" onClick={() => void logout()}>Salir</Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button variant="ghost" size="sm">Entrar</Button></Link>
              <Link to="/register"><Button size="sm">Registro</Button></Link>
            </>
          )}
        </div>
      </motion.header>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="panel mb-8"
      >
        <h2 className="font-display text-2xl mb-1">Cyber Fortress te necesita, {user?.username ?? 'Guardián'}.</h2>
        <p className="text-muted max-w-2xl">
          Defiende la ciudad digital con contraseñas robustas, MFA, gestores, firewalls y centros de
          monitoreo. Aprende ciberseguridad real mientras juegas.
        </p>
      </motion.section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {NAV.map((n, i) => (
          <motion.div
            key={n.to}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link to={n.to} className="block group">
              <div className="panel relative overflow-hidden hover:shadow-glow transition-shadow">
                <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br ${n.color} opacity-20 group-hover:opacity-40 blur-2xl transition-opacity`} />
                <div className="font-display text-xl mb-1">{n.label}</div>
                <div className="text-muted text-sm">{n.desc}</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <footer className="text-center text-muted text-xs mt-12">
        Hecho con 💜 · v0.1.0 · <Link to="/teacher" className="underline">Panel docente</Link>
      </footer>
    </main>
  );
}

function Logo() {
  return (
    <motion.svg width={44} height={44} viewBox="0 0 64 64" initial={{ rotate: -8 }} animate={{ rotate: [-8, 8, -8] }} transition={{ duration: 4, repeat: Infinity }}>
      <defs>
        <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7c5cff" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <path d="M32 4 L56 14 V32 C56 46 44 56 32 60 C20 56 8 46 8 32 V14 Z" fill="url(#lg)" stroke="#fff" strokeWidth="2" />
      <path d="M22 32 l8 8 l14 -16" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </motion.svg>
  );
}
