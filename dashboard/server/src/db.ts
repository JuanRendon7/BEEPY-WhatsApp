import { Pool } from 'pg'

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export async function initSchema(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS conversation_events (
      id SERIAL PRIMARY KEY,
      phone TEXT NOT NULL,
      client_name TEXT,
      client_registered BOOLEAN NOT NULL DEFAULT false,
      message_text TEXT NOT NULL,
      reply_text TEXT NOT NULL,
      escalated BOOLEAN NOT NULL DEFAULT false,
      response_time_ms INTEGER,
      received_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `)
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_conversation_events_created_at
      ON conversation_events (created_at);
  `)
}
