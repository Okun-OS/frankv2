'use client'

import Header from '@/components/layout/Header'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ClipboardList, Plus, TrendingUp, TrendingDown, Minus, CheckCircle2, XCircle, Lightbulb } from 'lucide-react'

const reviews = [
  {
    id: 1,
    weekNumber: 22,
    year: 2026,
    title: 'KW22 — Starkes Momentum trotz Lead-Rückgang',
    wins: [
      'Kundenzahl auf 234 gestiegen (+14 neue Kunden)',
      'Investor Call erfolgreich — Term Sheet in Vorbereitung',
      'LinkedIn-Reichweite +340% durch viral gegangenen Post',
      'Neues Feature: AI-Automatisierung live gegangen',
    ],
    losses: [
      'Lead-Generierung 42% unter Ziel',
      'Demo-Calls Conversion auf 3.2% gesunken',
      'Content-Frequenz auf 2x/Woche reduziert',
    ],
    learnings: [
      'Enterprise-Demos brauchen andere Kommunikation als SMB',
      'Video-Content perft 3x besser als Text auf LinkedIn',
      'Follow-up nach Tag 3 ist entscheidend für Conversion',
    ],
    nextWeekFocus: 'Lead-Generierung priorisieren. LinkedIn täglich, Cold Email A/B Test, Demo-Script optimieren.',
    kpiSnapshot: { revenue: 42800, leads: 47, customers: 234, nps: 74 },
    date: '30. Mai 2026',
    rating: 7.5,
  },
  {
    id: 2,
    weekNumber: 21,
    year: 2026,
    title: 'KW21 — Rekordumsatz im Mai',
    wins: [
      'Höchster Wochen-Revenue aller Zeiten: €11.4K',
      '2 Enterprise-Deals abgeschlossen',
      'NPS auf 74 gestiegen (+6)',
      'Team auf 7 FTE gewachsen',
    ],
    losses: [
      'Onboarding-Prozess überlastet — 2 Kunden frustriert',
      'Technical Debt aufgelaufen',
    ],
    learnings: [
      'Onboarding muss vor weiterer Skalierung automatisiert werden',
      'Enterprise-Kunden sind 3x profitabler als SMB',
    ],
    nextWeekFocus: 'Onboarding automatisieren & Enterprise-Pipeline ausbauen.',
    kpiSnapshot: { revenue: 40200, leads: 71, customers: 220, nps: 74 },
    date: '23. Mai 2026',
    rating: 8.8,
  },
]

export default function ReviewsPage() {
  return (
    <div>
      <Header
        title="Weekly Review Engine"
        subtitle="Retrospektiven, Learnings und kontinuierliche Verbesserung"
      />
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Reviews gesamt', value: '22', color: '#f59e0b' },
            { label: 'Ø Wochen-Rating', value: '7.9/10', color: '#22c55e' },
            { label: 'Learnings gesamt', value: '84', color: '#3b82f6' },
            { label: 'Streak', value: '22 Wochen', color: '#8b5cf6' },
          ].map((stat) => (
            <div key={stat.label} className="card p-4">
              <p style={{ color: '#64748b', fontSize: '11px', fontWeight: 500 }} className="mb-1">{stat.label}</p>
              <p style={{ color: stat.color, fontSize: '24px', fontWeight: 700 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <h2 style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }} className="uppercase tracking-widest">
            Review-Verlauf
          </h2>
          <Button variant="gold" size="sm">
            <Plus size={12} />
            Neues Review starten
          </Button>
        </div>

        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="card p-5">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 700 }}>{review.title}</h3>
                    <span
                      style={{
                        backgroundColor: review.rating >= 8 ? 'rgba(34,197,94,0.1)' : review.rating >= 6 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                        color: review.rating >= 8 ? '#22c55e' : review.rating >= 6 ? '#f59e0b' : '#ef4444',
                        fontSize: '13px',
                        fontWeight: 700,
                        padding: '2px 10px',
                        borderRadius: '6px',
                      }}
                    >
                      {review.rating}/10
                    </span>
                  </div>
                  <p style={{ color: '#475569', fontSize: '11px' }}>{review.date} · KW{review.weekNumber}/{review.year}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                {/* Wins */}
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <CheckCircle2 size={12} style={{ color: '#22c55e' }} />
                    <h4 style={{ color: '#22c55e', fontSize: '11px', fontWeight: 600 }} className="uppercase tracking-wider">Wins ({review.wins.length})</h4>
                  </div>
                  <div className="space-y-1">
                    {review.wins.map((win, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <span style={{ color: '#22c55e', fontSize: '10px', marginTop: '2px' }}>✓</span>
                        <p style={{ color: '#94a3b8', fontSize: '11px', lineHeight: 1.4 }}>{win}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Losses */}
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <XCircle size={12} style={{ color: '#ef4444' }} />
                    <h4 style={{ color: '#ef4444', fontSize: '11px', fontWeight: 600 }} className="uppercase tracking-wider">Losses ({review.losses.length})</h4>
                  </div>
                  <div className="space-y-1">
                    {review.losses.map((loss, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <span style={{ color: '#ef4444', fontSize: '10px', marginTop: '2px' }}>✗</span>
                        <p style={{ color: '#94a3b8', fontSize: '11px', lineHeight: 1.4 }}>{loss}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Learnings */}
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <Lightbulb size={12} style={{ color: '#f59e0b' }} />
                    <h4 style={{ color: '#f59e0b', fontSize: '11px', fontWeight: 600 }} className="uppercase tracking-wider">Learnings ({review.learnings.length})</h4>
                  </div>
                  <div className="space-y-1">
                    {review.learnings.map((learning, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <span style={{ color: '#f59e0b', fontSize: '10px', marginTop: '2px' }}>→</span>
                        <p style={{ color: '#94a3b8', fontSize: '11px', lineHeight: 1.4 }}>{learning}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Next Week Focus */}
              <div
                style={{
                  backgroundColor: 'rgba(245,158,11,0.08)',
                  border: '1px solid rgba(245,158,11,0.2)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  marginBottom: '12px',
                }}
              >
                <p style={{ color: '#f59e0b', fontSize: '10px', fontWeight: 600 }} className="mb-0.5 uppercase tracking-wider">Nächste Woche Fokus</p>
                <p style={{ color: '#94a3b8', fontSize: '11px' }}>{review.nextWeekFocus}</p>
              </div>

              {/* KPI Snapshot */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Revenue', value: `€${review.kpiSnapshot.revenue.toLocaleString()}`, color: '#22c55e' },
                  { label: 'Leads', value: review.kpiSnapshot.leads, color: '#3b82f6' },
                  { label: 'Kunden', value: review.kpiSnapshot.customers, color: '#f59e0b' },
                  { label: 'NPS', value: review.kpiSnapshot.nps, color: '#8b5cf6' },
                ].map((metric) => (
                  <div key={metric.label} style={{ backgroundColor: '#0a0b0f', borderRadius: '6px', padding: '8px 10px' }}>
                    <p style={{ color: '#475569', fontSize: '10px' }}>{metric.label}</p>
                    <p style={{ color: metric.color, fontSize: '14px', fontWeight: 700 }}>{metric.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
