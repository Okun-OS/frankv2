'use client'

import Header from '@/components/layout/Header'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Bot, CheckCircle, Pause, AlertCircle, Play, Settings, Activity, Zap, Clock, RefreshCw } from 'lucide-react'

const agents = [
  {
    id: 1,
    name: 'Founder Agent',
    type: 'founder',
    status: 'active',
    lastRun: 'vor 5 Min',
    description: 'Dein strategischer Berater. Analysiert Geschäftssituation, gibt Empfehlungen und priorisiert Aufgaben basierend auf Unternehmenszielen.',
    capabilities: ['Strategieanalyse', 'Prioritätensetzung', 'Entscheidungsunterstützung', 'FRANK Daily Brief'],
    runs: 2847,
    avgTime: '45s',
    successRate: 99.2,
  },
  {
    id: 2,
    name: 'Strategy Agent',
    type: 'strategy',
    status: 'active',
    lastRun: 'vor 1h',
    description: 'Entwickelt und bewertet strategische Initiativen. Erstellt Hypothesen, plant Experimente und validiert Strategien basierend auf Daten.',
    capabilities: ['OKR-Management', 'Hypothesen-Testing', 'Marktanalyse', 'Strategieentwicklung'],
    runs: 1203,
    avgTime: '2min',
    successRate: 97.8,
  },
  {
    id: 3,
    name: 'Sales Agent',
    type: 'sales',
    status: 'active',
    lastRun: 'vor 12 Min',
    description: 'Automatisiert Lead-Qualifizierung, verwaltet Pipeline und optimiert den Sales-Prozess für maximale Conversion.',
    capabilities: ['Lead-Qualifizierung', 'Pipeline-Management', 'Follow-up Automatisierung', 'CRM-Integration'],
    runs: 5621,
    avgTime: '30s',
    successRate: 98.5,
  },
  {
    id: 4,
    name: 'Marketing Agent',
    type: 'marketing',
    status: 'active',
    lastRun: 'vor 30 Min',
    description: 'Plant und optimiert Marketing-Kampagnen, analysiert Performance-Daten und identifiziert Wachstumschancen.',
    capabilities: ['Kampagnenplanung', 'Performance-Analyse', 'A/B Testing', 'ROI-Optimierung'],
    runs: 3410,
    avgTime: '1min',
    successRate: 96.1,
  },
  {
    id: 5,
    name: 'Content Agent',
    type: 'content',
    status: 'active',
    lastRun: 'vor 2h',
    description: 'Erstellt LinkedIn-Posts, Instagram-Content und Artikel im Stil von Felix Okun. Hält Brand Voice konsistent.',
    capabilities: ['LinkedIn Posts', 'Instagram Content', 'Artikel', 'Brand Voice Analyse'],
    runs: 4892,
    avgTime: '2min',
    successRate: 94.7,
  },
  {
    id: 6,
    name: 'Review Agent',
    type: 'review',
    status: 'active',
    lastRun: 'vor 3h',
    description: 'Führt wöchentliche Retrospektiven durch, extrahiert Learnings und dokumentiert Muster für kontinuierliche Verbesserung.',
    capabilities: ['Weekly Review', 'Retrospektiven', 'Learning-Extraktion', 'Pattern-Erkennung'],
    runs: 89,
    avgTime: '5min',
    successRate: 100,
  },
  {
    id: 7,
    name: 'Monitoring Agent',
    type: 'monitoring',
    status: 'active',
    lastRun: 'vor 2 Min',
    description: 'Überwacht alle KPIs in Echtzeit, erkennt Anomalien und sendet Alerts bei kritischen Abweichungen.',
    capabilities: ['KPI-Monitoring', 'Anomalie-Erkennung', 'Alert-System', 'Trend-Analyse'],
    runs: 18420,
    avgTime: '5s',
    successRate: 99.9,
  },
  {
    id: 8,
    name: 'Opportunity Agent',
    type: 'opportunity',
    status: 'active',
    lastRun: 'vor 45 Min',
    description: 'Scannt kontinuierlich Markt, Wettbewerb und Kundendaten nach neuen Wachstumschancen und Trends.',
    capabilities: ['Markt-Scanning', 'Wettbewerbsanalyse', 'Opportunity-Scoring', 'Trend-Erkennung'],
    runs: 2103,
    avgTime: '3min',
    successRate: 93.2,
  },
  {
    id: 9,
    name: 'Planning Agent',
    type: 'planning',
    status: 'active',
    lastRun: 'vor 8h',
    description: 'Generiert täglich einen optimierten Tagesplan basierend auf Zielen, Prioritäten und Energieleveln.',
    capabilities: ['Tagesplanung', 'Energieoptimierung', 'Prioritätensetzung', 'Zeitblöcke'],
    runs: 182,
    avgTime: '1min',
    successRate: 98.9,
  },
]

