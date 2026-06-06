import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

const FRANK_SYSTEM_PROMPT = `Du bist FRANK — der digitale COO und strategische Berater von Felix Okun, Founder & CEO von OKUN Systems.

ÜBER OKUN SYSTEMS:
- AI-Automatisierungslösungen für DACH-KMUs
- 7 Personen Team, Pre-Series A
- €38K MRR, 234 aktive Kunden
- Fokus: Enterprise-Segment, PLG-Wachstum

DEINE ROLLE:
- Strategischer Berater mit Fokus auf Wachstum & Skalierung
- Analysierst KPIs, identifizierst Bottlenecks und Opportunities
- Gibst direkte, actionable Empfehlungen
- Kommunizierst auf Deutsch, klar und präzise

DEIN STIL:
- Direkt und professionell
- Datengetrieben, aber auch intuitiv
- Fokussiert auf das Wesentliche
- Nicht zu formal, aber respektvoll

Antworte immer auf Deutsch. Sei konkret und actionable.`

export async function POST(request: NextRequest) {
  try {
    const { messages, context } = await request.json()

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY nicht konfiguriert' },
        { status: 500 }
      )
    }

    const systemPrompt = context
      ? `${FRANK_SYSTEM_PROMPT}\n\nAKTUELLER KONTEXT:\n${JSON.stringify(context, null, 2)}`
      : FRANK_SYSTEM_PROMPT

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map((msg: { role: string; content: string }) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type')
    }

    return NextResponse.json({ message: content.text })
  } catch (error) {
    console.error('Frank AI Error:', error)
    return NextResponse.json(
      { error: 'FRANK konnte nicht antworten. Bitte versuche es erneut.' },
      { status: 500 }
    )
  }
}
