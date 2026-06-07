'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Database, Plus, Star, Search, Brain, CheckCircle2, XCircle, Clock, Lightbulb } from 'lucide-react'

const memories = [
  {
    id: 1,
    title: 'Enterprise-Kunden sind 3x profitabler als SMB',
    content: 'Nach Analyse von 234 Kunden: Enterprise (50+ MA) haben durchschnittlich LTV von €8,400 vs. €2,800 bei SMB. Außerdem 60% niedrigere Churn Rate. Strategie: Enterprise-Akquise priorisieren.',
    category: 'learning',
    tags: ['pricing', 'customer-segmentation', 'enterprise'],
    importance: 5,
    source: 'weekly_review',
    date: '30. Mai 2026',
  },
  {
    id: 2,
    title: 'Video-Content perft 3x besser als Text auf LinkedIn',
    content: 'A/B Test über 4 Wochen (je 10 Posts): Video-Posts erreichen durchschnittlich 8,420 Views vs. 2,840 bei Text-Posts. Engagement-Rate: 4.2% vs. 1.8%. Konsequenz: 60% Video im Content-Mix.',
    category: 'pattern',
    tags: ['content', 'linkedin', 'video', 'marketing'],
    importance: 4,
    source: 'weekly_review',
    date: '23. Mai 2026',
  },
  {
    id: 3,
    title: 'Follow-up nach Tag 3 ist entscheidend für Demo-Conversion',
    content: 'Analyse von 127 Demo-Calls: Deals die nach Tag 3 (not nach Tag 7) gefolgt wurden, konvertierten 2.4x häufiger. Optimal: Automatisches Follow-up Email nach 72h mit Case Study.',
    category: 'pattern',
    tags: ['sales', 'conversion', 'follow-up'],
    importance: 5,
    source: 'agent',
    date: '20. Mai 2026',
  },
  {
    id: 4,
    title: 'Investor-Gespräch Vorbereitung: 3 Key-Metriken',
    content: 'Thomas Weber (VC) möchte immer sehen: 1) MRR-Wachstumsrate MoM, 2) CAC/LTV Ratio, 3) Churn Rate Trend. Nie ohne diese 3 Metriken in ein Investor-Meeting.',
    category: 'decision',
    tags: ['investor', 'fundraising', 'metrics'],
    importance: 5,
    source: 'manual',
    date: '15. Mai 2026',
  },
  {
    id: 5,
    title: 'Chatbot reduziert Website-Conversion um 12%',
    content: 'Test: KI-Chatbot auf Website für 30 Tage. Ergebnis: Conversion Rate von 3.8% auf 3.4% gesunken. Nutzer in B2B-Kontext wollen bei Erstanfragen mit echten Menschen sprechen. Chatbot entfernt.',
    category: 'result',
    tags: ['product', 'conversion', 'chatbot', 'experiment'],
    importance: 4,
    source: 'weekly_review',
    date: '10. Mai 2026',
  },
  {
    id: 6,
    title: 'Team-Entscheidungen brauchen klares Framework',
    content: 'Problem: Zu viele endlose Diskussionen ohne Entscheidung. Lösung eingeführt: "7-Minuten Regel" — nach 7 Min Diskussion entscheidet der Responsible alleine. Effizienz gestiegen.',
    category: 'decision',
    tags: ['team', 'management', 'process'],
    importance: 3,
    source: 'manual',
    date: '5. Mai 2026',
  },
]

const categoryConfig = {
  learning: { color: '#3b82f6', label: 'Learning', badgeVariant: 'blue' as const },
  pattern: { color: '#f59e0b', label: 'Muster', badgeVariant: 'gold' as const },
  decision: { color: '#8b5cf6', label: 'Entscheidung', badgeVariant: 'purple' as const },
  result: { color: '#22c55e', label: 'Ergebnis', badgeVariant: 'green' as const },
}

const sourceLabels: Record<string, string> = {
  weekly_review: 'Weekly Review',
  manual: 'Manuell',
  agent: 'FRANK Agent',
  learning_queue: 'Learning Queue',
}

interface LearningProposal {
  id: string
  title: string
  description: string
  category: string
  evidence?: string
  impact: string
  status: string
  confirmedAt?: string
  rejectedAt?: string
  source: string
  createdAt: string
}

const impactConfig: Record<string, { color: string; label: string }> = {
  high: { color: '#ef4444', label: 'Hoch' },
  medium: { color: '#f59e0b', label: 'Mittel' },
  low: { color: '#64748b', label: 'Niedrig' },
}

