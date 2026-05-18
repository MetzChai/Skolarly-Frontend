export interface Lesson {
  id: string
  user_id: string | null
  title: string
  original_content: string | null
  explanation: string | null
  summary: string | null
  file_type: string | null
  created_at: string
  updated_at: string
}

export interface Quiz {
  id: string
  user_id: string | null
  lesson_id: string | null
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  questions: QuizQuestion[]
  score: number | null
  total_questions: number | null
  created_at: string
}

export interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export interface ChatSession {
  id: string
  user_id: string | null
  title: string
  created_at: string
  updated_at: string
}

export interface ChatMessage {
  id: string
  session_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface StudyPlan {
  id: string
  user_id: string | null
  title: string
  description: string | null
  start_date: string | null
  end_date: string | null
  created_at: string
}

export interface StudyTask {
  id: string
  plan_id: string
  title: string
  description: string | null
  scheduled_date: string | null
  scheduled_time: string | null
  duration_minutes: number
  is_completed: boolean
  created_at: string
}

export interface StudySession {
  id: string
  user_id: string | null
  task_id: string | null
  start_time: string
  end_time: string | null
  duration_minutes: number | null
  created_at: string
}
