import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import prisma from '@/lib/prisma'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' })

export async function POST(req: NextRequest) {
  try {
    const { date } = await req.json().catch(() => ({}))

    const [kpis, goals, bottlenecks, opportunities, alerts, founderProfile, todayPlan] = await Promise.all([
      prisma.kPI.findMany({ where: { isActive: true }, take: 6 }),
      prisma.goal.findMany({ where: { status: 'active' }, take: 3 }),
      prisma.bottleneck.findMany({ where: { status: { not: 'resolved' } }, take: 3, orderBy: { createdAt: 'desc' } }),
      prisma.opportunity.findMany({ where: { status: 'identified' }, take: 3 }),
      prisma.alert.findMany({ where: { isRead: false }, take: 5, orderBy: { createdAt: 'desc' } }),
      prisma.founderProfile.findFirst({ where: { isActive: true } }).catch(() => prisma.founderProfile.findFirst()),
      prisma.dailyPlan.findFirst({ where: { date: { gte: new Date(new Date().setHours(0,0,0,0)) } }, include: { tasks: true } }),
    ])

    const profileCtx = founderProfile ? `
Founder: ${founderProfile.founderName}, ${founderProfile.companyName}
Ziel: ${founderProfile.biggestGoal}
Problem: ${founderProfile.biggestChallenge}
Kanäle: ${founderProfile.acquisitionChannels}
Umsatz: ${founderProfile.currentRevenue || 'unbekannt'}
Kunden: ${founderProfile.currentCustomers || 'unbekannt'}` : ''

    const today = date || new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })

    const prompt = `Du bist FRANK, digitaler COO. Erstelle das heutige Executive Briefing für ${today}.

${profileCtx}

LIVE DATEN:
KPIs: ${kpis.map(k => `${k.name}: ${k.current}${k.unit} (Ziel: ${k.target}${k.unit})`).join(', ') || 'keine'}
Ziele: ${goals.map(g => `${g.title} (${g.progress}%)`).join(', ') || 'keine'}
Engpässe: ${bottlenecks.map(b => `${b.title} [${b.impact}]`).join(', ') || 'keine'}
Chancen: ${opportunities.map(o => `${o.title} [${o.potential}]`).join(', ') || 'keine'}
Alerts: ${alerts.map(a => a.title).join(', ') || 'keine'}

Antworte NUR mit diesem exakten JSON-Format, kein Text davor oder danach:
{
  "mainGoal": { "title": "...", "description": "..." },
  "bottleneck": { "title": "...", "impact": "...", "action": "..." },
  "opportunity": { "title": "...", "potential": "..." },
  "risks": ["...", "...", "..."],
  "priorities": ["...", "...", "...", "..."],
  "dayPlan": [
    { "time": "09:00–11:00", "activity": "...", "category": "outreach" },
    { "time": "11:00–12:00", "activity": "...", "category": "admin" },
    { "time": "13:00–15:00", "activity": "...", "category": "focus" },
    { "time": "15:00–17:00", "activity": "...", "category": "content" }
  ],
  "coo_message": "Ein direkter Satz von dir als COO was heute wirklich zählt."
}`

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return NextResponse.json({ error: 'Invalid response format' }, { status: 500 })

    const briefing = JSON.parse(jsonMatch[0])

    // Merge live KPI data
    briefing.kpis = kpis.slice(0, 4).map(k => ({
      name: k.name,
      current: `${k.current}${k.unit}`,
      target: `${k.target}${k.unit}`,
      trend: k.trend,
      ok: k.current >= k.target * 0.7,
    }))

    briefing.todayTaskCount = todayPlan?.tasks?.length ?? 0

    return NextResponse.json(briefing)
  } catch (err) {
    console.error('Briefing error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
