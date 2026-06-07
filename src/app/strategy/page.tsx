'use client'

import Header from '@/components/layout/Header'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Brain, Plus, FlaskConical, Lightbulb, BarChart2, CheckCircle, XCircle, Clock, Shield, AlertTriangle, ChevronRight } from 'lucide-react'

const strategies = [
  {
    id: 1,
    title: 'Product-Led Growth Strategie',
    description: 'Freemium-Modell einführen um organisches Wachstum durch Produktnutzung zu treiben. Ziel: 40% der Neukunden über PLG-Funnel.',
    type: 'strategy',
    status: 'active',
    priority: 1,
    hypothesis: null,
    result: null,
  },
  {
    id: 2,
    title: 'Enterprise Outbound Sales',
    description: 'Direkter Outbound-Ansatz für Unternehmen 50-500 MA im DACH-Raum. Fokus auf Automatisierung & AI-Use-Cases.',
    type: 'strategy',
    status: 'active',
    priority: 2,
    hypothesis: null,
    result: null,
  },
  {
    id: 3,
    title: 'LinkedIn als primärer Akquisitionskanal',
    description: 'Test: 90 Tage intensive LinkedIn-Präsenz mit täglichen Posts & gezieltem Outreach erhöht Inbound-Leads um 150%.',
    type: 'hypothesis',
    status: 'testing',
    priority: 1,
    hypothesis: 'Daily LinkedIn content + targeted DMs → +150% Inbound Leads in 90 Tagen',
    result: null,
  },
  {
    id: 4,
    title: 'Video-Content für B2B Lead Gen',
    description: 'Experiment: 4 Wochen YouTube-Tutorial-Serie zu AI-Automatisierung → Leads messen.',
    type: 'experiment',
    status: 'testing',
    priority: 2,
    hypothesis: 'Educational Video Content → qualifizierte B2B Leads',
    result: null,
  },
  {
    id: 5,
    title: 'Cold Email Outreach',
    description: '30-Tage Test mit personalisiertem Cold Email Outreach an 500 Prospects.',
    type: 'experiment',
    status: 'validated',
    priority: 3,
    hypothesis: 'Personalisierte Cold Emails → 5%+ Reply Rate',
    result: 'Ergebnis: 3.2% Reply Rate. Unter Hypothese, aber profitabel. Weiter optimieren.',
  },
  {
    id: 6,
    title: 'Chatbot für Lead Qualifizierung',
    description: 'KI-Chatbot auf Website zur automatischen Lead-Qualifizierung einsetzen.',
    type: 'experiment',
    status: 'failed',
    priority: 2,
    hypothesis: 'Chatbot → Conversion Rate +25%',
    result: 'Ergebnis: Conversion sank um 12%. Nutzer bevorzugen menschlichen Kontakt in dieser Phase.',
  },
]

const typeConfig = {
  strategy: { icon: Brain, color: '#f59e0b', label: 'Strategie', badgeVariant: 'gold' as const },
  hypothesis: { icon: Lightbulb, color: '#3b82f6', label: 'Hypothese', badgeVariant: 'blue' as const },
  experiment: { icon: FlaskConical, color: '#8b5cf6', label: 'Experiment', badgeVariant: 'purple' as const },
}

const statusConfig = {
  active: { icon: BarChart2, color: '#22c55e', label: 'Aktiv' },
  testing: { icon: Clock, color: '#f97316', label: 'Im Test' },
  validated: { icon: CheckCircle, color: '#22c55e', label: 'Validiert' },
  failed: { icon: XCircle, color: '#ef4444', label: 'Gescheitert' },
}

