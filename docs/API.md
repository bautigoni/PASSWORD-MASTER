# 📡 API Reference — PASSWORD MASTER v1

> Base URL: `http://localhost:4001/api/v1`

Todas las respuestas son JSON. La autenticación usa `Authorization: Bearer <accessToken>`.

## Auth

### `POST /auth/register`
```json
{
  "email": "user@school.edu",
  "username": "guardian",
  "password": "S3cur3!Pa55word"
}
```

### `POST /auth/login`
Devuelve `{ accessToken, refreshToken, user }`.

### `POST /auth/refresh`
Body: `{ refreshToken }`.

### `POST /auth/logout`
Revoca el *refresh token*.

## Users

### `GET /users/me`
Perfil completo con stats, level, XP, monedas, gemas, mascota equipada.

### `PATCH /users/me`
Actualiza username, avatar, settings.

## Progress

### `GET /progress/me`
XP, nivel, *xpToNext*, *coins*, *gems*.

### `POST /progress/run`
Reporta el resultado de una partida (`runId`, `score`, `won`, `killedEnemies`, `lostLives`).

## Catalog

### `GET /catalog/towers`
### `GET /catalog/enemies`
### `GET /catalog/levels?env=city`
### `GET /catalog/achievements`
### `GET /catalog/pets`

## Achievements

### `POST /achievements/claim/:id`

## Multiplayer

### `POST /multiplayer/rooms` → `{ code, joinToken }`
### `POST /multiplayer/rooms/:code/join`
### `GET /multiplayer/rooms/:code`
### WebSocket `/ws` eventos:
- `room:state`
- `wave:start`
- `tower:place`
- `enemy:hit`
- `match:end`

## Teacher

### `POST /teacher/classes`
### `GET /teacher/classes/:id/progress`
### `GET /teacher/classes/:id/concepts`

## Errores

```json
{ "error": { "code": "INVALID_CREDENTIALS", "message": "..." } }
```

Códigos: `400` validación, `401` no auth, `403` sin permiso, `404` no existe, `409` conflicto,
`429` rate-limit, `500` interno.
