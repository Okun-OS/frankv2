import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/setup/reset — resets onboarding so the wizard runs again
export async function GET() {
  const user = await prisma.user.findFirst()
  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: { setupCompleted: false },
    })
  }

  await prisma.founderProfile.deleteMany()

  return NextResponse.redirect(new URL('/setup', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'))
}
