'use client'

import { useState, useEffect, useCallback } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  CheckSquare, CheckCircle2, Circle, Clock, Zap, RefreshCw, Target, Loader2,
  ChevronLeft, ChevronRight, MapPin, AlertCircle, CalendarDays,
} from 'lucide-react'

// ── Daily Planner data ──────────────────────────────────────────────────────

const tasks = [
  { time: '07:00', endTime: '07:30', title: 'Morning Routine & FRANK Daily Brief', category: 'health', color: '#22c55e', completed: true, priority: 1, reason: 'Tagesstruktur und mentale Klarheit für produktiven Tag.' },
  { time: '07:30', endTime: '09:00', title: 'Deep Work Block: Q3 Strategy Draft', category: 'focus', color: '#8b5cf6', completed: true, priority: 1, reason: 'Unterstützt Jahresziel: Strategische Positionierung Q3.' },
  { time: '09:00', endTime: '09:30', title: 'Team Stand-up Meeting', category: 'meeting', color: '#3b82f6', completed: true, priority: 2, reason: 'Team-Alignment für Tagespriorität.' },
  { time: '09:30', endTime: '10:00', title: 'Email & Slack Review', category: 'admin', color: '#64748b', completed: true, priority: 3, reason: 'Zeitboxed Admin: verhindert ständige Unterbrechungen.' },
  { time: '10:00', endTime: '11:00', title: 'Investor Call: Thomas Weber (Series A)', category: 'call', color: '#f59e0b', completed: false, priority: 1, reason: 'Kritisch für Finanzierungsziel.' },
  { time: '11:15', endTime: '12:00', title: 'Lead Pipeline Review & CRM Update', category: 'sales', color: '#22c55e', completed: false, priority: 2, reason: 'Direkte Auswirkung auf Monatsziel.' },
  { time: '13:00', endTime: '14:30', title: 'Deep Work: Feature Roadmap Q4', category: 'focus', color: '#8b5cf6', completed: false, priority: 1, reason: 'Unterstützt Produktziel Q4.' },
  { time: '14:30', endTime: '15:00', title: 'LinkedIn Content: 3 Posts erstellen', category: 'content', color: '#f97316', completed: false, priority: 2, reason: 'LinkedIn Präsenz = Inbound-Leads.' },
  { time: '15:30', endTime: '16:00', title: 'Product Demo: ACME GmbH', category: 'sales', color: '#22c55e', completed: false, priority: 1, reason: 'Hochwertiger Lead, direkte Auswirkung auf Abschluss-Ziel.' },
  { time: '16:30', endTime: '17:00', title: 'Daily Review & Morgen planen', category: 'review', color: '#ef4444', completed: false, priority: 2, reason: 'Reflexion verhindert Drift.' },
]

const categoryLabels: Record<string, string> = {
  focus: 'Deep Work', meeting: 'Meeting', sales: 'Sales', content: 'Content',
  call: 'Call', admin: 'Admin', health: 'Health', break: 'Pause', learning: 'Lernen', review: 'Review',
}

const focusTypeLabels: Record<string, string> = {
  deep_work: 'Deep Work', sales: 'Sales-Fokus', content: 'Content', balanced: 'Ausgewogen',
}

// ── Calendar helpers ────────────────────────────────────────────────────────

interface CalendarEvent {
  id: string; title: string; description?: string
  startTime: string; endTime: string; type: string; location?: string; color: string
}

const typeConfig: Record<string, { color: string; label: string }> = {
  meeting: { color: '#3b82f6', label: 'Meeting' },
  call: { color: '#f59e0b', label: 'Anruf' },
  focus: { color: '#8b5cf6', label: 'Deep Work' },
  review: { color: '#ef4444', label: 'Review' },
}

