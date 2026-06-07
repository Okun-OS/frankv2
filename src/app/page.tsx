'use client'
import { useState, useEffect } from 'react'
import { Brain, AlertTriangle, Rocket, Target, TrendingUp, ArrowRight, RefreshCw } from 'lucide-react'

export default function Dashboard() {
  const [data, setData] = useState<any>(null)
  const [frankBrief, setFrankBrief] = useState<string>('')
  const [loadingBrief, setLoadingBrief] = useState(true)
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    fetch('/api/dashboard').then(r => r.json()).then(setData)
    generateFrankBrief()
    const timer = setInterval(() => setTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  async function generateFrankBrief() {
    setLoadingBrief(true)
    try {
      const res = await fetch('/api/frank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: 'Erstelle ein tägliches Briefing für Felix. Analysiere den Unternehmenszustand und nenne: 1) Größtes Nadelöhr heute, 2) Größte Chance, 3) Wichtigstes Ziel, 4) Empfohlene Priorität heute. Max 4 kurze Sätze, direkt und sachlich wie ein COO.'
          }]
        })
      })
      const d = await res.json()
      setFrankBrief(d.message || '')
    } catch {
      setFrankBrief('Frank konnte keine Analyse laden. Bitte versuche es erneut.')
    }
    setLoadingBrief(false)
  }

  const hour = time.getHours()
  const greeting = hour < 12 ? 'Guten Morgen' : hour < 18 ? 'Guten Tag' : 'Guten Abend'

  return (
    <div className="min-h-screen" style={{ background: '#0a0b0f' }}>
      <div className="p-6 max-w-6xl mx-auto">

        {/* Header greeting */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: '#f1f5f9' }}>
                {greeting}, Felix 👋
              </h1>
              <p style={{ color: '#64748b' }} className="mt-1">
                {time.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
            <button
              onClick={generateFrankBrief}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm"
              style={{ background: '#111318', border: '1px solid #1e2130', color: '#94a3b8' }}
            >
              <RefreshCw size={14} />
              Analyse aktualisieren
            </button>
          </div>
        </div>

        {/* Frank's Brief — THE MAIN ELEMENT */}
        <div className="mb-8 p-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, #111318 0%, #161921 100%)', border: '1px solid #f59e0b33' }}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#f59e0b20', border: '2px solid #f59e0b40' }}>
              <Brain size={20} style={{ color: '#f59e0b' }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-bold text-lg" style={{ color: '#f59e0b' }}>FRANK</span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#f59e0b15', color: '#f59e0b', border: '1px solid #f59e0b30' }}>Tagesanalyse</span>
              </div>
              {loadingBrief ? (
                <div className="flex items-center gap-3" style={{ color: '#64748b' }}>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#f59e0b', animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#f59e0b', animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#f59e0b', animationDelay: '300ms' }} />
                  </div>
                  <span className="text-sm">Frank analysiert dein Unternehmen...</span>
                </div>
              ) : (
                <p className="leading-relaxed" style={{ color: '#e2e8f0' }}>{frankBrief}</p>
              )}
            </div>
          </div>
        </div>

        {/* 4 key insights grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Bottleneck */}
          <div className="p-5 rounded-xl" style={{ background: '#111318', border: '1px solid #ef444425' }}>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={16} style={{ color: '#ef4444' }} />
              <span className="text-xs font-medium uppercase tracking-wider" style={{ color: '#ef4444' }}>Größtes Nadelöhr</span>
            </div>
            <p className="font-semibold" style={{ color: '#f1f5f9' }}>
              {data?.bottlenecks?.[0]?.title || 'Wird analysiert...'}
            </p>
            {data?.bottlenecks?.[0]?.impact && (
              <span className="text-xs mt-2 inline-block px-2 py-0.5 rounded-full" style={{ background: '#ef444415', color: '#ef4444' }}>
                Impact: {data.bottlenecks[0].impact}
              </span>
            )}
          </div>

          {/* Opportunity */}
          <div className="p-5 rounded-xl" style={{ background: '#111318', border: '1px solid #22c55e25' }}>
            <div className="flex items-center gap-2 mb-3">
              <Rocket size={16} style={{ color: '#22c55e' }} />
              <span className="text-xs font-medium uppercase tracking-wider" style={{ color: '#22c55e' }}>Größte Chance</span>
            </div>
            <p className="font-semibold" style={{ color: '#f1f5f9' }}>
              {data?.opportunities?.[0]?.title || 'Wird analysiert...'}
            </p>
            {data?.opportunities?.[0]?.potential && (
              <span className="text-xs mt-2 inline-block px-2 py-0.5 rounded-full" style={{ background: '#22c55e15', color: '#22c55e' }}>
                Potenzial: {data.opportunities[0].potential}
              </span>
            )}
          </div>

          {/* Main Goal */}
          <div className="p-5 rounded-xl" style={{ background: '#111318', border: '1px solid #f59e0b25' }}>
            <div className="flex items-center gap-2 mb-3">
              <Target size={16} style={{ color: '#f59e0b' }} />
              <span className="text-xs font-medium uppercase tracking-wider" style={{ color: '#f59e0b' }}>Wichtigstes Ziel</span>
            </div>
            <p className="font-semibold" style={{ color: '#f1f5f9' }}>
              {data?.goals?.[0]?.title || 'Keine aktiven Ziele'}
            </p>
            {data?.goals?.[0]?.progress !== undefined && (
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1" style={{ color: '#64748b' }}>
                  <span>Fortschritt</span>
                  <span>{data.goals[0].progress}%</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ background: '#1e2130' }}>
                  <div className="h-1.5 rounded-full" style={{ background: '#f59e0b', width: `${data.goals[0].progress}%` }} />
                </div>
              </div>
            )}
          </div>

          {/* KPI Snapshot */}
          <div className="p-5 rounded-xl" style={{ background: '#111318', border: '1px solid #3b82f625' }}>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} style={{ color: '#3b82f6' }} />
              <span className="text-xs font-medium uppercase tracking-wider" style={{ color: '#3b82f6' }}>KPI Status</span>
            </div>
            {data?.kpis?.slice(0, 3).map((kpi: any) => (
              <div key={kpi.id} className="flex justify-between items-center mb-2">
                <span className="text-sm" style={{ color: '#94a3b8' }}>{kpi.name}</span>
                <span className="text-sm font-semibold" style={{ color: kpi.trend === 'up' ? '#22c55e' : kpi.trend === 'down' ? '#ef4444' : '#f1f5f9' }}>
                  {kpi.current} {kpi.unit}
                </span>
              </div>
            )) || <p style={{ color: '#64748b' }} className="text-sm">Keine KPIs verfügbar</p>}
          </div>
        </div>

        {/* Alerts */}
        {data?.alerts && data.alerts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: '#64748b' }}>Wichtige Alerts</h2>
            <div className="space-y-2">
              {data.alerts.slice(0, 3).map((alert: any) => (
                <div key={alert.id} className="flex items-start gap-3 p-4 rounded-xl" style={{ background: '#111318', border: '1px solid #1e2130' }}>
                  <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: alert.severity === 'danger' ? '#ef4444' : alert.severity === 'warning' ? '#f97316' : alert.severity === 'success' ? '#22c55e' : '#3b82f6' }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: '#f1f5f9' }}>{alert.title}</p>
                    {alert.description && <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>{alert.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA to Ask Frank */}
        <div className="p-6 rounded-2xl text-center" style={{ background: 'linear-gradient(135deg, #f59e0b10 0%, #f59e0b05 100%)', border: '1px solid #f59e0b30' }}>
          <p className="text-sm mb-3" style={{ color: '#94a3b8' }}>Was willst du heute erreichen?</p>
          <a href="/ask-frank" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all" style={{ background: '#f59e0b', color: '#0a0b0f' }}>
            <span>Frank fragen</span>
            <ArrowRight size={16} />
          </a>
        </div>

      </div>
    </div>
  )
}
