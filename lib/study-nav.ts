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

export const studyNavItems: NavItem[] = [
  {
    href: '/study-hub',
    label: 'Study Hub',
    icon: Home,
    description: 'Overview and quick access',
  },
  {
    href: '/study-hub/lesson-lab',
    label: 'Lessons',
    icon: BookOpen,
    description: 'AI lesson explanations',
  },
  {
    href: '/study-hub/quiz-lab',
    label: 'Quizzes',
    icon: BrainCircuit,
    description: 'Generate practice quizzes',
  },
  {
    href: '/study-hub/tutor',
    label: 'AI Tutor',
    icon: MessageSquare,
    description: 'Chat with your study tutor',
  },
  {
    href: '/study-hub/planner',
    label: 'Study Planner',
    icon: Calendar,
    description: 'Personalized study schedules',
  },
]

export function getPageMeta(pathname: string): { title: string; description: string } {
  const item = studyNavItems.find(
    (nav) =>
      pathname === nav.href ||
      (nav.href !== '/study-hub' && pathname.startsWith(nav.href)),
  )
  if (item) {
    return { title: item.label, description: item.description }
  }
  return { title: 'Study Hub', description: 'Your AI study companion' }
}
