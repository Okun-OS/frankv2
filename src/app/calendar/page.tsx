'use client'

import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/layout/Header'
import { Button } from '@/components/ui/Button'
import { ChevronLeft, ChevronRight, Clock, MapPin, RefreshCw, AlertCircle } from 'lucide-react'

interface CalendarEvent {
  id: string
  title: string
  description?: string
  startTime: string
  endTime: string
  type: string
  location?: string
  color: string
}

const typeConfig: Record<string, { color: string; label: string }> = {
  meeting: { color: '#3b82f6', label: 'Meeting' },
  call: { color: '#f59e0b', label: 'Anruf' },
  focus: { color: '#8b5cf6', label: 'Deep Work' },
  review: { color: '#ef4444', label: 'Review' },
}

function getWeekDays(baseDate: Date) {
  const days = []
  // Start from Monday of the current week
  const dayOfWeek = baseDate.getDay() // 0 = Sun
  const monday = new Date(baseDate)
  monday.setDate(baseDate.getDate() - ((dayOfWeek + 6) % 7))

  const dayLabels = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
  const dayNames = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag']

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    days.push({
      date: d,
      label: dayLabels[i],
      name: `${dayNames[i]}, ${d.getDate()}. ${d.toLocaleString('de-DE', { month: 'short' })}`,
      dayNum: d.getDate(),
    })
  }
  return days
}

