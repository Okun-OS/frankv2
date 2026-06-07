import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const items = await prisma.contentItem.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    const itemsWithPipeline = items.map((item) => {
      let parsedMetadata: Record<string, unknown> = {}
      if (item.metadata) {
        try {
          parsedMetadata = JSON.parse(item.metadata)
        } catch {
          // ignore parse errors
        }
      }

      return {
        ...item,
        pipelineData: parsedMetadata,
      }
    })

    return NextResponse.json(itemsWithPipeline)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unbekannter Fehler'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, platform, type, stage, data } = body

    const metadata = JSON.stringify({
      stage: stage || 'thema',
      ...(data || {}),
    })

    const item = await prisma.contentItem.create({
      data: {
        title: title || 'Neuer Content',
        platform: platform || 'linkedin',
        type: type || 'post',
        status: 'draft',
        metadata,
      },
    })

    return NextResponse.json(item)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unbekannter Fehler'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, stage, data } = body

    if (!id) {
      return NextResponse.json({ error: 'id ist erforderlich' }, { status: 400 })
    }

    const existing = await prisma.contentItem.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'ContentItem nicht gefunden' }, { status: 404 })
    }

    let existingMetadata: Record<string, unknown> = {}
    if (existing.metadata) {
      try {
        existingMetadata = JSON.parse(existing.metadata)
      } catch {
        // ignore
      }
    }

    const updatedMetadata = {
      ...existingMetadata,
      stage: stage || existingMetadata.stage,
      ...(data || {}),
    }

    // Determine status based on stage
    let status = existing.status
    if (stage === 'veroeffentlichung') {
      status = 'published'
    } else if (stage === 'finalisierung') {
      status = 'scheduled'
    }

    const updated = await prisma.contentItem.update({
      where: { id },
      data: {
        metadata: JSON.stringify(updatedMetadata),
        status,
        // Update body if text content provided
        ...(data?.generatedText ? { body: data.generatedText } : {}),
        // Update title if topic provided
        ...(data?.topic && !existing.title.startsWith('N') ? {} : data?.topic ? { title: data.topic.slice(0, 100) } : {}),
      },
    })

    return NextResponse.json(updated)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unbekannter Fehler'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