export default function StrategyPage() {
  return (
    <div>
      <Header
        title="Strategic Brain"
        subtitle="Strategien, Hypothesen & Experimente — von der Idee zur Validierung"
      />
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Aktive Strategien', value: '2', color: '#f59e0b' },
            { label: 'Im Test', value: '2', color: '#f97316' },
            { label: 'Validiert', value: '1', color: '#22c55e' },
            { label: 'Gescheitert', value: '1', color: '#ef4444' },
          ].map((stat) => (
            <div key={stat.label} className="card p-4">
              <p style={{ color: '#64748b', fontSize: '11px', fontWeight: 500 }} className="mb-1">{stat.label}</p>
              <p style={{ color: stat.color, fontSize: '24px', fontWeight: 700 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <h2 style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }} className="uppercase tracking-widest">
            Alle Strategien & Experimente
          </h2>
          <Button variant="gold" size="sm">
            <Plus size={12} />
            Neue Strategie
          </Button>
        </div>

        {/* BAFA Strategic Project */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(217,119,6,0.04) 100%)',
            border: '2px solid rgba(245,158,11,0.4)',
            borderRadius: '12px',
            padding: '16px',
          }}
        >
          <div className="flex items-start gap-4">
            <div
              style={{
                backgroundColor: 'rgba(245,158,11,0.15)',
                border: '1px solid rgba(245,158,11,0.3)',
                borderRadius: '8px',
                padding: '10px',
                flexShrink: 0,
              }}
            >
              <Shield size={20} style={{ color: '#f59e0b' }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: 700 }}>
                  BAFA-Beraterstatus
                </h3>
                <span
                  style={{
                    backgroundColor: 'rgba(245,158,11,0.15)',
                    border: '1px solid rgba(245,158,11,0.3)',
                    color: '#f59e0b',
                    fontSize: '10px',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: 700,
                  }}
                >
                  STRATEGISCHES PROJEKT
                </span>
                <div className="flex items-center gap-1">
                  <Clock size={10} style={{ color: '#f97316' }} />
                  <span style={{ color: '#f97316', fontSize: '11px', fontWeight: 500 }}>In Bearbeitung</span>
                </div>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '12px', lineHeight: 1.6, marginBottom: '12px' }}>
                BAFA-Zulassung als Unternehmensberater ermöglicht es, Förderprogramme für KMU-Kunden zugänglich zu machen.
                Positioniert OKUN Systems als offiziell anerkannten Berater mit staatlicher Legitimation.
              </p>

              <div className="grid grid-cols-3 gap-3 mb-3">
                <div
                  style={{
                    backgroundColor: '#111318',
                    border: '1px solid #1e2130',
                    borderRadius: '8px',
                    padding: '10px',
                  }}
                >
                  <p style={{ color: '#64748b', fontSize: '10px', fontWeight: 500, marginBottom: '4px' }}>Status</p>
                  <p style={{ color: '#f59e0b', fontSize: '12px', fontWeight: 600 }}>Antrag vorbereiten</p>
                </div>
                <div
                  style={{
                    backgroundColor: '#111318',
                    border: '1px solid #1e2130',
                    borderRadius: '8px',
                    padding: '10px',
                  }}
                >
                  <p style={{ color: '#64748b', fontSize: '10px', fontWeight: 500, marginBottom: '4px' }}>Nächste Deadline</p>
                  <p style={{ color: '#ef4444', fontSize: '12px', fontWeight: 600 }}>Q3 2026</p>
                </div>
                <div
                  style={{
                    backgroundColor: '#111318',
                    border: '1px solid #1e2130',
                    borderRadius: '8px',
                    padding: '10px',
                  }}
                >
                  <p style={{ color: '#64748b', fontSize: '10px', fontWeight: 500, marginBottom: '4px' }}>Risiko</p>
                  <p style={{ color: '#f97316', fontSize: '12px', fontWeight: 600 }}>Mittel</p>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#111318',
                  border: '1px solid #1e2130',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  marginBottom: '10px',
                }}
              >
                <p style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 600, marginBottom: '8px' }} className="uppercase tracking-wider">
                  Offene Schritte
                </p>
                {[
                  'Nachweis über Berufserfahrung (mind. 3 Jahre) zusammenstellen',
                  'Qualifikationsnachweise & Zertifikate aufbereiten',
                  'BAFA-Antrag ausfüllen und einreichen',
                  'Erstes gefördertes Beratungsprojekt durchführen',
                  'Qualitätssicherungs-Maßnahmen dokumentieren',
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-2 mb-1.5">
                    <ChevronRight size={10} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
                    <p style={{ color: '#64748b', fontSize: '11px' }}>{step}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <AlertTriangle size={12} style={{ color: '#f59e0b' }} />
                <p style={{ color: '#94a3b8', fontSize: '11px' }}>
                  <span style={{ color: '#f59e0b', fontWeight: 600 }}>Risiko:</span> Verzögerung gefährdet Ziel für BAFA-Beraterstatus in 2026. Priorisierung empfohlen.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {strategies.map((strategy) => {
            const typeInfo = typeConfig[strategy.type as keyof typeof typeConfig]
            const statusInfo = statusConfig[strategy.status as keyof typeof statusConfig]
            const TypeIcon = typeInfo.icon
            const StatusIcon = statusInfo.icon

            return (
              <div key={strategy.id} className="card p-4">
                <div className="flex items-start gap-4">
                  <div
                    style={{
                      backgroundColor: `${typeInfo.color}15`,
                      border: `1px solid ${typeInfo.color}30`,
                      borderRadius: '8px',
                      padding: '8px',
                      flexShrink: 0,
                    }}
                  >
                    <TypeIcon size={16} style={{ color: typeInfo.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 600 }}>{strategy.title}</h3>
                      <Badge variant={typeInfo.badgeVariant}>{typeInfo.label}</Badge>
                      <div className="flex items-center gap-1">
                        <StatusIcon size={10} style={{ color: statusInfo.color }} />
                        <span style={{ color: statusInfo.color, fontSize: '11px', fontWeight: 500 }}>{statusInfo.label}</span>
                      </div>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '12px', lineHeight: 1.5 }} className="mb-2">
                      {strategy.description}
                    </p>
                    {strategy.hypothesis && (
                      <div
                        style={{
                          backgroundColor: 'rgba(59,130,246,0.08)',
                          border: '1px solid rgba(59,130,246,0.2)',
                          borderRadius: '6px',
                          padding: '8px 10px',
                          marginBottom: '8px',
                        }}
                      >
                        <p style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 600 }} className="mb-0.5 uppercase tracking-wider">Hypothese</p>
                        <p style={{ color: '#f1f5f9', fontSize: '11px' }}>{strategy.hypothesis}</p>
                      </div>
                    )}
                    {strategy.result && (
                      <div
                        style={{
                          backgroundColor: strategy.status === 'validated' ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
                          border: `1px solid ${strategy.status === 'validated' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
                          borderRadius: '6px',
                          padding: '8px 10px',
                        }}
                      >
                        <p style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 600 }} className="mb-0.5 uppercase tracking-wider">Ergebnis</p>
                        <p style={{ color: '#f1f5f9', fontSize: '11px' }}>{strategy.result}</p>
                      </div>
                    )}
                  </div>
                  <div style={{ color: '#475569', fontSize: '11px' }}>P{strategy.priority}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