const typeColors: Record<string, string> = {
  founder: '#f59e0b',
  strategy: '#8b5cf6',
  sales: '#22c55e',
  marketing: '#3b82f6',
  content: '#f97316',
  review: '#ef4444',
  monitoring: '#22c55e',
  opportunity: '#f59e0b',
  planning: '#3b82f6',
}

export default function AgentsPage() {
  const activeCount = agents.filter(a => a.status === 'active').length

  return (
    <div>
      <Header
        title="Agent System"
        subtitle="9 spezialisierte AI-Agenten arbeiten 24/7 für OKUN Systems"
      />
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Aktive Agents', value: `${activeCount}/9`, color: '#22c55e' },
            { label: 'Gesamt Runs', value: '38.8K', color: '#f59e0b' },
            { label: 'Ø Success Rate', value: '97.6%', color: '#22c55e' },
            { label: 'Einsparung/Woche', value: '~40h', color: '#3b82f6' },
          ].map((stat) => (
            <div key={stat.label} className="card p-4">
              <p style={{ color: '#64748b', fontSize: '11px', fontWeight: 500 }} className="mb-1">{stat.label}</p>
              <p style={{ color: stat.color, fontSize: '24px', fontWeight: 700 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* System Status */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(34,197,94,0.04) 100%)',
            border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: '12px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div className="flex items-center gap-3">
            <div style={{ backgroundColor: '#22c55e' }} className="w-2 h-2 rounded-full animate-pulse" />
            <span style={{ color: '#22c55e', fontSize: '13px', fontWeight: 600 }}>Alle 9 Agenten aktiv — System läuft optimal</span>
          </div>
          <Button variant="secondary" size="sm">
            <RefreshCw size={11} />
            Status prüfen
          </Button>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-3 gap-4">
          {agents.map((agent) => {
            const color = typeColors[agent.type] || '#f59e0b'

            return (
              <div key={agent.id} className="card p-4 card-hover">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        backgroundColor: `${color}15`,
                        border: `1px solid ${color}30`,
                        borderRadius: '10px',
                        padding: '8px',
                        flexShrink: 0,
                      }}
                    >
                      <Bot size={16} style={{ color }} />
                    </div>
                    <div>
                      <h3 style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 600 }}>{agent.name}</h3>
                      <div className="flex items-center gap-1 mt-0.5">
                        <CheckCircle size={10} style={{ color: '#22c55e' }} />
                        <span style={{ color: '#22c55e', fontSize: '10px', fontWeight: 500 }}>Aktiv</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1 rounded hover:bg-white/5">
                      <Settings size={11} style={{ color: '#475569' }} />
                    </button>
                    <button className="p-1 rounded hover:bg-white/5">
                      <Pause size={11} style={{ color: '#475569' }} />
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p style={{ color: '#64748b', fontSize: '11px', lineHeight: 1.5 }} className="mb-3">
                  {agent.description}
                </p>

                {/* Capabilities */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {agent.capabilities.map((cap) => (
                    <span
                      key={cap}
                      style={{
                        backgroundColor: `${color}10`,
                        color: color,
                        fontSize: '9px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        border: `1px solid ${color}20`,
                        fontWeight: 500,
                      }}
                    >
                      {cap}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div style={{ borderTop: '1px solid #1e2130', paddingTop: '10px' }} className="grid grid-cols-3 gap-2">
                  <div>
                    <p style={{ color: '#475569', fontSize: '9px' }}>Runs</p>
                    <p style={{ color: '#f1f5f9', fontSize: '12px', fontWeight: 700 }}>{agent.runs.toLocaleString()}</p>
                  </div>
                  <div>
                    <p style={{ color: '#475569', fontSize: '9px' }}>Ø Zeit</p>
                    <p style={{ color: '#f1f5f9', fontSize: '12px', fontWeight: 700 }}>{agent.avgTime}</p>
                  </div>
                  <div>
                    <p style={{ color: '#475569', fontSize: '9px' }}>Erfolg</p>
                    <p style={{ color: '#22c55e', fontSize: '12px', fontWeight: 700 }}>{agent.successRate}%</p>
                  </div>
                </div>

                {/* Last Run */}
                <div className="flex items-center gap-1 mt-2">
                  <Clock size={10} style={{ color: '#475569' }} />
                  <span style={{ color: '#475569', fontSize: '10px' }}>Letzter Run: {agent.lastRun}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
