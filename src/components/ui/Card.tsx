import { cn } from '@/lib/utils'

interface CardProps {
  className?: string
  children: React.ReactNode
  hover?: boolean
}

export function Card({ className, children, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'card',
        hover && 'card-hover cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  className?: string
  children: React.ReactNode
}

export function CardHeader({ className, children }: CardHeaderProps) {
  return (
    <div className={cn('px-5 py-4', className)} style={{ borderBottom: '1px solid #1e2130' }}>
      {children}
    </div>
  )
}

export function CardContent({ className, children }: CardHeaderProps) {
  return <div className={cn('px-5 py-4', className)}>{children}</div>
}

export function CardTitle({ className, children }: CardHeaderProps) {
  return (
    <h3 className={cn('text-sm font-semibold', className)} style={{ color: '#f1f5f9' }}>
      {children}
    </h3>
  )
}
