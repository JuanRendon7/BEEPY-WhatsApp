import axios from 'axios'
import type { SummaryData, TrendPoint, FaqItem, ConversationsPage } from '@/types/api'
import { TOKEN_KEY } from '@/contexts/AuthContext'

const http = axios.create({
  baseURL: '/',
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
})

http.interceptors.request.use(config => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

function unwrap<T>(promise: Promise<{ data: { success: boolean; data: T; error?: { message: string } } }>, fallbackMsg: string): Promise<T> {
  return promise.then(response => {
    if (!response.data.success) {
      throw new Error(response.data.error?.message ?? fallbackMsg)
    }
    return response.data.data
  })
}

export function fetchSummary(rangeDays: number): Promise<SummaryData> {
  return unwrap(http.get(`/api/metrics/summary?range=${rangeDays}`), 'Error al obtener el resumen')
}

export function fetchTrend(rangeDays: number): Promise<TrendPoint[]> {
  return unwrap(http.get(`/api/metrics/trend?range=${rangeDays}`), 'Error al obtener la tendencia')
}

export function fetchFaq(limit = 10): Promise<FaqItem[]> {
  return unwrap(http.get(`/api/metrics/faq?limit=${limit}`), 'Error al obtener preguntas frecuentes')
}

export function fetchConversations(page: number, pageSize = 20): Promise<ConversationsPage> {
  return unwrap(http.get(`/api/conversations?page=${page}&pageSize=${pageSize}`), 'Error al obtener conversaciones')
}
