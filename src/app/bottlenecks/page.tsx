'use client'

import Header from '@/components/layout/Header'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { AlertTriangle, Plus, Clock, CheckCircle, ArrowRight } from 'lucide-react'

const bottlenecks = [
  {
    id: 1,
    title: 'Sales Funnel Conversion zu niedrig',
    description: 'Lead-zu-Kunde Conversion Rate liegt bei 3.2% statt dem Ziel von 8%. Hauptursachen: zu langer Demo-Prozess (avg 3 Wochen) und fehlende automatische Follow-ups.',
    impact: 'critical',
    status: 'open',
    area: 'sales',
    duration: '12 Tage',
    actions: ['Demo-Prozess auf max. 1 Woche verkürzen', 'Follow-up Sequenz mit 5 Touchpoints einrichten', 'Demo-Script optimieren'],
  },
  {
    id: 2,
    title: 'Manuelle Onboarding-Prozesse',
    description: 'Kunden-Onboarding dauert durchschnittlich 8 Tage und blockiert das Team mit manuellen Tasks. Skalierung limitiert.',
    impact: 'high',
    status: 'in_progress',
    area: 'operations',
    duration: '3 Wochen',
    actions: ['Onboarding-Checklist automatisieren', 'Self-Service-Portal bauen', 'Loom-Video-Onboarding erstellen'],
  },
  {
    id: 3,
    title: 'LinkedIn Content Inkonsistenz',
    description: 'Posting-Frequenz sank von 5x/Woche auf 2x/Woche. Engagement und Reichweite gesunken.',
    impact: 'medium',
    status: 'open',
    area: 'marketing',
    duration: '5 Tage',
    actions: ['Content-Kalender für 4 Wochen erstellen', 'Content-Agent für automatische Drafts aktivieren'],
  },
  {
    id: 4,
    title: 'Fehlende Product Analytics',
    description: 'Keine Daten über Nutzerverhalten im Produkt. Können nicht identifizieren, welche Features genutzt werden.',
    impact: 'medium',
    status: 'in_progress',
    area: 'product',
    duration: '4 Wochen',
    actions: ['Mixpanel Integration implementieren', 'Key Events definieren & tracken'],
  },
  {
    id: 5,
    title: 'Kein CRM-System',
    description: 'Sales-Prozess läuft über Spreadsheets. Keine Pipeline-Sichtbarkeit, Leads gehen verloren.',
    impact: 'high',
    status: 'resolved',
    area: 'sales',
    duration: '6 Wochen',
    actions: ['HubSpot eingerichtet', 'Pipeline konfiguriert', 'Team trainiert'],
  },
]

const impactConfig = {
  critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)', label: 'Kritisch', badgeVariant: 'red' as const },
  high: { color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.2)', label: 'Hoch', badgeVariant: 'orange' as const },
  medium: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', label: 'Mittel', badgeVariant: 'gold' as const },
  low: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)', label: 'Niedrig', badgeVariant: 'blue' as const },
}

const statusConfig = {
  open: { color: '#ef4444', label: 'Offen', icon: AlertTriangle },
  in_progress: { color: '#f59e0b', label: 'In Bearbeitung', icon: Clock },
  resolved: { color: '#22c55e', label: 'Gelöst', icon: CheckCircle },
}

const areaLabels: Record<string, string> = {
  sales: 'Sales',
  operations: 'Operations',
  marketing: 'Marketing',
  product: 'Produkt',
}

export default function BottlenecksPage() {
  const open = bottlenecks.filter(b => b.status === 'open').length
  const inProgress = bottlenecks.filter(b => b.status === 'in_progress').length
  const resolved = bottlenecks.filter(b => b.status === 'resolved').length
  const critical = bottlenecks.filter(b => b.impact === 'critical').length

  return (
    <div>
      <Header
        title="Bottleneck Engine"
        subtitle="Identifiziere, priorisiere und löse kritische Engpässe im Unternehmen"
      />
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Offen', value: open, color: '#ef4444' },
            { label: 'In Bearbeitung', value: inProgress, color: '#f59e0b' },
            { label: 'Gelöst', value: resolved, color: '#22c55e' },
            { label: 'Kritisch', value: critical, color: '#ef4444' },
          ].map((stat) => (
            <div key={stat.label} className="card p-4">
              <p style={{ color: '#64748b', fontSize: '11px', fontWeight: 500 }} className="mb-1">{stat.label}</p>
              <p style={{ color: stat.color, fontSize: '24px', fontWeight: 700 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <h2 style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }} className="uppercase tracking-widest">
            Alle Engpässe ({bottlenecks.length})
          </h2>
          <Button variant="gold" size="sm">
            <Plus size={12} />
            Engpass melden
          </Button>
        </div>

        <div className="space-y-3">
          {bottlenecks.map((b) => {
            const impact = impactConfig[b.impact as keyof typeof impactConfig]
            const statusInfo = statusConfig[b.status as keyof typeof statusConfig]
            const StatusIcon = statusInfo.icon

            return (
              <div key={b.id} className="card p-4">
                <div className="flex items-start gap-4">
                  <div
                    style={{
                      backgroundColor: impact.bg,
                      border: `1px solid ${impact.border}`,
                      borderRadius: '8px',
                      padding: '8px',
                      flexShrink: 0,
                    }}
                  >
                    <AlertTriangle size={16} style={{ color: impact.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 600 }}>{b.title}</h3>
                      <Badge variant={impact.badgeVariant}>{impact.label}</Badge>
                      <Badge variant="gray">{areaLabels[b.area]}</Badge>
                      <div className="flex items-center gap-1">
                        <StatusIcon size={10} style={{ color: statusInfo.color }} />
                        <span style={{ color: statusInfo.color, fontSize: '11px', fontWeight: 500 }}>{statusInfo.label}</span>
                      </div>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '12px', lineHeight: 1.5 }} className="mb-3">
                      {b.description}
                    </p>
                    {/* Actions */}
                    <div className="space-y-1 mb-2">
                      {b.actions.map((action, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <ArrowRight size={10} style={{ color: impact.color, flexShrink: 0 }} />
                          <span style={{ color: '#94a3b8', fontSize: '11px' }}>{action}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      <Clock size={11} style={{ color: '#475569' }} />
                      <span style={{ color: '#475569', fontSize: '11px' }}>Besteht seit {b.duration}</span>
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
