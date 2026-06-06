'use client'

import Header from '@/components/layout/Header'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Link as LinkIcon, CheckCircle, XCircle, Clock, Settings, Plus } from 'lucide-react'

const integrations = [
  {
    id: 1,
    name: 'HubSpot CRM',
    type: 'crm',
    status: 'connected',
    description: 'Leads, Deals, Contacts & Pipeline-Management',
    lastSync: 'vor 5 Min',
    icon: '🟠',
    color: '#f97316',
    features: ['Lead-Sync', 'Deal-Tracking', 'Contact-Management', 'Pipeline-Analyse'],
  },
  {
    id: 2,
    name: 'LinkedIn',
    type: 'linkedin',
    status: 'connected',
    description: 'Content Publishing, Analytics & Lead-Import',
    lastSync: 'vor 2h',
    icon: '🔵',
    color: '#0077b5',
    features: ['Post-Publishing', 'Analytics', 'Lead-Import', 'Message-API'],
  },
  {
    id: 3,
    name: 'Google Calendar',
    type: 'calendar',
    status: 'connected',
    description: 'Termine & Meetings synchronisieren',
    lastSync: 'vor 10 Min',
    icon: '🟡',
    color: '#f59e0b',
    features: ['Zwei-Wege Sync', 'Meeting-Import', 'Verfügbarkeit'],
  },
  {
    id: 4,
    name: 'Slack',
    type: 'slack',
    status: 'connected',
    description: 'Alerts, Notifications & Team-Kommunikation',
    lastSync: 'Echtzeit',
    icon: '🟣',
    color: '#8b5cf6',
    features: ['Alert-Benachrichtigungen', 'Daily Brief', 'KPI-Updates'],
  },
  {
    id: 5,
    name: 'Stripe',
    type: 'payment',
    status: 'connected',
    description: 'Revenue, Subscriptions & Zahlungsanalyse',
    lastSync: 'vor 1h',
    icon: '💳',
    color: '#6366f1',
    features: ['MRR-Tracking', 'Churn-Analyse', 'Revenue-Dashboard'],
  },
  {
    id: 6,
    name: 'Google Analytics',
    type: 'analytics',
    status: 'connected',
    description: 'Website-Traffic & Conversion-Tracking',
    lastSync: 'vor 30 Min',
    icon: '📊',
    color: '#3b82f6',
    features: ['Traffic-Analyse', 'Conversion-Tracking', 'Funnel-Analyse'],
  },
  {
    id: 7,
    name: 'Instagram',
    type: 'instagram',
    status: 'disconnected',
    description: 'Content Publishing & Analytics für Instagram',
    lastSync: 'Nie',
    icon: '📸',
    color: '#e1306c',
    features: ['Post-Publishing', 'Stories', 'Analytics', 'Lead-Gen'],
  },
  {
    id: 8,
    name: 'Notion',
    type: 'notion',
    status: 'disconnected',
    description: 'Dokumente, Wiki & Projekt-Management synchronisieren',
    lastSync: 'Nie',
    icon: '⚫',
    color: '#64748b',
    features: ['Docs-Sync', 'Database-Import', 'Wiki-Integration'],
  },
  {
    id: 9,
    name: 'Zapier',
    type: 'zapier',
    status: 'error',
    description: 'Verbinde FRANK OS mit 5000+ Apps via Zapier',
    lastSync: 'Fehler seit gestern',
    icon: '⚡',
    color: '#f97316',
    features: ['5000+ App-Verbindungen', 'Custom Workflows', 'Trigger & Actions'],
  },
]

const statusConfig = {
  connected: { color: '#22c55e', label: 'Verbunden', icon: CheckCircle, badgeVariant: 'green' as const },
  disconnected: { color: '#64748b', label: 'Getrennt', icon: XCircle, badgeVariant: 'gray' as const },
  error: { color: '#ef4444', label: 'Fehler', icon: XCircle, badgeVariant: 'red' as const },
}

export default function IntegrationsPage() {
  const connected = integrations.filter(i => i.status === 'connected').length
  const disconnected = integrations.filter(i => i.status === 'disconnected').length
  const errors = integrations.filter(i => i.status === 'error').length

  return (
    <div>
      <Header
        title="Integrations"
        subtitle="Verbinde FRANK OS mit deinen Lieblingstools und Diensten"
      />
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Verbunden', value: `${connected}/${integrations.length}`, color: '#22c55e' },
            { label: 'Getrennt', value: disconnected, color: '#64748b' },
            { label: 'Fehler', value: errors, color: '#ef4444' },
            { label: 'Datenpunkte/Tag', value: '12.4K', color: '#3b82f6' },
          ].map((stat) => (
            <div key={stat.label} className="card p-4">
              <p style={{ color: '#64748b', fontSize: '11px', fontWeight: 500 }} className="mb-1">{stat.label}</p>
              <p style={{ color: stat.color, fontSize: '24px', fontWeight: 700 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <h2 style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }} className="uppercase tracking-widest">
            Alle Integrationen ({integrations.length})
          </h2>
          <Button variant="gold" size="sm">
            <Plus size={12} />
            Integration hinzufügen
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {integrations.map((integration) => {
            const statusInfo = statusConfig[integration.status as keyof typeof statusConfig]
            const StatusIcon = statusInfo.icon

            return (
              <div key={integration.id} className="card p-4 card-hover">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      style={{
                        backgroundColor: `${integration.color}15`,
                        border: `1px solid ${integration.color}30`,
                        borderRadius: '10px',
                        padding: '8px',
                        fontSize: '20px',
                        lineHeight: 1,
                      }}
                    >
                      {integration.icon}
                    </div>
                    <div>
                      <h3 style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 600 }}>{integration.name}</h3>
                      <div className="flex items-center gap-1 mt-0.5">
                        <StatusIcon size={10} style={{ color: statusInfo.color }} />
                        <span style={{ color: statusInfo.color, fontSize: '10px', fontWeight: 500 }}>{statusInfo.label}</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-1 rounded hover:bg-white/5">
                    <Settings size={12} style={{ color: '#475569' }} />
                  </button>
                </div>

                <p style={{ color: '#64748b', fontSize: '11px', lineHeight: 1.5 }} className="mb-3">
                  {integration.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {integration.features.map((feature) => (
                    <span
                      key={feature}
                      style={{
                        backgroundColor: `${integration.color}10`,
                        color: integration.color,
                        fontSize: '9px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        border: `1px solid ${integration.color}20`,
                        fontWeight: 500,
                      }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid #1e2130', paddingTop: '10px' }} className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Clock size={10} style={{ color: '#475569' }} />
                    <span style={{ color: '#475569', fontSize: '10px' }}>Sync: {integration.lastSync}</span>
                  </div>
                  {integration.status === 'disconnected' ? (
                    <button
                      style={{
                        backgroundColor: 'rgba(245,158,11,0.1)',
                        color: '#f59e0b',
                        border: '1px solid rgba(245,158,11,0.2)',
                        fontSize: '10px',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 500,
                      }}
                    >
                      Verbinden
                    </button>
                  ) : integration.status === 'error' ? (
                    <button
                      style={{
                        backgroundColor: 'rgba(239,68,68,0.1)',
                        color: '#ef4444',
                        border: '1px solid rgba(239,68,68,0.2)',
                        fontSize: '10px',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 500,
                      }}
                    >
                      Reparieren
                    </button>
                  ) : (
                    <span style={{ color: '#22c55e', fontSize: '10px', fontWeight: 500 }}>✓ Aktiv</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
