'use client'

import { useState, useEffect } from 'react'
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
  Loader2,
} from 'lucide-react'

const iconMap: Record<string, React.ReactNode> = {
  revenue: <Euro size={14} style={{ color: '#22c55e' }} />,
  leads: <Users size={14} style={{ color: '#3b82f6' }} />,
  kunden: <TrendingUp size={14} style={{ color: '#f59e0b' }} />,
  termine: <Calendar size={14} style={{ color: '#8b5cf6' }} />,
  bewertung: <Star size={14} style={{ color: '#f97316' }} />,
}

function getKpiIcon(name: string) {
  const lower = name.toLowerCase()
  if (lower.includes('revenue') || lower.includes('mrr') || lower.includes('umsatz') || lower.includes('eur')) return iconMap.revenue
  if (lower.includes('lead') || lower.includes('user') || lower.includes('kontakt')) return iconMap.leads
  if (lower.includes('kund') || lower.includes('wachstum')) return iconMap.kunden
  if (lower.includes('termin') || lower.includes('call') || lower.includes('meeting')) return iconMap.termine
  if (lower.includes('bewert') || lower.includes('score') || lower.includes('nps')) return iconMap.bewertung
  return <TrendingUp size={14} style={{ color: '#f59e0b' }} />
}

function getKpiColor(name: string) {
  const lower = name.toLowerCase()
  if (lower.includes('revenue') || lower.includes('mrr') || lower.includes('umsatz')) return '#22c55e'
  if (lower.includes('lead') || lower.includes('user')) return '#3b82f6'
  if (lower.includes('kund') || lower.includes('wachstum')) return '#f59e0b'
  if (lower.includes('termin') || lower.includes('call')) return '#8b5cf6'
  return '#f97316'
}

