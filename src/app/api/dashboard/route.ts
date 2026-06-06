import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [kpis, alerts, bottlenecks, opportunities, goals, agents] = await Promise.all([
      prisma.kPI.findMany({ where: { isActive: true }, take: 5 }),
      prisma.alert.findMany({ where: { isRead: false }, orderBy: { createdAt: 'desc' }, take: 10 }),
      prisma.bottleneck.findMany({ where: { status: { not: 'resolved' } }, orderBy: { createdAt: 'desc' }, take: 3 }),
      prisma.opportunity.findMany({ where: { status: { in: ['identified', 'pursuing'] } }, orderBy: { createdAt: 'desc' }, take: 3 }),
      prisma.goal.findMany({ where: { status: 'active' }, orderBy: { priority: 'asc' }, take: 5 }),
      prisma.agent.findMany({ orderBy: { createdAt: 'asc' } }),
    ])

    return NextResponse.json({
      kpis,
      alerts,
      bottlenecks,
      opportunities,
      goals,
      agents,
    })
  } catch (error) {
    console.error('Dashboard GET error:', error)
    return NextResponse.json({ error: 'Fehler beim Laden des Dashboards' }, { status: 500 })
  }
}
