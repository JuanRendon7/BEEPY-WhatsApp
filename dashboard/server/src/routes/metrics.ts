import { Router, Request, Response } from 'express'
import { pool } from '../db'

export const metricsRouter = Router()

function parseRangeDays(value: unknown): number {
  const n = parseInt(String(value ?? '7'), 10)
  if (!Number.isFinite(n) || n <= 0) return 7
  return Math.min(n, 90)
}

metricsRouter.get('/api/metrics/summary', async (req: Request, res: Response) => {
  const rangeDays = parseRangeDays(req.query.range)

  const result = await pool.query<{
    total: string
    escalated: string
    avg_response_ms: string | null
    unique_clients: string
  }>(
    `SELECT
       COUNT(*)::text AS total,
       COUNT(*) FILTER (WHERE escalated)::text AS escalated,
       AVG(response_time_ms)::text AS avg_response_ms,
       COUNT(DISTINCT phone)::text AS unique_clients
     FROM conversation_events
     WHERE received_at >= NOW() - ($1 || ' days')::interval`,
    [rangeDays]
  )

  const row = result.rows[0]
  const total = parseInt(row.total, 10)
  const escalated = parseInt(row.escalated, 10)

  return res.json({
    success: true,
    data: {
      totalConversations: total,
      escalatedCount: escalated,
      escalationRate: total > 0 ? (escalated / total) * 100 : 0,
      avgResponseTimeMs: row.avg_response_ms ? Math.round(parseFloat(row.avg_response_ms)) : null,
      uniqueClients: parseInt(row.unique_clients, 10),
      rangeDays,
    },
  })
})

metricsRouter.get('/api/metrics/trend', async (req: Request, res: Response) => {
  const rangeDays = parseRangeDays(req.query.range)

  const result = await pool.query<{ date: string; total: string; escalated: string }>(
    `SELECT
       to_char(date_trunc('day', received_at), 'YYYY-MM-DD') AS date,
       COUNT(*)::text AS total,
       COUNT(*) FILTER (WHERE escalated)::text AS escalated
     FROM conversation_events
     WHERE received_at >= NOW() - ($1 || ' days')::interval
     GROUP BY 1
     ORDER BY 1 ASC`,
    [rangeDays]
  )

  const byDate = new Map(result.rows.map(r => [r.date, { total: parseInt(r.total, 10), escalated: parseInt(r.escalated, 10) }]))

  const points = []
  for (let i = rangeDays - 1; i >= 0; i--) {
    const d = new Date()
    d.setUTCDate(d.getUTCDate() - i)
    const key = d.toISOString().slice(0, 10)
    const entry = byDate.get(key)
    points.push({ date: key, total: entry?.total ?? 0, escalated: entry?.escalated ?? 0 })
  }

  return res.json({ success: true, data: points })
})
