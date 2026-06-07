import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  const error = req.nextUrl.searchParams.get('error')

  if (error || !code) {
    return NextResponse.redirect(new URL('/integrations?error=linkedin_denied', req.url))
  }

  try {
    // Exchange code for token
    const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI || '',
        client_id: process.env.LINKEDIN_CLIENT_ID || '',
        client_secret: process.env.LINKEDIN_CLIENT_SECRET || '',
      }),
    })

    const tokenData = await tokenRes.json()
    if (!tokenData.access_token) {
      throw new Error('No access token received')
    }

    // Fetch LinkedIn profile
    const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    const profile = await profileRes.json()

    const expiresAt = tokenData.expires_in
      ? new Date(Date.now() + tokenData.expires_in * 1000)
      : undefined

    // Upsert token
    const existing = await prisma.oAuthToken.findFirst({ where: { provider: 'linkedin' } })
    if (existing) {
      await prisma.oAuthToken.update({
        where: { id: existing.id },
        data: {
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token || undefined,
          expiresAt,
          scope: 'openid profile email w_member_social r_basicprofile',
          email: profile.email || undefined,
          updatedAt: new Date(),
        },
      })
    } else {
      await prisma.oAuthToken.create({
        data: {
          provider: 'linkedin',
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token || undefined,
          expiresAt,
          scope: 'openid profile email w_member_social r_basicprofile',
          email: profile.email || undefined,
        },
      })
    }

    // Update Integration record
    const existingInt = await prisma.integration.findFirst({ where: { type: 'linkedin' } })
    if (existingInt) {
      await prisma.integration.update({
        where: { id: existingInt.id },
        data: { status: 'connected', lastSync: new Date() },
      })
    } else {
      await prisma.integration.create({
        data: { name: 'LinkedIn', type: 'linkedin', status: 'connected' },
      })
    }

    return NextResponse.redirect(new URL('/integrations?success=linkedin', req.url))
  } catch (err: unknown) {
    console.error('LinkedIn OAuth error:', err)
    return NextResponse.redirect(new URL('/integrations?error=linkedin_failed', req.url))
  }
}
