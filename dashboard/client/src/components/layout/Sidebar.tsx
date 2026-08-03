import { LayoutDashboard, MessagesSquare, HelpCircle, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

export type NavSection = 'overview' | 'conversations' | 'faq'

const navItems = [
  { id: 'overview' as NavSection, label: 'Resumen', icon: LayoutDashboard, desc: 'KPIs y tendencias' },
  { id: 'conversations' as NavSection, label: 'Conversaciones', icon: MessagesSquare, desc: 'Historial de mensajes' },
  { id: 'faq' as NavSection, label: 'Preguntas frecuentes', icon: HelpCircle, desc: 'Lo más consultado' },
]

interface SidebarProps {
  active: NavSection
  onNavigate: (s: NavSection) => void
}

export function Sidebar({ active, onNavigate }: SidebarProps) {
  const { user, logout } = useAuth()
  return (
    <aside className="flex flex-col w-60 h-screen bg-surface border-r border-border shrink-0">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center border border-brand/30 shrink-0"
          style={{
            background: 'linear-gradient(135deg, rgba(245,168,0,0.15) 0%, rgba(245,168,0,0.05) 100%)',
          }}
        >
          <span className="text-brand font-black text-lg">B</span>
        </div>
        <div>
          <p className="text-sm font-bold text-text-primary tracking-tight leading-tight">Beepy Analytics</p>
          <p className="text-[10px] text-brand font-semibold tracking-widest uppercase">BEEPYRED</p>
        </div>
      </div>

      <div className="px-5 pt-5 pb-2">
        <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-text-muted/60">Módulos</p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(item => {
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 group',
                isActive
                  ? 'bg-brand/10 text-brand border border-brand/25'
                  : 'text-text-secondary border border-transparent hover:bg-white/5 hover:text-text-primary hover:border-white/8'
              )}
            >
              <div className={cn(
                'flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 shrink-0',
                isActive ? 'bg-brand/20' : 'bg-white/5 group-hover:bg-white/10'
              )}>
                <item.icon className={cn('h-4 w-4', isActive ? 'text-brand' : '')} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-semibold leading-none', isActive ? 'text-brand' : '')}>{item.label}</p>
                <p className="text-[10px] text-text-muted mt-0.5">{item.desc}</p>
              </div>
              {isActive && <div className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />}
            </button>
          )
        })}
      </nav>

      <div className="px-4 py-4 border-t border-border space-y-3">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-white/5 border border-border">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-brand/20 shrink-0">
            <span className="text-brand text-xs font-bold">
              {user?.nombre?.charAt(0).toUpperCase() ?? '?'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-text-primary truncate">{user?.nombre}</p>
            <p className="text-[10px] text-text-muted">Administrador</p>
          </div>
          <button
            onClick={logout}
            title="Cerrar sesión"
            className="text-text-muted hover:text-red-400 transition-colors shrink-0"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <p className="text-[10px] text-text-muted">Asistente Beepy conectado</p>
        </div>
        <p className="text-[10px] text-text-muted/40">© 2026 BEEPYRED ISP GROUP SAS</p>
      </div>
    </aside>
  )
}
