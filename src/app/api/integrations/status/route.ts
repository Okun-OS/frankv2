import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const [tokens, integrations, recentEmails, recentDeals, recentSocial] = await Promise.all([
    prisma.oAuthToken.findMany({
      select: { provider: true, email: true, expiresAt: true, updatedAt: true },
    }),
    prisma.integration.findMany(),
    prisma.incomingEmail.findMany({ take: 5, orderBy: { receivedAt: 'desc' } }),
    prisma.dealEvent.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
    prisma.socialMetric.findMany({ take: 10, orderBy: { createdAt: 'desc' } }),
  ])

  return NextResponse.json({ tokens, integrations, recentEmails, recentDeals, recentSocial })
}
