'use client'

import Header from '@/components/layout/Header'
import { KPICard } from '@/components/ui/KPICard'
import { AlertCard } from '@/components/ui/AlertCard'
import { AgentCard } from '@/components/ui/AgentCard'
import { Badge } from '@/components/ui/Badge'
import {
  Euro,
  Users,
  TrendingUp,
  Star,
  Calendar,
  Target,
  AlertTriangle,
  Rocket,
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  Bot,
  Activity,
} from 'lucide-react'

const kpis = [
  {
    name: 'Revenue MTD',
    value: '42.8K',
    target: '60K',
    change: 12.4,
    trend: 'up' as const,
    unit: '€',
    period: 'MTD',
    color: '#22c55e',
    icon: <Euro size={14} style={{ color: '#22c55e' }} />,
  },
  {
    name: 'Neue Leads',
    value: '47',
    target: '80',
    change: -8.2,
    trend: 'down' as const,
    unit: '',
    period: 'Diese Woche',
    color: '#3b82f6',
    icon: <Users size={14} style={{ color: '#3b82f6' }} />,
  },
  {
    name: 'Aktive Kunden',
    value: '234',
    target: '300',
    change: 4.7,
    trend: 'up' as const,
    unit: '',
    period: 'Gesamt',
    color: '#f59e0b',
    icon: <TrendingUp size={14} style={{ color: '#f59e0b' }} />,
  },
  {
    name: 'Termine',
    value: '8',
    target: '12',
    change: 0,
    trend: 'neutral' as const,
    unit: '',
    period: 'Diese Woche',
    color: '#8b5cf6',
    icon: <Calendar size={14} style={{ color: '#8b5cf6' }} />,
  },
  {
    name: 'Bewertung',
    value: '4.8',
    target: '5.0',
    change: 2.1,
    trend: 'up' as const,
    unit: '',
    period: 'Ø Score',
    color: '#f97316',
    icon: <Star size={14} style={{ color: '#f97316' }} />,
  },
]

const alerts = [
  {
    title: 'KPI-Warnung: Leads unter Ziel',
    description: 'Neue Leads diese Woche 42% unter dem Monatsziel. Sofortige Maßnahmen empfohlen.',
    severity: 'danger' as const,
    category: 'KPI',
    time: 'vor 2h',
  },
  {
    title: 'Opportunity erkannt: LinkedIn-Kampagne',
    description: 'Deine Konkurrenten erhöhen LinkedIn-Budget. Jetzt einsteigen für 3x ROI.',
    severity: 'warning' as const,
    category: 'Opportunity',
    time: 'vor 4h',
  },
  {
    title: 'Wöchentliches Review fällig',
    description: 'KW 23 Review noch nicht durchgeführt. FRANK hat Insights vorbereitet.',
    severity: 'info' as const,
    category: 'Review',
    time: 'vor 6h',
  },
  {
    title: 'Ziel erreicht: 200+ Kunden',
    description: 'Meilenstein überschritten! OKUN Systems hat nun 234 aktive Kunden.',
    severity: 'success' as const,
    category: 'Goal',
    time: 'gestern',
  },
]

const agents = [
  { name: 'Founder Agent', type: 'Strategischer Berater', status: 'active' as const, lastRun: 'vor 5 Min', description: 'Analysiert Geschäftsstrategie' },
  { name: 'Sales Agent', type: 'Vertrieb & CRM', status: 'active' as const, lastRun: 'vor 12 Min', description: 'Qualifiziert Leads automatisch' },
  { name: 'Strategy Agent', type: 'Strategieplanung', status: 'active' as const, lastRun: 'vor 1h', description: 'OKRs & Hypothesen' },
  { name: 'Marketing Agent', type: 'Marketing & Growth', status: 'active' as const, lastRun: 'vor 30 Min', description: 'Kampagnen & Funnels' },
  { name: 'Content Agent', type: 'Content Creation', status: 'active' as const, lastRun: 'vor 2h', description: 'LinkedIn & Instagram Posts' },
  { name: 'Review Agent', type: 'Weekly Review', status: 'active' as const, lastRun: 'vor 3h', description: 'Retrospektiven & Learnings' },
  { name: 'Monitoring Agent', type: 'System-Monitor', status: 'active' as const, lastRun: 'vor 2 Min', description: 'KPIs & Alerts überwachen' },
  { name: 'Opportunity Agent', type: 'Chancen-Scanner', status: 'active' as const, lastRun: 'vor 45 Min', description: 'Marktchancen identifizieren' },
  { name: 'Planning Agent', type: 'Tagesplanung', status: 'active' as const, lastRun: 'vor 8h', description: 'Optimalen Tagesplan erstellen' },
]

