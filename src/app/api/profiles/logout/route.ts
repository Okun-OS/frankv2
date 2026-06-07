import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST() {
  await prisma.founderProfile.updateMany({ data: { isActive: false } })
  const user = await prisma.user.findFirst()
  if (user) {
    await prisma.user.update({ where: { id: user.id }, data: { setupCompleted: false } })
  }
  return NextResponse.json({ success: true })
}
