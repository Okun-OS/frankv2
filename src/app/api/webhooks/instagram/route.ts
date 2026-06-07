import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import prisma from '@/lib/prisma'

// Webhook verification (GET)
export async function GET(req: NextRequest) {
  const mode = req.nextUrl.searchParams.get('hub.mode')
  const token = req.nextUrl.searchParams.get('hub.verify_token')
  const challenge = req.nextUrl.searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}

// Webhook events (POST)
export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('x-hub-signature-256') || ''
  const secret = process.env.INSTAGRAM_APP_SECRET || ''

  if (secret) {
    const expected = 'sha256=' + crypto.createHmac('sha256', secret).update(body).digest('hex')
    try {
      if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
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

  for (const entry of payload.entry || []) {
    for (const change of entry.changes || []) {
      const event = await prisma.webhookEvent.create({
        data: {
          source: 'instagram',
          eventType: change.field || 'unknown',
          payload: JSON.stringify(change),
        },
      })

      try {
        const field = change.field
        const value = change.value || {}

        if (field === 'mentions' || field === 'comments') {
          await prisma.socialMetric.create({
            data: {
              platform: 'instagram',
              postId: value.media_id || undefined,
              type: field === 'mentions' ? 'mention' : 'comment',
              content: value.text || value.comment_text || undefined,
              metadata: JSON.stringify(value),
            },
          })

          await prisma.alert.create({
            data: {
              title: field === 'mentions' ? 'Instagram Erwähnung' : 'Neuer Instagram Kommentar',
              description: value.text || value.comment_text || undefined,
              severity: 'info',
              category: 'social',
            },
          })
        } else if (field === 'messages') {
          await prisma.socialMetric.create({
            data: {
              platform: 'instagram',
              type: 'message',
              content: value.message?.text || undefined,
              metadata: JSON.stringify(value),
            },
          })
        } else if (field === 'feed') {
          // New post published
          await prisma.socialMetric.create({
            data: {
              platform: 'instagram',
              postId: value.post_id || undefined,
              type: 'post',
              content: value.message || undefined,
              likes: value.likes || 0,
              comments: value.comments || 0,
              metadata: JSON.stringify(value),
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
    }
  }

  return NextResponse.json({ received: true })
}
