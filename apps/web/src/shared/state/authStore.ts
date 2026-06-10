import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api, ApiError } from '@/shared/api/client';
import type { PublicUser } from '@pm/shared/types';

interface AuthState {
  user: PublicUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  hydrate: () => Promise<void>;
  setError: (e: string | null) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      error: null,
      setError: (e) => set({ error: e }),

      async login(email, password) {
        set({ isLoading: true, error: null });
        try {
          const res = await api<{ user: PublicUser; accessToken: string; refreshToken: string }>(
            '/auth/login',
            { method: 'POST', body: JSON.stringify({ email, password }) },
          );
          localStorage.setItem('pm_access', res.accessToken);
          localStorage.setItem('pm_refresh', res.refreshToken);
          set({ user: res.user, accessToken: res.accessToken, refreshToken: res.refreshToken, isLoading: false });
        } catch (e) {
          const msg = e instanceof ApiError ? e.message : 'Login failed';
          set({ isLoading: false, error: msg });
          throw e;
        }
      },

      async register(email, username, password) {
        set({ isLoading: true, error: null });
        try {
          const res = await api<{ user: PublicUser; accessToken: string; refreshToken: string }>(
            '/auth/register',
            { method: 'POST', body: JSON.stringify({ email, username, password }) },
          );
          localStorage.setItem('pm_access', res.accessToken);
          localStorage.setItem('pm_refresh', res.refreshToken);
          set({ user: res.user, accessToken: res.accessToken, refreshToken: res.refreshToken, isLoading: false });
        } catch (e) {
          const msg = e instanceof ApiError ? e.message : 'Register failed';
          set({ isLoading: false, error: msg });
          throw e;
        }
      },

      async logout() {
        const rt = get().refreshToken;
        if (rt) {
          try {
            await api('/auth/logout', { method: 'POST', body: JSON.stringify({ refreshToken: rt }) });
          } catch {
            /* ignore */
          }
        }
        localStorage.removeItem('pm_access');
        localStorage.removeItem('pm_refresh');
        set({ user: null, accessToken: null, refreshToken: null });
      },

      async refresh() {
        const rt = localStorage.getItem('pm_refresh');
        if (!rt) return;
        try {
          const res = await api<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
            method: 'POST',
            body: JSON.stringify({ refreshToken: rt }),
          });
          localStorage.setItem('pm_access', res.accessToken);
          localStorage.setItem('pm_refresh', res.refreshToken);
          set({ accessToken: res.accessToken, refreshToken: res.refreshToken });
        } catch {
          localStorage.removeItem('pm_access');
          localStorage.removeItem('pm_refresh');
          set({ user: null, accessToken: null, refreshToken: null });
        }
      },

      async hydrate() {
        const accessToken = localStorage.getItem('pm_access');
        if (!accessToken) return;
        try {
          const u = await api<PublicUser>('/users/me');
          set({ user: u, accessToken });
        } catch {
          await get().refresh();
        }
      },
    }),
    { name: 'pm-auth', partialize: (s) => ({ user: s.user }) },
  ),
);
