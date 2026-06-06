'use client'

import Header from '@/components/layout/Header'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { CalendarDays, Plus, ChevronLeft, ChevronRight, Clock, MapPin, Users } from 'lucide-react'

const events = [
  { id: 1, title: 'Investor Call: Thomas Weber', time: '10:00', endTime: '11:00', type: 'call', color: '#f59e0b', person: 'Thomas Weber', location: 'Zoom', day: 6 },
  { id: 2, title: 'Product Demo: ACME GmbH', time: '14:00', endTime: '15:00', type: 'meeting', color: '#3b82f6', person: 'Sarah Müller', location: 'Google Meet', day: 6 },
  { id: 3, title: 'Partnership Talk: Marco Rossi', time: '16:00', endTime: '16:30', type: 'call', color: '#22c55e', person: 'Marco Rossi', location: 'Telefon', day: 6 },
  { id: 4, title: 'Team Weekly Sync', time: '09:30', endTime: '10:00', type: 'meeting', color: '#8b5cf6', person: 'Team', location: 'Büro', day: 7 },
  { id: 5, title: 'Sales Pipeline Review', time: '11:00', endTime: '12:00', type: 'review', color: '#f97316', person: 'Julia König', location: 'Büro', day: 7 },
  { id: 6, title: 'Investor Meeting: VC Berlin', time: '14:00', endTime: '16:00', type: 'meeting', color: '#f59e0b', person: 'Klaus Berger', location: 'Berlin', day: 8 },
  { id: 7, title: 'Product Strategy Session', time: '09:00', endTime: '12:00', type: 'focus', color: '#8b5cf6', person: 'Team', location: 'Büro', day: 9 },
  { id: 8, title: 'Customer Success Call', time: '15:00', endTime: '15:30', type: 'call', color: '#22c55e', person: 'Lisa Schmidt', location: 'Zoom', day: 10 },
  { id: 9, title: 'Weekly Review mit FRANK', time: '17:00', endTime: '17:30', type: 'review', color: '#ef4444', person: 'FRANK AI', location: 'OS', day: 10 },
]

const typeConfig = {
  meeting: { color: '#3b82f6', label: 'Meeting' },
  call: { color: '#f59e0b', label: 'Anruf' },
  focus: { color: '#8b5cf6', label: 'Deep Work' },
  review: { color: '#ef4444', label: 'Review' },
}

const days = [
  { day: 6, label: 'Fr', name: 'Freitag, 6. Jun' },
  { day: 7, label: 'Sa', name: 'Samstag, 7. Jun' },
  { day: 8, label: 'So', name: 'Sonntag, 8. Jun' },
  { day: 9, label: 'Mo', name: 'Montag, 9. Jun' },
  { day: 10, label: 'Di', name: 'Dienstag, 10. Jun' },
  { day: 11, label: 'Mi', name: 'Mittwoch, 11. Jun' },
  { day: 12, label: 'Do', name: 'Donnerstag, 12. Jun' },
]

export default function CalendarPage() {
  return (
    <div>
      <Header
        title="Calendar Engine"
        subtitle="Termine, Zeitblöcke und strategische Planung"
      />
      <div className="p-6 space-y-6">
        {/* Week Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-lg hover:bg-white/5">
              <ChevronLeft size={16} style={{ color: '#94a3b8' }} />
            </button>
            <h2 style={{ color: '#f1f5f9', fontSize: '15px', fontWeight: 600 }}>KW 23 — Juni 2026</h2>
            <button className="p-1.5 rounded-lg hover:bg-white/5">
              <ChevronRight size={16} style={{ color: '#94a3b8' }} />
            </button>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">Heute</Button>
            <Button variant="gold" size="sm">
              <Plus size={12} />
              Neuer Termin
            </Button>
          </div>
        </div>

        {/* Week View */}
        <div className="card overflow-hidden">
          {/* Day Headers */}
          <div style={{ borderBottom: '1px solid #1e2130', display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {days.map((d) => (
              <div
                key={d.day}
                style={{
                  padding: '12px 8px',
                  textAlign: 'center',
                  borderRight: '1px solid #1e2130',
                  backgroundColor: d.day === 6 ? 'rgba(245,158,11,0.08)' : 'transparent',
                }}
              >
                <p style={{ color: d.day === 6 ? '#f59e0b' : '#64748b', fontSize: '10px', fontWeight: 600 }} className="uppercase">{d.label}</p>
                <p style={{
                  color: d.day === 6 ? '#f59e0b' : '#f1f5f9',
                  fontSize: '18px',
                  fontWeight: 700,
                  lineHeight: 1,
                  marginTop: '2px',
                }}>{d.day}</p>
              </div>
            ))}
          </div>

          {/* Events Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', minHeight: '300px' }}>
            {days.map((d) => {
              const dayEvents = events.filter(e => e.day === d.day)
              return (
                <div
                  key={d.day}
                  style={{
                    borderRight: '1px solid #1e2130',
                    padding: '8px',
                    backgroundColor: d.day === 6 ? 'rgba(245,158,11,0.03)' : 'transparent',
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
                      <p style={{ color: evt.color, fontSize: '10px', fontWeight: 700 }}>{evt.time}</p>
                      <p style={{ color: '#f1f5f9', fontSize: '10px', fontWeight: 500, lineHeight: 1.3 }}>{evt.title}</p>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>

        {/* Today's Events Detail */}
        <div>
          <h2 style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }} className="uppercase tracking-widest mb-3">
            Heutige Termine — Freitag, 6. Juni
          </h2>
          <div className="space-y-2">
            {events.filter(e => e.day === 6).map((evt) => {
              const typeInfo = typeConfig[evt.type as keyof typeof typeConfig]
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
                      <p style={{ color: evt.color, fontSize: '13px', fontWeight: 700 }}>{evt.time}</p>
                      <p style={{ color: '#475569', fontSize: '10px' }}>{evt.endTime}</p>
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
                        <div className="flex items-center gap-1">
                          <Users size={11} style={{ color: '#475569' }} />
                          <span style={{ color: '#475569', fontSize: '11px' }}>{evt.person}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={11} style={{ color: '#475569' }} />
                          <span style={{ color: '#475569', fontSize: '11px' }}>{evt.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={11} style={{ color: '#475569' }} />
                          <span style={{ color: '#475569', fontSize: '11px' }}>{evt.time} – {evt.endTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
