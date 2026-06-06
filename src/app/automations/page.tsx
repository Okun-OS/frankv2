'use client'

import Header from '@/components/layout/Header'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Zap, Plus, Play, Pause, CheckCircle, Clock, AlertTriangle, ArrowRight } from 'lucide-react'

const automations = [
  {
    id: 1,
    name: 'KPI Alert: Revenue unter Ziel',
    trigger: 'kpi_threshold',
    condition: 'Revenue < 80% des Monatsziels',
    action: 'Slack-Nachricht + FRANK Analyse starten',
    isActive: true,
    lastRun: 'Noch nie ausgelöst',
    runs: 0,
    description: 'Sendet sofortigen Alert wenn monatlicher Revenue unter 80% des Ziels fällt.',
  },
  {
    id: 2,
    name: 'Wöchentliches Review Reminder',
    trigger: 'time_based',
    condition: 'Jeden Freitag um 16:00 Uhr',
    action: 'Email + Dashboard-Notification senden',
    isActive: true,
    lastRun: 'Freitag, 30. Mai 2026',
    runs: 22,
    description: 'Erinnert Felix jeden Freitagnachmittag an das wöchentliche Review.',
  },
  {
    id: 3,
    name: 'Neuer Lead: Sofort qualifizieren',
    trigger: 'event_based',
    condition: 'Neuer Lead im CRM erstellt',
    action: 'Sales Agent Lead-Qualifizierung starten',
    isActive: true,
    lastRun: 'Heute, 14:23 Uhr',
    runs: 847,
    description: 'Startet automatisch den Sales Agent zur Lead-Qualifizierung sobald ein neuer Lead erfasst wird.',
  },
  {
    id: 4,
    name: 'Täglich: FRANK Morning Brief',
    trigger: 'time_based',
    condition: 'Täglich um 07:00 Uhr',
    action: 'FRANK Daily Brief generieren + versenden',
    isActive: true,
    lastRun: 'Heute, 07:00 Uhr',
    runs: 147,
    description: 'Generiert täglich den FRANK Morning Brief mit Tagesplan, KPI-Status und Prioritäten.',
  },
  {
    id: 5,
    name: 'Churn Risk Alert',
    trigger: 'event_based',
    condition: 'Kunde 14+ Tage nicht aktiv',
    action: 'Customer Success Task erstellen',
    isActive: true,
    lastRun: 'Gestern, 18:45 Uhr',
    runs: 23,
    description: 'Erstellt automatisch einen Customer Success Task wenn ein Kunde 2+ Wochen inaktiv war.',
  },
  {
    id: 6,
    name: 'LinkedIn Post Reminder',
    trigger: 'time_based',
    condition: 'Täglich um 08:30 Uhr (Mo-Fr)',
    action: 'LinkedIn Content Draft vorschlagen',
    isActive: false,
    lastRun: 'Montag, 1. Jun 2026',
    runs: 18,
    description: 'Schlägt täglich einen LinkedIn Post-Draft vor basierend auf aktuellen Business-Events.',
  },
  {
    id: 7,
    name: 'Goal Progress Update',
    trigger: 'time_based',
    condition: 'Jeden Montag um 09:00 Uhr',
    action: 'Goal Progress berechnen + Dashboard updaten',
    isActive: true,
    lastRun: 'Montag, 2. Jun 2026',
    runs: 22,
    description: 'Berechnet wöchentlich den Fortschritt aller aktiven Ziele und aktualisiert das Dashboard.',
  },
]

const triggerLabels: Record<string, string> = {
  kpi_threshold: 'KPI Schwellenwert',
  time_based: 'Zeitbasiert',
  event_based: 'Ereignisbasiert',
}

const triggerColors: Record<string, string> = {
  kpi_threshold: '#f97316',
  time_based: '#3b82f6',
  event_based: '#8b5cf6',
}

export default function AutomationsPage() {
  const active = automations.filter(a => a.isActive).length
  const totalRuns = automations.reduce((sum, a) => sum + a.runs, 0)

  return (
    <div>
      <Header
        title="Automation Framework"
        subtitle="Automatisiere repetitive Aufgaben und halte FRANK OS am Laufen"
      />
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Aktive Automationen', value: `${active}/${automations.length}`, color: '#22c55e' },
            { label: 'Gesamt Runs', value: totalRuns.toLocaleString(), color: '#f59e0b' },
            { label: 'Zeit gespart', value: '~8h/Woche', color: '#3b82f6' },
            { label: 'Erfolgsrate', value: '99.1%', color: '#22c55e' },
          ].map((stat) => (
            <div key={stat.label} className="card p-4">
              <p style={{ color: '#64748b', fontSize: '11px', fontWeight: 500 }} className="mb-1">{stat.label}</p>
              <p style={{ color: stat.color, fontSize: '24px', fontWeight: 700 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <h2 style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }} className="uppercase tracking-widest">
            Alle Automationen ({automations.length})
          </h2>
          <Button variant="gold" size="sm">
            <Plus size={12} />
            Neue Automation
          </Button>
        </div>

        <div className="space-y-3">
          {automations.map((auto) => {
            const triggerColor = triggerColors[auto.trigger]
            return (
              <div key={auto.id} className="card p-4">
                <div className="flex items-start gap-4">
                  <div
                    style={{
                      backgroundColor: `${triggerColor}15`,
                      border: `1px solid ${triggerColor}30`,
                      borderRadius: '8px',
                      padding: '8px',
                      flexShrink: 0,
                    }}
                  >
                    <Zap size={16} style={{ color: triggerColor }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 600 }}>{auto.name}</h3>
                      <span
                        style={{
                          backgroundColor: `${triggerColor}15`,
                          color: triggerColor,
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: 500,
                        }}
                      >
                        {triggerLabels[auto.trigger]}
                      </span>
                      {auto.isActive ? (
                        <Badge variant="green">Aktiv</Badge>
                      ) : (
                        <Badge variant="gray">Pausiert</Badge>
                      )}
                    </div>
                    <p style={{ color: '#64748b', fontSize: '12px', lineHeight: 1.5 }} className="mb-2">
                      {auto.description}
                    </p>
                    <div className="space-y-1 mb-2">
                      <div className="flex items-center gap-2">
                        <span style={{ color: '#475569', fontSize: '10px', minWidth: '60px', fontWeight: 600 }}>WENN:</span>
                        <span style={{ color: '#94a3b8', fontSize: '11px' }}>{auto.condition}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span style={{ color: '#475569', fontSize: '10px', minWidth: '60px', fontWeight: 600 }}>DANN:</span>
                        <span style={{ color: '#94a3b8', fontSize: '11px' }}>{auto.action}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Clock size={10} style={{ color: '#475569' }} />
                        <span style={{ color: '#475569', fontSize: '10px' }}>Zuletzt: {auto.lastRun}</span>
                      </div>
                      <span style={{ color: '#475569', fontSize: '10px' }}>{auto.runs} Runs</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-white/5">
                      {auto.isActive ? (
                        <Pause size={13} style={{ color: '#64748b' }} />
                      ) : (
                        <Play size={13} style={{ color: '#22c55e' }} />
                      )}
                    </button>
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
