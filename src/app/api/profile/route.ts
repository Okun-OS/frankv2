import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const profile = await prisma.founderProfile.findFirst()
  const user = await prisma.user.findFirst()
  return NextResponse.json({ profile, user })
}

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const existing = await prisma.founderProfile.findFirst()

  if (existing) {
    const updated = await prisma.founderProfile.update({
      where: { id: existing.id },
      data: { ...body, updatedAt: new Date() },
    })
    // Sync user name + company
    const user = await prisma.user.findFirst()
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          name: body.founderName ?? user.name,
          company: body.companyName ?? user.company,
        },
      })
    }
    return NextResponse.json({ profile: updated })
  }

  return NextResponse.json({ error: 'Kein Profil gefunden' }, { status: 404 })
}
