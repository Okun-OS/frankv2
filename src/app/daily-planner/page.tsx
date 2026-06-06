'use client'

import Header from '@/components/layout/Header'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { CheckSquare, CheckCircle2, Circle, Clock, Zap, RefreshCw } from 'lucide-react'

const tasks = [
  { time: '07:00', endTime: '07:30', title: 'Morning Routine & FRANK Daily Brief', category: 'health', color: '#22c55e', completed: true, priority: 1 },
  { time: '07:30', endTime: '09:00', title: 'Deep Work Block: Q3 Strategy Draft', category: 'focus', color: '#8b5cf6', completed: true, priority: 1 },
  { time: '09:00', endTime: '09:30', title: 'Team Stand-up Meeting', category: 'meeting', color: '#3b82f6', completed: true, priority: 2 },
  { time: '09:30', endTime: '10:00', title: 'Email & Slack Review', category: 'admin', color: '#64748b', completed: true, priority: 3 },
  { time: '10:00', endTime: '11:00', title: 'Investor Call: Thomas Weber (Series A)', category: 'call', color: '#f59e0b', completed: false, priority: 1 },
  { time: '11:00', endTime: '11:15', title: 'Kurze Pause', category: 'break', color: '#475569', completed: false, priority: 3 },
  { time: '11:15', endTime: '12:00', title: 'Lead Pipeline Review & CRM Update', category: 'sales', color: '#22c55e', completed: false, priority: 2 },
  { time: '12:00', endTime: '13:00', title: 'Mittagspause & Spaziergang', category: 'break', color: '#475569', completed: false, priority: 3 },
  { time: '13:00', endTime: '14:30', title: 'Deep Work: Feature Roadmap Q4', category: 'focus', color: '#8b5cf6', completed: false, priority: 1 },
  { time: '14:30', endTime: '15:00', title: 'LinkedIn Content: 3 Posts erstellen', category: 'content', color: '#f97316', completed: false, priority: 2 },
  { time: '15:00', endTime: '15:30', title: '1:1 Meeting: Julia (Marketing Lead)', category: 'meeting', color: '#3b82f6', completed: false, priority: 2 },
  { time: '15:30', endTime: '16:00', title: 'Product Demo: ACME GmbH', category: 'sales', color: '#22c55e', completed: false, priority: 1 },
  { time: '16:00', endTime: '16:30', title: 'Weiterbildung: AI Newsletter lesen', category: 'learning', color: '#f59e0b', completed: false, priority: 3 },
  { time: '16:30', endTime: '17:00', title: 'Daily Review & Morgen planen', category: 'review', color: '#ef4444', completed: false, priority: 2 },
  { time: '17:00', endTime: '17:30', title: 'FRANK Tages-Analyse besprechen', category: 'review', color: '#f59e0b', completed: false, priority: 2 },
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

export default function DailyPlannerPage() {
  const completed = tasks.filter(t => t.completed).length
  const total = tasks.length
  const progress = Math.round((completed / total) * 100)

  return (
    <div>
      <Header
        title="Daily Planner"
        subtitle="KI-optimierter Tagesplan für maximale Founder-Produktivität"
      />
      <div className="p-6 space-y-6">
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
              Heute, 6. Juni 2026
            </h2>
            <Badge variant="green">{progress}% abgeschlossen</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">
              <RefreshCw size={12} />
              Neu generieren
            </Button>
            <Button variant="gold" size="sm">
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
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  opacity: task.category === 'break' ? 0.5 : 1,
                }}
              >
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
                Dein Investor Call um 10:00 ist kritisch. Bereite 3 Key-Metriken vor: MRR, Wachstumsrate, und CAC/LTV.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