const dailyTasks = [
  { time: '08:00', title: 'Deep Work: Q3 Strategy Draft', duration: '90 Min', category: 'focus', color: '#8b5cf6', completed: true },
  { time: '09:30', title: 'Team Stand-up', duration: '30 Min', category: 'meeting', color: '#3b82f6', completed: true },
  { time: '10:00', title: 'Investor Call: Series A Prep', duration: '60 Min', category: 'call', color: '#f59e0b', completed: false },
  { time: '11:30', title: 'Lead-Review & CRM Update', duration: '45 Min', category: 'work', color: '#22c55e', completed: false },
  { time: '14:00', title: 'Content Erstellung: LinkedIn', duration: '60 Min', category: 'content', color: '#f97316', completed: false },
  { time: '15:30', title: '1:1 mit Marketing-Lead', duration: '30 Min', category: 'meeting', color: '#3b82f6', completed: false },
  { time: '17:00', title: 'Daily Review & FRANK Brief', duration: '30 Min', category: 'review', color: '#ef4444', completed: false },
]

const appointments = [
  { time: '10:00', title: 'Investor Call', person: 'Thomas Weber', type: 'call' },
  { time: '14:00', title: 'Product Demo', person: 'Sarah Müller', type: 'meeting' },
  { time: '16:00', title: 'Partnership Talk', person: 'Marco Rossi', type: 'call' },
]

