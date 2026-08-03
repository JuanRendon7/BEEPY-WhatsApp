import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string
  subtitle?: string
  icon: LucideIcon
  className?: string
  isLoading?: boolean
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  className,
  isLoading = false,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        'card-shimmer group relative overflow-hidden rounded-2xl border border-border bg-surface/60 backdrop-blur-sm px-5 pt-5 pb-6',
        'transition-all duration-300',
        className
      )}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-brand/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none overflow-hidden" />

      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand leading-none pt-0.5">
          {title}
        </p>
        <div className="flex-shrink-0 rounded-xl p-2.5 bg-white/5 ring-1 ring-inset ring-white/8">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </div>
      </div>

      {isLoading ? (
        <div className="mt-4 h-8 w-32 rounded-lg bg-white/[0.06] animate-pulse" />
      ) : (
        <p className="mt-4 text-xl sm:text-2xl font-bold leading-tight tracking-tight text-text-primary tabular-nums group-hover:text-white">
          {value}
        </p>
      )}

      {subtitle && (
        <p className="mt-2 text-xs leading-relaxed text-text-muted/80">
          {subtitle}
        </p>
      )}
    </div>
  )
}
