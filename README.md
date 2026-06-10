# PASSWORD MASTER

> **Cyber Fortress te necesita.** Defiende la ciudad digital de los hackers mientras aprendes ciberseguridad de verdad.

**Password Master** es un *tower defense* educativo AAA donde cada torre es una medida de seguridad real:
contraseñas robustas, MFA, gestores de contraseñas, firewalls, detección de phishing y centros de
monitoreo. Los enemigos son amenazas reales: *script kiddies*, *botnets*, *brute force bots*,
*phishers*, *data breach ghosts* y *deepfake hackers*. Los jefes representan malas prácticas
generalizadas (King of Weak Passwords, Lord Reuse, The Breach Master, The Phisher King).

Inspirado en *Kingdom Rush*, *Brawl Stars*, *Duolingo*, *Pokémon* y *Fall Guys* — aprende sin sentir
que estudias.

---

## ✨ Features

- 🎮 **Tower Defense premium** con motor de canvas, partículas, *glow effects* y feedback háptico-visual.
- 📚 **Aprendizaje embebido** — micro-tarjetas animadas explican *por qué* cada defensa funciona.
- 🏰 **50+ niveles de campaña** con dificultad progresiva y 4 entornos (ciudad, escuela, banco, hospital).
- 🧪 **Modo Laboratorio** — visualiza *fuerza de contraseñas*, *tiempos de crackeo*, *reutilización* y *MFA*.
- 🛠 **Modo Sandbox** — diseña tus propios sistemas.
- ⚔️ **Modo Desafío** — escenarios extremos generados por IA procedural.
- 🤖 **Director de IA** — genera oleadas, eventos y retos diarios únicos. Nunca dos partidas iguales.
- 👥 **Multijugador** cooperativo y competitivo (websockets).
- 🦊 **Mascotas** (Byte, Firewall Dog, Cyber Owl, Password Panda, Hack Hunter Bot) con pasivas únicas.
- 🏆 **Logros, XP, niveles, monedas, *skins* y *effects***.
- 👩‍🏫 **Panel Docente** — métricas de progreso y conceptos aprendidos.
- 🔐 **Ciberseguridad real**: Argon2id, JWT rotable, rate-limit, helmet, CORS estricto, validación Zod.

---

## 🧱 Stack

| Capa            | Tecnología                                                              |
| --------------- | ----------------------------------------------------------------------- |
| Frontend        | React 19, TypeScript, Vite, TailwindCSS, Framer Motion, Zustand, RQ, RR |
| Backend         | Node.js, TypeScript, Express, PostgreSQL, Prisma ORM                    |
| Realtime        | Socket.IO (multijugador coop/competitivo)                               |
| Calidad         | ESLint, Prettier, Husky, Vitest, React Testing Library                  |
| Arquitectura    | Clean Architecture, SOLID, DRY, KISS, Feature-Based                     |

---

## 📁 Estructura del monorepo

```
password-master/
├── apps/
│   ├── web/                 # Frontend (Vite + React 19)
│   └── api/                 # Backend (Express + Prisma)
├── packages/
│   └── shared/              # Tipos y constantes compartidas
├── .editorconfig
├── .gitattributes
├── .gitignore
├── .nvmrc
├── package.json             # Workspaces + scripts raíz
├── README.md
├── ROADMAP.md
└── docs/
    ├── ARCHITECTURE.md
    ├── GAME_DESIGN.md
    ├── SECURITY.md
    ├── TEACHER_GUIDE.md
    └── API.md
```

---

## 🚀 Quick Start

```bash
# Requisitos
node >= 20
pnpm >= 9 (o npm >= 10)
Docker (opcional, recomendado para PostgreSQL)

# Instalar
npm install

# Variables de entorno
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# Levantar Postgres con Docker
docker run -d --name pm-pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16

# Migrar y sembrar
npm run db:migrate -w apps/api
npm run db:seed -w apps/api

# Dev (frontend + backend concurrentes)
npm run dev
```

- Web → http://localhost:8080
- API → http://localhost:4001/api/v1
- API docs → http://localhost:4001/api/v1/docs

---

## 📜 Licencia

MIT — Hecho con 💜 para una internet más segura.
