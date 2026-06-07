'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { CheckSquare, CheckCircle2, Circle, Clock, Zap, RefreshCw, Target, Loader2 } from 'lucide-react'

const tasks = [
  { time: '07:00', endTime: '07:30', title: 'Morning Routine & FRANK Daily Brief', category: 'health', color: '#22c55e', completed: true, priority: 1, reason: 'Tagesstruktur und mentale Klarheit für produktiven Tag.' },
  { time: '07:30', endTime: '09:00', title: 'Deep Work Block: Q3 Strategy Draft', category: 'focus', color: '#8b5cf6', completed: true, priority: 1, reason: 'Unterstützt Jahresziel: Strategische Positionierung Q3. Morgens ist Fokus am höchsten.' },
  { time: '09:00', endTime: '09:30', title: 'Team Stand-up Meeting', category: 'meeting', color: '#3b82f6', completed: true, priority: 2, reason: 'Team-Alignment für Tagespriorität. Blockiert keine Deep Work Zeit.' },
  { time: '09:30', endTime: '10:00', title: 'Email & Slack Review', category: 'admin', color: '#64748b', completed: true, priority: 3, reason: 'Zeitboxed Admin: verhindert ständige Unterbrechungen im Deep Work.' },
  { time: '10:00', endTime: '11:00', title: 'Investor Call: Thomas Weber (Series A)', category: 'call', color: '#f59e0b', completed: false, priority: 1, reason: 'Kritisch für Finanzierungsziel. Externe Stakeholder haben feste Termine.' },
  { time: '11:00', endTime: '11:15', title: 'Kurze Pause', category: 'break', color: '#475569', completed: false, priority: 3, reason: 'Kognitive Erholung nach intensivem Call.' },
  { time: '11:15', endTime: '12:00', title: 'Lead Pipeline Review & CRM Update', category: 'sales', color: '#22c55e', completed: false, priority: 2, reason: 'Direkte Auswirkung auf Monatsziel: 40 neue Kunden. Leads veralten schnell.' },
  { time: '12:00', endTime: '13:00', title: 'Mittagspause & Spaziergang', category: 'break', color: '#475569', completed: false, priority: 3, reason: 'Energie-Management. Nachmittag-Produktivität hängt von Mittagsroutine ab.' },
  { time: '13:00', endTime: '14:30', title: 'Deep Work: Feature Roadmap Q4', category: 'focus', color: '#8b5cf6', completed: false, priority: 1, reason: 'Unterstützt Produktziel Q4. Zeitkritisch für Entwicklungsplanung.' },
  { time: '14:30', endTime: '15:00', title: 'LinkedIn Content: 3 Posts erstellen', category: 'content', color: '#f97316', completed: false, priority: 2, reason: 'LinkedIn Präsenz = Inbound-Leads. Ziel: +150% Inbound in 90 Tagen.' },
  { time: '15:00', endTime: '15:30', title: '1:1 Meeting: Julia (Marketing Lead)', category: 'meeting', color: '#3b82f6', completed: false, priority: 2, reason: 'Marketing-Alignment für Content-Strategie und Campaign-Planung.' },
  { time: '15:30', endTime: '16:00', title: 'Product Demo: ACME GmbH', category: 'sales', color: '#22c55e', completed: false, priority: 1, reason: 'Hochwertiger Lead, direkte Auswirkung auf Abschluss-Ziel.' },
  { time: '16:00', endTime: '16:30', title: 'Weiterbildung: AI Newsletter lesen', category: 'learning', color: '#f59e0b', completed: false, priority: 3, reason: 'Markt-Awareness für bessere Positionierung von OKUN Systems.' },
  { time: '16:30', endTime: '17:00', title: 'Daily Review & Morgen planen', category: 'review', color: '#ef4444', completed: false, priority: 2, reason: 'Reflexion verhindert Drift. Morgen-Planung spart 30 Min am nächsten Tag.' },
  { time: '17:00', endTime: '17:30', title: 'FRANK Tages-Analyse besprechen', category: 'review', color: '#f59e0b', completed: false, priority: 2, reason: 'FRANK analysiert Tagesleistung und passt Strategie für nächste Woche an.' },
]