const categoryLabels: Record<string, string> = {
  strategy: 'Strategie',
  outreach: 'Outreach',
  content: 'Content',
  process: 'Prozess',
  target_group: 'Zielgruppe',
}

export default function MemoryPage() {
  const [activeTab, setActiveTab] = useState<'memory' | 'learning'>('memory')
  const [proposals, setProposals] = useState<LearningProposal[]>([])
  const [loadingProposals, setLoadingProposals] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    if (activeTab === 'learning') {
      fetchProposals()
    }
  }, [activeTab])

  async function fetchProposals() {
    setLoadingProposals(true)
    try {
      const res = await fetch('/api/learning')
      const data = await res.json()
      setProposals(data)
    } catch (err) {
      console.error('Error fetching proposals:', err)
    } finally {
      setLoadingProposals(false)
    }
  }

  async function handleAction(id: string, action: 'confirm' | 'reject') {
    setActionLoading(id + action)
    try {
      const res = await fetch('/api/learning', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      })
      if (res.ok) {
        await fetchProposals()
      }
    } catch (err) {
      console.error('Error updating proposal:', err)
    } finally {
      setActionLoading(null)
    }
  }

  const pending = proposals.filter(p => p.status === 'pending')
  const confirmed = proposals.filter(p => p.status === 'confirmed')
  const rejected = proposals.filter(p => p.status === 'rejected')

  return (
    <div>
      <Header
        title="Memory Engine"
        subtitle="Institutionelles Wissen, Muster & Learnings für OKUN Systems"
      />
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Gesamt Einträge', value: memories.length.toString(), color: '#f59e0b' },
            { label: 'Learnings', value: '2', color: '#3b82f6' },
            { label: 'Muster', value: '2', color: '#f59e0b' },
            { label: 'Wichtigkeit Ø', value: '4.3/5', color: '#22c55e' },
          ].map((stat) => (
            <div key={stat.label} className="card p-4">
              <p style={{ color: '#64748b', fontSize: '11px', fontWeight: 500 }} className="mb-1">{stat.label}</p>
              <p style={{ color: stat.color, fontSize: '24px', fontWeight: 700 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1" style={{ borderBottom: '1px solid #1e2130', paddingBottom: '0' }}>
          <button
            onClick={() => setActiveTab('memory')}
            style={{
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: 600,
              color: activeTab === 'memory' ? '#f59e0b' : '#64748b',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'memory' ? '2px solid #f59e0b' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'all 0.15s',
            } as React.CSSProperties}
          >
            <div className="flex items-center gap-1.5">
              <Database size={12} />
              Wissensdatenbank
            </div>
          </button>
          <button
            onClick={() => setActiveTab('learning')}
            style={{
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: 600,
              color: activeTab === 'learning' ? '#f59e0b' : '#64748b',
              borderBottom: activeTab === 'learning' ? '2px solid #f59e0b' : '2px solid transparent',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s',
            } as React.CSSProperties}
          >
            <div className="flex items-center gap-1.5">
              <Brain size={12} />
              Learning Queue
              {pending.length > 0 && (
                <span
                  style={{
                    backgroundColor: '#f59e0b',
                    color: '#000',
                    fontSize: '9px',
                    fontWeight: 700,
                    padding: '1px 5px',
                    borderRadius: '9999px',
                  }}
                >
                  {pending.length}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Memory Tab */}
        {activeTab === 'memory' && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }} className="uppercase tracking-widest">
                  Wissensdatenbank ({memories.length})
                </h2>
                <div
                  style={{ backgroundColor: '#111318', border: '1px solid #1e2130', borderRadius: '6px', padding: '4px 10px' }}
                  className="flex items-center gap-1"
                >
                  <Search size={11} style={{ color: '#475569' }} />
                  <input
                    type="text"
                    placeholder="Suchen..."
                    style={{ backgroundColor: 'transparent', color: '#f1f5f9', outline: 'none', fontSize: '11px', width: '120px' }}
                  />
                </div>
              </div>
              <Button variant="gold" size="sm">
                <Plus size={12} />
                Eintrag hinzufügen
              </Button>
            </div>

            <div className="space-y-3">
              {memories.map((memory) => {
                const category = categoryConfig[memory.category as keyof typeof categoryConfig]
                return (
                  <div key={memory.id} className="card p-4 card-hover">
                    <div className="flex items-start gap-4">
                      <div
                        style={{
                          backgroundColor: `${category.color}15`,
                          border: `1px solid ${category.color}30`,
                          borderRadius: '8px',
                          padding: '8px',
                          flexShrink: 0,
                        }}
                      >
                        <Database size={14} style={{ color: category.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 600 }}>{memory.title}</h3>
                          <Badge variant={category.badgeVariant}>{category.label}</Badge>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={9}
                                style={{ color: i < memory.importance ? '#f59e0b' : '#1e2130' }}
                                fill={i < memory.importance ? '#f59e0b' : 'none'}
                              />
                            ))}
                          </div>
                        </div>
                        <p style={{ color: '#64748b', fontSize: '12px', lineHeight: 1.5 }} className="mb-2">
                          {memory.content}
                        </p>
                        <div className="flex items-center gap-3 flex-wrap">
                          {memory.tags.map((tag) => (
                            <span
                              key={tag}
                              style={{
                                color: '#64748b',
                                fontSize: '10px',
                                backgroundColor: '#1e2130',
                                padding: '2px 6px',
                                borderRadius: '4px',
                              }}
                            >
                              #{tag}
                            </span>
                          ))}
                          <span style={{ color: '#475569', fontSize: '10px', marginLeft: 'auto' }}>
                            {sourceLabels[memory.source]} · {memory.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* Learning Queue Tab */}
        {activeTab === 'learning' && (
          <div className="space-y-6">
            {loadingProposals ? (
              <div className="card p-8 text-center">
                <p style={{ color: '#64748b', fontSize: '13px' }}>Learning Queue wird geladen...</p>
              </div>
            ) : proposals.length === 0 ? (
              <div
                style={{
                  background: 'rgba(245,158,11,0.05)',
                  border: '1px solid rgba(245,158,11,0.15)',
                  borderRadius: '12px',
                  padding: '32px',
                  textAlign: 'center',
                }}
              >
                <Lightbulb size={32} style={{ color: '#f59e0b', margin: '0 auto 12px' }} />
                <h3 style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>
                  Frank hat noch keine Vorschläge generiert
                </h3>
                <p style={{ color: '#64748b', fontSize: '12px', lineHeight: 1.6 }}>
                  Sobald FRANK Muster in deinen Daten erkennt, erscheinen hier Lernvorschläge zur Bestätigung.
                  Du kannst auch manuell Vorschläge hinzufügen.
                </p>
              </div>
            ) : (
              <>
                {/* Pending Proposals */}
                {pending.length > 0 && (
                  <div>
                    <h3
                      style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600, marginBottom: '12px' }}
                      className="uppercase tracking-widest flex items-center gap-2"
                    >
                      <Clock size={12} style={{ color: '#f59e0b' }} />
                      Ausstehende Vorschläge ({pending.length})
                    </h3>
                    <div className="space-y-3">
                      {pending.map((proposal) => {
                        const impact = impactConfig[proposal.impact] || impactConfig.medium
                        return (
                          <div
                            key={proposal.id}
                            style={{
                              backgroundColor: '#111318',
                              border: '1px solid rgba(245,158,11,0.2)',
                              borderRadius: '10px',
                              padding: '14px',
                            }}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <h4 style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 600 }}>{proposal.title}</h4>
                                  <span
                                    style={{
                                      backgroundColor: `${impact.color}15`,
                                      color: impact.color,
                                      fontSize: '10px',
                                      padding: '2px 6px',
                                      borderRadius: '4px',
                                      fontWeight: 500,
                                    }}
                                  >
                                    {impact.label} Impact
                                  </span>
                                  <span
                                    style={{
                                      backgroundColor: '#1e2130',
                                      color: '#64748b',
                                      fontSize: '10px',
                                      padding: '2px 6px',
                                      borderRadius: '4px',
                                    }}
                                  >
                                    {categoryLabels[proposal.category] || proposal.category}
                                  </span>
                                </div>
                                <p style={{ color: '#64748b', fontSize: '12px', lineHeight: 1.5, marginBottom: '8px' }}>
                                  {proposal.description}
                                </p>
                                {proposal.evidence && (
                                  <div
                                    style={{
                                      backgroundColor: 'rgba(59,130,246,0.06)',
                                      border: '1px solid rgba(59,130,246,0.15)',
                                      borderRadius: '6px',
                                      padding: '8px 10px',
                                      marginBottom: '8px',
                                    }}
                                  >
                                    <p style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 600, marginBottom: '2px' }} className="uppercase tracking-wider">
                                      Evidenz
                                    </p>
                                    <p style={{ color: '#64748b', fontSize: '11px' }}>{proposal.evidence}</p>
                                  </div>
                                )}
                                <span style={{ color: '#475569', fontSize: '10px' }}>
                                  Von {proposal.source === 'frank' ? 'FRANK AI' : proposal.source} · {new Date(proposal.createdAt).toLocaleDateString('de-DE')}
                                </span>
                              </div>
                              <div className="flex flex-col gap-2">
                                <button
                                  onClick={() => handleAction(proposal.id, 'confirm')}
                                  disabled={actionLoading === proposal.id + 'confirm'}
                                  style={{
                                    backgroundColor: 'rgba(34,197,94,0.1)',
                                    border: '1px solid rgba(34,197,94,0.3)',
                                    color: '#22c55e',
                                    borderRadius: '6px',
                                    padding: '6px 12px',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    opacity: actionLoading ? 0.7 : 1,
                                  }}
                                >
                                  <CheckCircle2 size={12} />
                                  Bestätigen
                                </button>
                                <button
                                  onClick={() => handleAction(proposal.id, 'reject')}
                                  disabled={actionLoading === proposal.id + 'reject'}
                                  style={{
                                    backgroundColor: 'rgba(239,68,68,0.1)',
                                    border: '1px solid rgba(239,68,68,0.3)',
                                    color: '#ef4444',
                                    borderRadius: '6px',
                                    padding: '6px 12px',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    opacity: actionLoading ? 0.7 : 1,
                                  }}
                                >
                                  <XCircle size={12} />
                                  Ablehnen
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Confirmed Proposals */}
                {confirmed.length > 0 && (
                  <div>
                    <h3
                      style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600, marginBottom: '12px' }}
                      className="uppercase tracking-widest flex items-center gap-2"
                    >
                      <CheckCircle2 size={12} style={{ color: '#22c55e' }} />
                      Bestätigte Learnings ({confirmed.length})
                    </h3>
                    <div className="space-y-2">
                      {confirmed.map((proposal) => (
                        <div
                          key={proposal.id}
                          style={{
                            backgroundColor: 'rgba(34,197,94,0.04)',
                            border: '1px solid rgba(34,197,94,0.15)',
                            borderRadius: '8px',
                            padding: '10px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                          }}
                        >
                          <CheckCircle2 size={14} style={{ color: '#22c55e', flexShrink: 0 }} />
                          <div className="flex-1">
                            <p style={{ color: '#f1f5f9', fontSize: '12px', fontWeight: 500 }}>{proposal.title}</p>
                            <p style={{ color: '#475569', fontSize: '10px' }}>
                              Bestätigt am {proposal.confirmedAt ? new Date(proposal.confirmedAt).toLocaleDateString('de-DE') : '—'}
                            </p>
                          </div>
                          <span
                            style={{
                              backgroundColor: '#1e2130',
                              color: '#64748b',
                              fontSize: '10px',
                              padding: '2px 6px',
                              borderRadius: '4px',
                            }}
                          >
                            {categoryLabels[proposal.category] || proposal.category}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rejected Proposals */}
                {rejected.length > 0 && (
                  <div>
                    <h3
                      style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600, marginBottom: '12px' }}
                      className="uppercase tracking-widest flex items-center gap-2"
                    >
                      <XCircle size={12} style={{ color: '#ef4444' }} />
                      Abgelehnte Vorschläge ({rejected.length})
                    </h3>
                    <div className="space-y-2">
                      {rejected.map((proposal) => (
                        <div
                          key={proposal.id}
                          style={{
                            backgroundColor: 'rgba(239,68,68,0.03)',
                            border: '1px solid rgba(239,68,68,0.1)',
                            borderRadius: '8px',
                            padding: '10px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            opacity: 0.7,
                          }}
                        >
                          <XCircle size={14} style={{ color: '#ef4444', flexShrink: 0 }} />
                          <div className="flex-1">
                            <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 500 }}>{proposal.title}</p>
                            <p style={{ color: '#475569', fontSize: '10px' }}>
                              Abgelehnt am {proposal.rejectedAt ? new Date(proposal.rejectedAt).toLocaleDateString('de-DE') : '—'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
