import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { getDb } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { content, title } = await request.json()

    if (!content || !title) {
      return NextResponse.json({ error: 'Content and title are required' }, { status: 400 })
    }

    const { text: explanation } = await generateText({
      model: 'openai/gpt-4o-mini',
      system: `You are Skolarly, an expert educational tutor. Your job is to explain complex topics in a clear, engaging, and easy-to-understand way. 
      
      When explaining content:
      - Break down complex concepts into simpler parts
      - Use analogies and real-world examples
      - Highlight key terms and definitions
      - Provide step-by-step explanations where applicable
      - Use bullet points and numbered lists for clarity
      - Include practical applications when relevant
      
      Format your response using Markdown with proper headings, lists, and emphasis.`,
      prompt: `Please explain the following lesson content titled "${title}":\n\n${content}`,
    })

    const { text: summary } = await generateText({
      model: 'openai/gpt-4o-mini',
      system: 'You are an expert at summarizing educational content. Create concise, memorable summaries that capture the key points.',
      prompt: `Create a brief summary (3-5 key points) of this lesson:\n\n${content}`,
    })

    // Save to database
    const sql = getDb()
    const result = await sql`
      INSERT INTO lessons (title, original_content, explanation, summary)
      VALUES (${title}, ${content}, ${explanation}, ${summary})
      RETURNING *
    `

    return NextResponse.json({ 
      lesson: result[0],
      explanation,
      summary
    })
  } catch (error) {
    console.error('Lesson explanation error:', error)
    return NextResponse.json({ error: 'Failed to explain lesson' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const sql = getDb()
    const lessons = await sql`
      SELECT * FROM lessons ORDER BY created_at DESC LIMIT 50
    `
    return NextResponse.json({ lessons })
  } catch (error) {
    console.error('Fetch lessons error:', error)
    return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 })
  }
}
