import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { profileId } = await req.json()
  if (!profileId) return NextResponse.json({ error: 'profileId required' }, { status: 400 })

  // Deactivate all, then activate selected
  await prisma.founderProfile.updateMany({ data: { isActive: false } })
  const profile = await prisma.founderProfile.update({
    where: { id: profileId },
    data: { isActive: true },
  })

  // Sync User record
  const user = await prisma.user.findFirst()
  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: { name: profile.founderName, company: profile.companyName, setupCompleted: true },
    })
  }

  return NextResponse.json({ success: true })
}
