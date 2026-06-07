import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import prisma from '@/lib/prisma'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

const FRANK_SYSTEM_PROMPT = `Du bist FRANK — der digitale COO und strategische Berater von Felix Okun, Founder & CEO von OKUN Systems.

ÜBER OKUN SYSTEMS:
OKUN Systems entwickelt individuelle Unternehmenssysteme zur Prozessoptimierung und Automatisierung für KMUs.
Positionierung: Nicht klassische IT-Beratung, sondern geschäftsorientierte Systementwicklung.
Zielkunden: Hausverwaltungen, Personaldienstleister, Pflegedienste, Versicherungsvermittler, Agenturen und weitere KMUs.
Angebote: Kleines Paket (~7.500 EUR), Großes Paket (~15.000 EUR), Retainer, OKUN Blueprint.
Kernmethodik: OKUN Blueprint als Unternehmensanalyse.
Systeme: DealSky (LinkedIn-Outreach), E-Mail-Outreach, Cloud Code (OKUN Blueprint Platform).
Langfristige Ziele: BAFA-Beraterstatus, Medienautorität, DCF-Verlag, Produktisierung von Frank OS.

DEINE KERNAUFGABE:
Du bist kein Assistent, du bist ein digitaler COO. Du denkst zielorientiert, nicht aufgabenorientiert.
Du priorisierst nach Unternehmenswirkung. Du erkennst Engpässe, bildest Hypothesen, planst konkrete Arbeit.
Du handelst nicht eigenmächtig — du legst Vorschläge zur Freigabe vor.

ENTSCHEIDUNGSLOGIK:
Vision → Jahresziel → Quartalsziel → Monatsziel → Wochenziel → heutiger Engpass → konkrete Aufgabe

WENN FELIX NACH TAGESPLAN FRAGT:
Erstelle einen strukturierten Zeitplan mit Begründung:
- Zeitblock | Aufgabe | Warum diese Aufgabe? | Welches Ziel wird unterstützt?

WENN ZIELE GEFÄHRDET SIND: Sage es direkt, nenn den Engpass, schlage 2-3 konkrete Maßnahmen vor.
WENN DATEN FEHLEN: Frage gezielt nach oder markiere die Datenlücke.

Kommuniziere auf Deutsch. Sei direkt, sachlich, wie ein erfahrener COO — kein Motivationscoach.`

export async function POST(request: NextRequest) {
  try {
    const { messages, context } = await request.json()

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY nicht konfiguriert' },
        { status: 500 }
      )
    }

    // Fetch live data from the database
    const [kpis, goals, bottlenecks, opportunities, alerts, founderProfile] = await Promise.all([
      prisma.kPI.findMany({ where: { isActive: true }, take: 10 }),
      prisma.goal.findMany({ where: { status: 'active' }, take: 5 }),
      prisma.bottleneck.findMany({ where: { status: { not: 'resolved' } }, take: 3, orderBy: { createdAt: 'desc' } }),
      prisma.opportunity.findMany({ where: { status: 'identified' }, take: 3 }),
      prisma.alert.findMany({ where: { isRead: false }, take: 5, orderBy: { createdAt: 'desc' } }),
      prisma.founderProfile.findFirst(),
    ])

    const profileContext = founderProfile ? `
FOUNDER PROFIL:
Name: ${founderProfile.founderName}
Unternehmen: ${founderProfile.companyName}
Was wir machen: ${founderProfile.companyDescription}
Zielkunden: ${founderProfile.targetCustomers}
Angebote: ${founderProfile.offers}
Aktueller Umsatz: ${founderProfile.currentRevenue || 'nicht angegeben'}
Aktive Kunden: ${founderProfile.currentCustomers || 'nicht angegeben'}
Akquisitionskanäle: ${founderProfile.acquisitionChannels}
Größtes Ziel: ${founderProfile.biggestGoal}
Größtes Problem: ${founderProfile.biggestChallenge}
Arbeitszeit/Tag: ${founderProfile.workingHoursPerDay}h
` : ''

    const liveContext = `${profileContext}
LIVE UNTERNEHMENSDATEN (${new Date().toLocaleDateString('de-DE')}):

KPIs:
${kpis.length > 0 ? kpis.map(k => `- ${k.name}: ${k.current} ${k.unit} (Ziel: ${k.target} ${k.unit}, Trend: ${k.trend})`).join('\n') : '- Keine aktiven KPIs verfügbar'}

Aktive Ziele:
${goals.length > 0 ? goals.map(g => `- ${g.title}: ${g.progress}% (Status: ${g.status})`).join('\n') : '- Keine aktiven Ziele verfügbar'}

Aktuelle Engpässe:
${bottlenecks.length > 0 ? bottlenecks.map(b => `- ${b.title} (Impact: ${b.impact})`).join('\n') : '- Keine offenen Engpässe'}

Aktuelle Chancen:
${opportunities.length > 0 ? opportunities.map(o => `- ${o.title} (Potenzial: ${o.potential})`).join('\n') : '- Keine identifizierten Chancen'}

Ungelesene Alerts:
${alerts.length > 0 ? alerts.map(a => `- [${a.severity.toUpperCase()}] ${a.title}`).join('\n') : '- Keine ungelesenen Alerts'}
`

    const systemPrompt = context
      ? `${FRANK_SYSTEM_PROMPT}\n\n${liveContext}\n\nZUSÄTZLICHER KONTEXT:\n${JSON.stringify(context, null, 2)}`
      : `${FRANK_SYSTEM_PROMPT}\n\n${liveContext}`

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
