import { NextRequest, NextResponse } from 'next/server'
import { generateObject } from 'ai'
import { z } from 'zod'
import { getDb } from '@/lib/db'

const QuizSchema = z.object({
  questions: z.array(z.object({
    question: z.string(),
    options: z.array(z.string()).length(4),
    correctAnswer: z.number().min(0).max(3),
    explanation: z.string()
  }))
})

export async function POST(request: NextRequest) {
  try {
    const { topic, difficulty = 'medium', questionCount = 5, lessonId } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const difficultyPrompts = {
      easy: 'Create simple, straightforward questions suitable for beginners. Focus on basic concepts and definitions.',
      medium: 'Create moderately challenging questions that test understanding and application of concepts.',
      hard: 'Create challenging questions that require deep understanding, analysis, and application of advanced concepts.'
    }

    const { object: quiz } = await generateObject({
      model: 'openai/gpt-4o-mini',
      schema: QuizSchema,
      system: `You are Skolarly, an expert quiz creator. Generate educational quizzes that test understanding effectively.
      
      Guidelines:
      - Create clear, unambiguous questions
      - All 4 options should be plausible
      - Include detailed explanations for each correct answer
      - ${difficultyPrompts[difficulty as keyof typeof difficultyPrompts] || difficultyPrompts.medium}`,
      prompt: `Generate ${questionCount} multiple choice questions about: ${topic}`,
    })

    // Save to database
    const sql = getDb()
    const result = await sql`
      INSERT INTO quizzes (title, difficulty, questions, lesson_id, total_questions)
      VALUES (${`Quiz: ${topic}`}, ${difficulty}, ${JSON.stringify(quiz.questions)}, ${lessonId || null}, ${questionCount})
      RETURNING *
    `

    return NextResponse.json({ 
      quiz: {
        ...result[0],
        questions: quiz.questions
      }
    })
  } catch (error) {
    console.error('Quiz generation error:', error)
    return NextResponse.json({ error: 'Failed to generate quiz' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const sql = getDb()
    const quizzes = await sql`
      SELECT * FROM quizzes ORDER BY created_at DESC LIMIT 50
    `
    return NextResponse.json({ quizzes })
  } catch (error) {
    console.error('Fetch quizzes error:', error)
    return NextResponse.json({ error: 'Failed to fetch quizzes' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { quizId, score } = await request.json()

    const sql = getDb()
    const result = await sql`
      UPDATE quizzes SET score = ${score} WHERE id = ${quizId} RETURNING *
    `

    return NextResponse.json({ quiz: result[0] })
  } catch (error) {
    console.error('Update quiz error:', error)
    return NextResponse.json({ error: 'Failed to update quiz' }, { status: 500 })
  }
}
