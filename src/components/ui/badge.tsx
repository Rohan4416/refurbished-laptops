import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'pristine' | 'excellent' | 'good' | 'fair'
  size?: 'sm' | 'md'
  className?: string
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  const variants = {
    default: 'bg-slate-100 text-slate-700',
    primary: 'bg-blue-100 text-blue-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    error: 'bg-red-100 text-red-700',
    pristine: 'bg-emerald-100 text-emerald-800',
    excellent: 'bg-emerald-50 text-emerald-700',
    good: 'bg-amber-50 text-amber-700',
    fair: 'bg-stone-100 text-stone-600',
  }

  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded-full uppercase tracking-wide',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  )
}

interface ConditionBadgeProps {
  condition: 'PRISTINE' | 'EXCELLENT' | 'GOOD' | 'FAIR'
  size?: 'sm' | 'md'
}

export function ConditionBadge({ condition, size = 'sm' }: ConditionBadgeProps) {
  const labels: Record<string, string> = {
    PRISTINE: 'Pristine',
    EXCELLENT: 'Excellent',
    GOOD: 'Good',
    FAIR: 'Fair',
  }

  return (
    <Badge variant={condition.toLowerCase() as 'pristine' | 'excellent' | 'good' | 'fair'} size={size}>
      {labels[condition] || condition}
    </Badge>
  )
}