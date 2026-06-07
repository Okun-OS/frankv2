import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature =
    req.headers.get('x-li-signature') || req.headers.get('x-hub-signature') || ''
  const secret = process.env.LINKEDIN_WEBHOOK_SECRET || ''

  if (secret && signature) {
    const expected = crypto.createHmac('sha256', secret).update(body).digest('hex')
    const sig = signature.startsWith('sha256=') ? signature.slice(7) : signature
    try {
      if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    } catch {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }
  }

  let payload: any
  try {
    payload = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const eventType = payload.eventType || payload.event || 'unknown'

  const event = await prisma.webhookEvent.create({
    data: { source: 'linkedin', eventType, payload: body },
  })

  try {
    // LinkedIn webhook event types: SHARE_STATISTICS_CHANGE, FOLLOWER_STATISTICS_CHANGE, etc.
    if (eventType.includes('SHARE') || eventType.includes('POST')) {
      const share = payload.share || {}
      await prisma.socialMetric.create({
        data: {
          platform: 'linkedin',
          postId: share.id || share.shareUrn || undefined,
          type: 'post',
          content:
            share.text?.text ||
            share.specificContent?.['com.linkedin.ugc.ShareContent']?.shareCommentary?.text ||
            undefined,
          likes: payload.totalShareStatistics?.likeCount || 0,
          comments: payload.totalShareStatistics?.commentCount || 0,
          shares: payload.totalShareStatistics?.shareCount || 0,
          reach: payload.totalShareStatistics?.uniqueImpressionsCount || 0,
          impressions: payload.totalShareStatistics?.impressionCount || 0,
          metadata: body,
        },
      })
    } else if (eventType.includes('FOLLOWER')) {
      await prisma.alert.create({
        data: {
          title: 'LinkedIn Follower Update',
          description: `Neue Follower: ${payload.followerGain || '+?'}`,
          severity: 'info',
          category: 'social',
        },
      })
    } else if (eventType.includes('COMMENT')) {
      await prisma.socialMetric.create({
        data: {
          platform: 'linkedin',
          type: 'comment',
          content: payload.comment?.message?.text || undefined,
          metadata: body,
        },
      })
    } else if (eventType.includes('MESSAGE') || eventType.includes('INMAIL')) {
      await prisma.alert.create({
        data: {
          title: 'Neue LinkedIn Nachricht',
          description: payload.sender?.localizedFirstName
            ? `Von: ${payload.sender.localizedFirstName} ${payload.sender.localizedLastName || ''}`
            : undefined,
          severity: 'info',
          category: 'social',
        },
      })
    }

    await prisma.webhookEvent.update({ where: { id: event.id }, data: { processed: true } })
  } catch (err: any) {
    await prisma.webhookEvent.update({
      where: { id: event.id },
      data: { error: err.message },
    })
  }

  return NextResponse.json({ received: true })
}
