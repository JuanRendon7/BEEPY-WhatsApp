import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useConversations } from '@/hooks/useConversations'

function truncate(text: string, max = 60): string {
  return text.length > max ? `${text.slice(0, max)}…` : text
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('es-CO', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function ConversationsView() {
  const [page, setPage] = useState(1)
  const pageSize = 20
  const { data, isLoading } = useConversations(page, pageSize)

  const totalPages = data ? Math.max(1, Math.ceil(data.total / pageSize)) : 1

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-surface/60 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-text-muted text-xs uppercase tracking-wider">
                <th className="px-4 py-3 font-semibold">Fecha</th>
                <th className="px-4 py-3 font-semibold">Cliente</th>
                <th className="px-4 py-3 font-semibold">Mensaje</th>
                <th className="px-4 py-3 font-semibold">Respuesta</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-text-muted text-xs">
                    Cargando...
                  </td>
                </tr>
              )}
              {!isLoading && data?.items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-text-muted text-xs">
                    Todavía no hay conversaciones registradas.
                  </td>
                </tr>
              )}
              {!isLoading && data?.items.map(item => (
                <tr key={item.id} className="border-b border-border/60 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{formatDateTime(item.receivedAt)}</td>
                  <td className="px-4 py-3 text-text-primary font-medium whitespace-nowrap">
                    {item.clientName ?? 'Cliente'}
                    {!item.clientRegistered && (
                      <span className="ml-1.5 text-[10px] text-text-muted">(no registrado)</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-text-secondary max-w-xs" title={item.messageText}>
                    {truncate(item.messageText)}
                  </td>
                  <td className="px-4 py-3 text-text-secondary max-w-xs" title={item.replyText}>
                    {truncate(item.replyText)}
                  </td>
                  <td className="px-4 py-3">
                    {item.escalated ? (
                      <Badge variant="destructive">Escalado</Badge>
                    ) : (
                      <Badge>Resuelto</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-text-muted">
          {data ? `${data.total} conversaciones en total` : ''}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-border text-text-secondary hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs text-text-secondary px-2">
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-border text-text-secondary hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
