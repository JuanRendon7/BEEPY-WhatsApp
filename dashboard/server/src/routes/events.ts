import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { pool } from '../db'
import { requireApiKey } from '../middleware/auth'

export const eventsRouter = Router()

const EventSchema = z.object({
  phone: z.string().min(1),
  clientName: z.string().nullable().optional(),
  clientRegistered: z.boolean().optional().default(false),
  messageText: z.string().min(1),
  replyText: z.string().min(1),
  escalated: z.boolean().optional().default(false),
  receivedAt: z.number().optional(),
})

eventsRouter.post('/api/events', requireApiKey, async (req: Request, res: Response) => {
  const parsed = EventSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: { code: 'INVALID_BODY', message: parsed.error.message } })
  }

  const { phone, clientName, clientRegistered, messageText, replyText, escalated, receivedAt } = parsed.data
  const receivedAtDate = receivedAt ? new Date(receivedAt) : new Date()
  const responseTimeMs = receivedAt ? Date.now() - receivedAt : null

  await pool.query(
    `INSERT INTO conversation_events
      (phone, client_name, client_registered, message_text, reply_text, escalated, response_time_ms, received_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [phone, clientName ?? null, clientRegistered, messageText, replyText, escalated, responseTimeMs, receivedAtDate]
  )

  return res.status(201).json({ success: true, data: { ok: true } })
})
