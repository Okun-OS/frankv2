import { Bot, CheckCircle, Pause, AlertCircle } from 'lucide-react'

interface AgentCardProps {
  name: string
  type: string
  status: 'active' | 'paused' | 'error'
  lastRun?: string
  description?: string
}

const statusConfig = {
  active: { icon: CheckCircle, color: '#22c55e', label: 'Aktiv' },
  paused: { icon: Pause, color: '#f97316', label: 'Pausiert' },
  error: { icon: AlertCircle, color: '#ef4444', label: 'Fehler' },
}

export function AgentCard({ name, type, status, lastRun, description }: AgentCardProps) {
  const config = statusConfig[status]
  const StatusIcon = config.icon

  return (
    <div
      className="card card-hover p-4"
      style={{ cursor: 'pointer' }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            style={{
              backgroundColor: 'rgba(245,158,11,0.1)',
              border: '1px solid rgba(245,158,11,0.2)',
              borderRadius: '6px',
              padding: '5px',
            }}
          >
            <Bot size={12} style={{ color: '#f59e0b' }} />
          </div>
          <div>
            <p style={{ color: '#f1f5f9', fontSize: '12px', fontWeight: 600 }}>{name}</p>
            <p style={{ color: '#475569', fontSize: '10px' }}>{type}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <StatusIcon size={10} style={{ color: config.color }} />
          <span style={{ color: config.color, fontSize: '10px', fontWeight: 500 }}>{config.label}</span>
        </div>
      </div>
      {description && (
        <p style={{ color: '#64748b', fontSize: '11px', lineHeight: 1.4, marginBottom: '6px' }}>{description}</p>
      )}
      {lastRun && (
        <p style={{ color: '#475569', fontSize: '10px' }}>Zuletzt: {lastRun}</p>
      )}
    </div>
  )
}
