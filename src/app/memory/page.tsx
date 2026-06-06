'use client'

import Header from '@/components/layout/Header'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Database, Plus, Star, Search, Filter } from 'lucide-react'

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
}

export default function MemoryPage() {
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
      </div>
    </div>
  )
}
