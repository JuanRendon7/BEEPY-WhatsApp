export interface SummaryData {
  totalConversations: number
  escalatedCount: number
  escalationRate: number
  avgResponseTimeMs: number | null
  uniqueClients: number
  rangeDays: number
}

export interface TrendPoint {
  date: string
  total: number
  escalated: number
}

export interface FaqItem {
  messageText: string
  count: number
}

export interface ConversationEvent {
  id: number
  phone: string
  clientName: string | null
  clientRegistered: boolean
  messageText: string
  replyText: string
  escalated: boolean
  responseTimeMs: number | null
  receivedAt: string
}

export interface ConversationsPage {
  items: ConversationEvent[]
  page: number
  pageSize: number
  total: number
}