function formatTime(isoString: string) {
  const d = new Date(isoString)
  return d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [noToken, setNoToken] = useState(false)
  const [weekOffset, setWeekOffset] = useState(0)

  const today = new Date()
  const baseDate = new Date(today)
  baseDate.setDate(today.getDate() + weekOffset * 7)
  const weekDays = getWeekDays(baseDate)

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/sync/calendar')
      if (!res.ok) {
        const data = await res.json()
        if (data.error?.includes('No Google token')) {
          setNoToken(true)
        } else {
          setError(data.error || 'Fehler beim Laden der Termine')
        }
        return
      }
      const data = await res.json()
      setEvents(data)
      setNoToken(false)
    } catch {
      setError('Verbindungsfehler')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  async function handleSync() {
    try {
      setSyncing(true)
      setError(null)
      const res = await fetch('/api/sync/calendar', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        if (data.error?.includes('No Google token')) {
          setNoToken(true)
        } else {
          setError(data.error || 'Sync fehlgeschlagen')
        }
        return
      }
      await fetchEvents()
    } catch {
      setError('Sync fehlgeschlagen')
    } finally {
      setSyncing(false)
    }
  }

  const todayEvents = events.filter(e => isSameDay(new Date(e.startTime), today))

  // Get week number
  const startOfYear = new Date(today.getFullYear(), 0, 1)
  const weekNum = Math.ceil(((today.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7)
  const monthYear = baseDate.toLocaleString('de-DE', { month: 'long', year: 'numeric' })

  return (
    <div>
      <Header
        title="Calendar Engine"
        subtitle="Termine, Zeitblöcke und strategische Planung"
      />
      <div className="p-6 space-y-6">
        {/* No Token Banner */}
        {noToken && (
          <div
            style={{
              backgroundColor: 'rgba(245,158,11,0.08)',
              border: '1px solid rgba(245,158,11,0.25)',
              borderRadius: '10px',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <AlertCircle size={16} style={{ color: '#f59e0b', flexShrink: 0 }} />
            <p style={{ color: '#f59e0b', fontSize: '13px' }}>
              Google Kalender nicht verbunden — gehe zu{' '}
              <a href="/integrations" style={{ textDecoration: 'underline' }}>Integrationen</a>
              {' '}und verbinde deinen Google Account.
            </p>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div
            style={{
              backgroundColor: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: '10px',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <AlertCircle size={16} style={{ color: '#ef4444', flexShrink: 0 }} />
            <p style={{ color: '#ef4444', fontSize: '13px' }}>{error}</p>
          </div>
        )}

        {/* Week Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-lg hover:bg-white/5" onClick={() => setWeekOffset(w => w - 1)}>
              <ChevronLeft size={16} style={{ color: '#94a3b8' }} />
            </button>
            <h2 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 600 }}>KW {weekNum} — {monthYear}</h2>
            <button className="p-1.5 rounded-lg hover:bg-white/5" onClick={() => setWeekOffset(w => w + 1)}>
              <ChevronRight size={16} style={{ color: '#94a3b8' }} />
            </button>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setWeekOffset(0)}>Heute</Button>
            <Button variant="gold" size="sm" onClick={handleSync} disabled={syncing}>
              <RefreshCw size={12} className={syncing ? 'animate-spin' : ''} />
              {syncing ? 'Synchronisiert...' : 'Google Kalender synchronisieren'}
            </Button>
          </div>
        </div>

        {/* Week View */}
        <div className="card overflow-hidden">
          {/* Day Headers */}
          <div style={{ borderBottom: '1px solid #1e2130', display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {weekDays.map((d) => {
              const isToday = isSameDay(d.date, today)
              return (
                <div
                  key={d.dayNum}
                  style={{
                    padding: '12px 8px',
                    textAlign: 'center',
                    borderRight: '1px solid #1e2130',
                    backgroundColor: isToday ? 'rgba(245,158,11,0.08)' : 'transparent',
                  }}
                >
                  <p style={{ color: isToday ? '#f59e0b' : '#64748b', fontSize: '10px', fontWeight: 600 }} className="uppercase">{d.label}</p>
                  <p style={{
                    color: isToday ? '#f59e0b' : '#f1f5f9',
                    fontSize: '18px',
                    fontWeight: 700,
                    lineHeight: 1,
                    marginTop: '2px',
                  }}>{d.dayNum}</p>
                </div>
              )
            })}
          </div>

          {/* Events Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', minHeight: '300px' }}>
            {loading ? (
              <div style={{ gridColumn: 'span 7', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
                <p style={{ color: '#475569', fontSize: '13px' }}>Termine werden geladen...</p>
              </div>
            ) : events.length === 0 && !noToken ? (
              <div style={{ gridColumn: 'span 7', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '200px' }}>
                <p style={{ color: '#475569', fontSize: '13px', textAlign: 'center' }}>
                  Keine Termine gefunden. Synchronisiere deinen Google Kalender.
                </p>
              </div>
            ) : (
              weekDays.map((d) => {
                const isToday = isSameDay(d.date, today)
                const dayEvents = events.filter(e => isSameDay(new Date(e.startTime), d.date))
                return (
                  <div
                    key={d.dayNum}
                    style={{
                      borderRight: '1px solid #1e2130',
                      padding: '8px',
                      backgroundColor: isToday ? 'rgba(245,158,11,0.03)' : 'transparent',
                      minHeight: '280px',
                    }}
                  >
                    {dayEvents.map((evt) => (
                      <div
                        key={evt.id}
                        style={{
                          backgroundColor: `${evt.color}15`,
                          border: `1px solid ${evt.color}30`,
                          borderLeft: `3px solid ${evt.color}`,
                          borderRadius: '6px',
                          padding: '6px 8px',
                          marginBottom: '4px',
                          cursor: 'pointer',
                        }}
                      >
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

        {/* Today's Events Detail */}
        <div>
          <h2 style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }} className="uppercase tracking-widest mb-3">
            Heutige Termine — {today.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
          </h2>
          {todayEvents.length === 0 ? (
            <div className="card p-6" style={{ textAlign: 'center' }}>
              <p style={{ color: '#475569', fontSize: '13px' }}>
                {noToken
                  ? 'Google Kalender nicht verbunden.'
                  : loading
                  ? 'Laden...'
                  : 'Keine Termine für heute.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {todayEvents.map((evt) => {
                const typeInfo = typeConfig[evt.type] || typeConfig.meeting
                return (
                  <div key={evt.id} className="card p-4">
                    <div className="flex items-start gap-4">
                      <div
                        style={{
                          backgroundColor: `${evt.color}15`,
                          border: `1px solid ${evt.color}30`,
                          borderRadius: '8px',
                          padding: '8px',
                          textAlign: 'center',
                          minWidth: '52px',
                        }}
                      >
                        <p style={{ color: evt.color, fontSize: '13px', fontWeight: 700 }}>{formatTime(evt.startTime)}</p>
                        <p style={{ color: '#475569', fontSize: '10px' }}>{formatTime(evt.endTime)}</p>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 600 }}>{evt.title}</h3>
                          <span
                            style={{ color: typeInfo.color, fontSize: '10px', fontWeight: 500, backgroundColor: `${typeInfo.color}15`, padding: '2px 6px', borderRadius: '4px' }}
                          >
                            {typeInfo.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          {evt.location && (
                            <div className="flex items-center gap-1">
                              <MapPin size={11} style={{ color: '#475569' }} />
                              <span style={{ color: '#475569', fontSize: '11px' }}>{evt.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Clock size={11} style={{ color: '#475569' }} />
                            <span style={{ color: '#475569', fontSize: '11px' }}>{formatTime(evt.startTime)} – {formatTime(evt.endTime)}</span>
                          </div>
                        </div>
                        {evt.description && (
                          <p style={{ color: '#64748b', fontSize: '11px', marginTop: '4px' }}>{evt.description.slice(0, 100)}</p>
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
    </div>
  )
}
