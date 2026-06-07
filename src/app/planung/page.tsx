'use client'

import { useState, useEffect, useCallback } from 'react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  CheckSquare, CheckCircle2, Circle, Clock, Zap, RefreshCw, Target, Loader2,
  ChevronLeft, ChevronRight, MapPin, AlertCircle, CalendarDays, X,
} from 'lucide-react'

// ── Types ───────────────────────────────────────────────────────────────────

interface CalendarEvent {
  id: string; title: string; description?: string
  startTime: string; endTime: string; type: string; location?: string; color: string
}

interface DailyTask {
  id: string
  title: string
  startTime: string
  endTime: string
  category: string
  completed: boolean
  priority: number
  color: string
  reason?: string
}

interface DailyPlan {
  id: string
  date: string
  progress: number
  tasks: DailyTask[]
}

interface AvailabilityRecord {
  id: string
  date: string
  hours: number
  startTime?: string | null
  endTime?: string | null
  notAvailable: boolean
  focusType: string
  note?: string | null
}

// ── Constants ───────────────────────────────────────────────────────────────

const categoryLabels: Record<string, string> = {
  focus: 'Deep Work', meeting: 'Meeting', sales: 'Sales', content: 'Content',
  call: 'Call', admin: 'Admin', health: 'Health', break: 'Pause', learning: 'Lernen', review: 'Review', work: 'Arbeit',
}

const focusTypeLabels: Record<string, string> = {
  deep_work: 'Deep Work', sales: 'Sales', content: 'Content', balanced: 'Ausgewogen',
}

const focusTypeColors: Record<string, string> = {
  deep_work: '#8b5cf6', sales: '#22c55e', content: '#f97316', balanced: '#3b82f6',
}

const typeConfig: Record<string, { color: string; label: string }> = {
  meeting: { color: '#3b82f6', label: 'Meeting' },
  call: { color: '#f59e0b', label: 'Anruf' },
  focus: { color: '#8b5cf6', label: 'Deep Work' },
  review: { color: '#ef4444', label: 'Review' },
}

const DE_WEEKDAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
const DE_WEEKDAYS_FULL = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']
const DE_MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']

// ── Helpers ──────────────────────────────────────────────────────────────────

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

function getMonthDays(year: number, month: number): Array<Date | null> {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  // Monday-first grid
  let startPad = (firstDay.getDay() + 6) % 7
  const days: Array<Date | null> = []
  for (let i = 0; i < startPad; i++) days.push(null)
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d))
  return days
}

function dateKey(d: Date) {
  return d.toISOString().split('T')[0]
}