export default function Dashboard() {
  const today = new Date().toLocaleDateString('de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div>
      <Header
        title="GUTEN MORGEN, FELIX 👋"
        subtitle={`${today} · FRANK hat 3 wichtige Updates für dich`}
      />

      <div className="p-6 space-y-6">
        {/* KPI Row */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }} className="uppercase tracking-widest">
              Heutige KPIs
            </h2>
            <span style={{ color: '#3b82f6', fontSize: '11px' }} className="cursor-pointer hover:underline">
              Alle KPIs →
            </span>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {kpis.map((kpi) => (
              <KPICard key={kpi.name} {...kpi} />
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-4">
          {/* Top Priority */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target size={14} style={{ color: '#f59e0b' }} />
              <h3 style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }} className="uppercase tracking-widest">
                Top Priorität Heute
              </h3>
            </div>
            <h4 style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: 700 }} className="mb-2">
              Lead-Generierung sofort steigern
            </h4>
            <p style={{ color: '#64748b', fontSize: '12px', lineHeight: 1.5 }} className="mb-3">
              Leads sind 42% unter Ziel. LinkedIn Outreach-Kampagne heute starten und 3 neue Kontakte qualifizieren.
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="gold">Kritisch</Badge>
              <Badge variant="orange">Sales</Badge>
            </div>
          </div>

          {/* Top Bottleneck */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={14} style={{ color: '#ef4444' }} />
              <h3 style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }} className="uppercase tracking-widest">
                Kritischer Engpass
              </h3>
            </div>
            <h4 style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: 700 }} className="mb-2">
              Sales Funnel Conversion zu niedrig
            </h4>
            <p style={{ color: '#64748b', fontSize: '12px', lineHeight: 1.5 }} className="mb-3">
              Conversion von Lead zu Kunde bei 3.2% statt Ziel 8%. Demo-Prozess optimieren, Follow-up automatisieren.
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="red">Hoch</Badge>
              <span style={{ color: '#475569', fontSize: '11px' }}>Seit 12 Tagen</span>
            </div>
          </div>

          {/* Top Opportunity */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Rocket size={14} style={{ color: '#22c55e' }} />
              <h3 style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }} className="uppercase tracking-widest">
                Top Opportunity
              </h3>
            </div>
            <h4 style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: 700 }} className="mb-2">
              DACH Enterprise Partnership
            </h4>
            <p style={{ color: '#64748b', fontSize: '12px', lineHeight: 1.5 }} className="mb-3">
              3 Enterprise-Leads bereit für Partnership-Gespräch. Potenzial: €180K ARR. Zeitfenster: 14 Tage.
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="green">Sehr Hoch</Badge>
              <span style={{ color: '#475569', fontSize: '11px' }}>14 Tage Fenster</span>
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-3 gap-4">
          {/* Daily Plan */}
          <div className="card">
            <div style={{ borderBottom: '1px solid #1e2130' }} className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={14} style={{ color: '#f59e0b' }} />
                <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }} className="uppercase tracking-widest">
                  Tagesplan
                </span>
              </div>
              <span style={{ color: '#22c55e', fontSize: '11px' }}>2/7 erledigt</span>
            </div>
            <div className="p-3 space-y-1.5">
              {dailyTasks.map((task, i) => (
                <div
                  key={i}
                  style={{
                    borderLeft: `2px solid ${task.completed ? task.color : '#1e2130'}`,
                    backgroundColor: task.completed ? 'rgba(34,197,94,0.05)' : 'transparent',
                    borderRadius: '0 6px 6px 0',
                    padding: '5px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  {task.completed ? (
                    <CheckCircle2 size={12} style={{ color: '#22c55e', flexShrink: 0 }} />
                  ) : (
                    <Circle size={12} style={{ color: '#475569', flexShrink: 0 }} />
                  )}
                  <div className="flex-1 min-w-0">
                    <p style={{
                      color: task.completed ? '#475569' : '#f1f5f9',
                      fontSize: '11px',
                      fontWeight: 500,
                      textDecoration: task.completed ? 'line-through' : 'none',
                    }}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-1">
                      <Clock size={9} style={{ color: '#475569' }} />
                      <span style={{ color: '#475569', fontSize: '10px' }}>{task.time} · {task.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts Panel */}
          <div className="card">
            <div style={{ borderBottom: '1px solid #1e2130' }} className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} style={{ color: '#f97316' }} />
                <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }} className="uppercase tracking-widest">
                  Wichtige Alerts
                </span>
              </div>
              <span
                style={{ backgroundColor: '#ef4444', color: '#fff', fontSize: '10px', padding: '1px 6px', borderRadius: '9999px', fontWeight: 700 }}
              >
                4
              </span>
            </div>
            <div className="p-3 space-y-2">
              {alerts.map((alert, i) => (
                <AlertCard key={i} {...alert} />
              ))}
            </div>
          </div>

          {/* Right Column: Appointments + Activity */}
          <div className="space-y-4">
            {/* Next Appointments */}
            <div className="card">
              <div style={{ borderBottom: '1px solid #1e2130' }} className="px-4 py-3 flex items-center gap-2">
                <Calendar size={14} style={{ color: '#3b82f6' }} />
                <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }} className="uppercase tracking-widest">
                  Nächste Termine
                </span>
              </div>
              <div className="p-3 space-y-2">
                {appointments.map((apt, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        backgroundColor: '#111318',
                        border: '1px solid #1e2130',
                        borderRadius: '6px',
                        padding: '4px 8px',
                        minWidth: '44px',
                        textAlign: 'center',
                      }}
                    >
                      <span style={{ color: '#f59e0b', fontSize: '10px', fontWeight: 700 }}>{apt.time}</span>
                    </div>
                    <div>
                      <p style={{ color: '#f1f5f9', fontSize: '12px', fontWeight: 500 }}>{apt.title}</p>
                      <p style={{ color: '#475569', fontSize: '10px' }}>{apt.person}</p>
                    </div>
                    <ArrowRight size={10} style={{ color: '#475569', marginLeft: 'auto' }} />
                  </div>
                ))}
              </div>
            </div>

            {/* FRANK Brief */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(245,158,11,0.05) 100%)',
                border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: '12px',
                padding: '12px',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Bot size={14} style={{ color: '#f59e0b' }} />
                <span style={{ color: '#f59e0b', fontSize: '11px', fontWeight: 600 }}>FRANK&apos;s Daily Brief</span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '11px', lineHeight: 1.5 }}>
                &quot;Felix, dein kritischster Fokus heute: Lead-Generierung. Die Conversion liegt bei 3.2% —
                wir brauchen mindestens 8%. Ich habe einen Aktionsplan vorbereitet.
                Investor Call um 10:00 ist deine wichtigste Priorität.&quot;
              </p>
              <button
                style={{
                  color: '#f59e0b',
                  fontSize: '11px',
                  fontWeight: 600,
                  marginTop: '8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Mit FRANK besprechen →
              </button>
            </div>
          </div>
        </div>

        {/* Agents Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bot size={14} style={{ color: '#f59e0b' }} />
              <h2 style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }} className="uppercase tracking-widest">
                FRANK Agent System
              </h2>
              <span className="badge-green">9 Aktiv</span>
            </div>
            <span style={{ color: '#3b82f6', fontSize: '11px' }} className="cursor-pointer hover:underline">
              Alle Agents →
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {agents.map((agent) => (
              <AgentCard key={agent.name} {...agent} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
