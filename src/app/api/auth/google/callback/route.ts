// GET /api/auth/google/callback?code=...
// Exchanges code for tokens, saves to DB, redirects to /integrations
import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import prisma from '@/lib/prisma'

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
)

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  if (!code) return NextResponse.redirect(new URL('/integrations?error=no_code', req.url))

  try {
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)

    // Get user email
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
    const { data } = await oauth2.userinfo.get()

    // Find existing token for google
    const existing = await prisma.oAuthToken.findFirst({ where: { provider: 'google' } })

    if (existing) {
      await prisma.oAuthToken.update({
        where: { id: existing.id },
        data: {
          accessToken: tokens.access_token!,
          refreshToken: tokens.refresh_token || existing.refreshToken,
          expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
          scope: tokens.scope,
          email: data.email || existing.email,
          updatedAt: new Date(),
        },
      })
    } else {
      await prisma.oAuthToken.create({
        data: {
          provider: 'google',
          accessToken: tokens.access_token!,
          refreshToken: tokens.refresh_token || undefined,
          expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
          scope: tokens.scope,
          email: data.email || undefined,
        },
      })
    }

    // Update Integration record
    const existingIntegration = await prisma.integration.findFirst({ where: { type: 'gmail' } })
    if (existingIntegration) {
      await prisma.integration.update({
        where: { id: existingIntegration.id },
        data: { status: 'connected', lastSync: new Date() },
      })
    } else {
      await prisma.integration.create({
        data: { name: 'Gmail', type: 'gmail', status: 'connected' },
      })
    }

    return NextResponse.redirect(new URL('/integrations?success=gmail', req.url))
  } catch (err) {
    console.error('Gmail OAuth error:', err)
    return NextResponse.redirect(new URL('/integrations?error=oauth_failed', req.url))
  }
}
