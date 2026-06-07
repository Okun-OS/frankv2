import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()

  const task = await prisma.dailyTask.update({
    where: { id },
    data: {
      completed: body.completed !== undefined ? body.completed : undefined,
      title: body.title,
      startTime: body.startTime,
      endTime: body.endTime,
      category: body.category,
      priority: body.priority,
    },
  })

  // Recalculate plan progress
  const allTasks = await prisma.dailyTask.findMany({ where: { planId: task.planId } })
  const completedCount = allTasks.filter((t) => t.completed).length
  const progress = allTasks.length > 0 ? (completedCount / allTasks.length) * 100 : 0
  await prisma.dailyPlan.update({ where: { id: task.planId }, data: { progress } })

  return NextResponse.json(task)
}
