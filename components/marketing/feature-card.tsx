import Link from 'next/link'
import type { ReactNode } from 'react'

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  href: string
  color: 'primary' | 'secondary'
}

export default function FeatureCard({ icon, title, description, href, color }: FeatureCardProps) {
  return (
    <Link href={href} className="group">
      <div className="h-full p-6 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${
            color === 'primary' ? 'bg-primary/10 text-primary' : 'bg-secondary/80 text-secondary-foreground'
          }`}
        >
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </Link>
  )
}
