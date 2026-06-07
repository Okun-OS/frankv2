'use client'

import { useState, useEffect, useRef } from 'react'
import Header from '@/components/layout/Header'
import { Button } from '@/components/ui/Button'
import {
  Plus,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Calendar,
  Clock,
  Sparkles,
  Copy,
  Check,
  AlertCircle,
  FileText,
  ChevronRight,
  RefreshCw,
  Image,
  Send,
  Loader2,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Stage =
  | 'thema'
  | 'strategie'
  | 'text'
  | 'creative'
  | 'feedback'
  | 'finalisierung'
  | 'veroeffentlichung'

interface PipelineData {
  stage?: Stage
  topic?: string
  platform?: string
  frankSuggestions?: string[]
  selectedAngle?: string
  strategy?: {
    angle: string
    targetAudience: string
    coreMessage: string
    tone: string
  }
  generatedText?: string
  imageStyle?: string
  imageFormat?: string
  imageUrl?: string
  revisedPrompt?: string
  imageHistory?: string[]
  finalText?: string
  finalImageUrl?: string
}

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
  metadata: string | null
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const STAGES: { key: Stage; label: string }[] = [
  { key: 'thema', label: 'Thema' },
  { key: 'strategie', label: 'Strategie' },
  { key: 'text', label: 'Text' },
  { key: 'creative', label: 'Creative' },
  { key: 'feedback', label: 'Feedback' },
  { key: 'finalisierung', label: 'Finalisierung' },
  { key: 'veroeffentlichung', label: 'Veröffentlichung' },
]

const STAGE_INDEX: Record<Stage, number> = {
  thema: 0,
  strategie: 1,
  text: 2,
  creative: 3,
  feedback: 4,
  finalisierung: 5,
  veroeffentlichung: 6,
}

const PLATFORMS = [
  { value: 'linkedin_post', label: 'LinkedIn Post', platform: 'linkedin', type: 'post' },
  { value: 'linkedin_carousel', label: 'LinkedIn Carousel', platform: 'linkedin', type: 'carousel' },
  { value: 'instagram_post', label: 'Instagram Post', platform: 'instagram', type: 'post' },
  { value: 'instagram_story', label: 'Instagram Story', platform: 'instagram', type: 'story' },
  { value: 'instagram_carousel', label: 'Instagram Carousel', platform: 'instagram', type: 'carousel' },
  { value: 'ad', label: 'Werbeanzeige', platform: 'both', type: 'ad' },
  { value: 'thumbnail', label: 'Thumbnail', platform: 'both', type: 'thumbnail' },
]

const IMAGE_STYLES = ['Professionell', 'Modern', 'Minimalist', 'Luxuriös', 'Bold']

const FEEDBACK_QUICK = [
  'Moderner',
  'Luxuriöser',
  'Seriöser',
  'Mehr Unternehmer-Look',
  'Neue Variante',
  'Farben anpassen',
]

const platformConfig: Record<string, { color: string; label: string }> = {
  linkedin: { color: '#0077b5', label: 'LinkedIn' },
  instagram: { color: '#e1306c', label: 'Instagram' },
  both: { color: '#8b5cf6', label: 'LinkedIn + Instagram' },
}

const statusConfig: Record<string, { color: string; label: string }> = {
  published: { color: '#22c55e', label: 'Veröffentlicht' },
  scheduled: { color: '#f59e0b', label: 'Geplant' },
  draft: { color: '#64748b', label: 'Entwurf' },
}

// ─── Helper Components ─────────────────────────────────────────────────────────

function Spinner() {
  return <Loader2 size={16} style={{ color: '#f59e0b', animation: 'spin 1s linear infinite' }} />
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      style={{
        backgroundColor: 'rgba(239,68,68,0.08)',
        border: '1px solid rgba(239,68,68,0.25)',
        borderRadius: '8px',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '12px',
      }}
    >
      <AlertCircle size={14} style={{ color: '#ef4444', flexShrink: 0 }} />
      <p style={{ color: '#ef4444', fontSize: '12px' }}>{message}</p>
    </div>
  )
}

// ─── Stage Progress Bar ────────────────────────────────────────────────────────

