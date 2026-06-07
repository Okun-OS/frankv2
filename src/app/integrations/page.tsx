'use client'

import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/layout/Header'
import {
  CheckCircle,
  XCircle,
  Copy,
  Check,
  RefreshCw,
  Mail,
  Briefcase,
  Share2,
  ChevronRight,
  AlertCircle,
  Key,
} from 'lucide-react'

interface StatusData {
  tokens: Array<{
    provider: string
    email: string | null
    expiresAt: string | null
    updatedAt: string
  }>
  integrations: Array<{
    id: string
    name: string
    type: string
    status: string
    lastSync: string | null
  }>
  recentEmails: Array<{
    id: string
    from: string
    fromName: string | null
    subject: string
    snippet: string | null
    category: string
    priority: string
    sentiment: string | null
    aiSummary: string | null
    receivedAt: string
  }>
  recentDeals: Array<{
    id: string
    dealName: string | null
    eventType: string
    stage: string | null
    value: number | null
    currency: string
    contactName: string | null
    createdAt: string
  }>
  recentSocial: Array<{
    id: string
    platform: string
    type: string
    content: string | null
    likes: number
    comments: number
    createdAt: string
  }>
}

interface LinkedInPost {
  id: string
  platform: string
  type: string
  content: string | null
  publishedAt: string | null
  createdAt: string
}

const categoryColors: Record<string, string> = {
  lead: '#f59e0b',
  customer: '#22c55e',
  review: '#8b5cf6',
  support: '#3b82f6',
  newsletter: '#64748b',
  spam: '#ef4444',
  uncategorized: '#475569',
}

const priorityColors: Record<string, string> = {
  high: '#ef4444',
  normal: '#64748b',
  low: '#475569',
}

const eventTypeLabels: Record<string, string> = {
  deal_created: 'Neu',
  deal_won: 'Gewonnen',
  deal_lost: 'Verloren',
  stage_changed: 'Stage',
  note_added: 'Notiz',
  unknown: 'Event',
}

const eventTypeColors: Record<string, string> = {
  deal_won: '#22c55e',
  deal_lost: '#ef4444',
  deal_created: '#f59e0b',
  stage_changed: '#3b82f6',
  note_added: '#8b5cf6',
}

