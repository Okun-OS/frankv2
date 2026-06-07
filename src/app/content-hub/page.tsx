'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { FileText, Plus, Eye, Heart, MessageCircle, Share2, Calendar, Clock, Sparkles, Copy, Check, AlertCircle } from 'lucide-react'

interface ContentItem {
  id: string
  title: string
  platform: string
  type: string
  status: string
  scheduledAt: string | null
  publishedAt: string | null
  metrics: string | null
  body: string | null
}

const platformConfig = {
  linkedin: { color: '#0077b5', label: 'LinkedIn', Icon: FileText },
  instagram: { color: '#e1306c', label: 'Instagram', Icon: Heart },
  both: { color: '#8b5cf6', label: 'LinkedIn + Instagram', Icon: Share2 },
}

const statusConfig = {
  published: { color: '#22c55e', label: 'Veröffentlicht', badgeVariant: 'green' as const },
  scheduled: { color: '#f59e0b', label: 'Geplant', badgeVariant: 'gold' as const },
  draft: { color: '#64748b', label: 'Entwurf', badgeVariant: 'gray' as const },
}

const typeLabels: Record<string, string> = {
  article: 'Artikel',
  post: 'Post',
  reel: 'Reel',
  story: 'Story',
}

export default function ContentHubPage() {
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [loadingItems, setLoadingItems] = useState(true)

  // Generator state
  const [topic, setTopic] = useState('')
  const [platform, setPlatform] = useState('linkedin')
  const [genType, setGenType] = useState('creative')
  const [tone, setTone] = useState('professional')
  const [targetGroup, setTargetGroup] = useState('')
  const [generating, setGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)
  const [usedModel, setUsedModel] = useState<string | null>(null)
  const [genError, setGenError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [savingDraft, setSavingDraft] = useState(false)
  const [savedDraft, setSavedDraft] = useState(false)
  const [openaiMissing, setOpenaiMissing] = useState(false)

  useEffect(() => {
    fetchContent()
  }, [])

  async function fetchContent() {
    try {
      setLoadingItems(true)
      const res = await fetch('/api/content')
      if (res.ok) {
        const data = await res.json()
        setContentItems(data)
      }
    } catch {
      // ignore
    } finally {
      setLoadingItems(false)
    }
  }

  async function handleGenerate() {
    if (!topic.trim()) return
    setGenerating(true)
    setGenError(null)
    setGeneratedContent(null)
    setUsedModel(null)
    setSavedDraft(false)

    try {
      const res = await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: genType,
          topic,
          platform,
          tone,
          targetGroup: targetGroup || undefined,
          useCase: genType,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.error?.includes('OPENAI_API_KEY')) {
          setOpenaiMissing(true)
        }
        setGenError(data.error || 'Generierung fehlgeschlagen')
      } else {
        setGeneratedContent(data.content)
        setUsedModel(data.model)
      }
    } catch {
      setGenError('Verbindungsfehler')
    } finally {
      setGenerating(false)
    }
  }

  async function handleCopy() {
    if (!generatedContent) return
    await navigator.clipboard.writeText(generatedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleSaveDraft() {
    if (!generatedContent) return
    setSavingDraft(true)
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: topic.slice(0, 100),
          body: generatedContent,
          platform,
          type: genType === 'article' ? 'article' : 'post',
          status: 'draft',
        }),
      })
      if (res.ok) {
        setSavedDraft(true)
        fetchContent()
      }
    } catch {
      // ignore
    } finally {
      setSavingDraft(false)
    }
  }

  const published = contentItems.filter(c => c.status === 'published').length
  const scheduled = contentItems.filter(c => c.status === 'scheduled').length
  const drafts = contentItems.filter(c => c.status === 'draft').length
  const totalViews = contentItems.reduce((sum, c) => {
    if (!c.metrics) return sum
    try { return sum + (JSON.parse(c.metrics).views || 0) } catch { return sum }
  }, 0)

  return (
    <div>
      <Header
        title="Content Hub"
        subtitle="LinkedIn, Instagram & Brand Content — von der Idee bis zur Veröffentlichung"
      />
      <div className="p-6 space-y-6">

        {/* Content Generator */}
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles size={18} style={{ color: '#f59e0b' }} />
            <h2 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 600 }}>Content Generator</h2>
          </div>

          {/* OpenAI missing banner */}
          {openaiMissing && (
            <div
              style={{
                backgroundColor: 'rgba(245,158,11,0.08)',
                border: '1px solid rgba(245,158,11,0.25)',
                borderRadius: '8px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px',
              }}
            >
              <AlertCircle size={14} style={{ color: '#f59e0b', flexShrink: 0 }} />
              <p style={{ color: '#f59e0b', fontSize: '12px' }}>
                OpenAI nicht konfiguriert — Creative-Generierung nicht verfügbar. Strategische Inhalte (Artikel, Strategisch) funktionieren weiterhin.
              </p>
            </div>
          )}

          {/* Topic input */}
          <div className="mb-4">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Thema oder Idee eingeben..."
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              style={{
                width: '100%',
                backgroundColor: '#0d1117',
                border: '1px solid #1e2130',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#f1f5f9',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>

          {/* Options row */}
          <div className="flex flex-wrap gap-3 mb-4">
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              style={{
                backgroundColor: '#0d1117',
                border: '1px solid #1e2130',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#f1f5f9',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              <option value="linkedin">LinkedIn</option>
              <option value="instagram">Instagram</option>
              <option value="both">Beide</option>
            </select>

            <select
              value={genType}
              onChange={(e) => setGenType(e.target.value)}
              style={{
                backgroundColor: '#0d1117',
                border: '1px solid #1e2130',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#f1f5f9',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              <option value="creative">Creative / Post</option>
              <option value="hook">Hook</option>
              <option value="caption">Caption</option>
              <option value="article">Artikel</option>
              <option value="strategic">Strategisch</option>
            </select>

            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              style={{
                backgroundColor: '#0d1117',
                border: '1px solid #1e2130',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#f1f5f9',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              <option value="professional">Professionell</option>
              <option value="personal">Persönlich</option>
              <option value="provocative">Provokativ</option>
              <option value="educational">Lehrreich</option>
            </select>

            <input
              type="text"
              value={targetGroup}
              onChange={(e) => setTargetGroup(e.target.value)}
              placeholder="Zielgruppe (optional)"
              style={{
                flex: 1,
                minWidth: '180px',
                backgroundColor: '#0d1117',
                border: '1px solid #1e2130',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#f1f5f9',
                fontSize: '12px',
                outline: 'none',
              }}
            />

            <Button variant="gold" size="sm" onClick={handleGenerate} disabled={generating || !topic.trim()}>
              <Sparkles size={12} />
              {generating ? 'Generiert...' : 'Generieren'}
            </Button>
          </div>

          {/* Error */}
          {genError && (
            <div style={{ color: '#ef4444', fontSize: '12px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={12} />
              {genError}
            </div>
          )}

          {/* Result */}
          {generatedContent && (
            <div
              style={{
                backgroundColor: '#0d1117',
                border: '1px solid #1e2130',
                borderRadius: '8px',
                padding: '16px',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: '10px', fontWeight: 600, color: usedModel?.startsWith('gpt') ? '#22c55e' : '#8b5cf6', backgroundColor: usedModel?.startsWith('gpt') ? 'rgba(34,197,94,0.1)' : 'rgba(139,92,246,0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                    {usedModel?.startsWith('gpt') ? 'GPT-4o' : 'Claude'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: 'transparent',
                      border: '1px solid #1e2130',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      color: '#94a3b8',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    {copied ? <Check size={11} style={{ color: '#22c55e' }} /> : <Copy size={11} />}
                    {copied ? 'Kopiert!' : 'Kopieren'}
                  </button>
                  <button
                    onClick={handleSaveDraft}
                    disabled={savingDraft || savedDraft}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: savedDraft ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)',
                      border: `1px solid ${savedDraft ? 'rgba(34,197,94,0.25)' : 'rgba(245,158,11,0.25)'}`,
                      borderRadius: '6px',
                      padding: '4px 10px',
                      color: savedDraft ? '#22c55e' : '#f59e0b',
                      fontSize: '11px',
                      cursor: savedDraft ? 'default' : 'pointer',
                    }}
                  >
                    {savedDraft ? <Check size={11} /> : <FileText size={11} />}
                    {savedDraft ? 'Gespeichert!' : savingDraft ? 'Speichert...' : 'Als Draft speichern'}
                  </button>
                </div>
              </div>
              <pre style={{ color: '#cbd5e1', fontSize: '12px', lineHeight: 1.7, whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0 }}>
                {generatedContent}
              </pre>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Veröffentlicht', value: published, color: '#22c55e' },
            { label: 'Geplant', value: scheduled, color: '#f59e0b' },
            { label: 'Entwürfe', value: drafts, color: '#64748b' },
            { label: 'Gesamte Views', value: totalViews.toLocaleString(), color: '#3b82f6' },
          ].map((stat) => (
            <div key={stat.label} className="card p-4">
              <p style={{ color: '#64748b', fontSize: '11px', fontWeight: 500 }} className="mb-1">{stat.label}</p>
              <p style={{ color: stat.color, fontSize: '24px', fontWeight: 700 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <h2 style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }} className="uppercase tracking-widest">
            Content Bibliothek ({contentItems.length})
          </h2>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              <Calendar size={12} />
              Content Kalender
            </Button>
            <Button variant="gold" size="sm">
              <Plus size={12} />
              Neuer Content
            </Button>
          </div>
        </div>

        {loadingItems ? (
          <div className="card p-6" style={{ textAlign: 'center' }}>
            <p style={{ color: '#475569', fontSize: '13px' }}>Inhalte werden geladen...</p>
          </div>
        ) : contentItems.length === 0 ? (
          <div className="card p-6" style={{ textAlign: 'center' }}>
            <p style={{ color: '#475569', fontSize: '13px' }}>Noch keine Inhalte. Generiere deinen ersten Content oben.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {contentItems.map((item) => {
              const platform = platformConfig[item.platform as keyof typeof platformConfig] || platformConfig.linkedin
              const status = statusConfig[item.status as keyof typeof statusConfig] || statusConfig.draft
              const PlatformIcon = platform.Icon
              let parsedMetrics: { likes?: number; views?: number; comments?: number; shares?: number } | null = null
              if (item.metrics) {
                try { parsedMetrics = JSON.parse(item.metrics) } catch { /* ignore */ }
              }

              return (
                <div key={item.id} className="card p-4 card-hover">
                  <div className="flex items-start gap-4">
                    <div
                      style={{
                        backgroundColor: `${platform.color}15`,
                        border: `1px solid ${platform.color}30`,
                        borderRadius: '8px',
                        padding: '8px',
                        flexShrink: 0,
                      }}
                    >
                      <PlatformIcon size={16} style={{ color: platform.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 600 }}>{item.title}</h3>
                        <Badge variant={status.badgeVariant}>{status.label}</Badge>
                        <span style={{ color: platform.color, fontSize: '10px', fontWeight: 500 }}>{platform.label}</span>
                        <span style={{ color: '#475569', fontSize: '10px' }}>{typeLabels[item.type] || item.type}</span>
                      </div>
                      {item.body && (
                        <p style={{ color: '#64748b', fontSize: '11px', lineHeight: 1.5 }} className="mb-2">
                          {item.body.slice(0, 120)}...
                        </p>
                      )}

                      {parsedMetrics && (
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Eye size={11} style={{ color: '#475569' }} />
                            <span style={{ color: '#94a3b8', fontSize: '11px' }}>{(parsedMetrics.views || 0).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Heart size={11} style={{ color: '#ef4444' }} />
                            <span style={{ color: '#94a3b8', fontSize: '11px' }}>{parsedMetrics.likes || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle size={11} style={{ color: '#3b82f6' }} />
                            <span style={{ color: '#94a3b8', fontSize: '11px' }}>{parsedMetrics.comments || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Share2 size={11} style={{ color: '#22c55e' }} />
                            <span style={{ color: '#94a3b8', fontSize: '11px' }}>{parsedMetrics.shares || 0}</span>
                          </div>
                        </div>
                      )}

                      {item.scheduledAt && (
                        <div className="flex items-center gap-1">
                          <Clock size={11} style={{ color: '#f59e0b' }} />
                          <span style={{ color: '#f59e0b', fontSize: '11px', fontWeight: 500 }}>
                            Geplant: {new Date(item.scheduledAt).toLocaleDateString('de-DE')}
                          </span>
                        </div>
                      )}

                      {item.publishedAt && (
                        <div className="flex items-center gap-1">
                          <Calendar size={11} style={{ color: '#475569' }} />
                          <span style={{ color: '#475569', fontSize: '11px' }}>
                            Veröffentlicht: {new Date(item.publishedAt).toLocaleDateString('de-DE')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
