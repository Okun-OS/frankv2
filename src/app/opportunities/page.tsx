'use client'

import Header from '@/components/layout/Header'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Rocket, Plus, Clock, CheckCircle, ArrowRight, Star } from 'lucide-react'

const opportunities = [
  {
    id: 1,
    title: 'DACH Enterprise Partnership',
    description: '3 Enterprise-Kunden (50-200 MA) haben Interesse an Partnership-Modell signalisiert. Potenzial für white-label oder reseller agreement.',
    potential: 'very_high',
    timeframe: '14 Tage',
    status: 'pursuing',
    area: 'partnership',
    estimatedValue: '€180K ARR',
    actions: ['Erstgespräch mit ACME GmbH vereinbaren', 'Partnership-Proposal erstellen', 'Legal Review starten'],
  },
  {
    id: 2,
    title: 'LinkedIn Thought Leadership Kampagne',
    description: 'Konkurrenten reduzieren LinkedIn-Budget. Perfekter Zeitpunkt für aggressive Content-Strategie. Organische Reichweite um 300% steigerbar.',
    potential: 'high',
    timeframe: '7 Tage',
    status: 'identified',
    area: 'marketing',
    estimatedValue: '+80 Leads/Monat',
    actions: ['Content-Kalender Q3 erstellen', 'Ghostwriter engagieren', 'LinkedIn Ads testen'],
  },
  {
    id: 3,
    title: 'AI-Automatisierung für KMUs Seminar',
    description: 'Lokale IHK sucht Referenten für "AI im Mittelstand" Event mit 200+ Teilnehmern. Massive Brand-Awareness Opportunity.',
    potential: 'high',
    timeframe: '21 Tage',
    status: 'pursuing',
    area: 'marketing',
    estimatedValue: '200+ Leads',
    actions: ['Anmeldung bei IHK einreichen', 'Präsentation vorbereiten', 'Follow-up Funnel einrichten'],
  },
  {
    id: 4,
    title: 'Bestands-Kunden Upsell-Kampagne',
    description: '47 Kunden im Basic-Plan könnten auf Pro upgraden. Kein Upgrade-Angebot seit 6 Monaten. Low-Hanging Fruit.',
    potential: 'high',
    timeframe: '14 Tage',
    status: 'identified',
    area: 'sales',
    estimatedValue: '+€12K MRR',
    actions: ['Upsell-Email-Sequenz schreiben', 'Kunden-Segmentierung durchführen', 'Angebot formulieren'],
  },
  {
    id: 5,
    title: 'Google Ads für B2B Intents',
    description: 'Keyword-Analyse zeigt: Konkurrenten bieten nicht auf "AI Automatisierung Mittelstand". CPCs unter €3.',
    potential: 'medium',
    timeframe: '30 Tage',
    status: 'identified',
    area: 'marketing',
    estimatedValue: '+30 Leads/Monat',
    actions: ['Keyword-Research abschließen', 'Ad-Budget festlegen', 'Landing Pages erstellen'],
  },
  {
    id: 6,
    title: 'Partnerschaft mit HubSpot Agentur',
    description: 'Lokale HubSpot-Agentur sucht AI-Partner. Gegenseitige Empfehlungen könnten 10+ warme Leads/Monat bringen.',
    potential: 'medium',
    timeframe: '21 Tage',
    status: 'converted',
    area: 'partnership',
    estimatedValue: '10+ Leads/Monat',
    actions: ['Partnership-Agreement unterzeichnet', 'Erste gegenseitige Empfehlungen aktiv'],
  },
]

const potentialConfig = {
  very_high: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)', label: 'Sehr Hoch', badgeVariant: 'green' as const, stars: 4 },
  high: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', label: 'Hoch', badgeVariant: 'gold' as const, stars: 3 },
  medium: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)', label: 'Mittel', badgeVariant: 'blue' as const, stars: 2 },
  low: { color: '#64748b', bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.2)', label: 'Niedrig', badgeVariant: 'gray' as const, stars: 1 },
}

const statusConfig = {
  identified: { color: '#3b82f6', label: 'Identifiziert' },
  pursuing: { color: '#f59e0b', label: 'In Bearbeitung' },
  converted: { color: '#22c55e', label: 'Konvertiert' },
  dismissed: { color: '#ef4444', label: 'Abgelehnt' },
}

export default function OpportunitiesPage() {
  const identified = opportunities.filter(o => o.status === 'identified').length
  const pursuing = opportunities.filter(o => o.status === 'pursuing').length
  const converted = opportunities.filter(o => o.status === 'converted').length

  return (
    <div>
      <Header
        title="Opportunity Engine"
        subtitle="Identifiziere, bewerte und verfolge Wachstumschancen für OKUN Systems"
      />
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Identifiziert', value: identified, color: '#3b82f6' },
            { label: 'In Bearbeitung', value: pursuing, color: '#f59e0b' },
            { label: 'Konvertiert', value: converted, color: '#22c55e' },
            { label: 'Geschätzter Wert', value: '€290K+', color: '#f59e0b' },
          ].map((stat) => (
            <div key={stat.label} className="card p-4">
              <p style={{ color: '#64748b', fontSize: '11px', fontWeight: 500 }} className="mb-1">{stat.label}</p>
              <p style={{ color: stat.color, fontSize: '24px', fontWeight: 700 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <h2 style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }} className="uppercase tracking-widest">
            Alle Opportunities ({opportunities.length})
          </h2>
          <Button variant="gold" size="sm">
            <Plus size={12} />
            Neue Opportunity
          </Button>
        </div>

        <div className="space-y-3">
          {opportunities.map((opp) => {
            const potential = potentialConfig[opp.potential as keyof typeof potentialConfig]
            const statusInfo = statusConfig[opp.status as keyof typeof statusConfig]

            return (
              <div key={opp.id} className="card p-4">
                <div className="flex items-start gap-4">
                  <div
                    style={{
                      backgroundColor: potential.bg,
                      border: `1px solid ${potential.border}`,
                      borderRadius: '8px',
                      padding: '8px',
                      flexShrink: 0,
                    }}
                  >
                    <Rocket size={16} style={{ color: potential.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 600 }}>{opp.title}</h3>
                      <Badge variant={potential.badgeVariant}>{potential.label}</Badge>
                      <span style={{ color: statusInfo.color, fontSize: '11px', fontWeight: 500 }}>{statusInfo.label}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Star
                          key={i}
                          size={10}
                          style={{ color: i < potential.stars ? potential.color : '#1e2130' }}
                          fill={i < potential.stars ? potential.color : 'none'}
                        />
                      ))}
                    </div>
                    <p style={{ color: '#64748b', fontSize: '12px', lineHeight: 1.5 }} className="mb-2">
                      {opp.description}
                    </p>
                    <div className="flex items-center gap-4 mb-2">
                      <div style={{ color: '#22c55e', fontSize: '12px', fontWeight: 600 }}>
                        Est. Wert: {opp.estimatedValue}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={11} style={{ color: '#475569' }} />
                        <span style={{ color: '#475569', fontSize: '11px' }}>Zeitfenster: {opp.timeframe}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {opp.actions.map((action, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <ArrowRight size={10} style={{ color: potential.color, flexShrink: 0 }} />
                          <span style={{ color: '#94a3b8', fontSize: '11px' }}>{action}</span>
                        </div>
                      ))}
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
