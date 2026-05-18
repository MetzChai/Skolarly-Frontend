import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const sql = getDb()
    
    const plan = await sql`
      SELECT * FROM study_plans WHERE id = ${id}
    `

    if (plan.length === 0) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    const tasks = await sql`
      SELECT * FROM study_tasks WHERE plan_id = ${id} ORDER BY scheduled_date, created_at
    `

    return NextResponse.json({ plan: plan[0], tasks })
  } catch (error) {
    console.error('Fetch plan error:', error)
    return NextResponse.json({ error: 'Failed to fetch study plan' }, { status: 500 })
  }
}
