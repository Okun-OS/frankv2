import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const CATEGORY_COLORS: Record<string, string> = {
  focus: '#8b5cf6',
  meeting: '#3b82f6',
  sales: '#22c55e',
  content: '#f97316',
  call: '#f59e0b',
  admin: '#64748b',
  health: '#22c55e',
  review: '#ef4444',
  work: '#3b82f6',
}

export async function GET() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  const plan = await prisma.dailyPlan.findFirst({
    where: { date: { gte: today, lt: tomorrow } },
    include: { tasks: { orderBy: { startTime: 'asc' } } },
  })

  return NextResponse.json(plan)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  // Delete existing plan for today if any
  const existing = await prisma.dailyPlan.findFirst({
    where: { date: { gte: today, lt: tomorrow } },
  })
  if (existing) {
    await prisma.dailyTask.deleteMany({ where: { planId: existing.id } })
    await prisma.dailyPlan.delete({ where: { id: existing.id } })
  }

  const tasks: Array<{
    title: string
    startTime: string
    endTime: string
    category?: string
    priority?: number
  }> = body.tasks || []

  const plan = await prisma.dailyPlan.create({
    data: {
      date: today,
      progress: 0,
      tasks: {
        create: tasks.map((t) => ({
          title: t.title,
          startTime: t.startTime,
          endTime: t.endTime,
          category: t.category || 'work',
          priority: t.priority || 2,
          color: CATEGORY_COLORS[t.category || 'work'] || '#3b82f6',
          completed: false,
        })),
      },
    },
    include: { tasks: { orderBy: { startTime: 'asc' } } },
  })

  return NextResponse.json(plan)
}