export default function IntegrationsPage() {
  const [status, setStatus] = useState<StatusData | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'emails' | 'deals' | 'social'>('emails')
  const [syncResult, setSyncResult] = useState<string | null>(null)
  const [linkedInSyncing, setLinkedInSyncing] = useState(false)
  const [linkedInResult, setLinkedInResult] = useState<string | null>(null)
  const [linkedInPosts, setLinkedInPosts] = useState<LinkedInPost[]>([])
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/integrations/status')
      const data = await res.json()
      setStatus(data)
    } catch (err) {
      console.error('Failed to fetch status', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchLinkedInPosts = useCallback(async () => {
    try {
      const res = await fetch('/api/sync/linkedin')
      const data = await res.json()
      if (data.posts) {
        setLinkedInPosts(data.posts)
      }
    } catch {
      // silently ignore
    }
  }, [])

  useEffect(() => {
    fetchStatus()
    fetchLinkedInPosts()

    // Handle URL params for OAuth redirect
    const params = new URLSearchParams(window.location.search)
    const success = params.get('success')
    const error = params.get('error')
    if (success === 'linkedin') {
      setBanner({ type: 'success', message: 'LinkedIn erfolgreich verbunden!' })
      window.history.replaceState({}, '', '/integrations')
    } else if (error === 'linkedin_denied') {
      setBanner({ type: 'error', message: 'LinkedIn-Verbindung abgebrochen.' })
      window.history.replaceState({}, '', '/integrations')
    } else if (error === 'linkedin_failed') {
      setBanner({ type: 'error', message: 'LinkedIn-Verbindung fehlgeschlagen. Bitte erneut versuchen.' })
      window.history.replaceState({}, '', '/integrations')
    }

    const timer = setTimeout(() => setBanner(null), 5000)
    return () => clearTimeout(timer)
  }, [fetchStatus, fetchLinkedInPosts])

  async function syncLinkedIn() {
    setLinkedInSyncing(true)
    setLinkedInResult(null)
    try {
      const res = await fetch('/api/sync/linkedin', { method: 'POST' })
      const data = await res.json()
      if (data.error) {
        setLinkedInResult(`Fehler: ${data.error}`)
      } else {
        setLinkedInResult(`${data.postssynced ?? 0} neue Posts synchronisiert`)
        await fetchLinkedInPosts()
        await fetchStatus()
      }
    } catch {
      setLinkedInResult('Verbindungsfehler')
    } finally {
      setLinkedInSyncing(false)
    }
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

  const webhooks = [
    {
      name: 'Dealsky',
      key: 'dealsky',
      url: `${baseUrl}/api/webhooks/dealsky`,
      color: '#f59e0b',
      icon: '💼',
      desc: 'Deal-Events, Stage-Änderungen, Won/Lost',
      envVars: ['DEALSKY_WEBHOOK_SECRET'],
      method: 'POST',
    },
    {
      name: 'Instagram',
      key: 'instagram',
      url: `${baseUrl}/api/webhooks/instagram`,
      color: '#e1306c',
      icon: '📸',
      desc: 'Comments, Mentions, Messages, Feed (GET für Verification)',
      envVars: ['INSTAGRAM_WEBHOOK_VERIFY_TOKEN', 'INSTAGRAM_APP_SECRET'],
      method: 'GET + POST',
    },
    {
      name: 'LinkedIn',
      key: 'linkedin',
      url: `${baseUrl}/api/webhooks/linkedin`,
      color: '#0077b5',
      icon: '🔗',
      desc: 'Posts, Comments, Follower-Updates, Messages',
      envVars: ['LINKEDIN_WEBHOOK_SECRET'],
      method: 'POST',
    },
  ]

  const gmailToken = status?.tokens?.find((t) => t.provider === 'google')
  const gmailIntegration = status?.integrations?.find((i) => i.type === 'gmail')
  const isGmailConnected = !!gmailToken && gmailIntegration?.status === 'connected'

  const linkedInToken = status?.tokens?.find((t) => t.provider === 'linkedin')
  const linkedInIntegration = status?.integrations?.find((i) => i.type === 'linkedin')
  const isLinkedInConnected = !!linkedInToken && linkedInIntegration?.status === 'connected'

  async function syncGmail() {
    setSyncing(true)
    setSyncResult(null)
    try {
      const res = await fetch('/api/sync/gmail', { method: 'POST' })
      const data = await res.json()
      if (data.error) {
        setSyncResult(`Fehler: ${data.error}`)
      } else {
        setSyncResult(`${data.processed} neue E-Mails verarbeitet`)
        await fetchStatus()
      }
    } catch {
      setSyncResult('Verbindungsfehler')
    } finally {
      setSyncing(false)
    }
  }

  function copyUrl(url: string, key: string) {
    navigator.clipboard.writeText(url)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  function formatTime(dateStr: string | null) {
    if (!dateStr) return '—'
    const date = new Date(dateStr)
    const diff = Date.now() - date.getTime()
    const mins = Math.floor(diff / 60000)
    const hours = Math.floor(mins / 60)
    const days = Math.floor(hours / 24)
    if (mins < 2) return 'gerade eben'
    if (mins < 60) return `vor ${mins} Min`
    if (hours < 24) return `vor ${hours}h`
    return `vor ${days}d`
  }

  return (
    <div>
      <Header
        title="Integrations"
        subtitle="Verbinde FRANK OS mit Gmail, Dealsky, Instagram & LinkedIn"
      />
      <div className="p-6 space-y-6">

        {/* Banner for OAuth redirects */}
        {banner && (
          <div
            style={{
              backgroundColor: banner.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${banner.type === 'success' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
              color: banner.type === 'success' ? '#22c55e' : '#ef4444',
              fontSize: '13px',
              padding: '12px 16px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 600,
            }}
          >
            {banner.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
            {banner.message}
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-3">
          {[
            {
              label: 'Gmail',
              value: isGmailConnected ? 'Verbunden' : 'Getrennt',
              color: isGmailConnected ? '#22c55e' : '#64748b',
            },
            {
              label: 'E-Mails',
              value: status?.recentEmails?.length != null ? String(status.recentEmails.length) + (status.recentEmails.length === 50 ? '+' : '') : '—',
              color: '#3b82f6',
            },
            {
              label: 'Deal Events',
              value: status?.recentDeals != null ? String(status.recentDeals.length) : '—',
              color: '#f59e0b',
            },
            {
              label: 'Social Events',
              value: status?.recentSocial != null ? String(status.recentSocial.length) : '—',
              color: '#8b5cf6',
            },
          ].map((stat) => (
            <div key={stat.label} className="card p-4">
              <p style={{ color: '#64748b', fontSize: '11px', fontWeight: 500 }} className="mb-1">
                {stat.label}
              </p>
              <p style={{ color: stat.color, fontSize: '20px', fontWeight: 700 }}>
                {loading ? '...' : stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Gmail Card */}
        <div
          className="card p-5"
          style={{ borderColor: isGmailConnected ? 'rgba(34,197,94,0.2)' : '#1e2130' }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                style={{
                  backgroundColor: 'rgba(219,68,55,0.1)',
                  border: '1px solid rgba(219,68,55,0.2)',
                  borderRadius: '10px',
                  padding: '10px',
                  fontSize: '24px',
                  lineHeight: 1,
                }}
              >
                ✉️
              </div>
              <div>
                <h2 style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: 700 }}>Gmail</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  {isGmailConnected ? (
                    <>
                      <CheckCircle size={12} style={{ color: '#22c55e' }} />
                      <span style={{ color: '#22c55e', fontSize: '11px', fontWeight: 500 }}>
                        Verbunden
                      </span>
                      {gmailToken?.email && (
                        <span style={{ color: '#475569', fontSize: '11px' }}>
                          · {gmailToken.email}
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <XCircle size={12} style={{ color: '#64748b' }} />
                      <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 500 }}>
                        Nicht verbunden
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isGmailConnected && (
                <button
                  onClick={syncGmail}
                  disabled={syncing}
                  style={{
                    backgroundColor: 'rgba(59,130,246,0.1)',
                    color: '#3b82f6',
                    border: '1px solid rgba(59,130,246,0.2)',
                    fontSize: '11px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    cursor: syncing ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    opacity: syncing ? 0.6 : 1,
                  }}
                >
                  <RefreshCw size={11} className={syncing ? 'animate-spin' : ''} />
                  {syncing ? 'Syncing...' : 'Gmail synchronisieren'}
                </button>
              )}
              <a
                href="/api/auth/google"
                style={{
                  background: isGmailConnected
                    ? 'rgba(100,116,139,0.1)'
                    : 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: isGmailConnected ? '#64748b' : '#000',
                  border: isGmailConnected ? '1px solid rgba(100,116,139,0.2)' : 'none',
                  fontSize: '11px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {isGmailConnected ? 'Neu verbinden' : 'Mit Google verbinden'}
              </a>
            </div>
          </div>

          {/* Sync result message */}
          {syncResult && (
            <div
              style={{
                backgroundColor: syncResult.startsWith('Fehler')
                  ? 'rgba(239,68,68,0.1)'
                  : 'rgba(34,197,94,0.1)',
                border: `1px solid ${syncResult.startsWith('Fehler') ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)'}`,
                color: syncResult.startsWith('Fehler') ? '#ef4444' : '#22c55e',
                fontSize: '12px',
                padding: '8px 12px',
                borderRadius: '8px',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {syncResult.startsWith('Fehler') ? (
                <AlertCircle size={12} />
              ) : (
                <CheckCircle size={12} />
              )}
              {syncResult}
            </div>
          )}

          {/* Gmail info rows */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '12px',
              marginBottom: '16px',
            }}
          >
            {[
              {
                label: 'Letzter Sync',
                value: formatTime(gmailIntegration?.lastSync || null),
              },
              {
                label: 'Token gültig bis',
                value: gmailToken?.expiresAt ? formatTime(gmailToken.expiresAt) : '—',
              },
              {
                label: 'Gespeicherte E-Mails',
                value: status?.recentEmails?.length != null ? `${status.recentEmails.length}` : '—',
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  backgroundColor: '#0d0e13',
                  border: '1px solid #1e2130',
                  borderRadius: '8px',
                  padding: '10px 12px',
                }}
              >
                <p style={{ color: '#475569', fontSize: '10px', fontWeight: 500 }}>{item.label}</p>
                <p style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Recent emails preview */}
          {status?.recentEmails && status.recentEmails.length > 0 && (
            <div>
              <p
                style={{ color: '#475569', fontSize: '10px', fontWeight: 600, marginBottom: '8px' }}
                className="uppercase tracking-widest"
              >
                Letzte E-Mails
              </p>
              <div className="space-y-2">
                {status.recentEmails.slice(0, 5).map((email) => (
                  <div
                    key={email.id}
                    style={{
                      backgroundColor: '#0d0e13',
                      border: '1px solid #1e2130',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                    }}
                  >
                    <Mail size={12} style={{ color: '#475569', marginTop: '2px', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          style={{ color: '#f1f5f9', fontSize: '12px', fontWeight: 600 }}
                          className="truncate"
                        >
                          {email.fromName || email.from}
                        </span>
                        <span
                          style={{
                            backgroundColor: `${categoryColors[email.category] || '#475569'}15`,
                            color: categoryColors[email.category] || '#475569',
                            border: `1px solid ${categoryColors[email.category] || '#475569'}30`,
                            fontSize: '9px',
                            padding: '1px 5px',
                            borderRadius: '4px',
                            fontWeight: 600,
                            flexShrink: 0,
                          }}
                        >
                          {email.category}
                        </span>
                        {email.priority === 'high' && (
                          <span
                            style={{
                              backgroundColor: 'rgba(239,68,68,0.1)',
                              color: '#ef4444',
                              border: '1px solid rgba(239,68,68,0.2)',
                              fontSize: '9px',
                              padding: '1px 5px',
                              borderRadius: '4px',
                              fontWeight: 600,
                              flexShrink: 0,
                            }}
                          >
                            HIGH
                          </span>
                        )}
                        <span
                          style={{ color: '#475569', fontSize: '10px', marginLeft: 'auto', flexShrink: 0 }}
                        >
                          {formatTime(email.receivedAt)}
                        </span>
                      </div>
                      <p style={{ color: '#94a3b8', fontSize: '11px' }} className="truncate">
                        {email.subject}
                      </p>
                      {email.aiSummary && (
                        <p style={{ color: '#475569', fontSize: '10px', marginTop: '2px' }} className="truncate">
                          KI: {email.aiSummary}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Setup hint when not connected */}
          {!isGmailConnected && (
            <div
              style={{
                backgroundColor: 'rgba(245,158,11,0.05)',
                border: '1px solid rgba(245,158,11,0.15)',
                borderRadius: '8px',
                padding: '12px',
                display: 'flex',
                gap: '10px',
              }}
            >
              <AlertCircle size={14} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '1px' }} />
              <div>
                <p style={{ color: '#f59e0b', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  Setup erforderlich
                </p>
                <p style={{ color: '#64748b', fontSize: '11px', lineHeight: 1.5 }}>
                  Setze <code style={{ color: '#94a3b8' }}>GOOGLE_CLIENT_ID</code>,{' '}
                  <code style={{ color: '#94a3b8' }}>GOOGLE_CLIENT_SECRET</code> und{' '}
                  <code style={{ color: '#94a3b8' }}>GOOGLE_REDIRECT_URI</code> in deinen
                  Environment Variables, dann klicke auf "Mit Google verbinden".
                </p>
              </div>
            </div>
          )}
        </div>

        {/* LinkedIn OAuth Card */}
        <div
          className="card p-5"
          style={{ borderColor: isLinkedInConnected ? 'rgba(0,119,181,0.25)' : '#1e2130' }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                style={{
                  backgroundColor: 'rgba(0,119,181,0.1)',
                  border: '1px solid rgba(0,119,181,0.2)',
                  borderRadius: '10px',
                  padding: '10px',
                  fontSize: '24px',
                  lineHeight: 1,
                }}
              >
                🔗
              </div>
              <div>
                <h2 style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: 700 }}>LinkedIn</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  {isLinkedInConnected ? (
                    <>
                      <CheckCircle size={12} style={{ color: '#22c55e' }} />
                      <span style={{ color: '#22c55e', fontSize: '11px', fontWeight: 500 }}>
                        Verbunden
                      </span>
                      {linkedInToken?.email && (
                        <span style={{ color: '#475569', fontSize: '11px' }}>
                          · {linkedInToken.email}
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <XCircle size={12} style={{ color: '#64748b' }} />
                      <span style={{ color: '#64748b', fontSize: '11px', fontWeight: 500 }}>
                        Nicht verbunden
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isLinkedInConnected && (
                <button
                  onClick={syncLinkedIn}
                  disabled={linkedInSyncing}
                  style={{
                    backgroundColor: 'rgba(0,119,181,0.1)',
                    color: '#0077b5',
                    border: '1px solid rgba(0,119,181,0.2)',
                    fontSize: '11px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    cursor: linkedInSyncing ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    opacity: linkedInSyncing ? 0.6 : 1,
                  }}
                >
                  <RefreshCw size={11} className={linkedInSyncing ? 'animate-spin' : ''} />
                  {linkedInSyncing ? 'Syncing...' : 'Synchronisieren'}
                </button>
              )}
              <a
                href="/api/auth/linkedin"
                style={{
                  background: isLinkedInConnected
                    ? 'rgba(100,116,139,0.1)'
                    : 'linear-gradient(135deg, #0077b5, #005983)',
                  color: isLinkedInConnected ? '#64748b' : '#fff',
                  border: isLinkedInConnected ? '1px solid rgba(100,116,139,0.2)' : 'none',
                  fontSize: '11px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {isLinkedInConnected ? 'Neu verbinden' : 'Mit LinkedIn verbinden'}
              </a>
            </div>
          </div>

          {/* LinkedIn sync result */}
          {linkedInResult && (
            <div
              style={{
                backgroundColor: linkedInResult.startsWith('Fehler')
                  ? 'rgba(239,68,68,0.1)'
                  : 'rgba(34,197,94,0.1)',
                border: `1px solid ${linkedInResult.startsWith('Fehler') ? 'rgba(239,68,68,0.2)' : 'rgba(34,197,94,0.2)'}`,
                color: linkedInResult.startsWith('Fehler') ? '#ef4444' : '#22c55e',
                fontSize: '12px',
                padding: '8px 12px',
                borderRadius: '8px',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {linkedInResult.startsWith('Fehler') ? (
                <AlertCircle size={12} />
              ) : (
                <CheckCircle size={12} />
              )}
              {linkedInResult}
            </div>
          )}

          {/* LinkedIn info rows */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '12px',
              marginBottom: linkedInPosts.length > 0 || !isLinkedInConnected ? '16px' : '0',
            }}
          >
            {[
              {
                label: 'Letzter Sync',
                value: formatTime(linkedInIntegration?.lastSync || null),
              },
              {
                label: 'Token gültig bis',
                value: linkedInToken?.expiresAt ? formatTime(linkedInToken.expiresAt) : '—',
              },
              {
                label: 'Gespeicherte Posts',
                value: String(linkedInPosts.length),
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  backgroundColor: '#0d0e13',
                  border: '1px solid #1e2130',
                  borderRadius: '8px',
                  padding: '10px 12px',
                }}
              >
                <p style={{ color: '#475569', fontSize: '10px', fontWeight: 500 }}>{item.label}</p>
                <p style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600, marginTop: '2px' }}>
                  {loading ? '...' : item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Recent LinkedIn posts */}
          {linkedInPosts.length > 0 && (
            <div>
              <p
                style={{ color: '#475569', fontSize: '10px', fontWeight: 600, marginBottom: '8px' }}
                className="uppercase tracking-widest"
              >
                Letzte Posts
              </p>
              <div className="space-y-2">
                {linkedInPosts.slice(0, 5).map((post) => (
                  <div
                    key={post.id}
                    style={{
                      backgroundColor: '#0d0e13',
                      border: '1px solid #1e2130',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                    }}
                  >
                    <div
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: '#0077b5',
                        marginTop: '5px',
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          style={{
                            backgroundColor: 'rgba(0,119,181,0.1)',
                            color: '#0077b5',
                            border: '1px solid rgba(0,119,181,0.2)',
                            fontSize: '9px',
                            padding: '1px 5px',
                            borderRadius: '4px',
                            fontWeight: 600,
                            flexShrink: 0,
                          }}
                        >
                          {post.type}
                        </span>
                        <span
                          style={{ color: '#475569', fontSize: '10px', marginLeft: 'auto', flexShrink: 0 }}
                        >
                          {formatTime(post.publishedAt || post.createdAt)}
                        </span>
                      </div>
                      {post.content && (
                        <p style={{ color: '#94a3b8', fontSize: '11px' }} className="truncate">
                          {post.content}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Setup hint when not connected */}
          {!isLinkedInConnected && (
            <div
              style={{
                backgroundColor: 'rgba(0,119,181,0.05)',
                border: '1px solid rgba(0,119,181,0.15)',
                borderRadius: '8px',
                padding: '12px',
                display: 'flex',
                gap: '10px',
              }}
            >
              <AlertCircle size={14} style={{ color: '#0077b5', flexShrink: 0, marginTop: '1px' }} />
              <div>
                <p style={{ color: '#0077b5', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
                  Setup erforderlich
                </p>
                <p style={{ color: '#64748b', fontSize: '11px', lineHeight: 1.5 }}>
                  Setze{' '}
                  <code style={{ color: '#94a3b8' }}>LINKEDIN_CLIENT_ID</code>,{' '}
                  <code style={{ color: '#94a3b8' }}>LINKEDIN_CLIENT_SECRET</code> und{' '}
                  <code style={{ color: '#94a3b8' }}>LINKEDIN_REDIRECT_URI</code> in deinen
                  Environment Variables, dann klicke auf "Mit LinkedIn verbinden".
                  Verbindet Profil, Posts und Social-Metriken.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Webhook Cards */}
        <div>
          <h2
            style={{ color: '#64748b', fontSize: '11px', fontWeight: 600 }}
            className="uppercase tracking-widest mb-3"
          >
            Webhook Endpoints
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {webhooks.map((wh) => {
              const socialCount = status?.recentSocial?.filter(
                (s) => s.platform === wh.key
              ).length || 0

              return (
                <div key={wh.key} className="card p-4 card-hover">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      style={{
                        backgroundColor: `${wh.color}15`,
                        border: `1px solid ${wh.color}30`,
                        borderRadius: '8px',
                        padding: '8px',
                        fontSize: '18px',
                        lineHeight: 1,
                      }}
                    >
                      {wh.icon}
                    </div>
                    <div>
                      <h3 style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 700 }}>
                        {wh.name}
                      </h3>
                      <span
                        style={{
                          backgroundColor: `${wh.color}15`,
                          color: wh.color,
                          fontSize: '9px',
                          padding: '1px 5px',
                          borderRadius: '4px',
                          border: `1px solid ${wh.color}30`,
                          fontWeight: 600,
                        }}
                      >
                        {wh.method}
                      </span>
                    </div>
                    {(wh.key === 'dealsky' ? status?.recentDeals?.length : socialCount) ? (
                      <span
                        style={{
                          marginLeft: 'auto',
                          backgroundColor: 'rgba(34,197,94,0.1)',
                          color: '#22c55e',
                          border: '1px solid rgba(34,197,94,0.2)',
                          fontSize: '9px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: 600,
                        }}
                      >
                        {wh.key === 'dealsky' ? status?.recentDeals?.length : socialCount} Events
                      </span>
                    ) : null}
                  </div>

                  <p style={{ color: '#64748b', fontSize: '11px', lineHeight: 1.5, marginBottom: '12px' }}>
                    {wh.desc}
                  </p>

                  {/* Webhook URL */}
                  <div
                    style={{
                      backgroundColor: '#0d0e13',
                      border: '1px solid #1e2130',
                      borderRadius: '6px',
                      padding: '8px 10px',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <code
                      style={{
                        color: '#94a3b8',
                        fontSize: '10px',
                        flex: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontFamily: 'monospace',
                      }}
                    >
                      {wh.url}
                    </code>
                    <button
                      onClick={() => copyUrl(wh.url, wh.key)}
                      style={{
                        color: copied === wh.key ? '#22c55e' : '#475569',
                        padding: '2px',
                        flexShrink: 0,
                        cursor: 'pointer',
                        background: 'none',
                        border: 'none',
                        transition: 'color 0.2s',
                      }}
                    >
                      {copied === wh.key ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                  </div>

                  {/* Env vars needed */}
                  <div>
                    <p
                      style={{ color: '#475569', fontSize: '9px', fontWeight: 600, marginBottom: '4px' }}
                      className="uppercase tracking-widest"
                    >
                      ENV Variables
                    </p>
                    {wh.envVars.map((v) => (
                      <div
                        key={v}
                        style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}
                      >
                        <Key size={9} style={{ color: '#475569' }} />
                        <code style={{ color: '#64748b', fontSize: '10px', fontFamily: 'monospace' }}>
                          {v}
                        </code>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Activity Tabs */}
        <div className="card">
          {/* Tab bar */}
          <div
            style={{ borderBottom: '1px solid #1e2130', padding: '0 16px', display: 'flex', gap: '0' }}
          >
            {(
              [
                { key: 'emails', label: 'E-Mails', icon: Mail, count: status?.recentEmails?.length },
                { key: 'deals', label: 'Deal Events', icon: Briefcase, count: status?.recentDeals?.length },
                { key: 'social', label: 'Social', icon: Share2, count: status?.recentSocial?.length },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon
              const active = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: '12px 16px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: active ? '#f1f5f9' : '#475569',
                    borderTop: 'none',
                    borderLeft: 'none',
                    borderRight: 'none',
                    borderBottom: active ? '2px solid #f59e0b' : '2px solid transparent',
                    background: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'color 0.2s',
                  }}
                >
                  <Icon size={12} />
                  {tab.label}
                  {tab.count != null && tab.count > 0 && (
                    <span
                      style={{
                        backgroundColor: active ? 'rgba(245,158,11,0.15)' : 'rgba(71,85,105,0.2)',
                        color: active ? '#f59e0b' : '#64748b',
                        fontSize: '9px',
                        padding: '1px 5px',
                        borderRadius: '10px',
                        fontWeight: 700,
                      }}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Tab content */}
          <div style={{ padding: '16px', minHeight: '200px' }}>
            {activeTab === 'emails' && (
              <div className="space-y-2">
                {!status?.recentEmails?.length ? (
                  <div style={{ textAlign: 'center', color: '#475569', fontSize: '13px', padding: '40px 0' }}>
                    Noch keine E-Mails synchronisiert.{' '}
                    {isGmailConnected ? (
                      <button
                        onClick={syncGmail}
                        style={{ color: '#f59e0b', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Jetzt synchronisieren
                      </button>
                    ) : (
                      'Verbinde zuerst Gmail.'
                    )}
                  </div>
                ) : (
                  status.recentEmails.map((email) => (
                    <div
                      key={email.id}
                      style={{
                        backgroundColor: '#0d0e13',
                        border: '1px solid #1e2130',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                      }}
                    >
                      <div
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: categoryColors[email.category] || '#475569',
                          marginTop: '5px',
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span style={{ color: '#f1f5f9', fontSize: '12px', fontWeight: 600 }} className="truncate">
                            {email.fromName || email.from}
                          </span>
                          <span
                            style={{
                              backgroundColor: `${categoryColors[email.category] || '#475569'}15`,
                              color: categoryColors[email.category] || '#475569',
                              border: `1px solid ${categoryColors[email.category] || '#475569'}30`,
                              fontSize: '9px',
                              padding: '1px 5px',
                              borderRadius: '4px',
                              fontWeight: 600,
                              flexShrink: 0,
                            }}
                          >
                            {email.category}
                          </span>
                          {email.priority === 'high' && (
                            <span
                              style={{
                                backgroundColor: 'rgba(239,68,68,0.1)',
                                color: '#ef4444',
                                fontSize: '9px',
                                padding: '1px 5px',
                                borderRadius: '4px',
                                fontWeight: 600,
                                flexShrink: 0,
                              }}
                            >
                              HIGH
                            </span>
                          )}
                          <span style={{ color: '#475569', fontSize: '10px', marginLeft: 'auto', flexShrink: 0 }}>
                            {formatTime(email.receivedAt)}
                          </span>
                        </div>
                        <p style={{ color: '#64748b', fontSize: '11px' }} className="truncate">
                          {email.subject}
                        </p>
                        {email.aiSummary && (
                          <p style={{ color: '#475569', fontSize: '10px', marginTop: '2px', fontStyle: 'italic' }} className="truncate">
                            {email.aiSummary}
                          </p>
                        )}
                      </div>
                      <ChevronRight size={12} style={{ color: '#1e2130', flexShrink: 0, marginTop: '3px' }} />
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'deals' && (
              <div className="space-y-2">
                {!status?.recentDeals?.length ? (
                  <div style={{ textAlign: 'center', color: '#475569', fontSize: '13px', padding: '40px 0' }}>
                    Noch keine Deal Events empfangen. Konfiguriere den Dealsky Webhook.
                  </div>
                ) : (
                  status.recentDeals.map((deal) => (
                    <div
                      key={deal.id}
                      style={{
                        backgroundColor: '#0d0e13',
                        border: '1px solid #1e2130',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: `${eventTypeColors[deal.eventType] || '#475569'}15`,
                          color: eventTypeColors[deal.eventType] || '#64748b',
                          border: `1px solid ${eventTypeColors[deal.eventType] || '#475569'}30`,
                          fontSize: '9px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        {eventTypeLabels[deal.eventType] || deal.eventType}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ color: '#f1f5f9', fontSize: '12px', fontWeight: 600 }} className="truncate">
                          {deal.dealName || 'Unbekannter Deal'}
                        </p>
                        <p style={{ color: '#64748b', fontSize: '10px' }}>
                          {[deal.contactName, deal.stage].filter(Boolean).join(' · ')}
                          {deal.value != null && ` · ${deal.value.toLocaleString('de-DE')} ${deal.currency}`}
                        </p>
                      </div>
                      <span style={{ color: '#475569', fontSize: '10px', flexShrink: 0 }}>
                        {formatTime(deal.createdAt)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'social' && (
              <div className="space-y-2">
                {!status?.recentSocial?.length ? (
                  <div style={{ textAlign: 'center', color: '#475569', fontSize: '13px', padding: '40px 0' }}>
                    Noch keine Social Events empfangen. Konfiguriere Instagram oder LinkedIn Webhooks.
                  </div>
                ) : (
                  status.recentSocial.map((metric) => (
                    <div
                      key={metric.id}
                      style={{
                        backgroundColor: '#0d0e13',
                        border: '1px solid #1e2130',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      <span style={{ fontSize: '16px' }}>
                        {metric.platform === 'instagram' ? '📸' : '🔗'}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span style={{ color: '#f1f5f9', fontSize: '12px', fontWeight: 600 }}>
                            {metric.platform === 'instagram' ? 'Instagram' : 'LinkedIn'}
                          </span>
                          <span
                            style={{
                              backgroundColor:
                                metric.platform === 'instagram'
                                  ? 'rgba(225,48,108,0.1)'
                                  : 'rgba(0,119,181,0.1)',
                              color:
                                metric.platform === 'instagram' ? '#e1306c' : '#0077b5',
                              fontSize: '9px',
                              padding: '1px 5px',
                              borderRadius: '4px',
                              fontWeight: 600,
                            }}
                          >
                            {metric.type}
                          </span>
                          {(metric.likes > 0 || metric.comments > 0) && (
                            <span style={{ color: '#475569', fontSize: '10px' }}>
                              {metric.likes > 0 && `❤️ ${metric.likes}`}
                              {metric.comments > 0 && ` 💬 ${metric.comments}`}
                            </span>
                          )}
                        </div>
                        {metric.content && (
                          <p style={{ color: '#64748b', fontSize: '11px' }} className="truncate">
                            {metric.content}
                          </p>
                        )}
                      </div>
                      <span style={{ color: '#475569', fontSize: '10px', flexShrink: 0 }}>
                        {formatTime(metric.createdAt)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Environment Variables Guide */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Key size={14} style={{ color: '#f59e0b' }} />
            <h2 style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: 700 }}>
              Environment Variables
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                group: 'Google OAuth (Gmail)',
                color: '#db4437',
                vars: [
                  { name: 'GOOGLE_CLIENT_ID', desc: 'OAuth Client ID aus Google Console' },
                  { name: 'GOOGLE_CLIENT_SECRET', desc: 'OAuth Client Secret' },
                  { name: 'GOOGLE_REDIRECT_URI', desc: 'z.B. https://deine-app.railway.app/api/auth/google/callback' },
                ],
              },
              {
                group: 'LinkedIn OAuth',
                color: '#0077b5',
                vars: [
                  { name: 'LINKEDIN_CLIENT_ID', desc: 'Client ID aus LinkedIn Developer App' },
                  { name: 'LINKEDIN_CLIENT_SECRET', desc: 'Client Secret aus LinkedIn Developer App' },
                  { name: 'LINKEDIN_REDIRECT_URI', desc: 'z.B. https://deine-app.railway.app/api/auth/linkedin/callback' },
                ],
              },
              {
                group: 'Webhook Secrets',
                color: '#f59e0b',
                vars: [
                  { name: 'DEALSKY_WEBHOOK_SECRET', desc: 'HMAC-SHA256 Secret für Dealsky' },
                  { name: 'INSTAGRAM_WEBHOOK_VERIFY_TOKEN', desc: 'Verify Token für Meta Webhook Setup' },
                  { name: 'INSTAGRAM_APP_SECRET', desc: 'App Secret für Signatur-Verifikation' },
                  { name: 'LINKEDIN_WEBHOOK_SECRET', desc: 'Secret für LinkedIn Webhook' },
                ],
              },
            ].map((group) => (
              <div
                key={group.group}
                style={{
                  backgroundColor: '#0d0e13',
                  border: '1px solid #1e2130',
                  borderRadius: '8px',
                  padding: '12px',
                }}
              >
                <p
                  style={{
                    color: group.color,
                    fontSize: '11px',
                    fontWeight: 700,
                    marginBottom: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: group.color,
                      display: 'inline-block',
                    }}
                  />
                  {group.group}
                </p>
                {group.vars.map((v) => (
                  <div key={v.name} style={{ marginBottom: '8px' }}>
                    <code
                      style={{
                        color: '#94a3b8',
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        display: 'block',
                        marginBottom: '2px',
                      }}
                    >
                      {v.name}
                    </code>
                    <p style={{ color: '#475569', fontSize: '10px' }}>{v.desc}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
