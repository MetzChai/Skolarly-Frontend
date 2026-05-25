import { cn } from '@/lib/utils'

interface WorkspaceShellProps {
  children: React.ReactNode
  className?: string
  size?: 'md' | 'lg' | 'full'
}

const sizeClasses = {
  md: 'max-w-3xl',
  lg: 'max-w-5xl',
  full: 'max-w-7xl',
}

export function WorkspaceShell({
  children,
  className,
  size = 'full',
}: WorkspaceShellProps) {
  return (
    <div className={cn('mx-auto w-full px-4 py-6 sm:px-6 lg:px-8 lg:py-8', sizeClasses[size], className)}>
      {children}
    </div>
  )
}
