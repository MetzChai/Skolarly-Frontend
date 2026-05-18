import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { sessionId, content } = await request.json()

    if (!sessionId || !content) {
      return NextResponse.json({ error: 'Session ID and content are required' }, { status: 400 })
    }

    const sql = getDb()

    await sql`
      INSERT INTO chat_messages (session_id, role, content)
      VALUES (${sessionId}, 'assistant', ${content})
    `

    await sql`
      UPDATE chat_sessions SET updated_at = NOW() WHERE id = ${sessionId}
    `

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Save message error:', error)
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
  }
}
