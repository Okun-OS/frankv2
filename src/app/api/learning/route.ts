import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const proposals = await prisma.learningProposal.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
  return NextResponse.json(proposals)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const proposal = await prisma.learningProposal.create({
    data: {
      title: body.title,
      description: body.description,
      category: body.category,
      evidence: body.evidence,
      impact: body.impact || 'medium',
      source: body.source || 'frank',
    },
  })
  return NextResponse.json(proposal)
}

export async function PATCH(req: NextRequest) {
  const body = await req.json()
  const { id, action } = body // action: 'confirm' | 'reject'

  const proposal = await prisma.learningProposal.update({
    where: { id },
    data: {
      status: action === 'confirm' ? 'confirmed' : 'rejected',
      confirmedAt: action === 'confirm' ? new Date() : undefined,
      rejectedAt: action === 'reject' ? new Date() : undefined,
    },
  })

  // If confirmed, create a Memory entry
  if (action === 'confirm') {
    await prisma.memory.create({
      data: {
        title: proposal.title,
        content: proposal.description,
        category: 'learning',
        tags: JSON.stringify([proposal.category]),
        importance: proposal.impact === 'high' ? 5 : proposal.impact === 'medium' ? 3 : 2,
        source: 'learning_queue',
      },
    })
  }

  return NextResponse.json(proposal)
}