interface DashboardData {
  kpis: Array<{
    id: string
    name: string
    current: number
    target: number
    unit: string
    trend: string
    period: string
  }>
  alerts: Array<{
    id: string
    title: string
    description?: string
    severity: string
    category: string
    createdAt: string
  }>
  agents: Array<{
    id: string
    name: string
    type: string
    status: string
    lastRun?: string
  }>
  bottlenecks: Array<{
    id: string
    title: string
    description?: string
    impact: string
  }>
  opportunities: Array<{
    id: string
    title: string
    description?: string
    potential: string
    timeframe?: string
  }>
  goals: Array<{
    id: string
    title: string
    progress: number
  }>
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const today = new Date().toLocaleDateString('de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setLoading(true)
        const res = await fetch('/api/dashboard')
        if (!res.ok) throw new Error('Fehler beim Laden')
        const json = await res.json()
        setData(json)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unbekannter Fehler')
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <div>
        <Header
          title="GUTEN MORGEN, FELIX"
          subtitle={`${today} · FRANK lädt deine Daten...`}
        />
        <div className="p-6 flex items-center justify-center min-h-64">
          <div className="flex flex-col items-center gap-3">
            <Loader2 size={32} style={{ color: '#f59e0b' }} className="animate-spin" />
            <p style={{ color: '#64748b', fontSize: '13px' }}>Dashboard wird geladen...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div>
        <Header
          title="GUTEN MORGEN, FELIX"
          subtitle={`${today}`}
        />
        <div className="p-6">
          <div
            style={{
              backgroundColor: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: '12px',
              padding: '16px',
            }}
          >
            <p style={{ color: '#ef4444', fontSize: '13px' }}>
              Fehler beim Laden des Dashboards: {error}
            </p>
          </div>
        </div>
      </div>
    )
  }

  const { kpis, alerts, agents, bottlenecks, opportunities } = data

  const kpiCards = kpis.map((kpi) => ({
    name: kpi.name,
    value: kpi.unit === '€' || kpi.unit === 'EUR'
      ? kpi.current >= 1000 ? `${(kpi.current / 1000).toFixed(1)}K` : kpi.current.toString()
      : kpi.current.toString(),
    target: kpi.unit === '€' || kpi.unit === 'EUR'
      ? kpi.target >= 1000 ? `${(kpi.target / 1000).toFixed(0)}K` : kpi.target.toString()
      : kpi.target.toString(),
    change: kpi.current > 0 && kpi.target > 0
      ? Math.round(((kpi.current - kpi.target) / kpi.target) * 100)
      : 0,
    trend: (kpi.trend === 'up' ? 'up' : kpi.trend === 'down' ? 'down' : 'neutral') as 'up' | 'down' | 'neutral',
    unit: kpi.unit === 'EUR' ? '€' : kpi.unit,
    period: kpi.period,
    color: getKpiColor(kpi.name),
    icon: getKpiIcon(kpi.name),
  }))

  const topBottleneck = bottlenecks[0]
  const topOpportunity = opportunities[0]
  const unreadAlertsCount = alerts.filter(a => true).length

  return (
    <div>
      <Header
        title="GUTEN MORGEN, FELIX 👋"
        subtitle={`${today} · FRANK hat ${unreadAlertsCount} wichtige Updates für dich`}
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
          {kpiCards.length > 0 ? (
            <div className="grid grid-cols-5 gap-3">
              {kpiCards.map((kpi) => (
                <KPICard key={kpi.name} {...kpi} />
              ))}
            </div>
          ) : (
            <div className="card p-4">
              <p style={{ color: '#64748b', fontSize: '12px' }}>Keine aktiven KPIs verfügbar. Füge KPIs unter &quot;KPIs&quot; hinzu.</p>
            </div>
          )}
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
            {alerts.length > 0 ? (
              <>
                <h4 style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: 700 }} className="mb-2">
                  {alerts[0].title}
                </h4>
                <p style={{ color: '#64748b', fontSize: '12px', lineHeight: 1.5 }} className="mb-3">
                  {alerts[0].description || 'Überprüfe die aktuellen Alerts für Details.'}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant={alerts[0].severity === 'danger' ? 'red' : alerts[0].severity === 'warning' ? 'gold' : 'blue'}>
                    {alerts[0].category}
                  </Badge>
                </div>
              </>
            ) : (
              <>
                <h4 style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: 700 }} className="mb-2">
                  Keine kritischen Alerts
                </h4>
                <p style={{ color: '#64748b', fontSize: '12px', lineHeight: 1.5 }}>
                  Alle Systeme funktionieren normal.
                </p>
              </>
            )}
          </div>

          {/* Top Bottleneck */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={14} style={{ color: '#ef4444' }} />
              <h3 style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }} className="uppercase tracking-widest">
                Kritischer Engpass
              </h3>
            </div>
            {topBottleneck ? (
              <>
                <h4 style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: 700 }} className="mb-2">
                  {topBottleneck.title}
                </h4>
                <p style={{ color: '#64748b', fontSize: '12px', lineHeight: 1.5 }} className="mb-3">
                  {topBottleneck.description || 'Engpass erfordert Aufmerksamkeit.'}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant={topBottleneck.impact === 'high' ? 'red' : topBottleneck.impact === 'medium' ? 'gold' : 'blue'}>
                    {topBottleneck.impact === 'high' ? 'Hoch' : topBottleneck.impact === 'medium' ? 'Mittel' : 'Niedrig'}
                  </Badge>
                </div>
              </>
            ) : (
              <>
                <h4 style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: 700 }} className="mb-2">
                  Keine offenen Engpässe
                </h4>
                <p style={{ color: '#64748b', fontSize: '12px', lineHeight: 1.5 }}>
                  Alle Prozesse laufen reibungslos.
                </p>
              </>
            )}
          </div>

          {/* Top Opportunity */}
          <div className="card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Rocket size={14} style={{ color: '#22c55e' }} />
              <h3 style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }} className="uppercase tracking-widest">
                Top Opportunity
              </h3>
            </div>
            {topOpportunity ? (
              <>
                <h4 style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: 700 }} className="mb-2">
                  {topOpportunity.title}
                </h4>
                <p style={{ color: '#64748b', fontSize: '12px', lineHeight: 1.5 }} className="mb-3">
                  {topOpportunity.description || 'Wachstumschance identifiziert.'}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="green">
                    {topOpportunity.potential === 'high' ? 'Sehr Hoch' : topOpportunity.potential === 'medium' ? 'Mittel' : 'Niedrig'}
                  </Badge>
                  {topOpportunity.timeframe && (
                    <span style={{ color: '#475569', fontSize: '11px' }}>{topOpportunity.timeframe}</span>
                  )}
                </div>
              </>
            ) : (
              <>
                <h4 style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: 700 }} className="mb-2">
                  Keine aktuellen Chancen
                </h4>
                <p style={{ color: '#64748b', fontSize: '12px', lineHeight: 1.5 }}>
                  Füge Chancen unter &quot;Opportunities&quot; hinzu.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-3 gap-4">
          {/* Alerts Panel */}
          <div className="card col-span-2">
            <div style={{ borderBottom: '1px solid #1e2130' }} className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} style={{ color: '#f97316' }} />
                <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }} className="uppercase tracking-widest">
                  Wichtige Alerts
                </span>
              </div>
              {unreadAlertsCount > 0 && (
                <span
                  style={{ backgroundColor: '#ef4444', color: '#fff', fontSize: '10px', padding: '1px 6px', borderRadius: '9999px', fontWeight: 700 }}
                >
                  {unreadAlertsCount}
                </span>
              )}
            </div>
            <div className="p-3 space-y-2">
              {alerts.length > 0 ? (
                alerts.slice(0, 5).map((alert) => (
                  <AlertCard
                    key={alert.id}
                    title={alert.title}
                    description={alert.description || ''}
                    severity={alert.severity as 'danger' | 'warning' | 'info' | 'success'}
                    category={alert.category}
                    time={new Date(alert.createdAt).toLocaleDateString('de-DE')}
                  />
                ))
              ) : (
                <p style={{ color: '#64748b', fontSize: '12px', padding: '8px' }}>Keine ungelesenen Alerts.</p>
              )}
            </div>
          </div>

          {/* Right Column: FRANK Brief */}
          <div className="space-y-4">
            {/* Goals Summary */}
            {data.goals.length > 0 && (
              <div className="card p-4">
                <div style={{ borderBottom: '1px solid #1e2130' }} className="pb-2 mb-3 flex items-center gap-2">
                  <Target size={14} style={{ color: '#8b5cf6' }} />
                  <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }} className="uppercase tracking-widest">
                    Aktive Ziele
                  </span>
                </div>
                <div className="space-y-2">
                  {data.goals.slice(0, 3).map((goal) => (
                    <div key={goal.id} className="flex items-center gap-2">
                      {goal.progress >= 100 ? (
                        <CheckCircle2 size={12} style={{ color: '#22c55e', flexShrink: 0 }} />
                      ) : (
                        <Circle size={12} style={{ color: '#475569', flexShrink: 0 }} />
                      )}
                      <div className="flex-1 min-w-0">
                        <p style={{ color: '#f1f5f9', fontSize: '11px', fontWeight: 500 }} className="truncate">
                          {goal.title}
                        </p>
                        <div className="progress-bar mt-0.5">
                          <div
                            className="progress-bar-fill"
                            style={{ width: `${Math.min(goal.progress, 100)}%`, backgroundColor: '#8b5cf6' }}
                          />
                        </div>
                      </div>
                      <span style={{ color: '#8b5cf6', fontSize: '10px', fontWeight: 600, flexShrink: 0 }}>
                        {Math.round(goal.progress)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                {kpis.length > 0
                  ? `Felix, du hast ${kpis.length} aktive KPIs, ${bottlenecks.length} offene Engpässe und ${opportunities.length} identifizierte Chancen. ${alerts.length > 0 ? `${alerts.length} Alerts warten auf deine Aufmerksamkeit.` : 'Alle Systeme laufen normal.'}`
                  : 'Starte damit, KPIs, Ziele und Engpässe einzutragen, damit FRANK dir einen präzisen Daily Brief geben kann.'
                }
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
              {agents.length > 0 && (
                <span className="badge-green">{agents.filter(a => a.status === 'active').length} Aktiv</span>
              )}
            </div>
            <span style={{ color: '#3b82f6', fontSize: '11px' }} className="cursor-pointer hover:underline">
              Alle Agents →
            </span>
          </div>
          {agents.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {agents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  name={agent.name}
                  type={agent.type}
                  status={agent.status as 'active' | 'paused' | 'error'}
                  lastRun={agent.lastRun ? new Date(agent.lastRun).toLocaleDateString('de-DE') : 'Noch nicht gelaufen'}
                  description={agent.type}
                />
              ))}
            </div>
          ) : (
            <div className="card p-4">
              <p style={{ color: '#64748b', fontSize: '12px' }}>
                Keine Agents konfiguriert. Füge Agents unter &quot;Agents&quot; hinzu.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
