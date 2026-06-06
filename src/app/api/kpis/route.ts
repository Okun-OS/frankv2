import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const kpis = await prisma.kPI.findMany({
      where: { isActive: true },
      include: { values: { orderBy: { date: 'desc' }, take: 10 } },
      orderBy: { createdAt: 'asc' },
    })
    return NextResponse.json(kpis)
  } catch (error) {
    console.error('KPIs GET error:', error)
    return NextResponse.json({ error: 'Fehler beim Laden der KPIs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const kpi = await prisma.kPI.create({
      data: {
        name: body.name,
        category: body.category,
        unit: body.unit,
        target: body.target,
        current: body.current || 0,
        period: body.period || 'MTD',
      },
    })
    return NextResponse.json(kpi, { status: 201 })
  } catch (error) {
    console.error('KPIs POST error:', error)
    return NextResponse.json({ error: 'Fehler beim Erstellen des KPIs' }, { status: 500 })
  }
}
