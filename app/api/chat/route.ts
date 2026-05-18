import { NextRequest, NextResponse } from 'next/server'
import { streamText } from 'ai'
import { getDb } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const sql = getDb()
    let currentSessionId = sessionId

    // Create new session if needed
    if (!currentSessionId) {
      const sessionResult = await sql`
        INSERT INTO chat_sessions (title)
        VALUES (${message.substring(0, 50) + (message.length > 50 ? '...' : '')})
        RETURNING *
      `
      currentSessionId = sessionResult[0].id
    }

    // Save user message
    await sql`
      INSERT INTO chat_messages (session_id, role, content)
      VALUES (${currentSessionId}, 'user', ${message})
    `

    // Get conversation history
    const history = await sql`
      SELECT role, content FROM chat_messages 
      WHERE session_id = ${currentSessionId}
      ORDER BY created_at ASC
      LIMIT 20
    `

    const messages = history.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    }))

    const result = streamText({
      model: 'openai/gpt-4o-mini',
      system: `You are Skolarly, a friendly and knowledgeable AI study tutor. Your role is to help students learn effectively.

      Your capabilities:
      - Explain complex topics in simple terms
      - Answer questions about any subject
      - Help with homework and assignments
      - Provide study tips and learning strategies
      - Encourage and motivate students
      - Suggest resources for further learning

      Guidelines:
      - Be patient and encouraging
      - Use examples and analogies
      - Break down complex topics
      - Ask clarifying questions when needed
      - Celebrate student progress
      - Format responses with Markdown when helpful`,
      messages,
    })

    const response = await result.toDataStreamResponse()
    
    return response
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    const sql = getDb()

    if (sessionId) {
      const messages = await sql`
        SELECT * FROM chat_messages 
        WHERE session_id = ${sessionId}
        ORDER BY created_at ASC
      `
      return NextResponse.json({ messages })
    }

    const sessions = await sql`
      SELECT * FROM chat_sessions ORDER BY updated_at DESC LIMIT 50
    `
    return NextResponse.json({ sessions })
  } catch (error) {
    console.error('Fetch chat error:', error)
    return NextResponse.json({ error: 'Failed to fetch chat data' }, { status: 500 })
  }
}
