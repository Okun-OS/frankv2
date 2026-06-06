'use client'

import Header from '@/components/layout/Header'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { TrendingUp, TrendingDown, Minus, Plus, BarChart3 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const kpis = [
  {
    id: 1,
    name: 'Monthly Recurring Revenue',
    category: 'revenue',
    unit: '€',
    current: 38200,
    target: 45000,
    previous: 34000,
    trend: 'up',
    period: 'MTD',
    color: '#22c55e',
    history: [28000, 32000, 29000, 38000, 38200],
  },
  {
    id: 2,
    name: 'Neue Leads pro Woche',
    category: 'leads',
    unit: '',
    current: 47,
    target: 80,
    previous: 51,
    trend: 'down',
    period: 'Wöchentlich',
    color: '#3b82f6',
    history: [64, 71, 58, 51, 47],
  },
  {
    id: 3,
    name: 'Aktive Kunden',
    category: 'customers',
    unit: '',
    current: 234,
    target: 300,
    previous: 220,
    trend: 'up',
    period: 'Gesamt',
    color: '#f59e0b',
    history: [180, 195, 210, 220, 234],
  },
  {
    id: 4,
    name: 'Sales Conversion Rate',
    category: 'sales',
    unit: '%',
    current: 3.2,
    target: 8.0,
    previous: 3.8,
    trend: 'down',
    period: 'MTD',
    color: '#ef4444',
    history: [5.2, 4.8, 4.1, 3.8, 3.2],
  },
  {
    id: 5,
    name: 'Customer Satisfaction (NPS)',
    category: 'quality',
    unit: '',
    current: 74,
    target: 80,
    previous: 68,
    trend: 'up',
    period: 'Monatlich',
    color: '#8b5cf6',
    history: [58, 62, 65, 68, 74],
  },
  {
    id: 6,
    name: 'Churn Rate',
    category: 'retention',
    unit: '%',
    current: 2.1,
    target: 1.5,
    previous: 2.4,
    trend: 'up',
    period: 'MTD',
    color: '#f97316',
    history: [3.2, 2.8, 2.6, 2.4, 2.1],
  },
]

const months = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai']

export default function KPIsPage() {
  return (
    <div>
      <Header
        title="KPI Engine"
        subtitle="Definiere, tracke und erhalte Alerts für deine wichtigsten Metriken"
      />
      <div className="p-6 space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'KPIs Tracked', value: '6', color: '#f59e0b' },
            { label: 'Im Ziel', value: '3', color: '#22c55e' },
            { label: 'Unter Ziel', value: '2', color: '#ef4444' },
            { label: 'Kritisch', value: '1', color: '#f97316' },
          ].map((stat) => (
            <div key={stat.label} className="card p-4">
              <p style={{ color: '#64748b', fontSize: '11px', fontWeight: 500 }} className="mb-1">{stat.label}</p>
              <p style={{ color: stat.color, fontSize: '24px', fontWeight: 700 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }} className="uppercase tracking-widest">
            KPI Übersicht
          </h2>
          <Button variant="gold" size="sm">
            <Plus size={12} />
            Neuer KPI
          </Button>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 gap-4">
          {kpis.map((kpi) => {
            const progress = Math.min(100, (kpi.current / kpi.target) * 100)
            const changePercent = ((kpi.current - kpi.previous) / kpi.previous) * 100
            const isOnTrack = progress >= 80
            const TrendIcon = kpi.trend === 'up' ? TrendingUp : kpi.trend === 'down' ? TrendingDown : Minus
            const trendColor = kpi.trend === 'up' ? '#22c55e' : kpi.trend === 'down' ? '#ef4444' : '#94a3b8'

            const chartData = kpi.history.map((v, i) => ({ month: months[i], value: v }))

            return (
              <div key={kpi.id} className="card p-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 600 }}>{kpi.name}</h3>
                      <Badge variant={isOnTrack ? 'green' : 'red'}>{isOnTrack ? 'Im Ziel' : 'Unter Ziel'}</Badge>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span style={{ color: '#f1f5f9', fontSize: '28px', fontWeight: 700 }}>
                        {kpi.unit === '€' && '€'}{kpi.current.toLocaleString()}{kpi.unit !== '€' && kpi.unit}
                      </span>
                      <span style={{ color: '#475569', fontSize: '12px' }}>/ {kpi.unit === '€' && '€'}{kpi.target.toLocaleString()}{kpi.unit !== '€' && kpi.unit} Ziel</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendIcon size={14} style={{ color: trendColor }} />
                    <span style={{ color: trendColor, fontSize: '12px', fontWeight: 600 }}>
                      {changePercent >= 0 ? '+' : ''}{changePercent.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Mini chart */}
                <ResponsiveContainer width="100%" height={60}>
                  <LineChart data={chartData}>
                    <Line type="monotone" dataKey="value" stroke={kpi.color} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>

                {/* Progress */}
                <div className="mt-3">
                  <div className="flex justify-between mb-1">
                    <span style={{ color: '#475569', fontSize: '10px' }}>Fortschritt zum Ziel</span>
                    <span style={{ color: '#94a3b8', fontSize: '10px', fontWeight: 600 }}>{progress.toFixed(0)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: progress >= 80 ? '#22c55e' : progress >= 50 ? '#f59e0b' : '#ef4444',
                      }}
                    />
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
