import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'placeholder' })
}

function getAnthropic() {
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || 'placeholder' })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { type, topic, platform, tone, targetGroup, useCase } = body

  try {
    if (type === 'creative' || type === 'caption' || type === 'hook') {
      if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json({ error: 'OPENAI_API_KEY nicht konfiguriert' }, { status: 500 })
      }

      const platformContext = platform === 'linkedin'
        ? 'LinkedIn B2B-Plattform für Unternehmer und Entscheider'
        : platform === 'instagram'
        ? 'Instagram für visuelles Storytelling und Reichweite'
        : 'LinkedIn und Instagram'

      const prompt = type === 'hook'
        ? `Erstelle 5 verschiedene starke Hooks (erste 1-2 Zeilen) für einen ${platform}-Post über das Thema: "${topic}".
Zielgruppe: ${targetGroup || 'KMU-Entscheider, Geschäftsführer, Unternehmer in DACH'}
Ton: ${tone || 'professionell und direkt'}
Plattform: ${platformContext}

Die Hooks sollen sofort Aufmerksamkeit erzeugen und zum Weiterlesen animieren.
Format: Nummerierte Liste, max. 2 Zeilen pro Hook.`
        : type === 'caption'
        ? `Schreibe 3 verschiedene ${platform}-Captions für das Thema: "${topic}".
Ton: ${tone || 'professionell'}
Zielgruppe: ${targetGroup || 'KMU-Entscheider, DACH'}
Jede Caption max. 150 Wörter, mit 3-5 relevanten Hashtags am Ende.`
        : `Erstelle einen kreativen ${platform}-Post-Text zum Thema: "${topic}".
Ton: ${tone || 'professionell und authentisch'}
Zielgruppe: ${targetGroup || 'KMU-Entscheider, DACH'}
Format: ${useCase === 'story' ? 'Kurz, 3-5 Zeilen, Story-Format' : 'Standard-Post mit Hook, Body, CTA'}
Max. 200 Wörter.`

      const response = await getOpenAI().chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Du bist ein erfahrener Content-Stratege für OKUN Systems, ein B2B-Unternehmen für individuelle Unternehmenssysteme in der DACH-Region.
Erstelle Content für Felix Okun (Founder & CEO).
Stil: authentisch, unternehmerisch, wertvoll — kein generischer KI-Content.
Sprache: Deutsch.`
          },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.8,
      })

      return NextResponse.json({
        content: response.choices[0].message.content,
        model: 'gpt-4o',
        type,
      })
    } else {
      if (!process.env.ANTHROPIC_API_KEY) {
        return NextResponse.json({ error: 'ANTHROPIC_API_KEY nicht konfiguriert' }, { status: 500 })
      }

      const prompt = type === 'article'
        ? `Schreibe einen professionellen LinkedIn-Artikel für Felix Okun (Founder & CEO von OKUN Systems) über: "${topic}".

Struktur:
1. Starker Hook (2 Zeilen)
2. Problem/Situation (1 Abschnitt)
3. Kernaussage mit eigenen Erfahrungen (2-3 Abschnitte)
4. Konkrete Erkenntnisse (3-5 Bullet Points)
5. Schluss mit CTA

Ton: Persönlich, authentisch, auf Augenhöhe mit Unternehmern.
Länge: 400-600 Wörter.
Zielgruppe: ${targetGroup || 'KMU-Geschäftsführer, DACH'}.`
        : `Erstelle strategischen Content für ${platform} zum Thema: "${topic}".
Ton: ${tone || 'professionell und strategisch'}
Zielgruppe: ${targetGroup || 'KMU-Entscheider, DACH'}
Format: ${useCase}
Länge: 300-500 Wörter mit klarer Botschaft.`

      const response = await getAnthropic().messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
        system: `Du bist ein erfahrener B2B-Content-Stratege für OKUN Systems.
Felix Okun ist Founder & CEO. OKUN Systems entwickelt individuelle Unternehmenssysteme für KMUs.
Erstelle strategisch wertvolle Inhalte, die Autorität aufbauen und Vertrauen schaffen.
Sprache: Deutsch. Kein generischer KI-Stil.`,
      })

      const content = response.content[0].type === 'text' ? response.content[0].text : ''
      return NextResponse.json({ content, model: 'claude-sonnet-4-6', type })
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Content generation error:', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
