import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/shared/state/authStore';
import { Button } from '@/shared/ui/Button';
import { Panel } from '@/shared/ui/Panel';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, setError } = useAuth();
  const nav = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      nav('/');
    } catch {
      /* error en store */
    }
  };

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <Panel className="w-[360px]">
          <h1 className="font-display text-2xl title-grad mb-1">Bienvenido, Guardián</h1>
          <p className="text-muted text-sm mb-4">Entra a Cyber Fortress.</p>
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <Field
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              autoComplete="email"
            />
            <Field
              label="Contraseña"
              type="password"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
            />
            {error && (
              <div className="text-danger text-sm" onClick={() => setError(null)}>
                {error}
              </div>
            )}
            <Button disabled={isLoading}>{isLoading ? 'Entrando…' : 'Entrar'}</Button>
            <div className="text-sm text-muted text-center">
              ¿Sin cuenta?{' '}
              <Link to="/register" className="underline">
                Crea una
              </Link>
            </div>
          </form>
        </Panel>
      </motion.div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  ...rest
}: { label: string; value: string; onChange: (v: string) => void } & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange'
>) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs text-muted uppercase tracking-wider">{label}</span>
      <input
        {...rest}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 outline-none focus:border-accent2"
      />
    </label>
  );
}
