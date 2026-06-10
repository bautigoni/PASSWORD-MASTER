import { z } from 'zod';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4001';

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string, public details?: unknown) {
    super(message);
  }
}

export async function api<T>(
  path: string,
  init: RequestInit = {},
  schema?: z.ZodType<T>,
): Promise<T> {
  const accessToken = localStorage.getItem('pm_access');
  const res = await fetch(`${API_URL}/api/v1${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...(accessToken ? { authorization: `Bearer ${accessToken}` } : {}),
      ...(init.headers ?? {}),
    },
  });
  if (res.status === 204) return undefined as T;
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(res.status, body?.error?.code ?? 'ERROR', body?.error?.message ?? 'Request failed', body?.error?.details);
  }
  return schema ? schema.parse(body) : (body as T);
}
