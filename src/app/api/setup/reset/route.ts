import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const user = await prisma.user.findFirst()
  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: { setupCompleted: false },
    })
  }

  await prisma.founderProfile.deleteMany()

  return NextResponse.redirect(new URL('/setup', req.url))
}
