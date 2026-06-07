'use client'
import { useState, useEffect } from 'react'
import {
  Brain, AlertTriangle, Rocket, Target, TrendingUp, ArrowRight,
  RefreshCw, Shield, CalendarDays, Loader2, ChevronRight,
} from 'lucide-react'

interface Briefing {
  mainGoal: { title: string; description: string }
  bottleneck: { title: string; impact: string; action: string }
  opportunity: { title: string; potential: string }
  risks: string[]
  priorities: string[]
  dayPlan: { time: string; activity: string; category: string }[]
  kpis: { name: string; current: string; target: string; trend: string; ok: boolean }[]
  coo_message: string
  todayTaskCount: number
}

const categoryColors: Record<string, string> = {
  outreach: '#22c55e',
  sales: '#22c55e',
  focus: '#8b5cf6',
  content: '#f97316',
  admin: '#64748b',
  call: '#f59e0b',
  meeting: '#3b82f6',
  review: '#ef4444',
}

export default function Dashboard() {
  const [briefing, setBriefing] = useState<Briefing | null>(null)
  const [loading, setLoading] = useState(true)
  const [time, setTime] = useState(new Date())
  const [error, setError] = useState(false)

  useEffect(() => {
    loadBriefing()
    const timer = setInterval(() => setTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  async function loadBriefing() {
    setLoading(true)
    setError(false)
    try {
      const res = await fetch('/api/frank/briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      if (!res.ok) throw new Error()
      setBriefing(await res.json())
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const hour = time.getHours()
  const greeting = hour < 12 ? 'Guten Morgen' : hour < 18 ? 'Guten Tag' : 'Guten Abend'
  const dateStr = time.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="min-h-screen" style={{ background: '#0a0b0f' }}>
      <div className="p-6 max-w-5xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>{greeting} 👋</h1>
            <p style={{ color: '#64748b', fontSize: '13px' }}>{dateStr}</p>
          </div>
          <button
            onClick={loadBriefing}
            disabled={loading}
            style={{ background: '#111318', border: '1px solid #1e2130', color: '#94a3b8', borderRadius: '10px', padding: '8px 14px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
            Analyse aktualisieren
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ background: '#111318', border: '1px solid #f59e0b30', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f59e0b20', border: '2px solid #f59e0b40', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain size={18} style={{ color: '#f59e0b' }} />
              </div>
              <div>
                <p style={{ color: '#f59e0b', fontWeight: 700, fontSize: '14px' }}>FRANK</p>
                <p style={{ color: '#64748b', fontSize: '12px' }}>Analysiert dein Unternehmen...</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
              {[0, 150, 300].map(d => (
                <div key={d} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b', animation: 'pulse 1.5s infinite', animationDelay: `${d}ms` }} />
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div style={{ background: '#111318', border: '1px solid #ef444430', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
            <p style={{ color: '#ef4444', fontSize: '14px', marginBottom: '12px' }}>Frank konnte keine Analyse laden.</p>
            <button onClick={loadBriefing} style={{ background: '#f59e0b', color: '#0a0b0f', border: 'none', borderRadius: '8px', padding: '8px 18px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
              Erneut versuchen
            </button>
          </div>
        )}

        {/* Briefing */}
        {briefing && !loading && (
          <>
            {/* COO Message — Frank speaks first */}
            <div style={{ background: 'linear-gradient(135deg, #111318 0%, #161921 100%)', border: '1px solid #f59e0b40', borderRadius: '16px', padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#f59e0b20', border: '2px solid #f59e0b40', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Brain size={20} style={{ color: '#f59e0b' }} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: '15px' }}>FRANK</span>
                    <span style={{ background: '#f59e0b15', color: '#f59e0b', border: '1px solid #f59e0b30', fontSize: '10px', padding: '2px 8px', borderRadius: '20px', fontWeight: 600 }}>Executive Briefing</span>
                  </div>
                  <p style={{ color: '#e2e8f0', fontSize: '14px', lineHeight: 1.6 }}>{briefing.coo_message}</p>
                </div>
              </div>
            </div>

            {/* 3-column top row: Goal | Bottleneck | Opportunity */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>

              {/* Main Goal */}
              <div style={{ background: '#111318', border: '1px solid #f59e0b25', borderRadius: '14px', padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                  <Target size={13} style={{ color: '#f59e0b' }} />
                  <span style={{ color: '#f59e0b', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Wichtigstes Ziel heute</span>
                </div>
                <p style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>{briefing.mainGoal.title}</p>
                <p style={{ color: '#64748b', fontSize: '11px', lineHeight: 1.5 }}>{briefing.mainGoal.description}</p>
              </div>

              {/* Bottleneck */}
              <div style={{ background: '#111318', border: '1px solid #ef444425', borderRadius: '14px', padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                  <AlertTriangle size={13} style={{ color: '#ef4444' }} />
                  <span style={{ color: '#ef4444', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Größtes Nadelöhr</span>
                </div>
                <p style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>{briefing.bottleneck.title}</p>
                <p style={{ color: '#64748b', fontSize: '11px', marginBottom: '8px' }}>Auswirkung: {briefing.bottleneck.impact}</p>
                <div style={{ background: '#ef444410', border: '1px solid #ef444420', borderRadius: '8px', padding: '8px 10px' }}>
                  <p style={{ color: '#ef4444', fontSize: '11px', fontWeight: 500 }}>→ {briefing.bottleneck.action}</p>
                </div>
              </div>

              {/* Opportunity */}
              <div style={{ background: '#111318', border: '1px solid #22c55e25', borderRadius: '14px', padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                  <Rocket size={13} style={{ color: '#22c55e' }} />
                  <span style={{ color: '#22c55e', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Größte Chance</span>
                </div>
                <p style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>{briefing.opportunity.title}</p>
                <p style={{ color: '#64748b', fontSize: '11px' }}>Potenzial: {briefing.opportunity.potential}</p>
              </div>
            </div>

            {/* Bottom row: Risks + Priorities + Day Plan */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '12px' }}>

              {/* Risks */}
              <div style={{ background: '#111318', border: '1px solid #1e2130', borderRadius: '14px', padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                  <Shield size={13} style={{ color: '#f97316' }} />
                  <span style={{ color: '#f97316', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Risiken</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {briefing.risks.map((risk, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f97316', marginTop: '5px', flexShrink: 0 }} />
                      <p style={{ color: '#94a3b8', fontSize: '11px', lineHeight: 1.5 }}>{risk}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Priorities */}
              <div style={{ background: '#111318', border: '1px solid #1e2130', borderRadius: '14px', padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                  <TrendingUp size={13} style={{ color: '#3b82f6' }} />
                  <span style={{ color: '#3b82f6', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Prioritäten heute</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {briefing.priorities.map((p, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <span style={{ color: '#f59e0b', fontSize: '11px', fontWeight: 700, minWidth: '16px' }}>{i + 1}.</span>
                      <p style={{ color: '#94a3b8', fontSize: '11px', lineHeight: 1.5 }}>{p}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Day Plan */}
              <div style={{ background: '#111318', border: '1px solid #1e2130', borderRadius: '14px', padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                  <CalendarDays size={13} style={{ color: '#8b5cf6' }} />
                  <span style={{ color: '#8b5cf6', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tagesplan</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {briefing.dayPlan.map((block, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#f59e0b', fontSize: '10px', fontWeight: 700, minWidth: '72px', flexShrink: 0 }}>{block.time}</span>
                      <div style={{ width: '3px', height: '16px', borderRadius: '2px', background: categoryColors[block.category] || '#475569', flexShrink: 0 }} />
                      <span style={{ color: '#94a3b8', fontSize: '11px' }}>{block.activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* KPI row */}
            {briefing.kpis && briefing.kpis.length > 0 && (
              <div style={{ background: '#111318', border: '1px solid #1e2130', borderRadius: '14px', padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                  <TrendingUp size={13} style={{ color: '#64748b' }} />
                  <span style={{ color: '#64748b', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Unternehmensstatus</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${briefing.kpis.length}, 1fr)`, gap: '12px' }}>
                  {briefing.kpis.map((kpi, i) => (
                    <div key={i}>
                      <p style={{ color: '#475569', fontSize: '10px', marginBottom: '4px' }}>{kpi.name}</p>
                      <p style={{ color: kpi.ok ? '#22c55e' : '#f59e0b', fontSize: '18px', fontWeight: 700 }}>{kpi.current}</p>
                      <p style={{ color: '#475569', fontSize: '10px' }}>Ziel: {kpi.target}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <a
                href="/ask-frank"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0a0b0f', borderRadius: '14px', padding: '16px 20px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <div>
                  <p style={{ fontWeight: 800, fontSize: '14px' }}>Frank fragen</p>
                  <p style={{ fontSize: '11px', opacity: 0.7, marginTop: '2px' }}>Strategische Fragen stellen</p>
                </div>
                <ChevronRight size={20} />
              </a>
              <a
                href="/planung"
                style={{ background: '#111318', border: '1px solid #1e2130', color: '#f1f5f9', borderRadius: '14px', padding: '16px 20px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
              >
                <div>
                  <p style={{ fontWeight: 700, fontSize: '14px' }}>Tagesplan öffnen</p>
                  <p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                    {briefing.todayTaskCount > 0 ? `${briefing.todayTaskCount} Aufgaben geplant` : 'Noch kein Plan für heute'}
                  </p>
                </div>
                <ChevronRight size={20} style={{ color: '#475569' }} />
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
