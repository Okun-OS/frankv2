import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

async function getLinkedInToken() {
  const token = await prisma.oAuthToken.findFirst({ where: { provider: 'linkedin' } })
  if (!token) throw new Error('LinkedIn nicht verbunden')
  return token
}

export async function POST() {
  try {
    const token = await getLinkedInToken()

    // Fetch profile info
    const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${token.accessToken}` },
    })

    if (!profileRes.ok) {
      throw new Error(`LinkedIn API error: ${profileRes.status}`)
    }

    const profile = await profileRes.json()

    // Try to fetch recent posts (requires w_member_social)
    let postsData: { elements?: Array<{
      id?: string
      specificContent?: { 'com.linkedin.ugc.ShareContent'?: { shareCommentary?: { text?: string } } }
      firstPublishedAt?: number
    }> } | null = null
    try {
      const postsRes = await fetch(
        'https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List(' +
        encodeURIComponent(`urn:li:person:${profile.sub}`) +
        ')&count=10',
        {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            'X-Restli-Protocol-Version': '2.0.0',
          },
        }
      )
      if (postsRes.ok) {
        postsData = await postsRes.json()
      }
    } catch {
      // posts fetch is optional
    }

    // Store posts as SocialMetrics
    let synced = 0
    if (postsData?.elements) {
      for (const post of postsData.elements) {
        const content = post.specificContent?.['com.linkedin.ugc.ShareContent']
          ?.shareCommentary?.text || ''
        const postId = post.id || ''

        const existing = await prisma.socialMetric.findFirst({
          where: { platform: 'linkedin', postId },
        })

        if (!existing && postId) {
          await prisma.socialMetric.create({
            data: {
              platform: 'linkedin',
              postId,
              type: 'post',
              content: content.substring(0, 500),
              publishedAt: post.firstPublishedAt ? new Date(post.firstPublishedAt) : undefined,
              metadata: JSON.stringify(post),
            },
          })
          synced++
        }
      }
    }

    // Update last sync
    await prisma.integration.updateMany({
      where: { type: 'linkedin' },
      data: { lastSync: new Date() },
    })

    return NextResponse.json({
      success: true,
      profile: {
        name: profile.name,
        email: profile.email,
        picture: profile.picture,
      },
      postssynced: synced,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unbekannter Fehler'
    console.error('LinkedIn sync error:', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET() {
  const token = await prisma.oAuthToken.findFirst({ where: { provider: 'linkedin' } })
  const posts = await prisma.socialMetric.findMany({
    where: { platform: 'linkedin' },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })
  return NextResponse.json({
    connected: !!token,
    email: token?.email,
    posts,
  })
}
