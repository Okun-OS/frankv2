import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const profiles = await prisma.founderProfile.findMany({
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      founderName: true,
      companyName: true,
      isActive: true,
      createdAt: true,
    },
  })
  return NextResponse.json({ profiles })
}
