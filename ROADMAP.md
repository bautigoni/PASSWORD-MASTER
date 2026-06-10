# 🗺️ Roadmap de Desarrollo — PASSWORD MASTER

> Hoja de ruta pública. Versiones siguen **SemVer**.

---

## v0.1 — Foundation (✅ ahora)
- Monorepo con `apps/web`, `apps/api`, `packages/shared`.
- Backend Express + Prisma + PostgreSQL con auth Argon2id + JWT.
- Esquema Prisma completo (users, progress, achievements, pets, runs, multiplayer rooms, teacher panel).
- Frontend con sistema de diseño, routing, store Zustand, React Query.
- Motor de juego *tower defense* con canvas, oleadas, torres, enemigos, partículas, *HUD*.
- Menú principal, campaña, sandbox, laboratorio, tienda, logros, mascotas, panel docente, multijugador (sala + match simulado).
- Tests Vitest + RTL, ESLint + Prettier + Husky, *documentation site* básica.

## v0.2 — Gameplay Loop
- 10 niveles adicionales de campaña con narrativa corta.
- 2 nuevos enemigos (*Ransomware Knight*, *Zero-Day Phantom*).
- 1 nuevo jefe (*The Quantum Cracker*).
- Sistema de *combos* y *streaks*.
- *Daily challenge* procedural con seed reproducible.

## v0.3 — Profesor & LMS
- Exportar progreso del panel docente a CSV/JSON.
- Crear clases con código de acceso.
- Asignar niveles a estudiantes.
- *Heatmap* de conceptos aprendidos.

## v0.4 — Multijugador real
- Match cooperativo 1-4 jugadores con *netcode* autoritativo.
- Match competitivo con *ELO*.
- *Spectator mode*.

## v0.5 — LiveOps
- *Events* temporales (Hacktober, Navidad Segura, etc.).
- *Battle Pass* educativo con cosméticos.
- Tienda rotativa.

## v0.6 — Internacionalización
- i18n completa (es, en, pt-BR).
- Audios y *voice-overs* localizados.

## v1.0 — Lanzamiento
- 50+ niveles.
- 4 entornos.
- 8+ mascotas.
- 30+ logros.
- Mobile-friendly (PWA).
- App stores (TWA).

---

## 📌 Métricas de éxito

| KPI                                  | Objetivo     |
| ------------------------------------ | ------------ |
| Retención D1                          | > 45%        |
| Retención D7                          | > 22%        |
| Conceptos记住 por jugador (post-campaign) | ≥ 6/8        |
| NPS                                   | ≥ 60          |
| Crash-free sessions                   | ≥ 99.5%       |

---

## 🤝 Contribución

Ver `docs/ARCHITECTURE.md` para la arquitectura y `docs/SECURITY.md` para prácticas de seguridad.
