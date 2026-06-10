# 🎮 Game Design Document — PASSWORD MASTER

## 1. Pitch

Un *tower defense* donde el jugador defiende **Cyber Fortress** de un ejército de hackers. Cada
torre encarna una contramedida real de ciberseguridad. El aprendizaje ocurre en el *gameplay loop*,
no en tutoriales.

## 2. Pilares

1. **Ciberdefensa legible** — cada mecánica se ve y se siente como su concepto real.
2. **Loop adictivo** — oleadas cortas (60-180s), recompensas constantes, *meta-progression*.
3. **Estética premium** — paleta vibrante, animaciones con masa, *glow effects*, partículas.
4. **Educación invisible** — micro-tarjetas y *tooltips* explican el porqué, nunca el cómo enciclopédico.

## 3. Jugador objetivo

- Estudiantes 12-25 años.
- Profesionales *onboarding* de seguridad.
- Profesores que necesitan una herramienta engaging para enseñar conceptos.

## 4. Mecánica central

| Elemento  | Función educativa                                       |
| --------- | ------------------------------------------------------- |
| **Basic Password** | Representa contraseñas débiles. Cuesta poco, hace poco. |
| **Strong Password**| Larga + símbolos. Mayor DPS y *hp* de torre.            |
| **MFA**    | Multiplica daño contra enemigos avanzados.              |
| **Password Manager** | Aura que potencia torres en radio.                |
| **Phishing Detector** | Stunea *phishers* y *deepfakes*.                |
| **Firewall** | AoE. Castiga oleadas densas.                         |
| **SOC Center** | Reveal de enemigos invisibles (*breach ghosts*).   |

### Enemigos

| Enemigo       | Representa                | Contra-medida educativa            |
| ------------- | ------------------------- | ---------------------------------- |
| Script Kiddie | Ataques básicos, volumen  | Basic Password                     |
| Botnet        | DDoS, masa                | Firewall + Strong Password         |
| Brute Force   | Iteración sobre *creds*   | Strong Password, MFA               |
| Phisher       | Ingeniería social         | Phishing Detector                  |
| Breach Ghost  | Credenciales filtradas    | Password Manager (rotación)        |
| Deepfake      | Impersonación avanzada    | MFA, SOC Center                    |

### Jefes

- **The King of Weak Passwords** — representa `123456`, `password`, `qwerty`.
- **Lord Reuse** — reutilización de la misma contraseña en N sitios.
- **The Breach Master** — invoca Breach Ghosts con *spawn* rápido.
- **The Phisher King** — stun y *mind control* de torres durante segundos.

## 5. Progresión

- **XP** por derrotar enemigos, completar oleadas, aprender conceptos.
- **Niveles** (1-50) con desbloqueos de torres, mascotas y *skins*.
- **Monedas** (`Coins`) y **Gemas** (`Gems`) — *soft currency* / *premium currency*.
- **Logros** — recompensas cosméticas y de conocimiento.
- **Mascotas** — pasivas globales (XP+, drop+, daño+, etc.).

## 6. Modos

- **Campaign** — 50+ niveles, 4 entornos (ciudad, escuela, banco, hospital).
- **Challenge** — escenarios extremos generados.
- **Sandbox** — construcción libre, *infinite mode*.
- **Laboratory** — visualizaciones (fuerza, crackeo, MFA, breach).
- **Co-op** — 1-4 jugadores (autoritativo en servidor).
- **Versus** — compite por aguantar más.

## 7. Balance

- *Health/Damage/Mana* ajustables en `packages/shared` (tablas en `balance.ts`).
- Oleadas procedurales con *seed* reproducible para *daily challenges*.
- Director de IA: ramp lineal hasta *cap* + *events* cada 30s.

## 8. Monetización (respetuosa)

- **Gratis para educación** (códigos de licencia docente).
- Cosméticos y *battle pass* opcional.
- **Nunca** *pay-to-win*.

## 9. Métricas de engagement

- *Session length* objetivo: 8-15 min por run.
- *Levels per session*: 2-4.
- *Conversion* a multijugador: 12%+.
- *Concept retention* (test post-campaign): 75%+.

## 10. Roadmap de contenido

| Trimestre | Contenido                                                    |
| --------- | ------------------------------------------------------------ |
| Q1        | 25 niveles, 3 entornos, 6 mascotas.                          |
| Q2        | Multijugador real, panel docente, *daily challenge*.         |
| Q3        | 50 niveles, *battle pass* educativo.                          |
| Q4        | i18n, PWA, app stores.                                       |
