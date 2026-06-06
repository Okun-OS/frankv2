import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface KPICardProps {
  name: string
  value: string | number
  target?: string | number
  change?: number
  trend?: 'up' | 'down' | 'neutral'
  unit?: string
  period?: string
  color?: string
  icon?: React.ReactNode
}

export function KPICard({
  name,
  value,
  target,
  change,
  trend = 'neutral',
  unit = '',
  period = 'MTD',
  color = '#3b82f6',
  icon,
}: KPICardProps) {
  const trendColor =
    trend === 'up' ? '#22c55e' : trend === 'down' ? '#ef4444' : '#94a3b8'
  const TrendIcon =
    trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus

  return (
    <div
      className="card card-hover p-4"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* Color accent top bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          backgroundColor: color,
          borderRadius: '12px 12px 0 0',
        }}
      />

      <div className="flex items-start justify-between mb-3">
        <div>
          <p style={{ color: '#64748b', fontSize: '11px', fontWeight: 500 }} className="uppercase tracking-wider mb-1">
            {name}
          </p>
          <p style={{ color: '#f1f5f9', fontSize: '22px', fontWeight: 700, lineHeight: 1 }}>
            {unit}{value}
          </p>
        </div>
        {icon && (
          <div
            style={{
              backgroundColor: `${color}15`,
              border: `1px solid ${color}30`,
              borderRadius: '8px',
              padding: '8px',
            }}
          >
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <TrendIcon size={12} style={{ color: trendColor }} />
          {change !== undefined && (
            <span style={{ color: trendColor, fontSize: '11px', fontWeight: 600 }}>
              {change >= 0 ? '+' : ''}{change.toFixed(1)}%
            </span>
          )}
          <span style={{ color: '#475569', fontSize: '11px' }}>{period}</span>
        </div>
        {target !== undefined && (
          <span style={{ color: '#475569', fontSize: '11px' }}>
            Ziel: {unit}{target}
          </span>
        )}
      </div>
    </div>
  )
}
