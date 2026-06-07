'use client'

import Header from '@/components/layout/Header'
import { Badge } from '@/components/ui/Badge'
import { Target, Plus, ChevronRight, CheckCircle2, Circle, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const goals = [
  {
    id: 1,
    title: 'Revenue €720K ARR erreichen',
    description: 'Jahresumsatzziel 2026 für Series A Readiness',
    category: 'revenue',
    status: 'active',
    progress: 63,
    currentValue: 458000,
    targetValue: 720000,
    unit: '€',
    deadline: '31. Dez 2026',
    milestones: [
      { title: '€300K ARR Meilenstein', completed: true },
      { title: '€500K ARR Meilenstein', completed: false },
      { title: '€600K ARR Meilenstein', completed: false },
      { title: '€720K ARR Ziel', completed: false },
    ],
  },
  {
    id: 2,
    title: '300 Aktive Kunden',
    description: 'Kundenbasis für Enterprise-Tier aufbauen',
    category: 'customers',
    status: 'active',
    progress: 78,
    currentValue: 234,
    targetValue: 300,
    unit: '',
    deadline: '30. Sep 2026',
    milestones: [
      { title: '100 Kunden', completed: true },
      { title: '200 Kunden', completed: true },
      { title: '250 Kunden', completed: false },
      { title: '300 Kunden', completed: false },
    ],
  },
  {
    id: 3,
    title: 'Series A Finanzierung sichern',
    description: 'Series A Round in Höhe von €3M abschließen',
    category: 'growth',
    status: 'active',
    progress: 45,
    currentValue: null,
    targetValue: null,
    unit: '',
    deadline: 'Sep 2026',
    milestones: [
      { title: 'Pitch Deck fertiggestellt', completed: true },
      { title: 'Erste Investor-Meetings', completed: true },
      { title: 'Due Diligence Phase', completed: false },
      { title: 'Term Sheet erhalten', completed: false },
      { title: 'Closing', completed: false },
    ],
  },
  {
    id: 4,
    title: 'Team auf 12 FTE ausbauen',
    description: 'Schlüsselpositionen besetzen: CTO, Head of Sales, 2x Dev',
    category: 'team',
    status: 'active',
    progress: 58,
    currentValue: 7,
    targetValue: 12,
    unit: ' Personen',
    deadline: 'Q4 2026',
    milestones: [
      { title: 'CTO eingestellt', completed: true },
      { title: 'Head of Sales eingestellt', completed: false },
      { title: '2 Senior Developer', completed: false },
      { title: 'Marketing Manager', completed: false },
    ],
  },
]

const categoryColors: Record<string, string> = {
  revenue: '#22c55e',
  customers: '#3b82f6',
  growth: '#f59e0b',
  team: '#8b5cf6',
  product: '#f97316',
}

const categoryLabels: Record<string, string> = {
  revenue: 'Revenue',
  customers: 'Kunden',
  growth: 'Wachstum',
  team: 'Team',
  product: 'Produkt',
}

export default function ZielePage() {
  return (
    <div>
      <Header
        title="Ziele"
        subtitle="OKRs, Meilensteine & strategische Ziele im Überblick"
      />
      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Aktive Ziele', value: '4', color: '#f59e0b' },
            { label: 'Ø Fortschritt', value: '61%', color: '#22c55e' },
            { label: 'Meilensteine erreicht', value: '6/16', color: '#3b82f6' },
            { label: 'Ablauf diese Woche', value: '0', color: '#ef4444' },
          ].map((stat) => (
            <div key={stat.label} className="card p-4">
              <p style={{ color: '#64748b', fontSize: '11px', fontWeight: 500 }} className="mb-1">{stat.label}</p>
              <p style={{ color: stat.color, fontSize: '24px', fontWeight: 700 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Add Goal Button */}
        <div className="flex items-center justify-between">
          <h2 style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }} className="uppercase tracking-widest">
            Aktive Ziele ({goals.length})
          </h2>
          <Button variant="gold" size="sm">
            <Plus size={12} />
            Neues Ziel
          </Button>
        </div>

        {/* Goals List */}
        <div className="space-y-4">
          {goals.map((goal) => {
            const color = categoryColors[goal.category] || '#64748b'
            return (
              <div key={goal.id} className="card p-5">
                <div className="flex items-start gap-4">
                  <div
                    style={{
                      backgroundColor: `${color}15`,
                      border: `1px solid ${color}30`,
                      borderRadius: '8px',
                      padding: '8px',
                      flexShrink: 0,
                    }}
                  >
                    <Target size={16} style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 style={{ color: '#f1f5f9', fontSize: '14px', fontWeight: 700 }}>{goal.title}</h3>
                      <Badge variant="gray">{categoryLabels[goal.category]}</Badge>
                      <Badge variant="green">Aktiv</Badge>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '12px', marginBottom: '12px' }}>{goal.description}</p>

                    {/* Progress */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1 progress-bar">
                        <div
                          className="progress-bar-fill"
                          style={{
                            width: `${goal.progress}%`,
                            backgroundColor: color,
                          }}
                        />
                      </div>
                      <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 700, minWidth: '40px' }}>
                        {goal.progress}%
                      </span>
                      {goal.currentValue !== null && goal.targetValue !== null && (
                        <span style={{ color: '#475569', fontSize: '11px' }}>
                          {goal.currentValue.toLocaleString()}{goal.unit} / {goal.targetValue.toLocaleString()}{goal.unit}
                        </span>
                      )}
                    </div>

                    {/* Milestones */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {goal.milestones.map((ms, i) => (
                        <div key={i} className="flex items-center gap-1">
                          {ms.completed ? (
                            <CheckCircle2 size={11} style={{ color: '#22c55e' }} />
                          ) : (
                            <Circle size={11} style={{ color: '#475569' }} />
                          )}
                          <span style={{ color: ms.completed ? '#22c55e' : '#475569', fontSize: '11px' }}>{ms.title}</span>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar size={11} style={{ color: '#475569' }} />
                        <span style={{ color: '#475569', fontSize: '11px' }}>Deadline: {goal.deadline}</span>
                      </div>
                      <button style={{ color: '#3b82f6', fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        Details ansehen <ChevronRight size={10} className="inline" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
