'use client'

import Header from '@/components/layout/Header'
import { Badge } from '@/components/ui/Badge'
import {
  User,
  Building2,
  Layers,
  Telescope,
  GitBranch,
  Shield,
  AlertTriangle,
  Star,
  Target,
  ArrowRight,
  Zap,
  Globe,
  Mail,
  BarChart3,
  BookOpen,
  Package,
} from 'lucide-react'

const sectionCardStyle = {
  backgroundColor: '#111318',
  border: '1px solid #1e2130',
  borderRadius: '12px',
  padding: '20px',
}

export default function FounderBlueprintPage() {
  return (
    <div>
      <Header
        title="Founder Blueprint"
        subtitle="Das strategische Gehirn von FRANK — unveränderliche Grundlage für alle Entscheidungen"
      />
      <div className="p-6 space-y-6">

        {/* Section 1: Founder Profile */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <User size={14} style={{ color: '#f59e0b' }} />
            <h2 style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }} className="uppercase tracking-widest">
              1. Founder Profil
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {/* Identity */}
            <div style={sectionCardStyle}>
              <div className="flex items-center gap-3 mb-4">
                <div
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                >
                  <span className="text-white text-sm font-black">FO</span>
                </div>
                <div>
                  <h3 style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: 700 }}>Felix Okun</h3>
                  <p style={{ color: '#64748b', fontSize: '11px' }}>Founder & CEO · OKUN Systems</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Rolle', value: 'Founder & CEO' },
                  { label: 'Unternehmen', value: 'OKUN Systems' },
                  { label: 'Fokus', value: 'Strategie, Sales, Vision' },
                  { label: 'Arbeitsstil', value: 'Deep Work + strukturiert' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span style={{ color: '#64748b', fontSize: '11px' }}>{item.label}</span>
                    <span style={{ color: '#f1f5f9', fontSize: '11px', fontWeight: 500 }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths */}
            <div style={sectionCardStyle}>
              <div className="flex items-center gap-2 mb-3">
                <Star size={13} style={{ color: '#22c55e' }} />
                <h4 style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 600 }} className="uppercase tracking-widest">
                  Stärken
                </h4>
              </div>
              <div className="space-y-2">
                {[
                  { strength: 'Systemisches Denken', desc: 'Erkennt Muster & Strukturen schnell' },
                  { strength: 'Direkter Kommunikationsstil', desc: 'Klar, präzise, keine Umwege' },
                  { strength: 'Prozessoptimierung', desc: 'Findet Ineffizienzen und beseitigt sie' },
                  { strength: 'Strategische Planung', desc: 'Lang- und kurzfristiges Denken' },
                  { strength: 'KI-Affinität', desc: 'Frühadopter, nutzt Tools effektiv' },
                ].map((item) => (
                  <div key={item.strength} className="flex items-start gap-2">
                    <ArrowRight size={10} style={{ color: '#22c55e', flexShrink: 0, marginTop: '3px' }} />
                    <div>
                      <p style={{ color: '#f1f5f9', fontSize: '11px', fontWeight: 500 }}>{item.strength}</p>
                      <p style={{ color: '#64748b', fontSize: '10px' }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risks & Traps */}
            <div style={sectionCardStyle}>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={13} style={{ color: '#ef4444' }} />
                <h4 style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 600 }} className="uppercase tracking-widest">
                  Risiken & Fallen
                </h4>
              </div>
              <div className="space-y-2">
                {[
                  { risk: 'Over-Engineering', trap: 'Systeme bauen statt verkaufen' },
                  { risk: 'Perfektionismus', trap: 'Blockiert Veröffentlichung von MVP' },
                  { risk: 'Zu viele Projekte', trap: 'Fokus geht verloren (Shiny Object Syndrome)' },
                  { risk: 'Solo-Mentalität', trap: 'Delegation fällt schwer' },
                  { risk: 'Planungs-Overfitting', trap: 'Mehr planen als ausführen' },
                ].map((item) => (
                  <div key={item.risk} className="flex items-start gap-2">
                    <AlertTriangle size={10} style={{ color: '#ef4444', flexShrink: 0, marginTop: '3px' }} />
                    <div>
                      <p style={{ color: '#f1f5f9', fontSize: '11px', fontWeight: 500 }}>{item.risk}</p>
                      <p style={{ color: '#64748b', fontSize: '10px' }}>{item.trap}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: OKUN Systems Profile */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Building2 size={14} style={{ color: '#3b82f6' }} />
            <h2 style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }} className="uppercase tracking-widest">
              2. OKUN Systems Profil
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Company */}
            <div style={sectionCardStyle}>
              <h4 style={{ color: '#3b82f6', fontSize: '12px', fontWeight: 700, marginBottom: '12px' }}>Unternehmen</h4>
              <div className="space-y-3">
                <div>
                  <p style={{ color: '#64748b', fontSize: '10px', fontWeight: 600, marginBottom: '4px' }} className="uppercase tracking-wider">
                    Mission
                  </p>
                  <p style={{ color: '#f1f5f9', fontSize: '12px', lineHeight: 1.6 }}>
                    Individuelle Unternehmenssysteme zur Prozessoptimierung und Automatisierung für KMUs entwickeln.
                  </p>
                </div>
                <div>
                  <p style={{ color: '#64748b', fontSize: '10px', fontWeight: 600, marginBottom: '4px' }} className="uppercase tracking-wider">
                    Positionierung
                  </p>
                  <p style={{ color: '#f1f5f9', fontSize: '12px', lineHeight: 1.6 }}>
                    Nicht klassische IT-Beratung, sondern geschäftsorientierte Systementwicklung. Der Fokus liegt auf messbarem Geschäftswert, nicht auf Technologie.
                  </p>
                </div>
                <div>
                  <p style={{ color: '#64748b', fontSize: '10px', fontWeight: 600, marginBottom: '4px' }} className="uppercase tracking-wider">
                    Kernmethodik
                  </p>
                  <p style={{ color: '#f1f5f9', fontSize: '12px', lineHeight: 1.6 }}>
                    OKUN Blueprint — systematische Unternehmensanalyse als Einstieg in jedes Projekt.
                  </p>
                </div>
              </div>
            </div>

            {/* Target Customers */}
            <div style={sectionCardStyle}>
              <h4 style={{ color: '#3b82f6', fontSize: '12px', fontWeight: 700, marginBottom: '12px' }}>Zielkunden & Angebote</h4>
              <div className="space-y-3">
                <div>
                  <p style={{ color: '#64748b', fontSize: '10px', fontWeight: 600, marginBottom: '6px' }} className="uppercase tracking-wider">
                    Zielkunden (KMUs)
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Hausverwaltungen',
                      'Personaldienstleister',
                      'Pflegedienste',
                      'Versicherungsvermittler',
                      'Agenturen',
                      'Weitere KMUs',
                    ].map((customer) => (
                      <span
                        key={customer}
                        style={{
                          backgroundColor: 'rgba(59,130,246,0.1)',
                          border: '1px solid rgba(59,130,246,0.2)',
                          color: '#3b82f6',
                          fontSize: '10px',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontWeight: 500,
                        }}
                      >
                        {customer}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ color: '#64748b', fontSize: '10px', fontWeight: 600, marginBottom: '6px' }} className="uppercase tracking-wider">
                    Angebote & Preise
                  </p>
                  <div className="space-y-2">
                    {[
                      { name: 'Kleines Paket', price: '~7.500 €', desc: 'Einstieg, spezifisches Problem' },
                      { name: 'Großes Paket', price: '~15.000 €', desc: 'Umfassende Systementwicklung' },
                      { name: 'Retainer', price: 'Monatlich', desc: 'Laufende Optimierung & Support' },
                      { name: 'OKUN Blueprint', price: 'Discovery', desc: 'Unternehmensanalyse als Einstieg' },
                    ].map((offer) => (
                      <div key={offer.name} className="flex items-center justify-between">
                        <div>
                          <span style={{ color: '#f1f5f9', fontSize: '11px', fontWeight: 500 }}>{offer.name}</span>
                          <span style={{ color: '#64748b', fontSize: '10px' }}> · {offer.desc}</span>
                        </div>
                        <span style={{ color: '#22c55e', fontSize: '11px', fontWeight: 700 }}>{offer.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Systems & Assets */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Layers size={14} style={{ color: '#8b5cf6' }} />
            <h2 style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }} className="uppercase tracking-widest">
              3. Systeme & Assets
            </h2>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {[
              {
                name: 'DealSky',
                icon: Globe,
                color: '#0077b5',
                type: 'LinkedIn-Outreach',
                desc: 'Automatisiertes LinkedIn-Outreach-System für Lead-Generierung und Pipeline-Aufbau.',
                status: 'Aktiv',
              },
              {
                name: 'E-Mail-Outreach',
                icon: Mail,
                color: '#3b82f6',
                type: 'Email-System',
                desc: 'Personalisiertes Cold-Email-System für DACH-Zielkunden mit Tracking und Follow-ups.',
                status: 'Aktiv',
              },
              {
                name: 'OKUN Blueprint',
                icon: BookOpen,
                color: '#f59e0b',
                type: 'Analyse-Plattform',
                desc: 'Cloud Code-basierte Plattform für systematische Unternehmensanalyse (Discovery).',
                status: 'In Entwicklung',
              },
              {
                name: 'Website',
                icon: Globe,
                color: '#22c55e',
                type: 'Marketing',
                desc: 'Haupt-Website für Inbound-Leads, Positionierung und Social Proof.',
                status: 'Aktiv',
              },
              {
                name: 'Frank OS',
                icon: Zap,
                color: '#f97316',
                type: 'Founder OS',
                desc: 'Das vorliegende System — digitaler COO für Felix Okun und zukünftiges Produkt.',
                status: 'Produktisierung geplant',
              },
            ].map((system) => {
              const Icon = system.icon
              return (
                <div
                  key={system.name}
                  style={{
                    ...sectionCardStyle,
                    borderTop: `2px solid ${system.color}40`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      style={{
                        backgroundColor: `${system.color}15`,
                        borderRadius: '6px',
                        padding: '6px',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={14} style={{ color: system.color }} />
                    </div>
                    <div>
                      <p style={{ color: '#f1f5f9', fontSize: '12px', fontWeight: 700 }}>{system.name}</p>
                      <p style={{ color: '#64748b', fontSize: '10px' }}>{system.type}</p>
                    </div>
                  </div>
                  <p style={{ color: '#64748b', fontSize: '11px', lineHeight: 1.5, marginBottom: '8px' }}>
                    {system.desc}
                  </p>
                  <span
                    style={{
                      backgroundColor: `${system.color}10`,
                      color: system.color,
                      fontSize: '9px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: 600,
                    }}
                  >
                    {system.status}
                  </span>
                </div>
              )
            })}
          </div>
        </section>

        {/* Section 4: Langfristige Vision */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Telescope size={14} style={{ color: '#22c55e' }} />
            <h2 style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }} className="uppercase tracking-widest">
              4. Langfristige Vision
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              {[
                {
                  title: 'BAFA-Beraterstatus',
                  icon: Shield,
                  color: '#f59e0b',
                  timeline: '2026',
                  desc: 'Offizielle BAFA-Zulassung als Unternehmensberater. Ermöglicht staatliche Förderung für KMU-Kunden und stärkt Legitimation & Vertrauen.',
                },
                {
                  title: 'Medienautorität',
                  icon: BarChart3,
                  color: '#3b82f6',
                  timeline: '2026–2027',
                  desc: 'Felix als anerkannte Stimme zu KMU-Digitalisierung und Prozessoptimierung. LinkedIn, Podcast, YouTube als Kanäle.',
                },
              ].map((vision) => {
                const Icon = vision.icon
                return (
                  <div
                    key={vision.title}
                    style={{
                      ...sectionCardStyle,
                      borderLeft: `3px solid ${vision.color}`,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        style={{
                          backgroundColor: `${vision.color}15`,
                          borderRadius: '6px',
                          padding: '6px',
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={14} style={{ color: vision.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 600 }}>{vision.title}</h4>
                          <span
                            style={{
                              backgroundColor: `${vision.color}15`,
                              color: vision.color,
                              fontSize: '10px',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              fontWeight: 600,
                            }}
                          >
                            {vision.timeline}
                          </span>
                        </div>
                        <p style={{ color: '#64748b', fontSize: '12px', lineHeight: 1.6 }}>{vision.desc}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="space-y-3">
              {[
                {
                  title: 'DCF-Verlag',
                  icon: BookOpen,
                  color: '#8b5cf6',
                  timeline: '2027+',
                  desc: 'Eigener Verlag für Business-Inhalte, Frameworks und Bücher rund um KMU-Digitalisierung und das OKUN-Methode.',
                },
                {
                  title: 'Produktisierung von Frank OS',
                  icon: Package,
                  color: '#22c55e',
                  timeline: '2027+',
                  desc: 'Frank OS als eigenständiges SaaS-Produkt für andere Founder. Das Founder Operating System wird vom internen Tool zum skalierbaren Produkt.',
                },
              ].map((vision) => {
                const Icon = vision.icon
                return (
                  <div
                    key={vision.title}
                    style={{
                      ...sectionCardStyle,
                      borderLeft: `3px solid ${vision.color}`,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        style={{
                          backgroundColor: `${vision.color}15`,
                          borderRadius: '6px',
                          padding: '6px',
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={14} style={{ color: vision.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 600 }}>{vision.title}</h4>
                          <span
                            style={{
                              backgroundColor: `${vision.color}15`,
                              color: vision.color,
                              fontSize: '10px',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              fontWeight: 600,
                            }}
                          >
                            {vision.timeline}
                          </span>
                        </div>
                        <p style={{ color: '#64748b', fontSize: '12px', lineHeight: 1.6 }}>{vision.desc}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Section 5: Entscheidungsframework */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <GitBranch size={14} style={{ color: '#f97316' }} />
            <h2 style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }} className="uppercase tracking-widest">
              5. Entscheidungsframework
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Decision Logic */}
            <div style={sectionCardStyle}>
              <h4 style={{ color: '#f97316', fontSize: '12px', fontWeight: 700, marginBottom: '12px' }}>
                FRANK&apos;s Entscheidungslogik
              </h4>
              <p style={{ color: '#64748b', fontSize: '11px', marginBottom: '12px', lineHeight: 1.5 }}>
                Jede Entscheidung folgt dieser Kaskade von Vision zu konkreter Aufgabe:
              </p>
              <div className="space-y-2">
                {[
                  { step: 'Vision', desc: 'Wohin entwickelt sich OKUN Systems langfristig?', color: '#f59e0b' },
                  { step: 'Jahresziel', desc: 'Was muss dieses Jahr erreicht werden?', color: '#f97316' },
                  { step: 'Quartalsziel', desc: 'Was ist der Fokus dieses Quartals?', color: '#ef4444' },
                  { step: 'Monatsziel', desc: 'Was sind die Monatsprioritäten?', color: '#8b5cf6' },
                  { step: 'Wochenziel', desc: 'Was wird diese Woche erledigt?', color: '#3b82f6' },
                  { step: 'Heutiger Engpass', desc: 'Was blockiert uns gerade?', color: '#22c55e' },
                  { step: 'Konkrete Aufgabe', desc: 'Was wird jetzt getan?', color: '#22c55e' },
                ].map((item, i) => (
                  <div key={item.step} className="flex items-center gap-3">
                    <div
                      style={{
                        backgroundColor: `${item.color}15`,
                        border: `1px solid ${item.color}30`,
                        borderRadius: '4px',
                        padding: '2px 8px',
                        minWidth: '110px',
                        flexShrink: 0,
                      }}
                    >
                      <span style={{ color: item.color, fontSize: '10px', fontWeight: 700 }}>{item.step}</span>
                    </div>
                    {i < 6 && <ArrowRight size={10} style={{ color: '#475569', flexShrink: 0 }} />}
                    <p style={{ color: '#64748b', fontSize: '11px' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Priorities & Rules */}
            <div style={sectionCardStyle}>
              <h4 style={{ color: '#f97316', fontSize: '12px', fontWeight: 700, marginBottom: '12px' }}>
                FRANK&apos;s Priorisierungsregeln
              </h4>
              <div className="space-y-4">
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 600, marginBottom: '6px' }} className="uppercase tracking-wider">
                    Immer priorisieren
                  </p>
                  {[
                    'Umsatz-relevante Aktivitäten (Sales, Demo, Follow-up)',
                    'Engpass-Beseitigung vor Optimierung',
                    'Commitments zu externen Stakeholdern',
                    'Deep Work morgens, Admin nachmittags',
                  ].map((rule) => (
                    <div key={rule} className="flex items-start gap-2 mb-1.5">
                      <Target size={10} style={{ color: '#22c55e', flexShrink: 0, marginTop: '2px' }} />
                      <p style={{ color: '#64748b', fontSize: '11px' }}>{rule}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <p style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 600, marginBottom: '6px' }} className="uppercase tracking-wider">
                    Warnsignale (FRANK meldet sich)
                  </p>
                  {[
                    'KPI weicht mehr als 20% vom Ziel ab',
                    'Wochenziel bis Donnerstag nicht erreichbar',
                    'Mehr als 3 Tage ohne Kunden-Kontakt',
                    'Neue Projekte ohne klares Ziel',
                  ].map((warning) => (
                    <div key={warning} className="flex items-start gap-2 mb-1.5">
                      <AlertTriangle size={10} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
                      <p style={{ color: '#64748b', fontSize: '11px' }}>{warning}</p>
                    </div>
                  ))}
                </div>
                <div
                  style={{
                    backgroundColor: 'rgba(245,158,11,0.06)',
                    border: '1px solid rgba(245,158,11,0.15)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                  }}
                >
                  <p style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 600, marginBottom: '4px' }} className="uppercase tracking-wider">
                    FRANK&apos;s Grundsatz
                  </p>
                  <p style={{ color: '#f1f5f9', fontSize: '12px', lineHeight: 1.6, fontStyle: 'italic' }}>
                    &quot;Ich bin kein Assistent. Ich bin ein digitaler COO. Ich denke zielorientiert, nicht aufgabenorientiert. Ich priorisiere nach Unternehmenswirkung.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
