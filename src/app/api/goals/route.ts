import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const goals = await prisma.goal.findMany({
      include: { milestones: true },
      orderBy: [{ priority: 'asc' }, { createdAt: 'desc' }],
    })
    return NextResponse.json(goals)
  } catch (error) {
    console.error('Goals GET error:', error)
    return NextResponse.json({ error: 'Fehler beim Laden der Ziele' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const goal = await prisma.goal.create({
      data: {
        title: body.title,
        description: body.description,
        category: body.category,
        status: body.status || 'active',
        priority: body.priority || 1,
        targetValue: body.targetValue,
        unit: body.unit,
        deadline: body.deadline ? new Date(body.deadline) : undefined,
        progress: body.progress || 0,
      },
    })
    return NextResponse.json(goal, { status: 201 })
  } catch (error) {
    console.error('Goals POST error:', error)
    return NextResponse.json({ error: 'Fehler beim Erstellen des Ziels' }, { status: 500 })
  }
}
