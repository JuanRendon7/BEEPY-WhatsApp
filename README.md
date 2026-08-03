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
