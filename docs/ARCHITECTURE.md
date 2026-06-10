# 🏛 Arquitectura — PASSWORD MASTER

## Principios

- **Clean Architecture**: las reglas de negocio no dependen del framework.
- **SOLID**: cada clase/módulo tiene una única responsabilidad y se extiende, no se modifica.
- **DRY**: la fuente de verdad del contenido es `packages/shared`.
- **KISS**: el motor de juego es determinista y basado en ticks; nada de magia.
- **Feature-Based**: cada feature vive en su carpeta con su `domain/`, `application/` e `infrastructure/`.

---

## Backend (`apps/api`)

```
src/
├── app/                       # Bootstrap de Express
├── config/                    # Variables de entorno validadas con Zod
├── modules/
│   ├── auth/                  # Registro, login, refresh, logout
│   ├── users/                 # Perfil, settings
│   ├── progress/              # XP, niveles, monedas
│   ├── achievements/          # Logros
│   ├── pets/                  # Mascotas
│   ├── progression/           # Catálogo de torres/enemigos/niveles
│   ├── runs/                  # Partidas guardadas, replays
│   ├── procedural/            # Generador de oleadas procedurales
│   ├── multiplayer/           # Salas coop/competitivo
│   └── teacher/               # Panel docente
├── shared/
│   ├── domain/                # Entidades y VOs
│   ├── application/           # Casos de uso
│   └── infrastructure/        # Prisma, Redis, Socket.IO
├── prisma/                    # Schema + migrations + seeds
└── server.ts
```

Cada módulo sigue el patrón:

```
modules/<feature>/
├── domain/        # Entidades puras, invariantes
├── application/   # UseCases, DTOs
├── infrastructure/ # Controllers HTTP, repos Prisma
└── <feature>.routes.ts
```

---

## Frontend (`apps/web`)

```
src/
├── app/                  # Router + providers
├── features/             # Feature-based
│   ├── auth/
│   ├── game/             # Engine, HUD, board, towers, enemies
│   ├── campaign/
│   ├── sandbox/
│   ├── laboratory/
│   ├── shop/
│   ├── achievements/
│   ├── pets/
│   ├── multiplayer/
│   └── teacher/
├── shared/
│   ├── ui/               # Componentes primitivos
│   ├── hooks/
│   ├── api/              # React Query clients
│   ├── state/            # Zustand stores
│   ├── motion/           # Framer Motion variants
│   └── lib/
├── assets/               # SVGs, fuentes
└── styles/               # Tailwind entrypoint
```

---

## Motor de juego

El motor es **determinista** y basado en *ticks* (`requestAnimationFrame` con `dt` acumulado). Mantiene:

- `WorldState` — torres, enemigos, proyectiles, partículas.
- `WaveDirector` — invoca oleadas desde el *WaveManifest* procedural.
- `InputController` — selección / colocación / upgrade.
- `Renderer` — capas: terreno, caminos, sombras, entidades, proyectiles, *fx*, *HUD*.

Toda la lógica se ejecuta en un *pure reducer* `update(state, dt, input) → state` para facilitar
testing y *time-travel debugging*.

---

## Comunicación cliente↔servidor

- **REST** (HTTP/JSON) para auth, progreso, catálogos, panel docente, multijugador (rooms).
- **WebSockets (Socket.IO)** para *heartbeats*, eventos de partida, sincronización de oleadas en
  cooperativo y *ELO* en competitivo.

---

## Decisiones clave

| Decisión                                | Razón                                                                 |
| --------------------------------------- | --------------------------------------------------------------------- |
| React Query para servidor, Zustand para UI/local | Separa estado remoto (cache, reintentos) de estado instantáneo de UI. |
| Prisma + PostgreSQL                      | Tipado fuerte, migraciones declarativas, ecosistema maduro.           |
| `packages/shared` para constantes y tipos | DRY absoluto entre cliente y servidor (catalogo de torres/enemigos). |
| `tsx` para scripts (`dev`, `seed`)       | Menos boilerplate, mismo TS en backend.                               |
| Validación con Zod                      | Single source of truth para payloads en cliente y servidor.           |

---

## Diagrama lógico

```
┌──────────────┐    REST/WS    ┌──────────────┐    Prisma    ┌──────────────┐
│  Web (React) │ ────────────▶ │ API (Express)│ ────────────▶│  PostgreSQL  │
└──────────────┘               └──────────────┘              └──────────────┘
       ▲                              ▲
       │            shared            │
       └──────────┬───────────────────┘
                  ▼
            ┌──────────────┐
            │   shared     │  (tipos, constantes, contratos)
            └──────────────┘
```
