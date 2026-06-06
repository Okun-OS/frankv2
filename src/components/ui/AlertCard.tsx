import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react'

interface AlertCardProps {
  title: string
  description?: string
  severity: 'info' | 'warning' | 'danger' | 'success'
  category?: string
  time?: string
}

const severityConfig = {
  info: { icon: Info, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.2)' },
  warning: { icon: AlertTriangle, color: '#f97316', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.2)' },
  danger: { icon: XCircle, color: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)' },
  success: { icon: CheckCircle, color: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.2)' },
}

export function AlertCard({ title, description, severity, category, time }: AlertCardProps) {
  const config = severityConfig[severity]
  const Icon = config.icon

  return (
    <div
      style={{
        backgroundColor: config.bg,
        border: `1px solid ${config.border}`,
        borderRadius: '8px',
        padding: '10px 12px',
        display: 'flex',
        gap: '10px',
        alignItems: 'flex-start',
      }}
    >
      <Icon size={14} style={{ color: config.color, flexShrink: 0, marginTop: '1px' }} />
      <div className="flex-1 min-w-0">
        <p style={{ color: '#f1f5f9', fontSize: '12px', fontWeight: 500, marginBottom: '2px' }}>{title}</p>
        {description && (
          <p style={{ color: '#64748b', fontSize: '11px', lineHeight: 1.4 }}>{description}</p>
        )}
        {(category || time) && (
          <div className="flex items-center gap-2 mt-1">
            {category && (
              <span style={{ color: config.color, fontSize: '10px', fontWeight: 500 }}>{category}</span>
            )}
            {time && (
              <span style={{ color: '#475569', fontSize: '10px' }}>{time}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
