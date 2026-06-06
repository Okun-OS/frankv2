import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: React.ReactNode
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: '1px solid #3b82f6',
  },
  secondary: {
    backgroundColor: '#111318',
    color: '#94a3b8',
    border: '1px solid #1e2130',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: '#94a3b8',
    border: '1px solid transparent',
  },
  danger: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    color: '#ef4444',
    border: '1px solid rgba(239,68,68,0.2)',
  },
  gold: {
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    color: '#000',
    border: 'none',
    fontWeight: 700,
  },
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function Button({
  variant = 'secondary',
  size = 'md',
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      style={variantStyles[variant]}
      className={cn(
        'rounded-lg font-medium transition-all hover:opacity-80 active:scale-95 disabled:opacity-50 flex items-center gap-2',
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
