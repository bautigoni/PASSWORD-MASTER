# 🔒 Seguridad — PASSWORD MASTER

> Ironía cero: enseñamos ciberseguridad, **somos** ciberseguridad.

## Autenticación

- **Hashing**: `argon2id` (m=64MB, t=3, p=4) — *memory-hard*, resistente a GPU/ASIC.
- **JWT**:
  - Access token (15 min) + Refresh token (7 días) con *rotation*.
  - Refresh tokens hasheados en BD (`sha256`).
  - *Revocation list* en logout.
- **MFA opcional (TOTP RFC 6238)** — al alcance para futuros usuarios *teacher/admin*.

## Autorización

- Middleware `requireAuth` + `requireRole('teacher' | 'admin')`.
- Panel docente sólo accede a clases donde el usuario es *owner*.

## Transporte

- HTTPS obligatorio en producción (HSTS, `preload`).
- Cookies `HttpOnly`, `SameSite=Lax`, `Secure` en prod.

## Headers (`helmet`)

- `Content-Security-Policy` estricta con *nonce*.
- `X-Content-Type-Options: nosniff`.
- `Referrer-Policy: strict-origin-when-cross-origin`.
- `X-Frame-Options: DENY`.

## Rate limit

- `express-rate-limit` por IP+endpoint.
- Login: 5/min, registro: 5/h, *refresh*: 30/min.

## Validación

- **Zod** en cada endpoint. Errores -> 400 con payload sanitizado.

## Logs y auditoría

- Logger estructurado (`pino`).
- Eventos sensibles: `auth.login`, `auth.logout`, `auth.refresh`, `teacher.view_class`.

## Almacenamiento

- **PostgreSQL** cifrado en disco (cloud-provider managed).
- **Backups** diarios cifrados con clave en KMS.
- **No se guardan contraseñas reales** de usuarios reales — sólo hashes y métricas del juego.

## Dependencias

- `npm audit` en CI.
- Renovación automática vía `dependabot`/Renovate.
- Lockfile *committed*.

## CTF interno

Cada release incluye un *capture-the-flag* educativo en `/admin/ctf` (sólo `admin`).

## Reporte de vulnerabilidades

`security@passwordmaster.app` — respuesta < 72h.