function StageProgressBar({ currentStage }: { currentStage: Stage }) {
  const currentIdx = STAGE_INDEX[currentStage]
  const progress = ((currentIdx + 1) / STAGES.length) * 100

  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Gold progress bar */}
      <div
        style={{
          height: '3px',
          backgroundColor: '#1e2130',
          borderRadius: '2px',
          marginBottom: '16px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #f59e0b, #d97706)',
            borderRadius: '2px',
            transition: 'width 0.4s ease',
          }}
        />
      </div>

      {/* Stage labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {STAGES.map((s, idx) => {
          const isDone = idx < currentIdx
          const isCurrent = idx === currentIdx
          return (
            <div key={s.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 700,
                  backgroundColor: isDone
                    ? 'rgba(245,158,11,0.2)'
                    : isCurrent
                    ? '#f59e0b'
                    : '#1e2130',
                  color: isDone ? '#f59e0b' : isCurrent ? '#000' : '#475569',
                  border: isDone ? '1px solid rgba(245,158,11,0.4)' : isCurrent ? 'none' : '1px solid #2a3045',
                }}
              >
                {isDone ? '✓' : idx + 1}
              </div>
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: isCurrent ? 600 : 400,
                  color: isCurrent ? '#f59e0b' : isDone ? '#64748b' : '#475569',
                  whiteSpace: 'nowrap',
                }}
              >
                {s.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Stage: Thema ──────────────────────────────────────────────────────────────

function ThemaStage({
  data,
  onChange,
  onNext,
}: {
  data: PipelineData
  onChange: (d: Partial<PipelineData>) => void
  onNext: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedPlatform, setSelectedPlatform] = useState(data.platform || 'linkedin_post')
  const [topic, setTopic] = useState(data.topic || '')
  const [suggestions, setSuggestions] = useState<string[]>(data.frankSuggestions || [])
  const [selectedAngle, setSelectedAngle] = useState(data.selectedAngle || '')

  async function handleFrankSuggest() {
    if (!topic.trim()) return
    setLoading(true)
    setError(null)
    setSuggestions([])
    try {
      const res = await fetch('/api/frank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Gib mir 3 verschiedene Themen-Winkel (Angles) für folgenden Content-Kontext:
Plattform: ${PLATFORMS.find((p) => p.value === selectedPlatform)?.label}
Thema/Idee: ${topic}

Antworte NUR mit 3 nummerierten Zeilen, je max. 1 Satz pro Winkel. Kein weiterer Text.`,
            },
          ],
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Fehler')
      const text: string = json.message
      const lines = text
        .split('\n')
        .map((l: string) => l.replace(/^\d+[\.\)]\s*/, '').trim())
        .filter((l: string) => l.length > 10)
        .slice(0, 3)
      setSuggestions(lines)
      onChange({ frankSuggestions: lines })
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Fehler')
    } finally {
      setLoading(false)
    }
  }

  function handleNext() {
    const platformDef = PLATFORMS.find((p) => p.value === selectedPlatform)
    onChange({
      topic,
      platform: selectedPlatform,
      selectedAngle: selectedAngle || topic,
      frankSuggestions: suggestions,
    })
    onNext()
  }

  return (
    <div>
      <h3 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>
        Worum soll es gehen?
      </h3>

      <textarea
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Beschreibe dein Thema oder deine Idee..."
        rows={3}
        style={{
          width: '100%',
          backgroundColor: '#0d1117',
          border: '1px solid #1e2130',
          borderRadius: '8px',
          padding: '12px 14px',
          color: '#f1f5f9',
          fontSize: '13px',
          outline: 'none',
          resize: 'vertical',
          marginBottom: '16px',
          boxSizing: 'border-box',
        }}
      />

      {/* Platform selector */}
      <div style={{ marginBottom: '16px' }}>
        <p style={{ color: '#64748b', fontSize: '11px', fontWeight: 500, marginBottom: '8px' }}>PLATTFORM</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {PLATFORMS.map((p) => (
            <button
              key={p.value}
              onClick={() => setSelectedPlatform(p.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                backgroundColor:
                  selectedPlatform === p.value ? 'rgba(245,158,11,0.15)' : '#1a1f2e',
                border:
                  selectedPlatform === p.value
                    ? '1px solid rgba(245,158,11,0.4)'
                    : '1px solid #1e2130',
                color: selectedPlatform === p.value ? '#f59e0b' : '#94a3b8',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleFrankSuggest}
          disabled={loading || !topic.trim()}
        >
          {loading ? <Spinner /> : <Sparkles size={12} />}
          {loading ? 'Frank denkt...' : 'Frank gibt Strategie-Ideen'}
        </Button>
      </div>

      {error && <ErrorBanner message={error} />}

      {suggestions.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <p style={{ color: '#64748b', fontSize: '11px', fontWeight: 500, marginBottom: '8px' }}>
            FRANK&apos;S VORSCHLÄGE — wähle einen Winkel:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => setSelectedAngle(s)}
                style={{
                  textAlign: 'left',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor:
                    selectedAngle === s ? 'rgba(245,158,11,0.08)' : '#0d1117',
                  border:
                    selectedAngle === s
                      ? '1px solid rgba(245,158,11,0.3)'
                      : '1px solid #1e2130',
                  color: selectedAngle === s ? '#f1f5f9' : '#94a3b8',
                  fontSize: '13px',
                  lineHeight: '1.5',
                }}
              >
                <span style={{ color: '#f59e0b', fontWeight: 600, marginRight: '8px' }}>{i + 1}.</span>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="gold"
          size="sm"
          onClick={handleNext}
          disabled={!topic.trim()}
        >
          Weiter
          <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  )
}

// ─── Stage: Strategie ──────────────────────────────────────────────────────────

function StrategieStage({
  data,
  onChange,
  onNext,
}: {
  data: PipelineData
  onChange: (d: Partial<PipelineData>) => void
  onNext: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [strategy, setStrategy] = useState(data.strategy || null)

  useEffect(() => {
    if (!strategy) {
      analyzeStrategy()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function analyzeStrategy() {
    setLoading(true)
    setError(null)
    try {
      const platformLabel = PLATFORMS.find((p) => p.value === data.platform)?.label || data.platform
      const res = await fetch('/api/frank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Analysiere diesen Content-Winkel und liefere eine kompakte Strategie.

Thema: ${data.topic}
Gewählter Winkel: ${data.selectedAngle || data.topic}
Plattform: ${platformLabel}

Antworte im exakten JSON-Format ohne Markdown:
{
  "angle": "Der konkrete Blickwinkel in 1 Satz",
  "targetAudience": "Zielgruppe in 1 Satz",
  "coreMessage": "Kernbotschaft in 1 Satz",
  "tone": "Tonalität in 2-3 Wörtern"
}`,
            },
          ],
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Fehler')
      let parsed
      try {
        const text: string = json.message
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : null
      } catch {
        throw new Error('Konnte Strategie nicht parsen')
      }
      if (!parsed) throw new Error('Ungültige Strategie-Antwort')
      setStrategy(parsed)
      onChange({ strategy: parsed })
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Fehler')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h3 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>
        Strategie-Analyse
      </h3>
      <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '16px' }}>
        Thema: <span style={{ color: '#94a3b8' }}>{data.selectedAngle || data.topic}</span>
      </p>

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '20px 0' }}>
          <Spinner />
          <span style={{ color: '#64748b', fontSize: '13px' }}>Frank analysiert den Content-Winkel...</span>
        </div>
      )}

      {error && <ErrorBanner message={error} />}

      {strategy && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {[
            { label: 'ANGLE', value: strategy.angle, icon: '🎯' },
            { label: 'ZIELGRUPPE', value: strategy.targetAudience, icon: '👥' },
            { label: 'KERNBOTSCHAFT', value: strategy.coreMessage, icon: '💡' },
            { label: 'TONALITÄT', value: strategy.tone, icon: '🎭' },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                backgroundColor: '#0d1117',
                border: '1px solid #1e2130',
                borderRadius: '8px',
                padding: '12px 14px',
              }}
            >
              <p style={{ color: '#64748b', fontSize: '10px', fontWeight: 600, marginBottom: '4px' }}>
                {item.icon} {item.label}
              </p>
              <p style={{ color: '#f1f5f9', fontSize: '13px', lineHeight: 1.5 }}>{item.value}</p>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button variant="secondary" size="sm" onClick={analyzeStrategy} disabled={loading}>
          <RefreshCw size={12} />
          Neu analysieren
        </Button>
        <Button variant="gold" size="sm" onClick={onNext} disabled={!strategy || loading}>
          Text generieren
          <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  )
}

// ─── Stage: Text ───────────────────────────────────────────────────────────────

function TextStage({
  data,
  onChange,
  onNext,
}: {
  data: PipelineData
  onChange: (d: Partial<PipelineData>) => void
  onNext: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [text, setText] = useState(data.generatedText || '')
  const [usedModel, setUsedModel] = useState<string | null>(null)

  useEffect(() => {
    if (!text) {
      generateText()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function generateText() {
    setLoading(true)
    setError(null)
    try {
      const platformDef = PLATFORMS.find((p) => p.value === data.platform)
      const isCreative = platformDef?.type === 'post' || platformDef?.type === 'story'
      const genType = isCreative ? 'creative' : 'strategic'

      const res = await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: genType,
          topic: data.selectedAngle || data.topic,
          platform: platformDef?.platform || 'linkedin',
          tone: data.strategy?.tone || 'professionell',
          targetGroup: data.strategy?.targetAudience,
          useCase: genType,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Generierung fehlgeschlagen')
      setText(json.content || '')
      setUsedModel(json.model || null)
      onChange({ generatedText: json.content })
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Fehler')
    } finally {
      setLoading(false)
    }
  }

  function handleTextChange(val: string) {
    setText(val)
    onChange({ generatedText: val })
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 600 }}>
          Content Text
        </h3>
        {usedModel && (
          <span
            style={{
              fontSize: '10px',
              fontWeight: 600,
              color: usedModel.startsWith('gpt') ? '#22c55e' : '#8b5cf6',
              backgroundColor: usedModel.startsWith('gpt') ? 'rgba(34,197,94,0.1)' : 'rgba(139,92,246,0.1)',
              padding: '2px 8px',
              borderRadius: '4px',
            }}
          >
            {usedModel.startsWith('gpt') ? 'GPT-4o' : 'Claude'}
          </span>
        )}
      </div>

      {loading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '20px 0' }}>
          <Spinner />
          <span style={{ color: '#64748b', fontSize: '13px' }}>Text wird generiert...</span>
        </div>
      )}

      {error && <ErrorBanner message={error} />}

      {!loading && (
        <textarea
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          rows={10}
          style={{
            width: '100%',
            backgroundColor: '#0d1117',
            border: '1px solid #1e2130',
            borderRadius: '8px',
            padding: '12px 14px',
            color: '#f1f5f9',
            fontSize: '13px',
            lineHeight: '1.7',
            outline: 'none',
            resize: 'vertical',
            marginBottom: '16px',
            boxSizing: 'border-box',
          }}
        />
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button variant="secondary" size="sm" onClick={generateText} disabled={loading}>
          <RefreshCw size={12} />
          Regenerieren
        </Button>
        <Button variant="gold" size="sm" onClick={onNext} disabled={!text.trim() || loading}>
          Weiter zu Creative
          <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  )
}

// ─── Stage: Creative ───────────────────────────────────────────────────────────

function CreativeStage({
  data,
  onChange,
  onNext,
}: {
  data: PipelineData
  onChange: (d: Partial<PipelineData>) => void
  onNext: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [style, setStyle] = useState(data.imageStyle || 'Professionell')
  const [imageUrl, setImageUrl] = useState(data.imageUrl || '')

  function getImageFormat() {
    const platformDef = PLATFORMS.find((p) => p.value === data.platform)
    if (!platformDef) return 'linkedin_post'
    if (platformDef.value === 'instagram_story') return 'instagram_story'
    if (platformDef.value === 'linkedin_carousel' || platformDef.value === 'instagram_carousel') return 'carousel'
    if (platformDef.value === 'ad') return 'ad'
    if (platformDef.value === 'thumbnail') return 'thumbnail'
    if (platformDef.platform === 'instagram') return 'instagram_post'
    return 'linkedin_post'
  }

  async function generateImage() {
    setLoading(true)
    setError(null)
    try {
      const format = getImageFormat()
      const prompt = `${data.selectedAngle || data.topic}. ${data.strategy?.coreMessage || ''}. Für ${PLATFORMS.find((p) => p.value === data.platform)?.label || 'Social Media'}.`

      const res = await fetch('/api/content/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, format, style }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Fehler')
      setImageUrl(json.url)
      onChange({
        imageUrl: json.url,
        imageStyle: style,
        imageFormat: format,
        revisedPrompt: json.revisedPrompt,
        imageHistory: [...(data.imageHistory || []), json.url].slice(-3),
      })
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Fehler')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h3 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>
        Creative generieren
      </h3>

      {/* Style selector */}
      <div style={{ marginBottom: '16px' }}>
        <p style={{ color: '#64748b', fontSize: '11px', fontWeight: 500, marginBottom: '8px' }}>STIL</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {IMAGE_STYLES.map((s) => (
            <button
              key={s}
              onClick={() => setStyle(s)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                backgroundColor: style === s ? 'rgba(245,158,11,0.15)' : '#1a1f2e',
                border: style === s ? '1px solid rgba(245,158,11,0.4)' : '1px solid #1e2130',
                color: style === s ? '#f59e0b' : '#94a3b8',
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <Button variant="gold" size="sm" onClick={generateImage} disabled={loading}>
          {loading ? <Spinner /> : <Image size={12} />}
          {loading ? 'Generiert...' : 'Creative generieren'}
        </Button>
      </div>

      {error && <ErrorBanner message={error} />}

      {loading && (
        <div
          style={{
            width: '100%',
            aspectRatio: '1',
            maxWidth: '400px',
            backgroundColor: '#0d1117',
            border: '1px solid #1e2130',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '16px',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <Loader2
              size={32}
              style={{ color: '#f59e0b', animation: 'spin 1s linear infinite', margin: '0 auto 8px' }}
            />
            <p style={{ color: '#64748b', fontSize: '12px' }}>DALL-E 3 generiert dein Creative...</p>
          </div>
        </div>
      )}

      {imageUrl && !loading && (
        <div style={{ marginBottom: '16px' }}>
          <img
            src={imageUrl}
            alt="Generiertes Creative"
            style={{
              width: '100%',
              maxWidth: '400px',
              borderRadius: '12px',
              border: '1px solid #1e2130',
            }}
          />
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="gold" size="sm" onClick={onNext} disabled={!imageUrl || loading}>
          Weiter zu Feedback
          <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  )
}

// ─── Stage: Feedback ───────────────────────────────────────────────────────────

function FeedbackStage({
  data,
  onChange,
  onNext,
}: {
  data: PipelineData
  onChange: (d: Partial<PipelineData>) => void
  onNext: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [feedbackInput, setFeedbackInput] = useState('')
  const [currentImageUrl, setCurrentImageUrl] = useState(data.imageUrl || '')
  const [imageHistory, setImageHistory] = useState<string[]>(data.imageHistory || [data.imageUrl || ''].filter(Boolean))

  function getImageFormat() {
    const platformDef = PLATFORMS.find((p) => p.value === data.platform)
    if (!platformDef) return 'linkedin_post'
    if (platformDef.value === 'instagram_story') return 'instagram_story'
    if (platformDef.value === 'linkedin_carousel' || platformDef.value === 'instagram_carousel') return 'carousel'
    if (platformDef.value === 'ad') return 'ad'
    if (platformDef.value === 'thumbnail') return 'thumbnail'
    if (platformDef.platform === 'instagram') return 'instagram_post'
    return 'linkedin_post'
  }

  async function applyFeedback(feedback: string) {
    if (!feedback.trim()) return
    setLoading(true)
    setError(null)
    try {
      const format = getImageFormat()
      const prompt = `${data.selectedAngle || data.topic}. ${data.strategy?.coreMessage || ''}. Für ${PLATFORMS.find((p) => p.value === data.platform)?.label || 'Social Media'}.`

      const res = await fetch('/api/content/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          format,
          style: data.imageStyle || 'Professionell',
          previousPrompt: data.revisedPrompt || prompt,
          feedback,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Fehler')

      const newHistory = [...imageHistory, json.url].slice(-3)
      setCurrentImageUrl(json.url)
      setImageHistory(newHistory)
      setFeedbackInput('')
      onChange({
        imageUrl: json.url,
        imageHistory: newHistory,
        revisedPrompt: json.revisedPrompt,
      })
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Fehler')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h3 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>
        Creative verfeinern
      </h3>

      {/* Main image */}
      {currentImageUrl && (
        <div style={{ marginBottom: '16px' }}>
          <img
            src={currentImageUrl}
            alt="Aktuelles Creative"
            style={{
              width: '100%',
              maxWidth: '400px',
              borderRadius: '12px',
              border: '1px solid rgba(245,158,11,0.2)',
            }}
          />
        </div>
      )}

      {/* Image history thumbnails */}
      {imageHistory.length > 1 && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <p style={{ color: '#64748b', fontSize: '11px', alignSelf: 'center', marginRight: '4px' }}>Verlauf:</p>
          {imageHistory.slice(0, -1).map((url, i) => (
            <button
              key={i}
              onClick={() => setCurrentImageUrl(url)}
              style={{
                border: '1px solid #1e2130',
                borderRadius: '6px',
                padding: 0,
                cursor: 'pointer',
                overflow: 'hidden',
                backgroundColor: 'transparent',
              }}
            >
              <img src={url} alt={`Version ${i + 1}`} style={{ width: '48px', height: '48px', objectFit: 'cover', display: 'block' }} />
            </button>
          ))}
        </div>
      )}

      {error && <ErrorBanner message={error} />}

      {/* Quick feedback buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
        {FEEDBACK_QUICK.map((q) => (
          <button
            key={q}
            onClick={() => applyFeedback(q)}
            disabled={loading}
            style={{
              padding: '5px 10px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 500,
              cursor: 'pointer',
              backgroundColor: '#1a1f2e',
              border: '1px solid #1e2130',
              color: '#94a3b8',
              opacity: loading ? 0.5 : 1,
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Custom feedback input */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input
          type="text"
          value={feedbackInput}
          onChange={(e) => setFeedbackInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && applyFeedback(feedbackInput)}
          placeholder="Was soll geändert werden?"
          disabled={loading}
          style={{
            flex: 1,
            backgroundColor: '#0d1117',
            border: '1px solid #1e2130',
            borderRadius: '8px',
            padding: '8px 12px',
            color: '#f1f5f9',
            fontSize: '13px',
            outline: 'none',
          }}
        />
        <Button
          variant="secondary"
          size="sm"
          onClick={() => applyFeedback(feedbackInput)}
          disabled={loading || !feedbackInput.trim()}
        >
          {loading ? <Spinner /> : <Send size={12} />}
        </Button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="gold" size="sm" onClick={onNext} disabled={loading}>
          Finalisieren
          <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  )
}

// ─── Stage: Finalisierung ──────────────────────────────────────────────────────

function FinalisierungStage({
  data,
  onChange,
  onNext,
  onSaveDraft,
  itemId,
}: {
  data: PipelineData
  onChange: (d: Partial<PipelineData>) => void
  onNext: () => void
  onSaveDraft: () => void
  itemId: string | null
}) {
  const [finalText, setFinalText] = useState(data.finalText || data.generatedText || '')
  const [saved, setSaved] = useState(false)

  function handleTextChange(val: string) {
    setFinalText(val)
    onChange({ finalText: val })
  }

  return (
    <div>
      <h3 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 600, marginBottom: '16px' }}>
        Finalisierung
      </h3>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {/* Final text */}
        <div style={{ flex: 1, minWidth: '280px' }}>
          <p style={{ color: '#64748b', fontSize: '11px', fontWeight: 500, marginBottom: '8px' }}>TEXT</p>
          <textarea
            value={finalText}
            onChange={(e) => handleTextChange(e.target.value)}
            rows={12}
            style={{
              width: '100%',
              backgroundColor: '#0d1117',
              border: '1px solid #1e2130',
              borderRadius: '8px',
              padding: '12px 14px',
              color: '#f1f5f9',
              fontSize: '13px',
              lineHeight: '1.7',
              outline: 'none',
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Final image */}
        {data.imageUrl && (
          <div style={{ flex: '0 0 auto' }}>
            <p style={{ color: '#64748b', fontSize: '11px', fontWeight: 500, marginBottom: '8px' }}>CREATIVE</p>
            <img
              src={data.imageUrl}
              alt="Finales Creative"
              style={{
                width: '240px',
                borderRadius: '12px',
                border: '1px solid #1e2130',
              }}
            />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            onSaveDraft()
            setSaved(true)
            setTimeout(() => setSaved(false), 2000)
          }}
        >
          {saved ? <Check size={12} style={{ color: '#22c55e' }} /> : <FileText size={12} />}
          {saved ? 'Gespeichert!' : 'Als Entwurf speichern'}
        </Button>
        <Button variant="gold" size="sm" onClick={onNext}>
          Veröffentlichen
          <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  )
}

// ─── Stage: Veröffentlichung ───────────────────────────────────────────────────

function VeroeffentlichungStage({ onReset }: { onReset: () => void }) {
  return (
    <div style={{ textAlign: 'center', padding: '32px 16px' }}>
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: 'rgba(34,197,94,0.1)',
          border: '2px solid rgba(34,197,94,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          fontSize: '28px',
        }}
      >
        ✓
      </div>
      <h3 style={{ color: '#f1f5f9', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
        Content finalisiert!
      </h3>
      <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '24px' }}>
        Dein Content wurde erfolgreich als veröffentlicht markiert.
      </p>
      <Button variant="gold" size="md" onClick={onReset}>
        <Plus size={14} />
        Neuen Content erstellen
      </Button>
    </div>
  )
}

// ─── Bibliothek ────────────────────────────────────────────────────────────────

function BibliothekView({ items, loading }: { items: ContentItem[]; loading: boolean }) {
  const published = items.filter((c) => c.status === 'published').length
  const scheduled = items.filter((c) => c.status === 'scheduled').length
  const drafts = items.filter((c) => c.status === 'draft').length
  const totalViews = items.reduce((sum, c) => {
    if (!c.metrics) return sum
    try {
      return sum + (JSON.parse(c.metrics).views || 0)
    } catch {
      return sum
    }
  }, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
        {[
          { label: 'Veröffentlicht', value: published, color: '#22c55e' },
          { label: 'Geplant', value: scheduled, color: '#f59e0b' },
          { label: 'Entwürfe', value: drafts, color: '#64748b' },
          { label: 'Gesamte Views', value: totalViews.toLocaleString(), color: '#3b82f6' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="card"
            style={{ padding: '16px' }}
          >
            <p style={{ color: '#64748b', fontSize: '11px', fontWeight: 500, marginBottom: '4px' }}>{stat.label}</p>
            <p style={{ color: stat.color, fontSize: '24px', fontWeight: 700 }}>{stat.value}</p>
          </div>
        ))}
      </div>

      <h2 style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        Content Bibliothek ({items.length})
      </h2>

      {loading ? (
        <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
          <p style={{ color: '#475569', fontSize: '13px' }}>Inhalte werden geladen...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
          <p style={{ color: '#475569', fontSize: '13px' }}>Noch keine Inhalte. Erstelle deinen ersten Content über die Pipeline.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {items.map((item) => {
            const plat = platformConfig[item.platform] || platformConfig.linkedin
            const st = statusConfig[item.status] || statusConfig.draft
            let parsedMetrics: { likes?: number; views?: number; comments?: number; shares?: number } | null = null
            if (item.metrics) {
              try {
                parsedMetrics = JSON.parse(item.metrics)
              } catch {
                /* ignore */
              }
            }
            return (
              <div key={item.id} className="card card-hover" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div
                    style={{
                      backgroundColor: `${plat.color}15`,
                      border: `1px solid ${plat.color}30`,
                      borderRadius: '8px',
                      padding: '8px',
                      flexShrink: 0,
                    }}
                  >
                    <FileText size={16} style={{ color: plat.color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <h3 style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 600 }}>{item.title}</h3>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: 600,
                          color: st.color,
                          backgroundColor: `${st.color}15`,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          border: `1px solid ${st.color}30`,
                        }}
                      >
                        {st.label}
                      </span>
                      <span style={{ color: plat.color, fontSize: '10px', fontWeight: 500 }}>{plat.label}</span>
                    </div>
                    {item.body && (
                      <p style={{ color: '#64748b', fontSize: '11px', lineHeight: 1.5, marginBottom: '8px' }}>
                        {item.body.slice(0, 120)}...
                      </p>
                    )}
                    {parsedMetrics && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Eye size={11} style={{ color: '#475569' }} />
                          <span style={{ color: '#94a3b8', fontSize: '11px' }}>{(parsedMetrics.views || 0).toLocaleString()}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Heart size={11} style={{ color: '#ef4444' }} />
                          <span style={{ color: '#94a3b8', fontSize: '11px' }}>{parsedMetrics.likes || 0}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MessageCircle size={11} style={{ color: '#3b82f6' }} />
                          <span style={{ color: '#94a3b8', fontSize: '11px' }}>{parsedMetrics.comments || 0}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Share2 size={11} style={{ color: '#22c55e' }} />
                          <span style={{ color: '#94a3b8', fontSize: '11px' }}>{parsedMetrics.shares || 0}</span>
                        </div>
                      </div>
                    )}
                    {item.scheduledAt && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={11} style={{ color: '#f59e0b' }} />
                        <span style={{ color: '#f59e0b', fontSize: '11px', fontWeight: 500 }}>
                          Geplant: {new Date(item.scheduledAt).toLocaleDateString('de-DE')}
                        </span>
                      </div>
                    )}
                    {item.publishedAt && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
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
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ContentHubPage() {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'bibliothek'>('pipeline')

  // Pipeline state
  const [currentStage, setCurrentStage] = useState<Stage>('thema')
  const [pipelineData, setPipelineData] = useState<PipelineData>({})
  const [currentItemId, setCurrentItemId] = useState<string | null>(null)
  const [savingPipeline, setSavingPipeline] = useState(false)

  // Library state
  const [contentItems, setContentItems] = useState<ContentItem[]>([])
  const [loadingItems, setLoadingItems] = useState(true)

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

  function updatePipelineData(partial: Partial<PipelineData>) {
    setPipelineData((prev) => ({ ...prev, ...partial }))
  }

  async function savePipelineState(stage: Stage, extraData?: Partial<PipelineData>) {
    setSavingPipeline(true)
    try {
      const data = { ...pipelineData, ...extraData, stage }
      if (!currentItemId) {
        // Create new item
        const res = await fetch('/api/content/pipeline', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: pipelineData.topic || 'Neuer Content',
            platform: PLATFORMS.find((p) => p.value === (pipelineData.platform || 'linkedin_post'))?.platform || 'linkedin',
            type: PLATFORMS.find((p) => p.value === (pipelineData.platform || 'linkedin_post'))?.type || 'post',
            stage,
            data,
          }),
        })
        if (res.ok) {
          const item = await res.json()
          setCurrentItemId(item.id)
        }
      } else {
        // Update existing
        await fetch('/api/content/pipeline', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: currentItemId, stage, data }),
        })
      }
      fetchContent()
    } catch {
      // ignore save errors silently
    } finally {
      setSavingPipeline(false)
    }
  }

  function advanceStage(nextStage: Stage) {
    setCurrentStage(nextStage)
    savePipelineState(nextStage)
  }

  function resetPipeline() {
    setCurrentStage('thema')
    setPipelineData({})
    setCurrentItemId(null)
    fetchContent()
  }

  async function handleSaveDraft() {
    await savePipelineState('finalisierung', { finalText: pipelineData.finalText || pipelineData.generatedText })
  }

  const tabStyle = (tab: 'pipeline' | 'bibliothek') => ({
    padding: '8px 20px',
    fontSize: '13px',
    fontWeight: 500,
    cursor: 'pointer',
    borderRadius: '8px',
    backgroundColor: activeTab === tab ? 'rgba(245,158,11,0.1)' : 'transparent',
    border: activeTab === tab ? '1px solid rgba(245,158,11,0.3)' : '1px solid transparent',
    color: activeTab === tab ? '#f59e0b' : '#64748b',
  })

  return (
    <div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <Header
        title="Content Engine"
        subtitle="Von der Idee bis zur Veröffentlichung — FRANK OS Pipeline"
      />

      <div style={{ padding: '24px' }}>
        {/* Tabs + New button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button style={tabStyle('pipeline')} onClick={() => setActiveTab('pipeline')}>
              Pipeline
            </button>
            <button style={tabStyle('bibliothek')} onClick={() => setActiveTab('bibliothek')}>
              Bibliothek
            </button>
          </div>
          <Button variant="gold" size="sm" onClick={resetPipeline}>
            <Plus size={12} />
            Neuer Content
          </Button>
        </div>

        {activeTab === 'bibliothek' ? (
          <BibliothekView items={contentItems} loading={loadingItems} />
        ) : (
          <div
            className="card"
            style={{ padding: '24px' }}
          >
            {/* Stage progress */}
            {currentStage !== 'veroeffentlichung' && (
              <StageProgressBar currentStage={currentStage} />
            )}

            {/* Stage content */}
            {currentStage === 'thema' && (
              <ThemaStage
                data={pipelineData}
                onChange={updatePipelineData}
                onNext={() => {
                  savePipelineState('strategie')
                  setCurrentStage('strategie')
                }}
              />
            )}

            {currentStage === 'strategie' && (
              <StrategieStage
                data={pipelineData}
                onChange={updatePipelineData}
                onNext={() => advanceStage('text')}
              />
            )}

            {currentStage === 'text' && (
              <TextStage
                data={pipelineData}
                onChange={updatePipelineData}
                onNext={() => advanceStage('creative')}
              />
            )}

            {currentStage === 'creative' && (
              <CreativeStage
                data={pipelineData}
                onChange={updatePipelineData}
                onNext={() => advanceStage('feedback')}
              />
            )}

            {currentStage === 'feedback' && (
              <FeedbackStage
                data={pipelineData}
                onChange={updatePipelineData}
                onNext={() => advanceStage('finalisierung')}
              />
            )}

            {currentStage === 'finalisierung' && (
              <FinalisierungStage
                data={pipelineData}
                onChange={updatePipelineData}
                onNext={() => advanceStage('veroeffentlichung')}
                onSaveDraft={handleSaveDraft}
                itemId={currentItemId}
              />
            )}

            {currentStage === 'veroeffentlichung' && (
              <VeroeffentlichungStage onReset={resetPipeline} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
