import { cn } from '@/lib/utils'

type BadgeVariant = 'gold' | 'green' | 'red' | 'orange' | 'blue' | 'purple' | 'gray'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  gold: 'badge-gold',
  green: 'badge-green',
  red: 'badge-red',
  orange: 'badge-orange',
  blue: 'badge-blue',
  purple: '',
  gray: '',
}

const variantInlineStyles: Record<BadgeVariant, React.CSSProperties> = {
  gold: {},
  green: {},
  red: {},
  orange: {},
  blue: {},
  purple: {
    backgroundColor: 'rgba(139,92,246,0.1)',
    color: '#8b5cf6',
    border: '1px solid rgba(139,92,246,0.2)',
    fontSize: '0.75rem',
    padding: '0.125rem 0.5rem',
    borderRadius: '9999px',
  },
  gray: {
    backgroundColor: 'rgba(100,116,139,0.1)',
    color: '#64748b',
    border: '1px solid rgba(100,116,139,0.2)',
    fontSize: '0.75rem',
    padding: '0.125rem 0.5rem',
    borderRadius: '9999px',
  },
}

export function Badge({ variant = 'gray', children, className }: BadgeProps) {
  const hasInlineStyle = variant === 'purple' || variant === 'gray'
  return (
    <span
      className={cn(variantStyles[variant], className)}
      style={hasInlineStyle ? variantInlineStyles[variant] : undefined}
    >
      {children}
    </span>
  )
}
