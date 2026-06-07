import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import prisma from '@/lib/prisma'

async function getCalendarClient() {
  const token = await prisma.oAuthToken.findFirst({ where: { provider: 'google' } })
  if (!token) throw new Error('No Google token found')

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )
  oauth2Client.setCredentials({
    access_token: token.accessToken,
    refresh_token: token.refreshToken || undefined,
    expiry_date: token.expiresAt?.getTime(),
  })

  oauth2Client.on('tokens', async (tokens) => {
    if (tokens.access_token) {
      await prisma.oAuthToken.update({
        where: { id: token.id },
        data: {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token || token.refreshToken,
          expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
        },
      })
    }
  })

  return google.calendar({ version: 'v3', auth: oauth2Client })
}

export async function POST() {
  try {
    const calendar = await getCalendarClient()

    const now = new Date()
    const twoWeeksOut = new Date(now)
    twoWeeksOut.setDate(twoWeeksOut.getDate() + 14)

    const res = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: twoWeeksOut.toISOString(),
      maxResults: 50,
      singleEvents: true,
      orderBy: 'startTime',
    })

    const events = res.data.items || []
    let synced = 0

    for (const event of events) {
      if (!event.id || !event.start || !event.summary) continue

      const startTime = event.start.dateTime
        ? new Date(event.start.dateTime)
        : event.start.date
        ? new Date(event.start.date + 'T00:00:00')
        : null
      const endTime = event.end?.dateTime
        ? new Date(event.end.dateTime)
        : event.end?.date
        ? new Date(event.end.date + 'T23:59:59')
        : null

      if (!startTime || !endTime) continue

      const title = event.summary.toLowerCase()
      let type = 'meeting'
      if (title.includes('call') || title.includes('anruf') || title.includes('telefon')) type = 'call'
      else if (title.includes('focus') || title.includes('deep work') || title.includes('fokus')) type = 'focus'
      else if (title.includes('review') || title.includes('retrospektive')) type = 'review'

      const existing = await prisma.calendarEvent.findFirst({
        where: {
          title: event.summary,
          startTime,
        },
      })

      if (!existing) {
        await prisma.calendarEvent.create({
          data: {
            title: event.summary,
            description: event.description || undefined,
            startTime,
            endTime,
            type,
            location: event.location || undefined,
            color: type === 'call' ? '#f59e0b' : type === 'focus' ? '#8b5cf6' : type === 'review' ? '#ef4444' : '#3b82f6',
          },
        })
        synced++
      }
    }

    return NextResponse.json({ success: true, synced, total: events.length })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Calendar sync error:', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET() {
  const now = new Date()
  const twoWeeksOut = new Date(now)
  twoWeeksOut.setDate(twoWeeksOut.getDate() + 14)

  const events = await prisma.calendarEvent.findMany({
    where: {
      startTime: { gte: now, lte: twoWeeksOut },
    },
    orderBy: { startTime: 'asc' },
  })
  return NextResponse.json(events)
}
