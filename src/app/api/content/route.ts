import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const items = await prisma.contentItem.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
  })
  return NextResponse.json(items)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const item = await prisma.contentItem.create({
    data: {
      title: body.title,
      body: body.body,
      platform: body.platform || 'linkedin',
      type: body.type || 'post',
      status: body.status || 'draft',
      scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : undefined,
      tags: body.tags ? JSON.stringify(body.tags) : undefined,
    },
  })
  return NextResponse.json(item)
}
