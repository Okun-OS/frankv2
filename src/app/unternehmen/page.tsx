'use client'

import { useState, useEffect } from 'react'
import { Euro, Users, TrendingUp, Target, AlertTriangle, Rocket, Star, Calendar, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react'

const revenueData = [
  { month: 'Jan', revenue: 28000, target: 35000 },
  { month: 'Feb', revenue: 32000, target: 37000 },
  { month: 'Mär', revenue: 29000, target: 40000 },
  { month: 'Apr', revenue: 38000, target: 42000 },
  { month: 'Mai', revenue: 42800, target: 45000 },
]

const metrics = [
  { label: 'MRR', value: '€38.2K', change: 12.4, up: true },
  { label: 'ARR', value: '€458K', change: 18.2, up: true },
  { label: 'Churn Rate', value: '2.1%', change: -0.3, up: false },
  { label: 'NPS Score', value: '74', change: 8, up: true },
  { label: 'CAC', value: '€124', change: -5.2, up: true },
  { label: 'LTV', value: '€1,840', change: 14.8, up: true },
  { label: 'LTV/CAC', value: '14.8x', change: 22.1, up: true },
  { label: 'Runway', value: '18 Mo', change: 0, up: true },
]

interface DashboardData {
  kpis: Array<{ id: string; name: string; current: number; target: number; unit: string; trend: string }>
  goals: Array<{ id: string; title: string; progress: number }>
  bottlenecks: Array<{ id: string; title: string; description?: string; impact: string }>
  opportunities: Array<{ id: string; title: string; description?: string; potential: string }>
}

export default function UnternehmenPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen" style={{ background: '#0a0b0f' }}>
      <div className="p-6 max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>Unternehmen</h1>
          <p style={{ color: '#64748b' }} className="mt-1">Vollständige Unternehmensübersicht — OKUN Systems</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-64">
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={32} style={{ color: '#f59e0b' }} className="animate-spin" />
              <p style={{ color: '#64748b', fontSize: '13px' }}>Daten werden geladen...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Top KPI Row */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Revenue MTD', value: '€42.8K', target: '€60K', icon: <Euro size={14} style={{ color: '#22c55e' }} />, color: '#22c55e', change: '+12.4%' },
                { label: 'Aktive Kunden', value: '234', target: '300', icon: <Users size={14} style={{ color: '#f59e0b' }} />, color: '#f59e0b', change: '+4.7%' },
                { label: 'MRR Wachstum', value: '12.4%', target: '15%', icon: <TrendingUp size={14} style={{ color: '#3b82f6' }} />, color: '#3b82f6', change: '+2.1%' },
                { label: 'Leads diese Woche', value: '47', target: '60', icon: <Calendar size={14} style={{ color: '#8b5cf6' }} />, color: '#8b5cf6', change: '-8.2%' },
              ].map((kpi) => (
                <div key={kpi.label} className="p-4 rounded-xl" style={{ background: '#111318', border: '1px solid #1e2130' }}>
                  <div className="flex items-center gap-2 mb-2">
                    {kpi.icon}
                    <span className="text-xs" style={{ color: '#64748b' }}>{kpi.label}</span>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>{kpi.value}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs" style={{ color: '#475569' }}>Ziel: {kpi.target}</span>
                    <span className="text-xs font-semibold" style={{ color: kpi.change.startsWith('+') ? '#22c55e' : '#ef4444' }}>{kpi.change}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Business Metrics Grid */}
            <div className="mb-6">
              <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#64748b' }}>Business Metriken</h2>
              <div className="grid grid-cols-4 gap-3">
                {metrics.map((m) => (
                  <div key={m.label} className="p-4 rounded-xl" style={{ background: '#111318', border: '1px solid #1e2130' }}>
                    <p className="text-xs mb-1" style={{ color: '#64748b' }}>{m.label}</p>
                    <p className="text-xl font-bold" style={{ color: '#f1f5f9' }}>{m.value}</p>
                    {m.change !== 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        {m.up ? (
                          <ArrowUpRight size={11} style={{ color: '#22c55e' }} />
                        ) : (
                          <ArrowDownRight size={11} style={{ color: '#ef4444' }} />
                        )}
                        <span className="text-xs font-semibold" style={{ color: m.up ? '#22c55e' : '#ef4444' }}>
                          {m.change > 0 ? '+' : ''}{m.change}%
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Special Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-xl" style={{ background: '#111318', border: '1px solid #f59e0b25' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Star size={14} style={{ color: '#f59e0b' }} />
                  <span className="text-xs font-medium" style={{ color: '#f59e0b' }}>Bewertungen</span>
                </div>
                <p className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>4.8 ★</p>
                <p className="text-xs mt-1" style={{ color: '#475569' }}>127 Google Reviews</p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: '#111318', border: '1px solid #3b82f625' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Target size={14} style={{ color: '#3b82f6' }} />
                  <span className="text-xs font-medium" style={{ color: '#3b82f6' }}>BAFA Status</span>
                </div>
                <p className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>Aktiv</p>
                <p className="text-xs mt-1" style={{ color: '#475569' }}>Zertifiziert bis Dez 2026</p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: '#111318', border: '1px solid #22c55e25' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={14} style={{ color: '#22c55e' }} />
                  <span className="text-xs font-medium" style={{ color: '#22c55e' }}>Termine diese Woche</span>
                </div>
                <p className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>8 / 12</p>
                <p className="text-xs mt-1" style={{ color: '#475569' }}>67% des Wochenziels</p>
              </div>
            </div>

            {/* Goals Overview */}
            <div className="mb-6">
              <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: '#64748b' }}>Strategische Ziele</h2>
              <div className="grid grid-cols-2 gap-3">
                {(data?.goals && data.goals.length > 0 ? data.goals : [
                  { id: '1', title: 'Revenue €720K ARR erreichen', progress: 63 },
                  { id: '2', title: '300 Aktive Kunden', progress: 78 },
                  { id: '3', title: 'Series A Finanzierung sichern', progress: 45 },
                  { id: '4', title: 'Team auf 12 FTE ausbauen', progress: 58 },
                ]).map((goal) => (
                  <div key={goal.id} className="p-4 rounded-xl" style={{ background: '#111318', border: '1px solid #1e2130' }}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold" style={{ color: '#f1f5f9' }}>{goal.title}</p>
                      <span className="text-sm font-bold" style={{ color: goal.progress > 70 ? '#22c55e' : goal.progress > 40 ? '#f59e0b' : '#ef4444' }}>
                        {goal.progress}%
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: '#1e2130' }}>
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{
                          width: `${goal.progress}%`,
                          background: goal.progress > 70 ? '#22c55e' : goal.progress > 40 ? '#f59e0b' : '#ef4444'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom: Bottleneck + Opportunity */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-xl" style={{ background: '#111318', border: '1px solid #ef444425' }}>
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={16} style={{ color: '#ef4444' }} />
                  <span className="text-xs font-medium uppercase tracking-wider" style={{ color: '#ef4444' }}>Top Engpass</span>
                </div>
                <p className="font-semibold mb-1" style={{ color: '#f1f5f9' }}>
                  {data?.bottlenecks?.[0]?.title || 'Keine offenen Engpässe'}
                </p>
                {data?.bottlenecks?.[0]?.description && (
                  <p className="text-xs" style={{ color: '#64748b' }}>{data.bottlenecks[0].description}</p>
                )}
                {data?.bottlenecks?.[0]?.impact && (
                  <span className="text-xs mt-2 inline-block px-2 py-0.5 rounded-full" style={{ background: '#ef444415', color: '#ef4444' }}>
                    Impact: {data.bottlenecks[0].impact}
                  </span>
                )}
              </div>

              <div className="p-5 rounded-xl" style={{ background: '#111318', border: '1px solid #22c55e25' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Rocket size={16} style={{ color: '#22c55e' }} />
                  <span className="text-xs font-medium uppercase tracking-wider" style={{ color: '#22c55e' }}>Top Chance</span>
                </div>
                <p className="font-semibold mb-1" style={{ color: '#f1f5f9' }}>
                  {data?.opportunities?.[0]?.title || 'Keine identifizierten Chancen'}
                </p>
                {data?.opportunities?.[0]?.description && (
                  <p className="text-xs" style={{ color: '#64748b' }}>{data.opportunities[0].description}</p>
                )}
                {data?.opportunities?.[0]?.potential && (
                  <span className="text-xs mt-2 inline-block px-2 py-0.5 rounded-full" style={{ background: '#22c55e15', color: '#22c55e' }}>
                    Potenzial: {data.opportunities[0].potential}
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