function getWeekDays(baseDate: Date) {
  const dayOfWeek = baseDate.getDay()
  const monday = new Date(baseDate)
  monday.setDate(baseDate.getDate() - ((dayOfWeek + 6) % 7))
  const dayLabels = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
  const dayNames = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag']
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return { date: d, label: dayLabels[i], name: `${dayNames[i]}, ${d.getDate()}. ${d.toLocaleString('de-DE', { month: 'short' })}`, dayNum: d.getDate() }
  })
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

// ── Component ───────────────────────────────────────────────────────────────

type Tab = 'heute' | 'kalender' | 'woche'

export default function PlanungPage() {
  const [tab, setTab] = useState<Tab>('heute')

  // Daily planner state
  const [availHours, setAvailHours] = useState(8)
  const [focusType, setFocusType] = useState('balanced')
  const [savingAvail, setSavingAvail] = useState(false)
  const [availSaved, setAvailSaved] = useState(false)
  const [aiPlanText, setAiPlanText] = useState<string | null>(null)
  const [generatingPlan, setGeneratingPlan] = useState(false)
  const [planError, setPlanError] = useState<string | null>(null)

  // Calendar state
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [calLoading, setCalLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [calError, setCalError] = useState<string | null>(null)
  const [noToken, setNoToken] = useState(false)
  const [weekOffset, setWeekOffset] = useState(0)

  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  const completed = tasks.filter(t => t.completed).length
  const progress = Math.round((completed / tasks.length) * 100)

  const baseDate = new Date(today)
  baseDate.setDate(today.getDate() + weekOffset * 7)
  const weekDays = getWeekDays(baseDate)
  const startOfYear = new Date(today.getFullYear(), 0, 1)
  const weekNum = Math.ceil(((today.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7)
  const monthYear = baseDate.toLocaleString('de-DE', { month: 'long', year: 'numeric' })
  const todayEvents = events.filter(e => isSameDay(new Date(e.startTime), today))

  const fetchEvents = useCallback(async () => {
    try {
      setCalLoading(true)
      setCalError(null)
      const res = await fetch('/api/sync/calendar')
      if (!res.ok) {
        const d = await res.json()
        if (d.error?.includes('No Google token')) setNoToken(true)
        else setCalError(d.error || 'Fehler beim Laden')
        return
      }
      setEvents(await res.json())
      setNoToken(false)
    } catch { setCalError('Verbindungsfehler') }
    finally { setCalLoading(false) }
  }, [])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  async function handleSaveAvailability() {
    setSavingAvail(true)
    try {
      await fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: todayStr, hours: availHours, focusType }),
      })
      setAvailSaved(true)
      setTimeout(() => setAvailSaved(false), 3000)
    } catch { /* silent */ }
    finally { setSavingAvail(false) }
  }

  async function handleGenerateAIPlan() {
    setGeneratingPlan(true)
    setPlanError(null)
    setAiPlanText(null)
    try {
      const res = await fetch('/api/frank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `Erstelle einen optimalen Tagesplan für heute. Verfügbare Zeit: ${availHours} Stunden. Fokus-Typ: ${focusTypeLabels[focusType]}. Formatiere jeden Zeitblock exakt so: **[Zeitblock]** | **Aufgabe** | Warum diese Aufgabe? | Welches Ziel wird unterstützt?` }],
          context: { availableHours: availHours, focusType, date: today.toLocaleDateString('de-DE') },
        }),
      })
      const d = await res.json()
      if (d.error) throw new Error(d.error)
      setAiPlanText(d.message)
    } catch (err) { setPlanError(err instanceof Error ? err.message : 'Fehler') }
    finally { setGeneratingPlan(false) }
  }

  async function handleSync() {
    setSyncing(true)
    setCalError(null)
    try {
      const res = await fetch('/api/sync/calendar', { method: 'POST' })
      const d = await res.json()
      if (!res.ok) {
        if (d.error?.includes('No Google token')) setNoToken(true)
        else setCalError(d.error || 'Sync fehlgeschlagen')
        return
      }
      await fetchEvents()
    } catch { setCalError('Sync fehlgeschlagen') }
    finally { setSyncing(false) }
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'heute', label: 'Heute' },
    { key: 'kalender', label: 'Kalender' },
    { key: 'woche', label: 'Woche' },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#0a0b0f' }}>
      <div className="p-6 max-w-6xl mx-auto">

        {/* Header + Tabs */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#f1f5f9' }}>Planung</h1>
          <p style={{ color: '#64748b' }} className="mb-4">Tagesplan, Kalender & Wochenübersicht</p>
          <div className="flex gap-1" style={{ background: '#111318', border: '1px solid #1e2130', borderRadius: '10px', padding: '4px', display: 'inline-flex' }}>
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                style={{
                  background: tab === t.key ? '#f59e0b' : 'transparent',
                  color: tab === t.key ? '#0a0b0f' : '#94a3b8',
                  border: 'none',
                  borderRadius: '7px',
                  padding: '6px 16px',
                  fontSize: '13px',
                  fontWeight: tab === t.key ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── HEUTE TAB ──────────────────────────────────────────────── */}
        {tab === 'heute' && (
          <div className="space-y-6">
            {/* Availability Widget */}
            <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(245,158,11,0.03) 100%)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Clock size={14} style={{ color: '#f59e0b' }} />
                <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: '#f59e0b' }}>Verfügbarkeit heute</h3>
              </div>
              <div className="flex items-end gap-4 flex-wrap">
                <div>
                  <p className="text-xs mb-2" style={{ color: '#64748b' }}>Wie viele Stunden stehen heute zur Verfügung?</p>
                  <div className="flex items-center gap-2">
                    {[2, 4, 6, 8, 10, 12].map((h) => (
                      <button key={h} onClick={() => setAvailHours(h)}
                        style={{ backgroundColor: availHours === h ? '#f59e0b' : '#111318', border: `1px solid ${availHours === h ? '#f59e0b' : '#1e2130'}`, color: availHours === h ? '#000' : '#94a3b8', borderRadius: '6px', padding: '5px 10px', fontSize: '12px', fontWeight: availHours === h ? 700 : 500, cursor: 'pointer' }}>
                        {h}h
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs mb-2" style={{ color: '#64748b' }}>Fokus-Typ</p>
                  <div className="flex items-center gap-2">
                    {Object.entries(focusTypeLabels).map(([key, label]) => (
                      <button key={key} onClick={() => setFocusType(key)}
                        style={{ backgroundColor: focusType === key ? 'rgba(139,92,246,0.15)' : '#111318', border: `1px solid ${focusType === key ? '#8b5cf6' : '#1e2130'}`, color: focusType === key ? '#8b5cf6' : '#94a3b8', borderRadius: '6px', padding: '5px 10px', fontSize: '11px', fontWeight: focusType === key ? 700 : 500, cursor: 'pointer' }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 ml-auto">
                  <Button variant="secondary" size="sm" onClick={handleSaveAvailability} disabled={savingAvail}>
                    {savingAvail ? <Loader2 size={12} className="animate-spin" /> : <CheckSquare size={12} />}
                    {availSaved ? 'Gespeichert!' : 'Speichern'}
                  </Button>
                  <Button variant="gold" size="sm" onClick={handleGenerateAIPlan} disabled={generatingPlan}>
                    {generatingPlan ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
                    {generatingPlan ? 'FRANK plant...' : 'KI-Plan generieren'}
                  </Button>
                </div>
              </div>
            </div>

            {/* AI Plan Result */}
            {(aiPlanText || generatingPlan || planError) && (
              <div className="p-4 rounded-xl" style={{ background: '#111318', border: '1px solid rgba(139,92,246,0.2)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Zap size={14} style={{ color: '#8b5cf6' }} />
                  <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: '#8b5cf6' }}>FRANK KI-Tagesplan</h3>
                </div>
                {generatingPlan && <div className="flex items-center gap-2"><Loader2 size={14} style={{ color: '#f59e0b' }} className="animate-spin" /><p className="text-xs" style={{ color: '#64748b' }}>FRANK analysiert deine Daten...</p></div>}
                {planError && <p className="text-xs" style={{ color: '#ef4444' }}>{planError}</p>}
                {aiPlanText && <div style={{ color: '#94a3b8', fontSize: '12px', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{aiPlanText}</div>}
              </div>
            )}

            {/* Progress */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Fortschritt', value: `${progress}%`, color: '#22c55e' },
                { label: 'Erledigt', value: `${completed}/${tasks.length}`, color: '#3b82f6' },
                { label: 'Deep Work', value: '4.5h', color: '#8b5cf6' },
                { label: 'Fokus-Score', value: '8.2/10', color: '#f59e0b' },
              ].map((s) => (
                <div key={s.label} className="card p-4">
                  <p className="text-xs mb-1" style={{ color: '#64748b' }}>{s.label}</p>
                  <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#94a3b8' }}>
                  {today.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </h2>
                <Badge variant="green">{progress}% abgeschlossen</Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm"><RefreshCw size={12} />Neu generieren</Button>
                <Button variant="gold" size="sm" onClick={handleGenerateAIPlan} disabled={generatingPlan}><Zap size={12} />FRANK optimieren</Button>
              </div>
            </div>

            {/* Task Timeline */}
            <div className="space-y-2">
              {tasks.map((task, i) => (
                <div key={i} style={{ backgroundColor: task.completed ? 'rgba(34,197,94,0.05)' : '#111318', border: `1px solid ${task.completed ? 'rgba(34,197,94,0.2)' : '#1e2130'}`, borderLeft: `3px solid ${task.color}`, borderRadius: '8px', padding: '10px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {task.completed ? <CheckCircle2 size={16} style={{ color: '#22c55e', flexShrink: 0 }} /> : <Circle size={16} style={{ color: '#475569', flexShrink: 0 }} />}
                    <div style={{ minWidth: '50px' }}>
                      <span style={{ color: '#f59e0b', fontSize: '11px', fontWeight: 700 }}>{task.time}</span>
                      <br />
                      <span style={{ color: '#475569', fontSize: '10px' }}>{task.endTime}</span>
                    </div>
                    <div className="flex-1">
                      <p style={{ color: task.completed ? '#475569' : '#f1f5f9', fontSize: '12px', fontWeight: 500, textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</p>
                    </div>
                    <span style={{ backgroundColor: `${task.color}15`, color: task.color, fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: 500, flexShrink: 0 }}>{categoryLabels[task.category]}</span>
                    {task.priority === 1 && <span style={{ color: '#ef4444', fontSize: '10px', fontWeight: 700, flexShrink: 0 }}>P1</span>}
                  </div>
                  {task.reason && (
                    <div style={{ marginTop: '6px', paddingLeft: '40px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                      <Target size={10} style={{ color: '#475569', flexShrink: 0, marginTop: '1px' }} />
                      <p style={{ color: '#475569', fontSize: '10px', lineHeight: 1.4 }}>{task.reason}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── KALENDER TAB ───────────────────────────────────────────── */}
        {tab === 'kalender' && (
          <div className="space-y-6">
            {noToken && (
              <div style={{ backgroundColor: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '10px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertCircle size={16} style={{ color: '#f59e0b', flexShrink: 0 }} />
                <p style={{ color: '#f59e0b', fontSize: '13px' }}>Google Kalender nicht verbunden — gehe zu <a href="/integrations" style={{ textDecoration: 'underline' }}>Integrationen</a>.</p>
              </div>
            )}
            {calError && (
              <div style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertCircle size={16} style={{ color: '#ef4444', flexShrink: 0 }} />
                <p style={{ color: '#ef4444', fontSize: '13px' }}>{calError}</p>
              </div>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded-lg hover:bg-white/5" onClick={() => setWeekOffset(w => w - 1)}><ChevronLeft size={16} style={{ color: '#94a3b8' }} /></button>
                <h2 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 600 }}>KW {weekNum} — {monthYear}</h2>
                <button className="p-1.5 rounded-lg hover:bg-white/5" onClick={() => setWeekOffset(w => w + 1)}><ChevronRight size={16} style={{ color: '#94a3b8' }} /></button>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => setWeekOffset(0)}>Heute</Button>
                <Button variant="gold" size="sm" onClick={handleSync} disabled={syncing}>
                  <RefreshCw size={12} className={syncing ? 'animate-spin' : ''} />
                  {syncing ? 'Synchronisiert...' : 'Google Kalender synchronisieren'}
                </Button>
              </div>
            </div>

            <div className="card overflow-hidden">
              <div style={{ borderBottom: '1px solid #1e2130', display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                {weekDays.map((d) => {
                  const isToday = isSameDay(d.date, today)
                  return (
                    <div key={d.dayNum} style={{ padding: '12px 8px', textAlign: 'center', borderRight: '1px solid #1e2130', backgroundColor: isToday ? 'rgba(245,158,11,0.08)' : 'transparent' }}>
                      <p style={{ color: isToday ? '#f59e0b' : '#64748b', fontSize: '10px', fontWeight: 600 }} className="uppercase">{d.label}</p>
                      <p style={{ color: isToday ? '#f59e0b' : '#f1f5f9', fontSize: '18px', fontWeight: 700, lineHeight: 1, marginTop: '2px' }}>{d.dayNum}</p>
                    </div>
                  )
                })}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', minHeight: '300px' }}>
                {calLoading ? (
                  <div style={{ gridColumn: 'span 7', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
                    <p style={{ color: '#475569', fontSize: '13px' }}>Termine werden geladen...</p>
                  </div>
                ) : events.length === 0 && !noToken ? (
                  <div style={{ gridColumn: 'span 7', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
                    <p style={{ color: '#475569', fontSize: '13px', textAlign: 'center' }}>Keine Termine. Synchronisiere deinen Google Kalender.</p>
                  </div>
                ) : (
                  weekDays.map((d) => {
                    const isToday = isSameDay(d.date, today)
                    const dayEvents = events.filter(e => isSameDay(new Date(e.startTime), d.date))
                    return (
                      <div key={d.dayNum} style={{ borderRight: '1px solid #1e2130', padding: '8px', backgroundColor: isToday ? 'rgba(245,158,11,0.03)' : 'transparent', minHeight: '280px' }}>
                        {dayEvents.map((evt) => (
                          <div key={evt.id} style={{ backgroundColor: `${evt.color}15`, border: `1px solid ${evt.color}30`, borderLeft: `3px solid ${evt.color}`, borderRadius: '6px', padding: '6px 8px', marginBottom: '4px', cursor: 'pointer' }}>
                            <p style={{ color: evt.color, fontSize: '10px', fontWeight: 700 }}>{formatTime(evt.startTime)}</p>
                            <p style={{ color: '#f1f5f9', fontSize: '10px', fontWeight: 500, lineHeight: 1.3 }}>{evt.title}</p>
                          </div>
                        ))}
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#94a3b8' }}>
                Heutige Termine — {today.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
              </h2>
              {todayEvents.length === 0 ? (
                <div className="card p-6 text-center"><p style={{ color: '#475569', fontSize: '13px' }}>{noToken ? 'Google Kalender nicht verbunden.' : calLoading ? 'Laden...' : 'Keine Termine für heute.'}</p></div>
              ) : (
                <div className="space-y-2">
                  {todayEvents.map((evt) => {
                    const typeInfo = typeConfig[evt.type] || typeConfig.meeting
                    return (
                      <div key={evt.id} className="card p-4">
                        <div className="flex items-start gap-4">
                          <div style={{ backgroundColor: `${evt.color}15`, border: `1px solid ${evt.color}30`, borderRadius: '8px', padding: '8px', textAlign: 'center', minWidth: '52px' }}>
                            <p style={{ color: evt.color, fontSize: '13px', fontWeight: 700 }}>{formatTime(evt.startTime)}</p>
                            <p style={{ color: '#475569', fontSize: '10px' }}>{formatTime(evt.endTime)}</p>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 600 }}>{evt.title}</h3>
                              <span style={{ color: typeInfo.color, fontSize: '10px', fontWeight: 500, backgroundColor: `${typeInfo.color}15`, padding: '2px 6px', borderRadius: '4px' }}>{typeInfo.label}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              {evt.location && <div className="flex items-center gap-1"><MapPin size={11} style={{ color: '#475569' }} /><span style={{ color: '#475569', fontSize: '11px' }}>{evt.location}</span></div>}
                              <div className="flex items-center gap-1"><Clock size={11} style={{ color: '#475569' }} /><span style={{ color: '#475569', fontSize: '11px' }}>{formatTime(evt.startTime)} – {formatTime(evt.endTime)}</span></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── WOCHE TAB ──────────────────────────────────────────────── */}
        {tab === 'woche' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4 mb-2">
              {[
                { label: 'Erledigte Aufgaben', value: `${completed}/${tasks.length}`, color: '#22c55e' },
                { label: 'Kalender-Termine', value: `${todayEvents.length} heute`, color: '#3b82f6' },
                { label: 'Wochenfortschritt', value: `${progress}%`, color: '#f59e0b' },
              ].map((s) => (
                <div key={s.label} className="p-4 rounded-xl" style={{ background: '#111318', border: '1px solid #1e2130' }}>
                  <p className="text-xs mb-1" style={{ color: '#64748b' }}>{s.label}</p>
                  <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>

            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#64748b' }}>Diese Woche — Übersicht</h2>
              <div className="space-y-3">
                {['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag'].map((day, i) => {
                  const isToday = i === ((today.getDay() + 6) % 7)
                  return (
                    <div key={day} className="p-4 rounded-xl flex items-center gap-4" style={{ background: '#111318', border: `1px solid ${isToday ? '#f59e0b30' : '#1e2130'}` }}>
                      <div style={{ minWidth: '80px' }}>
                        <p className="text-sm font-semibold" style={{ color: isToday ? '#f59e0b' : '#f1f5f9' }}>{day}</p>
                        {isToday && <span className="text-xs" style={{ color: '#f59e0b' }}>Heute</span>}
                      </div>
                      <div className="flex-1">
                        <div className="h-2 rounded-full" style={{ background: '#1e2130' }}>
                          <div className="h-2 rounded-full" style={{ background: isToday ? '#f59e0b' : '#3b82f6', width: isToday ? `${progress}%` : i < ((today.getDay() + 6) % 7) ? '100%' : '0%' }} />
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarDays size={12} style={{ color: '#475569' }} />
                        <span className="text-xs" style={{ color: '#475569' }}>
                          {isToday ? `${todayEvents.length} Termine` : i < ((today.getDay() + 6) % 7) ? 'Abgeschlossen' : 'Geplant'}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="p-5 rounded-xl text-center" style={{ background: 'linear-gradient(135deg, #f59e0b10 0%, #f59e0b05 100%)', border: '1px solid #f59e0b30' }}>
              <p className="text-sm mb-3" style={{ color: '#94a3b8' }}>Frank soll deinen Wochenplan optimieren?</p>
              <button
                onClick={() => setTab('heute')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm"
                style={{ background: '#f59e0b', color: '#0a0b0f', cursor: 'pointer', border: 'none' }}
              >
                <Zap size={14} />
                KI-Plan generieren
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
