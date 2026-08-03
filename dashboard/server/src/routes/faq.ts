import { Router, Request, Response } from 'express'
import { pool } from '../db'

export const faqRouter = Router()

faqRouter.get('/api/metrics/faq', async (req: Request, res: Response) => {
  const limitRaw = parseInt(String(req.query.limit ?? '10'), 10)
  const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(limitRaw, 50) : 10

  const result = await pool.query<{ normalized: string; sample: string; count: string }>(
    `SELECT
       lower(trim(message_text)) AS normalized,
       (array_agg(message_text ORDER BY id ASC))[1] AS sample,
       COUNT(*)::text AS count
     FROM conversation_events
     GROUP BY 1
     ORDER BY COUNT(*) DESC
     LIMIT $1`,
    [limit]
  )

  const data = result.rows.map(r => ({ messageText: r.sample, count: parseInt(r.count, 10) }))
  return res.json({ success: true, data })
})
