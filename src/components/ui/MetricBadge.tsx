import { TrendingUp, TrendingDown } from 'lucide-react'

interface MetricBadgeProps {
  value: number
  label?: string
}

export function MetricBadge({ value, label }: MetricBadgeProps) {
  const isPositive = value >= 0
  return (
    <span
      style={{
        backgroundColor: isPositive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
        color: isPositive ? '#22c55e' : '#ef4444',
        border: `1px solid ${isPositive ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
        fontSize: '11px',
        padding: '2px 6px',
        borderRadius: '9999px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '3px',
        fontWeight: 600,
      }}
    >
      {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
      {isPositive ? '+' : ''}{value.toFixed(1)}%
      {label && <span style={{ color: 'inherit', opacity: 0.7 }}>{label}</span>}
    </span>
  )
}
