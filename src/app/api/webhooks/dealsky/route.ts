import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import prisma from '@/lib/prisma'

function verifySignature(body: string, signature: string, secret: string): boolean {
  if (!secret) return true // Skip verification if no secret configured
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex')
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('x-dealsky-signature') || ''
  const secret = process.env.DEALSKY_WEBHOOK_SECRET || ''

  if (secret && !verifySignature(body, signature, secret)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  let payload: any
  try {
    payload = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Save raw event
  const event = await prisma.webhookEvent.create({
    data: {
      source: 'dealsky',
      eventType: payload.event || payload.type || 'unknown',
      payload: body,
    },
  })

  // Process deal event
  try {
    const eventType = payload.event || payload.type || 'unknown'

    await prisma.dealEvent.create({
      data: {
        source: 'dealsky',
        dealId: payload.deal?.id || payload.id || undefined,
        dealName: payload.deal?.name || payload.name || undefined,
        stage: payload.deal?.stage || payload.stage || undefined,
        value: payload.deal?.value || payload.value || undefined,
        currency: payload.deal?.currency || 'EUR',
        contactName: payload.deal?.contact?.name || payload.contact?.name || undefined,
        contactEmail: payload.deal?.contact?.email || payload.contact?.email || undefined,
        eventType,
        note: payload.note || payload.deal?.note || undefined,
        metadata: JSON.stringify(payload),
      },
    })

    // Create alert for won/lost deals
    if (eventType === 'deal_won') {
      const value = payload.deal?.value || payload.value
      await prisma.alert.create({
        data: {
          title: `Deal gewonnen: ${payload.deal?.name || payload.name || 'Unbekannt'}`,
          description: value ? `Wert: ${value.toLocaleString('de-DE')} EUR` : undefined,
          severity: 'success',
          category: 'crm',
        },
      })
    } else if (eventType === 'deal_lost') {
      await prisma.alert.create({
        data: {
          title: `Deal verloren: ${payload.deal?.name || payload.name || 'Unbekannt'}`,
          description: payload.reason || undefined,
          severity: 'warning',
          category: 'crm',
        },
      })
    } else if (eventType === 'deal_created') {
      await prisma.alert.create({
        data: {
          title: `Neuer Deal: ${payload.deal?.name || payload.name || 'Unbekannt'}`,
          description: `Stage: ${payload.deal?.stage || payload.stage || '—'}`,
          severity: 'info',
          category: 'crm',
        },
      })
    }

    // Mark event as processed
    await prisma.webhookEvent.update({ where: { id: event.id }, data: { processed: true } })
  } catch (err: any) {
    await prisma.webhookEvent.update({
      where: { id: event.id },
      data: { error: err.message },
    })
  }

  return NextResponse.json({ received: true })
}
