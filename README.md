# Miki Command Center

Dashboard seguro para gestionar tareas y proyectos con OpenClaw.

## Seguridad

- Autenticación con contraseña segura (PBKDF2)
- Sesiones encriptadas con iron-session
- Rate limiting en login
- Headers de seguridad (HSTS, CSP, etc.)
- Sin exposición de datos sensibles

## Deploy

```bash
npm run build
vercel --prod
```

## Variables de Entorno

```bash
# Seguridad
SESSION_SECRET=random_string_32_chars_min
ADMIN_PASSWORD_HASH=hash_generado

# Base de datos (Upstash Redis)
UPSTASH_REDIS_REST_URL=https://...rest.upstash.io
UPSTASH_REDIS_REST_TOKEN=token_aqui
```
