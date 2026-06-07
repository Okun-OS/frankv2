import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import Anthropic from '@anthropic-ai/sdk'
import prisma from '@/lib/prisma'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

async function getGmailClient() {
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

  // Auto-refresh
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

  return google.gmail({ version: 'v1', auth: oauth2Client })
}

function extractBody(payload: any): string {
  if (!payload) return ''

  if (payload.body?.data) {
    return Buffer.from(payload.body.data, 'base64').toString('utf-8')
  }

  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === 'text/plain' && part.body?.data) {
        return Buffer.from(part.body.data, 'base64').toString('utf-8')
      }
    }
    for (const part of payload.parts) {
      const result = extractBody(part)
      if (result) return result
    }
  }

  return ''
}

export async function POST() {
  try {
    const gmail = await getGmailClient()

    // Get last 20 unread messages
    const listRes = await gmail.users.messages.list({
      userId: 'me',
      q: 'is:unread newer_than:7d',
      maxResults: 20,
    })

    const messages = listRes.data.messages || []
    let processed = 0

    for (const msg of messages) {
      if (!msg.id) continue

      // Skip if already in DB
      const existing = await prisma.incomingEmail.findUnique({ where: { gmailId: msg.id } })
      if (existing) continue

      const full = await gmail.users.messages.get({ userId: 'me', id: msg.id, format: 'full' })
      const headers = full.data.payload?.headers || []

      const from = headers.find((h) => h.name === 'From')?.value || ''
      const subject = headers.find((h) => h.name === 'Subject')?.value || '(Kein Betreff)'
      const dateStr = headers.find((h) => h.name === 'Date')?.value || ''
      const body = extractBody(full.data.payload)
      const snippet = full.data.snippet || ''

      // Extract name and email from From header
      const fromMatch = from.match(/^(.+?)\s*<(.+?)>$/)
      const fromName = fromMatch ? fromMatch[1].trim().replace(/"/g, '') : undefined
      const fromEmail = fromMatch ? fromMatch[2] : from

      // AI Classification
      let category = 'uncategorized'
      let priority = 'normal'
      let sentiment = 'neutral'
      let aiSummary = ''

      if (process.env.ANTHROPIC_API_KEY && body) {
        try {
          const classification = await anthropic.messages.create({
            model: 'claude-sonnet-4-6',
            max_tokens: 200,
            messages: [
              {
                role: 'user',
                content: `Analysiere diese E-Mail und antworte NUR mit JSON:
Von: ${from}
Betreff: ${subject}
Inhalt: ${body.substring(0, 1000)}

JSON Format:
{"category": "lead|customer|review|support|newsletter|spam|uncategorized", "priority": "high|normal|low", "sentiment": "positive|neutral|negative", "summary": "max 1 Satz auf Deutsch"}`,
              },
            ],
          })

          const text =
            classification.content[0].type === 'text' ? classification.content[0].text : ''
          const jsonMatch = text.match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0])
            category = parsed.category || 'uncategorized'
            priority = parsed.priority || 'normal'
            sentiment = parsed.sentiment || 'neutral'
            aiSummary = parsed.summary || ''
          }
        } catch {
          // Ignore AI classification errors, use defaults
        }
      }

      await prisma.incomingEmail.create({
        data: {
          gmailId: msg.id,
          threadId: full.data.threadId || undefined,
          from: fromEmail,
          fromName,
          subject,
          snippet,
          body: body.substring(0, 10000),
          receivedAt: dateStr ? new Date(dateStr) : new Date(),
          category,
          priority,
          sentiment,
          aiSummary,
        },
      })

      // Create alert for high-priority or lead emails
      if (priority === 'high' || category === 'lead') {
        await prisma.alert.create({
          data: {
            title:
              category === 'lead'
                ? `Neuer Lead: ${fromName || fromEmail}`
                : `Wichtige E-Mail: ${subject}`,
            description: aiSummary || snippet,
            severity: priority === 'high' ? 'warning' : 'info',
            category: 'email',
          },
        })
      }

      // Update Integration sync time
      await prisma.integration.updateMany({
        where: { type: 'gmail' },
        data: { lastSync: new Date() },
      })

      processed++
    }

    return NextResponse.json({ success: true, processed })
  } catch (err: any) {
    console.error('Gmail sync error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function GET() {
  const emails = await prisma.incomingEmail.findMany({
    orderBy: { receivedAt: 'desc' },
    take: 50,
  })
  return NextResponse.json(emails)
}
