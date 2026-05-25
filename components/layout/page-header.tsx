import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description: string
  icon: LucideIcon
  variant?: 'primary' | 'secondary'
  action?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  variant = 'primary',
  action,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between', className)}>
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'flex size-12 shrink-0 items-center justify-center rounded-xl shadow-sm',
            variant === 'primary'
              ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
              : 'bg-secondary/90 text-secondary-foreground ring-1 ring-secondary/30',
          )}
        >
          <Icon className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground sm:text-base">{description}</p>
        </div>
      </div>
      {action}
    </div>
  )
}
