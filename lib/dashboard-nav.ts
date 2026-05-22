import {
  BookOpen,
  BrainCircuit,
  MessageSquare,
  Calendar,
  Home,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  href: string
  label: string
  icon: LucideIcon
  description: string
}

export const dashboardNavItems: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: Home,
    description: 'Overview and quick access',
  },
  {
    href: '/dashboard/lessons',
    label: 'Lessons',
    icon: BookOpen,
    description: 'AI lesson explanations',
  },
  {
    href: '/dashboard/quizzes',
    label: 'Quizzes',
    icon: BrainCircuit,
    description: 'Generate practice quizzes',
  },
  {
    href: '/dashboard/chat',
    label: 'AI Tutor',
    icon: MessageSquare,
    description: 'Chat with your study tutor',
  },
  {
    href: '/dashboard/planner',
    label: 'Study Planner',
    icon: Calendar,
    description: 'Personalized study schedules',
  },
]

export function getPageMeta(pathname: string): { title: string; description: string } {
  const item = dashboardNavItems.find(
    (nav) =>
      pathname === nav.href ||
      (nav.href !== '/dashboard' && pathname.startsWith(nav.href)),
  )
  if (item) {
    return { title: item.label, description: item.description }
  }
  return { title: 'Dashboard', description: 'Your AI study companion' }
}
