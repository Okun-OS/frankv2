import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const dateParam = req.nextUrl.searchParams.get('date')
  const from = req.nextUrl.searchParams.get('from')
  const to = req.nextUrl.searchParams.get('to')

  if (dateParam) {
    const date = new Date(dateParam)
    date.setHours(0, 0, 0, 0)
    const next = new Date(date)
    next.setDate(next.getDate() + 1)
    const avail = await prisma.availability.findFirst({
      where: { date: { gte: date, lt: next } },
    })
    return NextResponse.json(avail)
  }

  const where = from && to ? {
    date: { gte: new Date(from), lte: new Date(to) }
  } : {}

  const records = await prisma.availability.findMany({
    where,
    orderBy: { date: 'asc' },
    take: 62,
  })
  return NextResponse.json(records)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const date = new Date(body.date)
  date.setHours(0, 0, 0, 0)

  const startTime = body.startTime ?? null
  const endTime = body.endTime ?? null

  // Calculate hours from startTime/endTime if provided
  let hours = body.hours ?? 0
  if (startTime && endTime && !body.hours) {
    const [sh, sm] = startTime.split(':').map(Number)
    const [eh, em] = endTime.split(':').map(Number)
    hours = Math.max(0, (eh * 60 + em - sh * 60 - sm) / 60)
  }

  const record = await prisma.availability.upsert({
    where: { date },
    update: {
      hours,
      startTime,
      endTime,
      notAvailable: body.notAvailable ?? false,
      timeSlots: body.timeSlots ? JSON.stringify(body.timeSlots) : undefined,
      note: body.note ?? null,
      focusType: body.focusType || 'balanced',
      updatedAt: new Date(),
    },
    create: {
      date,
      hours,
      startTime,
      endTime,
      notAvailable: body.notAvailable ?? false,
      timeSlots: body.timeSlots ? JSON.stringify(body.timeSlots) : undefined,
      note: body.note ?? null,
      focusType: body.focusType || 'balanced',
    },
  })
  return NextResponse.json(record)
}
