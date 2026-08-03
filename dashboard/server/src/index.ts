import 'dotenv/config'
import path from 'path'
import express from 'express'
import cors from 'cors'
import { z } from 'zod'
import { initSchema } from './db'
import { authRouter } from './routes/auth'
import { eventsRouter } from './routes/events'
import { metricsRouter } from './routes/metrics'
import { faqRouter } from './routes/faq'
import { conversationsRouter } from './routes/conversations'
import { requireAuth } from './middleware/auth'
import { errorHandler } from './middleware/errorHandler'

const EnvSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  AUTH_USERS: z.string().min(2, 'AUTH_USERS is required — JSON array of {username,hash,nombre}'),
  DASHBOARD_API_KEY: z.string().min(16, 'DASHBOARD_API_KEY must be at least 16 characters'),
  PORT: z.string().default('3001'),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
})

const envResult = EnvSchema.safeParse(process.env)
if (!envResult.success) {
  console.error('[STARTUP ERROR] Missing required environment variables:')
  console.error(envResult.error.flatten().fieldErrors)
  process.exit(1)
}

const env = envResult.data
const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: false,
}))
app.use(express.json())

if (env.NODE_ENV === 'production') {
  const clientDist = path.resolve(__dirname, '../../client/dist')
  app.use(express.static(clientDist))
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Público — login/me
app.use(authRouter)
// Público (protegido por x-api-key) — ingesta desde n8n
app.use(eventsRouter)

// Todo lo demás bajo /api requiere JWT
app.use('/api', requireAuth)

app.use(metricsRouter)
app.use(faqRouter)
app.use(conversationsRouter)

app.use('/api', (_req, res) => {
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found' } })
})

if (env.NODE_ENV === 'production') {
  const clientDist = path.resolve(__dirname, '../../client/dist')
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'))
  })
}

app.use(errorHandler)

const port = parseInt(env.PORT, 10)

initSchema()
  .then(() => {
    app.listen(port, () => {
      console.log(`[Beepy Analytics] Server running on http://localhost:${port}`)
      console.log(`[Beepy Analytics] Mode: ${env.NODE_ENV}`)
    })
  })
  .catch(err => {
    console.error('[STARTUP ERROR] Failed to initialize database schema:', err)
    process.exit(1)
  })