function parseTasksFromFrankResponse(text: string): Array<{
  title: string; startTime: string; endTime: string; category: string; priority: number
}> {
  const lines = text.split('\n')
  const tasks: Array<{ title: string; startTime: string; endTime: string; category: string; priority: number }> = []
  const timePattern = /(\d{1,2}:\d{2})\s*[–\-]\s*(\d{1,2}:\d{2})/

  for (const line of lines) {
    const match = line.match(timePattern)
    if (!match) continue
    const startTime = match[1].padStart(5, '0')
    const endTime = match[2].padStart(5, '0')
    // Extract title: remove time pattern and markdown bold markers
    let title = line
      .replace(timePattern, '')
      .replace(/\*\*/g, '')
      .replace(/^\s*[\|\-\*#]+\s*/, '')
      .replace(/\|\s*.*$/, '') // Remove "| Warum..." part
      .trim()
    if (!title) continue

    // Detect category
    let category = 'work'
    let priority = 2
    const lower = title.toLowerCase()
    if (lower.includes('deep work') || lower.includes('focus') || lower.includes('strategi')) { category = 'focus'; priority = 1 }
    else if (lower.includes('meeting') || lower.includes('stand-up')) { category = 'meeting'; priority = 2 }
    else if (lower.includes('sales') || lower.includes('lead') || lower.includes('demo') || lower.includes('investor')) { category = 'sales'; priority = 1 }
    else if (lower.includes('content') || lower.includes('linkedin') || lower.includes('post')) { category = 'content'; priority = 2 }
    else if (lower.includes('morning') || lower.includes('health') || lower.includes('sport')) { category = 'health'; priority = 3 }
    else if (lower.includes('email') || lower.includes('admin') || lower.includes('slack')) { category = 'admin'; priority = 3 }
    else if (lower.includes('review') || lower.includes('reflexion')) { category = 'review'; priority = 2 }

    tasks.push({ title, startTime, endTime, category, priority })
  }
  return tasks
}

// ── Component ────────────────────────────────────────────────────────────────

type Tab = 'heute' | 'kalender' | 'woche' | 'monat'

export default function PlanungPage() {
  const [tab, setTab] = useState<Tab>('heute')

  // ── Heute state
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null)
  const [planLoading, setPlanLoading] = useState(true)
  const [generatingPlan, setGeneratingPlan] = useState(false)
  const [savingPlan, setSavingPlan] = useState(false)
  const [planError, setPlanError] = useState<string | null>(null)
  const [aiPlanText, setAiPlanText] = useState<string | null>(null)
  const [availHours, setAvailHours] = useState(8)
  const [focusType, setFocusType] = useState('balanced')

  // ── Calendar state
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [calLoading, setCalLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [calError, setCalError] = useState<string | null>(null)
  const [noToken, setNoToken] = useState(false)
  const [weekOffset, setWeekOffset] = useState(0)

  // ── Monat state
  const [monthOffset, setMonthOffset] = useState(0)
  const [availability, setAvailability] = useState<Record<string, AvailabilityRecord>>({})
  const [availLoading, setAvailLoading] = useState(false)
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const [dayForm, setDayForm] = useState({
    startTime: '09:00',
    endTime: '18:00',
    notAvailable: false,
    focusType: 'balanced',
    note: '',
  })
  const [savingDay, setSavingDay] = useState(false)
  const [daySaved, setDaySaved] = useState(false)
  const [monthPlanText, setMonthPlanText] = useState<string | null>(null)
  const [generatingMonthPlan, setGeneratingMonthPlan] = useState(false)
  const [monthPlanError, setMonthPlanError] = useState<string | null>(null)

  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]

  // Calendar helpers
  const baseDate = new Date(today)
  baseDate.setDate(today.getDate() + weekOffset * 7)
  const weekDays = getWeekDays(baseDate)
  const startOfYear = new Date(today.getFullYear(), 0, 1)
  const weekNum = Math.ceil(((today.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7)
  const monthYear = baseDate.toLocaleString('de-DE', { month: 'long', year: 'numeric' })
  const todayEvents = events.filter(e => isSameDay(new Date(e.startTime), today))

  // Monat helpers
  const targetDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1)
  const targetYear = targetDate.getFullYear()
  const targetMonth = targetDate.getMonth()
  const monthDays = getMonthDays(targetYear, targetMonth)

  // ── Load daily plan ──────────────────────────────────────────────────────

  const fetchDailyPlan = useCallback(async () => {
    setPlanLoading(true)
    setPlanError(null)
    try {
      const res = await fetch('/api/daily-plan')
      if (!res.ok) throw new Error('Fehler beim Laden')
      const data = await res.json()
      setDailyPlan(data)
    } catch {
      setPlanError('Tagesplan konnte nicht geladen werden.')
    } finally {
      setPlanLoading(false)
    }
  }, [])

  useEffect(() => { fetchDailyPlan() }, [fetchDailyPlan])

  // ── Load calendar events ─────────────────────────────────────────────────

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

  // ── Load month availability ──────────────────────────────────────────────

  const fetchMonthAvailability = useCallback(async () => {
    setAvailLoading(true)
    try {
      const from = new Date(targetYear, targetMonth, 1).toISOString().split('T')[0]
      const to = new Date(targetYear, targetMonth + 1, 0).toISOString().split('T')[0]
      const res = await fetch(`/api/availability?from=${from}&to=${to}`)
      const data: AvailabilityRecord[] = await res.json()
      const map: Record<string, AvailabilityRecord> = {}
      for (const r of data) {
        map[r.date.split('T')[0]] = r
      }
      setAvailability(map)
    } catch { /* silent */ }
    finally { setAvailLoading(false) }
  }, [targetYear, targetMonth])

  useEffect(() => {
    if (tab === 'monat') fetchMonthAvailability()
  }, [tab, fetchMonthAvailability])

  // ── Heute handlers ───────────────────────────────────────────────────────

  async function handleGenerateAIPlan() {
    setGeneratingPlan(true)
    setPlanError(null)
    setAiPlanText(null)
    try {
      const res = await fetch('/api/frank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: `Erstelle einen optimalen Tagesplan für heute (${today.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}). Verfügbare Zeit: ${availHours} Stunden. Fokus-Typ: ${focusTypeLabels[focusType]}. Formatiere jeden Zeitblock exakt so (eine Zeile pro Aufgabe): 09:00-11:00 | Aufgabe | Warum | Ziel` }],
          context: { availableHours: availHours, focusType, date: today.toLocaleDateString('de-DE') },
        }),
      })
      const d = await res.json()
      if (d.error) throw new Error(d.error)
      setAiPlanText(d.message)
    } catch (err) { setPlanError(err instanceof Error ? err.message : 'Fehler') }
    finally { setGeneratingPlan(false) }
  }

  async function handleSavePlan() {
    if (!aiPlanText) return
    setSavingPlan(true)
    try {
      const tasks = parseTasksFromFrankResponse(aiPlanText)
      if (tasks.length === 0) {
        setPlanError('Keine Aufgaben erkannt. Bitte erneut generieren.')
        return
      }
      const res = await fetch('/api/daily-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks }),
      })
      const data = await res.json()
      setDailyPlan(data)
      setAiPlanText(null)
    } catch { setPlanError('Fehler beim Speichern.') }
    finally { setSavingPlan(false) }
  }

  async function handleToggleTask(taskId: string, completed: boolean) {
    setDailyPlan(prev => {
      if (!prev) return prev
      const tasks = prev.tasks.map(t => t.id === taskId ? { ...t, completed } : t)
      const doneCount = tasks.filter(t => t.completed).length
      return { ...prev, tasks, progress: tasks.length > 0 ? (doneCount / tasks.length) * 100 : 0 }
    })
    try {
      await fetch(`/api/daily-plan/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      })
    } catch { /* revert on error */ fetchDailyPlan() }
  }

  // ── Calendar handlers ────────────────────────────────────────────────────

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

  // ── Monat handlers ───────────────────────────────────────────────────────

  function handleSelectDay(day: Date) {
    setDaySaved(false)
    if (selectedDay && isSameDay(selectedDay, day)) {
      setSelectedDay(null)
      return
    }
    setSelectedDay(day)
    const key = dateKey(day)
    const existing = availability[key]
    if (existing) {
      setDayForm({
        startTime: existing.startTime || '09:00',
        endTime: existing.endTime || '18:00',
        notAvailable: existing.notAvailable,
        focusType: existing.focusType || 'balanced',
        note: existing.note || '',
      })
    } else {
      setDayForm({ startTime: '09:00', endTime: '18:00', notAvailable: false, focusType: 'balanced', note: '' })
    }
  }

  async function handleSaveDayAvailability() {
    if (!selectedDay) return
    setSavingDay(true)
    try {
      const res = await fetch('/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: dateKey(selectedDay),
          startTime: dayForm.notAvailable ? null : dayForm.startTime,
          endTime: dayForm.notAvailable ? null : dayForm.endTime,
          notAvailable: dayForm.notAvailable,
          focusType: dayForm.focusType,
          note: dayForm.note || null,
        }),
      })
      const record = await res.json()
      setAvailability(prev => ({ ...prev, [record.date.split('T')[0]]: record }))
      setDaySaved(true)
      setTimeout(() => setDaySaved(false), 2500)
    } catch { /* silent */ }
    finally { setSavingDay(false) }
  }

  async function handleFrankMonthPlan() {
    setGeneratingMonthPlan(true)
    setMonthPlanError(null)
    setMonthPlanText(null)
    const availEntries = Object.entries(availability).map(([date, rec]) => {
      const d = new Date(date)
      const dayLabel = `${DE_WEEKDAYS_FULL[d.getDay()]}, ${d.getDate()}. ${DE_MONTHS[d.getMonth()]}`
      if (rec.notAvailable) return `${dayLabel}: Nicht verfügbar`
      return `${dayLabel}: ${rec.startTime || '09:00'} – ${rec.endTime || '18:00'} | Fokus: ${focusTypeLabels[rec.focusType] || 'Ausgewogen'}${rec.note ? ` | Notiz: ${rec.note}` : ''}`
    })
    const availText = availEntries.length > 0 ? availEntries.join('\n') : 'Noch keine Verfügbarkeiten eingetragen.'
    try {
      const res = await fetch('/api/frank', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: `Plane den Monat ${DE_MONTHS[targetMonth]} ${targetYear} basierend auf folgender Verfügbarkeit:\n\n${availText}\n\nErstelle einen monatlichen Arbeitsplan mit: 1) Schwerpunkt-Wochen, 2) Content-Tage, 3) Sales-Tage, 4) Deep-Work-Blöcke, 5) Buffer für Unvorhergesehenes. Format: strukturiert, umsetzbar, wie ein COO der den Kalender plant. Verwende klare Abschnitte mit Überschriften.`,
          }],
          context: { month: DE_MONTHS[targetMonth], year: targetYear, availability: availEntries },
        }),
      })
      const d = await res.json()
      if (d.error) throw new Error(d.error)
      setMonthPlanText(d.message)
    } catch (err) { setMonthPlanError(err instanceof Error ? err.message : 'Fehler') }
    finally { setGeneratingMonthPlan(false) }
  }

  // ── Derived ──────────────────────────────────────────────────────────────

  const completedCount = dailyPlan?.tasks.filter(t => t.completed).length ?? 0
  const totalTasks = dailyPlan?.tasks.length ?? 0
  const progress = dailyPlan?.progress ?? 0

  const tabs: { key: Tab; label: string }[] = [
    { key: 'heute', label: 'Heute' },
    { key: 'kalender', label: 'Kalender' },
    { key: 'woche', label: 'Woche' },
    { key: 'monat', label: 'Monat' },
  ]

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen" style={{ background: '#0a0b0f' }}>
      <div className="p-6 max-w-6xl mx-auto">

        {/* Header + Tabs */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#f1f5f9' }}>Planung</h1>
          <p style={{ color: '#64748b' }} className="mb-4">Tagesplan, Kalender & Wochenübersicht</p>
          <div style={{ background: '#111318', border: '1px solid #1e2130', borderRadius: '10px', padding: '4px', display: 'inline-flex', gap: '4px' }}>
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

        {/* ── HEUTE TAB ──────────────────────────────────────────────────── */}
        {tab === 'heute' && (
          <div className="space-y-6">

            {/* Availability / Plan Generator Widget */}
            <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(245,158,11,0.03) 100%)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Clock size={14} style={{ color: '#f59e0b' }} />
                <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: '#f59e0b' }}>Verfügbarkeit & KI-Plan</h3>
              </div>
              <div className="flex items-end gap-4 flex-wrap">
                <div>
                  <p className="text-xs mb-2" style={{ color: '#64748b' }}>Verfügbare Stunden heute</p>
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
                  <Button variant="gold" size="sm" onClick={handleGenerateAIPlan} disabled={generatingPlan}>
                    {generatingPlan ? <Loader2 size={12} className="animate-spin" /> : <Zap size={12} />}
                    {generatingPlan ? 'FRANK plant...' : 'KI-Plan generieren'}
                  </Button>
                </div>
              </div>
            </div>

            {/* AI Plan Raw Output + Save button */}
            {(aiPlanText || generatingPlan || planError) && (
              <div className="p-4 rounded-xl" style={{ background: '#111318', border: '1px solid rgba(139,92,246,0.2)' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Zap size={14} style={{ color: '#8b5cf6' }} />
                    <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: '#8b5cf6' }}>FRANK KI-Tagesplan</h3>
                  </div>
                  {aiPlanText && (
                    <Button variant="gold" size="sm" onClick={handleSavePlan} disabled={savingPlan}>
                      {savingPlan ? <Loader2 size={12} className="animate-spin" /> : <CheckSquare size={12} />}
                      {savingPlan ? 'Speichert...' : 'Plan übernehmen'}
                    </Button>
                  )}
                </div>
                {generatingPlan && <div className="flex items-center gap-2"><Loader2 size={14} style={{ color: '#f59e0b' }} className="animate-spin" /><p className="text-xs" style={{ color: '#64748b' }}>FRANK analysiert deine Daten...</p></div>}
                {planError && <p className="text-xs" style={{ color: '#ef4444' }}>{planError}</p>}
                {aiPlanText && <div style={{ color: '#94a3b8', fontSize: '12px', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{aiPlanText}</div>}
              </div>
            )}

            {/* No plan yet */}
            {!planLoading && !dailyPlan && !aiPlanText && !generatingPlan && (
              <div className="p-8 rounded-xl text-center" style={{ background: '#111318', border: '1px solid #1e2130' }}>
                <Zap size={28} style={{ color: '#f59e0b', margin: '0 auto 12px' }} />
                <p className="text-sm mb-1" style={{ color: '#f1f5f9', fontWeight: 600 }}>Noch kein Tagesplan für heute</p>
                <p className="text-xs mb-4" style={{ color: '#64748b' }}>Lass FRANK deinen optimalen Tagesplan erstellen</p>
                <Button variant="gold" size="md" onClick={handleGenerateAIPlan} disabled={generatingPlan}>
                  <Zap size={14} />
                  KI-Plan generieren
                </Button>
              </div>
            )}

            {planLoading && (
              <div className="flex items-center justify-center p-8">
                <Loader2 size={20} style={{ color: '#f59e0b' }} className="animate-spin" />
                <span className="ml-2 text-sm" style={{ color: '#64748b' }}>Tagesplan wird geladen...</span>
              </div>
            )}

            {/* Plan loaded: show stats + tasks */}
            {dailyPlan && !planLoading && (
              <>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: 'Fortschritt', value: `${Math.round(progress)}%`, color: '#22c55e' },
                    { label: 'Erledigt', value: `${completedCount}/${totalTasks}`, color: '#3b82f6' },
                    { label: 'Deep Work', value: `${dailyPlan.tasks.filter(t => t.category === 'focus').length} Blöcke`, color: '#8b5cf6' },
                    { label: 'Fokus-Score', value: totalTasks > 0 ? `${Math.round((completedCount / totalTasks) * 10 * 10) / 10}/10` : '—', color: '#f59e0b' },
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
                    <Badge variant="green">{Math.round(progress)}% abgeschlossen</Badge>
                  </div>
                  <Button variant="secondary" size="sm" onClick={handleGenerateAIPlan} disabled={generatingPlan}>
                    <RefreshCw size={12} />Neu generieren
                  </Button>
                </div>

                {/* Task Timeline */}
                <div className="space-y-2">
                  {dailyPlan.tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(task.id, !task.completed)}
                      style={{ backgroundColor: task.completed ? 'rgba(34,197,94,0.05)' : '#111318', border: `1px solid ${task.completed ? 'rgba(34,197,94,0.2)' : '#1e2130'}`, borderLeft: `3px solid ${task.color}`, borderRadius: '8px', padding: '10px 14px', cursor: 'pointer', transition: 'all 0.15s' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {task.completed
                          ? <CheckCircle2 size={16} style={{ color: '#22c55e', flexShrink: 0 }} />
                          : <Circle size={16} style={{ color: '#475569', flexShrink: 0 }} />}
                        <div style={{ minWidth: '50px' }}>
                          <span style={{ color: '#f59e0b', fontSize: '11px', fontWeight: 700 }}>{task.startTime}</span>
                          <br />
                          <span style={{ color: '#475569', fontSize: '10px' }}>{task.endTime}</span>
                        </div>
                        <div className="flex-1">
                          <p style={{ color: task.completed ? '#475569' : '#f1f5f9', fontSize: '12px', fontWeight: 500, textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</p>
                        </div>
                        <span style={{ backgroundColor: `${task.color}15`, color: task.color, fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: 500, flexShrink: 0 }}>{categoryLabels[task.category] || task.category}</span>
                        {task.priority === 1 && <span style={{ color: '#ef4444', fontSize: '10px', fontWeight: 700, flexShrink: 0 }}>P1</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── KALENDER TAB ───────────────────────────────────────────────── */}
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

        {/* ── WOCHE TAB ──────────────────────────────────────────────────── */}
        {tab === 'woche' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4 mb-2">
              {[
                { label: 'Erledigte Aufgaben', value: `${completedCount}/${totalTasks}`, color: '#22c55e' },
                { label: 'Kalender-Termine', value: `${todayEvents.length} heute`, color: '#3b82f6' },
                { label: 'Wochenfortschritt', value: `${Math.round(progress)}%`, color: '#f59e0b' },
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
                          <div className="h-2 rounded-full" style={{ background: isToday ? '#f59e0b' : '#3b82f6', width: isToday ? `${Math.round(progress)}%` : i < ((today.getDay() + 6) % 7) ? '100%' : '0%' }} />
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

        {/* ── MONAT TAB ──────────────────────────────────────────────────── */}
        {tab === 'monat' && (
          <div className="space-y-6">

            {/* Header: month nav + Frank button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setMonthOffset(o => o - 1); setSelectedDay(null) }}
                  style={{ background: '#111318', border: '1px solid #1e2130', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center' }}
                >
                  <ChevronLeft size={16} />
                </button>
                <h2 style={{ color: '#f1f5f9', fontSize: '16px', fontWeight: 700, minWidth: '160px', textAlign: 'center' }}>
                  {DE_MONTHS[targetMonth]} {targetYear}
                </h2>
                <button
                  onClick={() => { setMonthOffset(o => o + 1); setSelectedDay(null) }}
                  style={{ background: '#111318', border: '1px solid #1e2130', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center' }}
                >
                  <ChevronRight size={16} />
                </button>
                <button
                  onClick={() => { setMonthOffset(0); setSelectedDay(null) }}
                  style={{ background: '#111318', border: '1px solid #1e2130', borderRadius: '6px', padding: '5px 12px', cursor: 'pointer', color: '#94a3b8', fontSize: '12px' }}
                >
                  Heute
                </button>
              </div>
              <button
                onClick={handleFrankMonthPlan}
                disabled={generatingMonthPlan}
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '13px', fontWeight: 700, cursor: generatingMonthPlan ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: generatingMonthPlan ? 0.7 : 1 }}
              >
                {generatingMonthPlan ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                {generatingMonthPlan ? 'Frank plant...' : 'Frank plant den Monat'}
              </button>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4">
              {[
                { color: '#22c55e', label: 'Verfügbar' },
                { color: '#475569', label: 'Nicht verfügbar' },
                { color: '#f59e0b', label: 'Heute' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: l.color }} />
                  <span style={{ color: '#64748b', fontSize: '11px' }}>{l.label}</span>
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #1e2130', background: '#111318' }}>
              {/* Weekday headers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid #1e2130' }}>
                {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map(d => (
                  <div key={d} style={{ padding: '10px 8px', textAlign: 'center', fontSize: '11px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', borderRight: '1px solid #1e2130' }}>
                    {d}
                  </div>
                ))}
              </div>

              {/* Days grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                {monthDays.map((day, idx) => {
                  if (!day) {
                    return <div key={`empty-${idx}`} style={{ borderRight: '1px solid #1e2130', borderBottom: '1px solid #1e2130', minHeight: '72px', background: 'rgba(0,0,0,0.2)' }} />
                  }
                  const key = dateKey(day)
                  const avail = availability[key]
                  const isToday = isSameDay(day, today)
                  const isSelected = selectedDay ? isSameDay(day, selectedDay) : false
                  const isPast = day < today && !isToday
                  const isUnavailable = avail?.notAvailable
                  const isAvailable = avail && !avail.notAvailable
                  const focusColor = avail ? focusTypeColors[avail.focusType] || '#3b82f6' : null

                  let hours = 0
                  if (isAvailable && avail.startTime && avail.endTime) {
                    const [sh, sm] = avail.startTime.split(':').map(Number)
                    const [eh, em] = avail.endTime.split(':').map(Number)
                    hours = Math.max(0, (eh * 60 + em - sh * 60 - sm) / 60)
                  } else if (isAvailable && avail.hours) {
                    hours = avail.hours
                  }

                  return (
                    <div
                      key={key}
                      onClick={() => handleSelectDay(day)}
                      style={{
                        borderRight: '1px solid #1e2130',
                        borderBottom: '1px solid #1e2130',
                        minHeight: '72px',
                        padding: '8px',
                        cursor: 'pointer',
                        background: isSelected
                          ? 'rgba(245,158,11,0.12)'
                          : isToday
                          ? 'rgba(245,158,11,0.06)'
                          : isPast
                          ? 'rgba(0,0,0,0.15)'
                          : 'transparent',
                        transition: 'background 0.1s',
                        position: 'relative',
                      }}
                    >
                      {/* Day number */}
                      <div style={{
                        width: '24px', height: '24px', borderRadius: '50%',
                        background: isToday ? '#f59e0b' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', fontWeight: isToday ? 700 : 500,
                        color: isToday ? '#0a0b0f' : isPast ? '#475569' : '#f1f5f9',
                        marginBottom: '4px',
                      }}>
                        {day.getDate()}
                      </div>

                      {/* Availability indicator */}
                      {availLoading ? null : isUnavailable ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <div style={{ width: '100%', height: '3px', borderRadius: '2px', background: '#475569' }} />
                          <span style={{ fontSize: '9px', color: '#475569' }}>Frei</span>
                        </div>
                      ) : isAvailable ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <div style={{ width: '100%', height: '3px', borderRadius: '2px', background: focusColor || '#22c55e' }} />
                          <span style={{ fontSize: '9px', color: '#64748b' }}>{hours > 0 ? `${hours}h` : ''}</span>
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Day detail panel */}
            {selectedDay && (
              <div className="rounded-xl p-5" style={{ background: '#111318', border: '1px solid rgba(245,158,11,0.3)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 700 }}>
                    {DE_WEEKDAYS_FULL[selectedDay.getDay()]}, {selectedDay.getDate()}. {DE_MONTHS[selectedDay.getMonth()]}
                  </h3>
                  <button onClick={() => setSelectedDay(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: '4px' }}>
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Not available toggle */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setDayForm(f => ({ ...f, notAvailable: !f.notAvailable }))}
                      style={{
                        background: dayForm.notAvailable ? 'rgba(239,68,68,0.15)' : 'rgba(34,197,94,0.1)',
                        border: `1px solid ${dayForm.notAvailable ? '#ef4444' : '#22c55e'}`,
                        color: dayForm.notAvailable ? '#ef4444' : '#22c55e',
                        borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                      }}
                    >
                      {dayForm.notAvailable ? 'Nicht verfügbar' : 'Verfügbar'}
                    </button>
                    <span style={{ color: '#64748b', fontSize: '11px' }}>Klicken zum Umschalten</span>
                  </div>

                  {/* Time slots */}
                  {!dayForm.notAvailable && (
                    <div className="flex items-center gap-4 flex-wrap">
                      <div>
                        <label style={{ color: '#64748b', fontSize: '11px', display: 'block', marginBottom: '4px' }}>Startzeit</label>
                        <input
                          type="time"
                          value={dayForm.startTime}
                          onChange={e => setDayForm(f => ({ ...f, startTime: e.target.value }))}
                          style={{ background: '#0a0b0f', border: '1px solid #1e2130', borderRadius: '6px', padding: '6px 10px', color: '#f1f5f9', fontSize: '13px', fontWeight: 600 }}
                        />
                      </div>
                      <div style={{ color: '#475569', fontSize: '16px', marginTop: '18px' }}>→</div>
                      <div>
                        <label style={{ color: '#64748b', fontSize: '11px', display: 'block', marginBottom: '4px' }}>Endzeit</label>
                        <input
                          type="time"
                          value={dayForm.endTime}
                          onChange={e => setDayForm(f => ({ ...f, endTime: e.target.value }))}
                          style={{ background: '#0a0b0f', border: '1px solid #1e2130', borderRadius: '6px', padding: '6px 10px', color: '#f1f5f9', fontSize: '13px', fontWeight: 600 }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Focus type */}
                  {!dayForm.notAvailable && (
                    <div>
                      <p style={{ color: '#64748b', fontSize: '11px', marginBottom: '6px' }}>Fokus-Typ</p>
                      <div className="flex gap-2 flex-wrap">
                        {Object.entries(focusTypeLabels).map(([key, label]) => (
                          <button
                            key={key}
                            onClick={() => setDayForm(f => ({ ...f, focusType: key }))}
                            style={{
                              background: dayForm.focusType === key ? `${focusTypeColors[key]}20` : '#0a0b0f',
                              border: `1px solid ${dayForm.focusType === key ? focusTypeColors[key] : '#1e2130'}`,
                              color: dayForm.focusType === key ? focusTypeColors[key] : '#64748b',
                              borderRadius: '6px', padding: '5px 12px', fontSize: '11px', fontWeight: dayForm.focusType === key ? 700 : 500, cursor: 'pointer',
                            }}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Note */}
                  <div>
                    <label style={{ color: '#64748b', fontSize: '11px', display: 'block', marginBottom: '4px' }}>Notiz (optional)</label>
                    <input
                      type="text"
                      placeholder="z.B. Arzttermin 14:00, halber Tag..."
                      value={dayForm.note}
                      onChange={e => setDayForm(f => ({ ...f, note: e.target.value }))}
                      style={{ width: '100%', background: '#0a0b0f', border: '1px solid #1e2130', borderRadius: '6px', padding: '7px 10px', color: '#f1f5f9', fontSize: '12px' }}
                    />
                  </div>

                  {/* Save button */}
                  <div className="flex items-center gap-3">
                    <Button variant="gold" size="sm" onClick={handleSaveDayAvailability} disabled={savingDay}>
                      {savingDay ? <Loader2 size={12} className="animate-spin" /> : <CheckSquare size={12} />}
                      {savingDay ? 'Speichert...' : 'Speichern'}
                    </Button>
                    {daySaved && <span style={{ color: '#22c55e', fontSize: '12px', fontWeight: 600 }}>Gespeichert!</span>}
                  </div>
                </div>
              </div>
            )}

            {/* Frank Month Plan Output */}
            {(monthPlanText || generatingMonthPlan || monthPlanError) && (
              <div className="rounded-xl p-5" style={{ background: '#111318', border: '1px solid rgba(139,92,246,0.25)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <Zap size={16} style={{ color: '#8b5cf6' }} />
                  <h3 style={{ color: '#8b5cf6', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    FRANK — Monatsplan {DE_MONTHS[targetMonth]} {targetYear}
                  </h3>
                </div>
                {generatingMonthPlan && (
                  <div className="flex items-center gap-2">
                    <Loader2 size={14} style={{ color: '#f59e0b' }} className="animate-spin" />
                    <p style={{ color: '#64748b', fontSize: '12px' }}>FRANK erstellt deinen Monatsplan...</p>
                  </div>
                )}
                {monthPlanError && <p style={{ color: '#ef4444', fontSize: '12px' }}>{monthPlanError}</p>}
                {monthPlanText && (
                  <MonthPlanDisplay text={monthPlanText} />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Month Plan Renderer ───────────────────────────────────────────────────────

function MonthPlanDisplay({ text }: { text: string }) {
  const sections: Array<{ heading: string | null; lines: string[] }> = []
  let current: { heading: string | null; lines: string[] } = { heading: null, lines: [] }

  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim()
    // Detect section headings: markdown ## or lines with ** that are short
    if (line.startsWith('## ') || line.startsWith('### ')) {
      if (current.lines.length > 0 || current.heading) sections.push(current)
      current = { heading: line.replace(/^#{2,3}\s+/, '').replace(/\*\*/g, ''), lines: [] }
    } else if (line.startsWith('**') && line.endsWith('**') && line.length < 80) {
      if (current.lines.length > 0 || current.heading) sections.push(current)
      current = { heading: line.replace(/\*\*/g, ''), lines: [] }
    } else if (line) {
      current.lines.push(line)
    }
  }
  if (current.lines.length > 0 || current.heading) sections.push(current)

  if (sections.length === 0) {
    return <div style={{ color: '#94a3b8', fontSize: '12px', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{text}</div>
  }

  return (
    <div className="space-y-4">
      {sections.map((sec, i) => (
        <div key={i}>
          {sec.heading && (
            <h4 style={{ color: '#f59e0b', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '2px', background: '#f59e0b', display: 'inline-block', borderRadius: '1px' }} />
              {sec.heading}
            </h4>
          )}
          <div style={{ paddingLeft: sec.heading ? '18px' : '0' }}>
            {sec.lines.map((line, j) => {
              const cleanLine = line.replace(/\*\*/g, '').replace(/^[-•*]\s*/, '').trim()
              const isBullet = /^[-•*]/.test(line)
              return (
                <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '4px' }}>
                  {isBullet && <span style={{ color: '#f59e0b', fontSize: '10px', marginTop: '3px', flexShrink: 0 }}>▸</span>}
                  <p style={{ color: '#94a3b8', fontSize: '12px', lineHeight: 1.6, flex: 1 }}>{cleanLine}</p>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
