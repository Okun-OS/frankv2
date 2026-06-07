import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import prisma from '@/lib/prisma'

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
)

// Flexible column matching — detects German and English outreach headers
function detectColumn(headers: string[], candidates: string[]): number {
  return headers.findIndex(h =>
    candidates.some(c => h.toLowerCase().includes(c.toLowerCase()))
  )
}

export async function POST(req: NextRequest) {
  try {
    const { sheetId } = await req.json()
    if (!sheetId) return NextResponse.json({ error: 'sheetId required' }, { status: 400 })

    const token = await prisma.oAuthToken.findFirst({ where: { provider: 'google' } })
    if (!token) return NextResponse.json({ error: 'Google not connected' }, { status: 401 })

    oauth2Client.setCredentials({
      access_token: token.accessToken,
      refresh_token: token.refreshToken ?? undefined,
    })

    const sheets = google.sheets({ version: 'v4', auth: oauth2Client })

    // Read first sheet
    const meta = await sheets.spreadsheets.get({ spreadsheetId: sheetId })
    const firstSheet = meta.data.sheets?.[0]?.properties?.title ?? 'Sheet1'

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: firstSheet,
    })

    const rows = res.data.values ?? []
    if (rows.length < 2) return NextResponse.json({ synced: 0, message: 'Sheet is empty' })

    const headers = (rows[0] as string[]).map(h => h?.toString() ?? '')
    const dataRows = rows.slice(1) as string[][]

    // Detect column indices
    const nameCol    = detectColumn(headers, ['name', 'kontakt', 'person', 'vorname', 'contact'])
    const companyCol = detectColumn(headers, ['company', 'unternehmen', 'firma', 'organisation'])
    const statusCol  = detectColumn(headers, ['status', 'antwort', 'reply', 'response', 'ergebnis', 'result'])
    const dateCol    = detectColumn(headers, ['datum', 'date', 'gesendet', 'sent', 'created'])
    const noteCol    = detectColumn(headers, ['notiz', 'note', 'kommentar', 'comment', 'nachricht', 'message'])
    const linkedinCol = detectColumn(headers, ['linkedin', 'profil', 'url', 'link'])

    // Status categories used to detect replies / meetings
    const REPLY_KEYWORDS   = ['antwort', 'geantwortet', 'replied', 'reply', 'interessiert', 'interested', 'ja', 'yes']
    const MEETING_KEYWORDS = ['termin', 'meeting', 'call', 'gespräch', 'gebucht', 'booked', 'demo']
    const SENT_KEYWORDS    = ['gesendet', 'sent', 'kontaktiert', 'outreach', 'offen', 'open', 'pending']

    let syncedCount = 0
    let repliesCount = 0
    let meetingsCount = 0
    let sentCount = 0

    for (const row of dataRows) {
      const name    = nameCol >= 0 ? row[nameCol]?.toString()?.trim() : undefined
      const company = companyCol >= 0 ? row[companyCol]?.toString()?.trim() : undefined
      const status  = statusCol >= 0 ? row[statusCol]?.toString()?.trim()?.toLowerCase() : ''
      const note    = noteCol >= 0 ? row[noteCol]?.toString()?.trim() : undefined
      const dateStr = dateCol >= 0 ? row[dateCol]?.toString()?.trim() : undefined

      if (!name && !company) continue

      const isReply   = REPLY_KEYWORDS.some(k => status?.includes(k))
      const isMeeting = MEETING_KEYWORDS.some(k => status?.includes(k))
      const isSent    = !isReply && !isMeeting && SENT_KEYWORDS.some(k => status?.includes(k))

      let eventType = 'outreach_sent'
      if (isReply) eventType = 'outreach_replied'
      if (isMeeting) eventType = 'meeting_booked'

      if (isReply) repliesCount++
      if (isMeeting) meetingsCount++
      if (isSent || (!isReply && !isMeeting)) sentCount++

      const createdAt = dateStr ? (new Date(dateStr).toString() !== 'Invalid Date' ? new Date(dateStr) : new Date()) : new Date()

      await prisma.dealEvent.upsert({
        where: {
          // Upsert by source+contactName+eventType to avoid duplicates
          id: `sheets-${sheetId.slice(-8)}-${(name ?? company ?? '').replace(/\s/g, '_').slice(0, 20)}-${eventType}`,
        },
        create: {
          id: `sheets-${sheetId.slice(-8)}-${(name ?? company ?? '').replace(/\s/g, '_').slice(0, 20)}-${eventType}`,
          source: 'google_sheets',
          contactName: name,
          dealName: company,
          eventType,
          note: note ?? status,
          metadata: JSON.stringify({ sheetId, headers: headers.join(',') }),
          createdAt,
        },
        update: {
          note: note ?? status,
        },
      })

      syncedCount++
    }

    // Save sheet ID in Integration config
    const existingIntegration = await prisma.integration.findFirst({ where: { type: 'google_sheets' } })
    if (existingIntegration) {
      await prisma.integration.update({
        where: { id: existingIntegration.id },
        data: { status: 'connected', lastSync: new Date(), config: JSON.stringify({ sheetId }) },
      })
    } else {
      await prisma.integration.create({
        data: {
          name: 'Google Sheets Outreach',
          type: 'google_sheets',
          status: 'connected',
          config: JSON.stringify({ sheetId }),
          lastSync: new Date(),
        },
      })
    }

    // Update outreach KPI if it exists
    const outreachKpi = await prisma.kPI.findFirst({ where: { name: { contains: 'Antwortquote' } } })
    if (outreachKpi && sentCount > 0) {
      const rate = Math.round((repliesCount / (sentCount + repliesCount + meetingsCount)) * 100)
      await prisma.kPI.update({
        where: { id: outreachKpi.id },
        data: { current: rate, previous: outreachKpi.current },
      })
    }

    // Update appointments KPI
    const termineKpi = await prisma.kPI.findFirst({ where: { name: { contains: 'Termine' } } })
    if (termineKpi && meetingsCount > 0) {
      await prisma.kPI.update({
        where: { id: termineKpi.id },
        data: { current: meetingsCount, previous: termineKpi.current },
      })
    }

    // Alert if reply rate is low
    if (sentCount > 10) {
      const replyRate = (repliesCount / (sentCount + repliesCount + meetingsCount)) * 100
      if (replyRate < 3) {
        await prisma.alert.create({
          data: {
            title: 'Niedrige Outreach-Antwortquote',
            description: `Nur ${replyRate.toFixed(1)}% Antwortrate im Sheet (${repliesCount} von ${sentCount + repliesCount + meetingsCount} Kontakten). Frank empfiehlt: Nachrichten testen.`,
            severity: 'warning',
            category: 'outreach',
          },
        })
      }
    }

    return NextResponse.json({
      synced: syncedCount,
      replies: repliesCount,
      meetings: meetingsCount,
      sent: sentCount,
      replyRate: sentCount > 0 ? ((repliesCount / (sentCount + repliesCount + meetingsCount)) * 100).toFixed(1) + '%' : 'n/a',
    })
  } catch (err) {
    console.error('Sheets sync error:', err)
    return NextResponse.json({ error: 'Sync failed', detail: String(err) }, { status: 500 })
  }
}

export async function GET() {
  const integration = await prisma.integration.findFirst({ where: { type: 'google_sheets' } })
  return NextResponse.json({
    connected: integration?.status === 'connected',
    lastSync: integration?.lastSync,
    sheetId: integration?.config ? JSON.parse(integration.config).sheetId : null,
  })
}
