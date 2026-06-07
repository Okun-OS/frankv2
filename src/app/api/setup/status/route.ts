import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const user = await prisma.user.findFirst()
  const profile = await prisma.founderProfile.findFirst()
  return NextResponse.json({
    setupCompleted: user?.setupCompleted ?? false,
    hasProfile: !!profile,
    user,
  })
}
