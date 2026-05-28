import {
  BookOpen,
  BrainCircuit,
  MessageSquare,
  Home,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

export const studyNavItems: NavItem[] = [
  {
    href: "/skolarly",
    label: "Study Hub",
    icon: Home,
    description: "Overview and quick access",
  },
  {
    href: "/skolarly/lesson-lab",
    label: " AI Lesson Explainer",
    icon: BookOpen,
    description: "AI lesson explanations",
  },
  {
    href: "/skolarly/quiz-lab",
    label: " AI Quiz Generator",
    icon: BrainCircuit,
    description: "Generate practice quizzes",
  },
  {
    href: "/skolarly/tutor",
    label: "AI Tutor",
    icon: MessageSquare,
    description: "Chat with your study tutor",
  },
];

export function getPageMeta(pathname: string): {
  title: string;
  description: string;
} {
  const item = studyNavItems.find(
    (nav) =>
      pathname === nav.href ||
      (nav.href !== "/skolarly" && pathname.startsWith(nav.href)),
  );
  if (item) {
    return { title: item.label, description: item.description };
  }
  return { title: "Study Hub", description: "Your AI study companion" };
}
