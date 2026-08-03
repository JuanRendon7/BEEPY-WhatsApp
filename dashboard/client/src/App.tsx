import { useState } from 'react'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { Sidebar, type NavSection } from '@/components/layout/Sidebar'
import { AppLayout } from '@/components/layout/AppLayout'
import { OverviewView } from '@/components/views/OverviewView'
import { ConversationsView } from '@/components/views/ConversationsView'
import { FaqView } from '@/components/views/FaqView'
import { LoginView } from '@/components/views/LoginView'

const sectionMeta: Record<NavSection, { title: string; subtitle: string }> = {
  overview: { title: 'Resumen', subtitle: 'Comportamiento del asistente Beepy' },
  conversations: { title: 'Conversaciones', subtitle: 'Historial de mensajes procesados' },
  faq: { title: 'Preguntas frecuentes', subtitle: 'Lo que más preguntan los clientes' },
}

function AppInner() {
  const { user, isLoading } = useAuth()
  const [section, setSection] = useState<NavSection>('overview')

  if (isLoading) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand/30 border-t-brand animate-spin" />
      </div>
    )
  }

  if (!user) return <LoginView />

  const meta = sectionMeta[section]

  return (
    <AppLayout
      sidebar={<Sidebar active={section} onNavigate={setSection} />}
      title={meta.title}
      subtitle={meta.subtitle}
    >
      {section === 'overview' && <OverviewView />}
      {section === 'conversations' && <ConversationsView />}
      {section === 'faq' && <FaqView />}
    </AppLayout>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}

export default App