const categoryColors: Record<string, string> = {
  focus: '#8b5cf6',
  meeting: '#3b82f6',
  sales: '#22c55e',
  content: '#f97316',
  call: '#f59e0b',
  admin: '#64748b',
  health: '#22c55e',
  break: '#475569',
  learning: '#f59e0b',
  review: '#ef4444',
}

const categoryLabels: Record<string, string> = {
  focus: 'Deep Work',
  meeting: 'Meeting',
  sales: 'Sales',
  content: 'Content',
  call: 'Call',
  admin: 'Admin',
  health: 'Health',
  break: 'Pause',
  learning: 'Lernen',
  review: 'Review',
}

const focusTypeLabels: Record<string, string> = {
  deep_work: 'Deep Work',
  sales: 'Sales-Fokus',
  content: 'Content',
  balanced: 'Ausgewogen',
}

interface AIPlan {
  tasks?: Array<{
    time: string
    endTime: string
    title: string
    reason: string
    goal: string
    category: string
    priority: number
  }>
  rawText?: string
}

export default function DailyPlannerPage() {
  const completed = tasks.filter(t => t.completed).length
  const total = tasks.length
  const progress = Math.round((completed / total) * 100)

  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  // Availability state
  const [availHours, setAvailHours] = useState<number>(8)
  const [focusType, setFocusType] = useState<string>('balanced')
  const [savingAvail, setSavingAvail] = useState(false)
  const [availSaved, setAvailSaved] = useState(false)
  const [aiPlan, setAiPlan] = useState<AIPlan | null>(null)
  const [generatingPlan, setGeneratingPlan] = useState(false)
  const [planError, setPlanError] = useState<string | null>(null)

  async function handleSaveAvailability() {
    setSavingAvail(true)
    try {
      await fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: todayStr,
          hours: availHours,
          focusType,
        }),
      })
      setAvailSaved(true)
      setTimeout(() => setAvailSaved(false), 3000)
    } catch (err) {
      console.error('Error saving availability:', err)
    } finally {
      setSavingAvail(false)
    }
  }

  async function handleGenerateAIPlan() {
    setGeneratingPlan(true)
    setPlanError(null)
    setAiPlan(null)
    try {
      const res = await fetch('/api/frank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Erstelle einen optimalen Tagesplan für heute. Verfügbare Zeit: ${availHours} Stunden. Fokus-Typ: ${focusTypeLabels[focusType]}.

Formatiere jeden Zeitblock exakt so:
**[Zeitblock]** | **Aufgabe** | Warum diese Aufgabe? | Welches Ziel wird unterstützt?

Sei konkret mit Uhrzeiten (z.B. 08:00-09:30) und begründe jede Entscheidung basierend auf den aktuellen KPIs, Engpässen und Zielen.`,
            },
          ],
          context: {
            availableHours: availHours,
            focusType,
            date: today.toLocaleDateString('de-DE'),
          },
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setAiPlan({ rawText: data.message })
    } catch (err) {
      setPlanError(err instanceof Error ? err.message : 'Fehler beim Generieren')
    } finally {
      setGeneratingPlan(false)
    }
  }

  return (
    <div>
      <Header
        title="Daily Planner"
        subtitle="KI-optimierter Tagesplan für maximale Founder-Produktivität"
      />
      <div className="p-6 space-y-6">
        {/* Availability Widget */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(245,158,11,0.03) 100%)',
            border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: '12px',
            padding: '16px',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock size={14} style={{ color: '#f59e0b' }} />
            <h3 style={{ color: '#f59e0b', fontSize: '12px', fontWeight: 700 }} className="uppercase tracking-widest">
              Verfügbarkeit heute
            </h3>
          </div>
          <div className="flex items-end gap-4 flex-wrap">
            <div>
              <p style={{ color: '#64748b', fontSize: '11px', fontWeight: 500, marginBottom: '8px' }}>
                Wie viele Stunden stehen heute zur Verfügung?
              </p>
              <div className="flex items-center gap-2">
                {[2, 4, 6, 8, 10, 12].map((h) => (
                  <button
                    key={h}
                    onClick={() => setAvailHours(h)}
                    style={{
                      backgroundColor: availHours === h ? '#f59e0b' : '#111318',
                      border: `1px solid ${availHours === h ? '#f59e0b' : '#1e2130'}`,
                      color: availHours === h ? '#000' : '#94a3b8',
                      borderRadius: '6px',
                      padding: '5px 10px',
                      fontSize: '12px',
                      fontWeight: availHours === h ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {h}h
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p style={{ color: '#64748b', fontSize: '11px', fontWeight: 500, marginBottom: '8px' }}>
                Fokus-Typ
              </p>
              <div className="flex items-center gap-2">
                {Object.entries(focusTypeLabels).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setFocusType(key)}
                    style={{
                      backgroundColor: focusType === key ? 'rgba(139,92,246,0.15)' : '#111318',
                      border: `1px solid ${focusType === key ? '#8b5cf6' : '#1e2130'}`,
                      color: focusType === key ? '#8b5cf6' : '#94a3b8',
                      borderRadius: '6px',
                      padding: '5px 10px',
                      fontSize: '11px',
                      fontWeight: focusType === key ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 ml-auto">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSaveAvailability}
                disabled={savingAvail}
              >
                {savingAvail ? <Loader2 size={12} className="animate-spin" /> : <CheckSquare size={12} />}
                {availSaved ? 'Gespeichert!' : 'Speichern'}
              </Button>
              <Button
                variant="gold"
                size="sm"
                onClick={handleGenerateAIPlan}
                disabled={generatingPlan}
              >
                {generatingPlan ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
                {generatingPlan ? 'FRANK plant...' : 'KI-Plan generieren'}
              </Button>
            </div>
          </div>
        </div>

        {/* AI Plan Result */}
        {(aiPlan || generatingPlan || planError) && (
          <div
            style={{
              backgroundColor: '#111318',
              border: '1px solid rgba(139,92,246,0.2)',
              borderRadius: '12px',
              padding: '16px',
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Zap size={14} style={{ color: '#8b5cf6' }} />
              <h3 style={{ color: '#8b5cf6', fontSize: '12px', fontWeight: 700 }} className="uppercase tracking-widest">
                FRANK KI-Tagesplan
              </h3>
            </div>
            {generatingPlan && (
              <div className="flex items-center gap-2">
                <Loader2 size={14} style={{ color: '#f59e0b' }} className="animate-spin" />
                <p style={{ color: '#64748b', fontSize: '12px' }}>FRANK analysiert deine Daten und erstellt einen optimalen Plan...</p>
              </div>
            )}
            {planError && (
              <p style={{ color: '#ef4444', fontSize: '12px' }}>{planError}</p>
            )}
            {aiPlan?.rawText && (
              <div style={{ color: '#94a3b8', fontSize: '12px', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {aiPlan.rawText}
              </div>
            )}
          </div>
        )}

        {/* Progress Overview */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Fortschritt', value: `${progress}%`, color: '#22c55e' },
            { label: 'Erledigt', value: `${completed}/${total}`, color: '#3b82f6' },
            { label: 'Deep Work', value: '4.5h', color: '#8b5cf6' },
            { label: 'Fokus-Score', value: '8.2/10', color: '#f59e0b' },
          ].map((stat) => (
            <div key={stat.label} className="card p-4">
              <p style={{ color: '#64748b', fontSize: '11px', fontWeight: 500 }} className="mb-1">{stat.label}</p>
              <p style={{ color: stat.color, fontSize: '24px', fontWeight: 700 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }} className="uppercase tracking-widest">
              {today.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </h2>
            <Badge variant="green">{progress}% abgeschlossen</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              <RefreshCw size={12} />
              Neu generieren
            </Button>
            <Button variant="gold" size="sm" onClick={handleGenerateAIPlan} disabled={generatingPlan}>
              <Zap size={12} />
              FRANK optimieren
            </Button>
          </div>
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-2">
            {tasks.map((task, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: task.completed ? 'rgba(34,197,94,0.05)' : '#111318',
                  border: `1px solid ${task.completed ? 'rgba(34,197,94,0.2)' : '#1e2130'}`,
                  borderLeft: `3px solid ${task.color}`,
                  borderRadius: '8px',
                  padding: '10px 14px',
                  opacity: task.category === 'break' ? 0.5 : 1,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {task.completed ? (
                    <CheckCircle2 size={16} style={{ color: '#22c55e', flexShrink: 0 }} />
                  ) : (
                    <Circle size={16} style={{ color: '#475569', flexShrink: 0 }} />
                  )}
                  <div style={{ minWidth: '50px' }}>
                    <span style={{ color: '#f59e0b', fontSize: '11px', fontWeight: 700 }}>{task.time}</span>
                    <br />
                    <span style={{ color: '#475569', fontSize: '10px' }}>{task.endTime}</span>
                  </div>
                  <div className="flex-1">
                    <p style={{
                      color: task.completed ? '#475569' : '#f1f5f9',
                      fontSize: '12px',
                      fontWeight: 500,
                      textDecoration: task.completed ? 'line-through' : 'none',
                    }}>
                      {task.title}
                    </p>
                  </div>
                  <span
                    style={{
                      backgroundColor: `${task.color}15`,
                      color: task.color,
                      fontSize: '10px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: 500,
                      flexShrink: 0,
                    }}
                  >
                    {categoryLabels[task.category]}
                  </span>
                  {task.priority === 1 && (
                    <span style={{ color: '#ef4444', fontSize: '10px', fontWeight: 700, flexShrink: 0 }}>P1</span>
                  )}
                </div>
                {/* Warum? reasoning */}
                {task.reason && task.category !== 'break' && (
                  <div
                    style={{
                      marginTop: '6px',
                      paddingLeft: '40px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '6px',
                    }}
                  >
                    <Target size={10} style={{ color: '#475569', flexShrink: 0, marginTop: '1px' }} />
                    <p style={{ color: '#475569', fontSize: '10px', lineHeight: 1.4 }}>
                      {task.reason}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-4">
            {/* Progress Ring */}
            <div className="card p-4 text-center">
              <div style={{ position: 'relative', display: 'inline-block', margin: '0 auto' }}>
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#1e2130" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="40"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 40 * progress / 100} ${2 * Math.PI * 40 * (1 - progress / 100)}`}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                  <text x="50" y="55" textAnchor="middle" fill="#f1f5f9" fontSize="18" fontWeight="700">{progress}%</text>
                </svg>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '8px' }}>Tagesfortschritt</p>
            </div>

            {/* Category Breakdown */}
            <div className="card p-4">
              <h3 style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 600 }} className="uppercase tracking-widest mb-3">
                Zeit nach Kategorie
              </h3>
              {[
                { label: 'Deep Work', hours: '4.5h', color: '#8b5cf6', pct: 40 },
                { label: 'Meetings', hours: '2.0h', color: '#3b82f6', pct: 20 },
                { label: 'Sales', hours: '1.5h', color: '#22c55e', pct: 15 },
                { label: 'Pausen', hours: '1.5h', color: '#475569', pct: 15 },
                { label: 'Sonstiges', hours: '1.0h', color: '#f97316', pct: 10 },
              ].map((cat) => (
                <div key={cat.label} className="mb-2">
                  <div className="flex justify-between mb-0.5">
                    <span style={{ color: '#94a3b8', fontSize: '11px' }}>{cat.label}</span>
                    <span style={{ color: cat.color, fontSize: '11px', fontWeight: 600 }}>{cat.hours}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${cat.pct}%`, backgroundColor: cat.color }} />
                  </div>
                </div>
              ))}
            </div>

            {/* FRANK Tips */}
            <div
              style={{
                background: 'rgba(245,158,11,0.08)',
                border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: '12px',
                padding: '12px',
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Zap size={12} style={{ color: '#f59e0b' }} />
                <span style={{ color: '#f59e0b', fontSize: '11px', fontWeight: 600 }}>FRANK Tip</span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '11px', lineHeight: 1.5 }}>
                Gib deine verfügbaren Stunden ein und lass FRANK einen datengetriebenen Tagesplan generieren — mit Begründung für jede Aufgabe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
