import { Router, Request, Response } from 'express'
import { pool } from '../db'

export const conversationsRouter = Router()

conversationsRouter.get('/api/conversations', async (req: Request, res: Response) => {
  const pageRaw = parseInt(String(req.query.page ?? '1'), 10)
  const pageSizeRaw = parseInt(String(req.query.pageSize ?? '20'), 10)
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1
  const pageSize = Number.isFinite(pageSizeRaw) && pageSizeRaw > 0 ? Math.min(pageSizeRaw, 100) : 20
  const offset = (page - 1) * pageSize

  const [itemsResult, countResult] = await Promise.all([
    pool.query(
      `SELECT id, phone, client_name, client_registered, message_text, reply_text,
              escalated, response_time_ms, received_at
       FROM conversation_events
       ORDER BY received_at DESC
       LIMIT $1 OFFSET $2`,
      [pageSize, offset]
    ),
    pool.query<{ count: string }>('SELECT COUNT(*)::text AS count FROM conversation_events'),
  ])

  const items = itemsResult.rows.map(r => ({
    id: r.id,
    phone: r.phone,
    clientName: r.client_name,
    clientRegistered: r.client_registered,
    messageText: r.message_text,
    replyText: r.reply_text,
    escalated: r.escalated,
    responseTimeMs: r.response_time_ms,
    receivedAt: r.received_at,
  }))

  return res.json({
    success: true,
    data: {
      items,
      page,
      pageSize,
      total: parseInt(countResult.rows[0].count, 10),
    },
  })
})
