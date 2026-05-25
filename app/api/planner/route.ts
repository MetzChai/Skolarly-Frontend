import { NextRequest, NextResponse } from 'next/server'
import { generateObject } from 'ai'
import { z } from 'zod'
import { getDb } from '@/lib/db'

const StudyPlanSchema = z.object({
  tasks: z.array(z.object({
    title: z.string(),
    description: z.string(),
    duration_minutes: z.number(),
    day_offset: z.number()
  }))
})

export async function POST(request: NextRequest) {
  try {
    const { title, description, topics, duration_days = 7, hours_per_day = 2 } = await request.json()

    if (!title || !topics) {
      return NextResponse.json({ error: 'Title and topics are required' }, { status: 400 })
    }

    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + duration_days)

    // Generate AI study plan
    const { object: generatedPlan } = await generateObject({
      model: 'openai/gpt-4o-mini',
      schema: StudyPlanSchema,
      system: `You are Skolarly, an expert study planner. Create effective, balanced study schedules that optimize learning.
      
      Guidelines:
      - Break topics into manageable study sessions
      - Alternate between different subjects
      - Include review sessions
      - Schedule harder topics when energy is typically higher
      - Include short breaks between sessions
      - Space out learning for better retention`,
      prompt: `Create a ${duration_days}-day study plan for the following topics: ${topics}
      
      Available study time: ${hours_per_day} hours per day.
      Plan title: ${title}
      ${description ? `Additional context: ${description}` : ''}
      
      Generate study tasks distributed across the ${duration_days} days. Use day_offset 0 for today, 1 for tomorrow, etc.`,
    })

    // Save plan to database
    const sql = getDb()
    const planResult = await sql`
      INSERT INTO study_plans (title, description, start_date, end_date)
      VALUES (${title}, ${description || null}, ${startDate.toISOString()}, ${endDate.toISOString()})
      RETURNING *
    `

    const planId = planResult[0].id

    // Save tasks
    for (const task of generatedPlan.tasks) {
      const taskDate = new Date(startDate)
      taskDate.setDate(taskDate.getDate() + task.day_offset)
      
      await sql`
        INSERT INTO study_tasks (plan_id, title, description, scheduled_date, duration_minutes)
        VALUES (${planId}, ${task.title}, ${task.description}, ${taskDate.toISOString().split('T')[0]}, ${task.duration_minutes})
      `
    }

    // Fetch the complete plan with tasks
    const tasks = await sql`
      SELECT * FROM study_tasks WHERE plan_id = ${planId} ORDER BY scheduled_date, created_at
    `

    return NextResponse.json({ 
      plan: planResult[0],
      tasks
    })
  } catch (error) {
    console.error('Study plan generation error:', error)
    return NextResponse.json({ error: 'Failed to generate study plan' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const sql = getDb()
    const plans = await sql`
      SELECT * FROM study_plans ORDER BY created_at DESC LIMIT 50
    `
    return NextResponse.json({ plans })
  } catch (error) {
    console.error('Fetch plans error:', error)
    return NextResponse.json({ error: 'Failed to fetch study plans' }, { status: 500 })
  }
}
