# BEEPY-WhatsApp — Asistente IA para BEEPYRED

Asistente conversacional de WhatsApp con IA para **BEEPYRED**, proveedor de internet por fibra óptica y radioenlace en San Luis, Antioquia.

## Despliegue rápido en Railway

1. Conecta este repo a Railway.
2. Agrega un **Volume** en `/home/node/.n8n`.
3. Configura las variables de entorno (ver `.env.example`).
4. Espera ~2 min, crea tu usuario en n8n.
5. Importa el flujo desde `whatsapp-ia-beepyred.json` (raíz del repo) y **actívalo** (toggle "Active" en n8n) — el webhook solo queda registrado si el flujo está activo.
6. En [developers.facebook.com](https://developers.facebook.com), en la configuración del webhook de tu app de WhatsApp Cloud API:
   - URL de callback: `https://<tu-dominio-railway>/webhook/whatsapp-beepyred`
   - Token de verificación: el mismo valor que pusiste en `META_VERIFY_TOKEN`
   - Suscríbete al campo `messages`.
   - Activa **Coexistence** para el número de WhatsApp que vas a usar.

## Variables de entorno

| Variable | Valor |
|---|---|
| `N8N_PORT` | `${PORT}` |
| `WEBHOOK_URL` | `https://${RAILWAY_PUBLIC_DOMAIN}` |
| `WH_API_KEY` | API Key de WispHub |
| `ANTHROPIC_API_KEY` | API Key de Anthropic |
| `META_ACCESS_TOKEN` | Token de la Cloud API de Meta |
| `META_VERIFY_TOKEN` | Token que tú inventas; debe coincidir con el que registres en el dashboard de Meta |
| `N8N_ENCRYPTION_KEY` | Clave fija para cifrar credenciales guardadas en n8n. Genérala una sola vez y no la cambies después (si la pierdes, las credenciales guardadas en n8n quedan inutilizables) |
| `N8N_PROXY_HOPS` | `1` — necesario para que n8n mantenga la sesión de login correctamente detrás del proxy de Railway |
| `DASHBOARD_URL` | Dominio (sin `https://`) del servicio `dashboard/` en Railway, ej. `beepy-analytics-production.up.railway.app` |
| `DASHBOARD_API_KEY` | Secreto compartido con el servicio del dashboard — debe coincidir exactamente en ambos servicios |

## Dashboard de analítica (`dashboard/`)

Panel para ver cómo se comporta Beepy: conversaciones por día, tasa de escalamiento, tiempo de respuesta y preguntas más frecuentes. Vive en la carpeta `dashboard/` de este mismo repo y se despliega como un **segundo servicio de Railway**, en el mismo proyecto.

### Pasos de despliegue

1. En el proyecto de Railway, agrega el plugin **Postgres** (botón "+ New" → Database → PostgreSQL).
2. Crea un nuevo servicio desde este mismo repo (`+ New` → GitHub Repo → `BEEPY-WhatsApp`).
3. En **Settings** del nuevo servicio, configura **Root Directory** = `dashboard`.
4. Configura sus variables de entorno (ver `dashboard/.env.example`):
   - `DATABASE_URL` → referencia al plugin: `${{Postgres.DATABASE_URL}}`
   - `JWT_SECRET` → clave aleatoria de 32+ caracteres
   - `AUTH_USERS` → JSON con el usuario admin y su hash bcrypt (ver abajo)
   - `DASHBOARD_API_KEY` → mismo valor que pusiste en el servicio de n8n
   - `NODE_ENV=production`
5. Genera dominio público (**Settings → Networking → Generate Domain**).
6. Copia ese dominio a la variable `DASHBOARD_URL` del servicio de **n8n** (sin `https://`) y agrega `DASHBOARD_API_KEY` también ahí (mismo valor).
7. Re-importa `whatsapp-ia-beepyred.json` en n8n (ya incluye el nodo "Registrar evento") y actívalo.

### Generar el hash de la contraseña para `AUTH_USERS`

```bash
cd dashboard/server
npm install
node -e "require('bcryptjs').hash(process.argv[1], 10).then(console.log)" "tu_contraseña"
```

Con el hash resultante, arma el valor de `AUTH_USERS`:

```json
[{"username":"admin","hash":"<hash generado>","nombre":"Tu Nombre"}]
```

Si el dashboard se cae o `DASHBOARD_API_KEY`/`DASHBOARD_URL` no están configurados, el asistente de WhatsApp sigue funcionando con normalidad — el nodo "Registrar evento" está marcado para no bloquear el envío de la respuesta al cliente.
