import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const body = await req.json()

  // Save or update founder profile
  const existingProfile = await prisma.founderProfile.findFirst()
  if (existingProfile) {
    await prisma.founderProfile.update({
      where: { id: existingProfile.id },
      data: { ...body.profile, updatedAt: new Date() },
    })
  } else {
    await prisma.founderProfile.create({ data: body.profile })
  }

  // Update user
  const user = await prisma.user.findFirst()
  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: body.profile.founderName,
        company: body.profile.companyName,
        setupCompleted: true,
        updatedAt: new Date(),
      },
    })
  } else {
    await prisma.user.create({
      data: {
        name: body.profile.founderName,
        company: body.profile.companyName,
        setupCompleted: true,
      },
    })
  }

  // Seed initial KPIs based on profile
  const kpiCount = await prisma.kPI.count()
  if (kpiCount === 0) {
    await prisma.kPI.createMany({
      data: [
        { name: 'Umsatz (MTD)', category: 'revenue', unit: '€', target: 10000, current: 0, trend: 'up', period: 'MTD' },
        { name: 'Neue Leads', category: 'sales', unit: '', target: 50, current: 0, trend: 'neutral', period: 'Woche' },
        { name: 'Aktive Kunden', category: 'customers', unit: '', target: 20, current: 0, trend: 'up', period: 'Gesamt' },
        { name: 'Termine diese Woche', category: 'sales', unit: '', target: 10, current: 0, trend: 'neutral', period: 'Woche' },
        { name: 'Bewertung Ø', category: 'reputation', unit: '★', target: 5, current: 0, trend: 'up', period: 'Gesamt' },
        { name: 'Antwortquote Outreach', category: 'marketing', unit: '%', target: 5, current: 0, trend: 'neutral', period: 'MTD' },
      ],
    })
  }

  // Create initial alert
  await prisma.alert.create({
    data: {
      title: 'Willkommen bei FRANK OS!',
      description: 'Dein System ist eingerichtet. Frank analysiert jetzt deine Situation.',
      severity: 'success',
      category: 'system',
    },
  })

  return NextResponse.json({ success: true })
}
