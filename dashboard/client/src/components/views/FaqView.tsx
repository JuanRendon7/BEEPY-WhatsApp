import { HelpCircle } from 'lucide-react'
import { useFaq } from '@/hooks/useFaq'

export function FaqView() {
  const { data, isLoading } = useFaq(20)

  const maxCount = data && data.length > 0 ? data[0].count : 1

  return (
    <div className="rounded-2xl border border-border bg-surface/60 backdrop-blur-sm p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-4">
        Preguntas más frecuentes
      </p>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 rounded-lg bg-white/[0.06] animate-pulse" />
          ))}
        </div>
      )}

      {!isLoading && data?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-text-muted">
          <HelpCircle className="h-8 w-8 mb-2 opacity-40" />
          <p className="text-xs">Todavía no hay suficientes mensajes para detectar patrones.</p>
        </div>
      )}

      {!isLoading && data && data.length > 0 && (
        <ul className="space-y-2">
          {data.map((item, i) => (
            <li key={i} className="relative overflow-hidden rounded-xl border border-border/60">
              <div
                className="absolute inset-y-0 left-0 bg-brand/10"
                style={{ width: `${Math.max(4, (item.count / maxCount) * 100)}%` }}
              />
              <div className="relative flex items-center justify-between gap-4 px-4 py-3">
                <p className="text-sm text-text-primary truncate">{item.messageText}</p>
                <span className="text-xs font-semibold text-brand shrink-0 tabular-nums">{item.count}×</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
