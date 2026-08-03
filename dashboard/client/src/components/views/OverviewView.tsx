import { useState } from 'react'
import { MessagesSquare, ArrowUpRight, Timer, Users } from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from 'recharts'
import { MetricCard } from '@/components/metrics/MetricCard'
import { useSummary } from '@/hooks/useSummary'
import { useTrend } from '@/hooks/useTrend'
import { cn } from '@/lib/utils'

const RANGES = [
  { label: '7 días', value: 7 },
  { label: '30 días', value: 30 },
]

function formatMs(ms: number | null): string {
  if (ms === null) return '—'
  if (ms < 1000) return `${ms} ms`
  return `${(ms / 1000).toFixed(1)} s`
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`)
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })
}

export function OverviewView() {
  const [range, setRange] = useState(7)
  const { data: summary, isLoading: summaryLoading } = useSummary(range)
  const { data: trend, isLoading: trendLoading } = useTrend(range)

  const chartData = (trend ?? []).map(p => ({
    ...p,
    label: formatDateLabel(p.date),
    resolved: p.total - p.escalated,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {RANGES.map(r => (
          <button
            key={r.value}
            onClick={() => setRange(r.value)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors',
              range === r.value
                ? 'bg-brand/15 border-brand/30 text-brand'
                : 'border-border text-text-secondary hover:bg-white/5'
            )}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Conversaciones"
          value={summary ? summary.totalConversations.toLocaleString('es-CO') : '—'}
          subtitle={`Últimos ${range} días`}
          icon={MessagesSquare}
          isLoading={summaryLoading}
        />
        <MetricCard
          title="Tasa de escalamiento"
          value={summary ? `${summary.escalationRate.toFixed(1)}%` : '—'}
          subtitle={summary ? `${summary.escalatedCount} conversaciones escaladas` : undefined}
          icon={ArrowUpRight}
          isLoading={summaryLoading}
        />
        <MetricCard
          title="Tiempo de respuesta"
          value={summary ? formatMs(summary.avgResponseTimeMs) : '—'}
          subtitle="Promedio"
          icon={Timer}
          isLoading={summaryLoading}
        />
        <MetricCard
          title="Clientes únicos"
          value={summary ? summary.uniqueClients.toLocaleString('es-CO') : '—'}
          subtitle={`Últimos ${range} días`}
          icon={Users}
          isLoading={summaryLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border bg-surface/60 backdrop-blur-sm p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-4">
            Conversaciones por día
          </p>
          <div className="h-64">
            {!trendLoading && chartData.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F5A800" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#F5A800" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#27272A" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" stroke="#71717A" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717A" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: '#18181B', border: '1px solid #27272A', borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: '#A1A1AA' }}
                  />
                  <Area type="monotone" dataKey="total" name="Conversaciones" stroke="#F5A800" fill="url(#totalGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
            {!trendLoading && chartData.length === 0 && (
              <div className="h-full flex items-center justify-center text-xs text-text-muted">
                Todavía no hay datos suficientes.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-surface/60 backdrop-blur-sm p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand mb-4">
            Resueltos vs escalados
          </p>
          <div className="h-64">
            {!trendLoading && chartData.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid stroke="#27272A" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="label" stroke="#71717A" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717A" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: '#18181B', border: '1px solid #27272A', borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: '#A1A1AA' }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, color: '#A1A1AA' }} />
                  <Bar dataKey="resolved" name="Resueltos" stackId="a" fill="#F5A800" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="escalated" name="Escalados" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
            {!trendLoading && chartData.length === 0 && (
              <div className="h-full flex items-center justify-center text-xs text-text-muted">
                Todavía no hay datos suficientes.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
