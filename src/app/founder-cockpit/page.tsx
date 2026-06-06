'use client'

import Header from '@/components/layout/Header'
import { KPICard } from '@/components/ui/KPICard'
import { Badge } from '@/components/ui/Badge'
import { Euro, Users, TrendingUp, Target, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const revenueData = [
  { month: 'Jan', revenue: 28000, target: 35000 },
  { month: 'Feb', revenue: 32000, target: 37000 },
  { month: 'Mär', revenue: 29000, target: 40000 },
  { month: 'Apr', revenue: 38000, target: 42000 },
  { month: 'Mai', revenue: 42800, target: 45000 },
  { month: 'Jun', revenue: 0, target: 50000 },
]

const leadData = [
  { week: 'KW20', leads: 64 },
  { week: 'KW21', leads: 71 },
  { week: 'KW22', leads: 58 },
  { week: 'KW23', leads: 47 },
]

const metrics = [
  { label: 'MRR', value: '€38.2K', change: 12.4, up: true },
  { label: 'ARR', value: '€458K', change: 18.2, up: true },
  { label: 'Churn Rate', value: '2.1%', change: -0.3, up: false },
  { label: 'NPS Score', value: '74', change: 8, up: true },
  { label: 'CAC', value: '€124', change: -5.2, up: true },
  { label: 'LTV', value: '€1,840', change: 14.8, up: true },
  { label: 'LTV/CAC', value: '14.8x', change: 22.1, up: true },
  { label: 'Runway', value: '18 Mo', change: 0, up: true },
]

const goals = [
  { title: 'Revenue €60K MTD', progress: 71, status: 'active', deadline: '30. Jun' },
  { title: '300 Aktive Kunden', progress: 78, status: 'active', deadline: 'Q3 2026' },
  { title: 'Series A Ready', progress: 45, status: 'active', deadline: 'Sep 2026' },
  { title: 'Team auf 12 Personen', progress: 58, status: 'active', deadline: 'Q4 2026' },
]

export default function FounderCockpit() {
  return (
    <div>
      <Header
        title="Founder Cockpit"
        subtitle="Vollständige Unternehmensübersicht — alle Systeme auf einen Blick"
      />
      <div className="p-6 space-y-6">
        {/* Top KPIs */}
        <div className="grid grid-cols-4 gap-3">
          <KPICard name="Revenue MTD" value="42.8K" target="60K" change={12.4} trend="up" unit="€" color="#22c55e" icon={<Euro size={14} style={{ color: '#22c55e' }} />} />
          <KPICard name="Aktive Kunden" value="234" target="300" change={4.7} trend="up" unit="" color="#f59e0b" icon={<Users size={14} style={{ color: '#f59e0b' }} />} />
          <KPICard name="MRR Wachstum" value="12.4" target="15" change={2.1} trend="up" unit="%" color="#3b82f6" icon={<TrendingUp size={14} style={{ color: '#3b82f6' }} />} />
          <KPICard name="Goal Progress" value="63" target="100" change={5.8} trend="up" unit="%" color="#8b5cf6" icon={<Target size={14} style={{ color: '#8b5cf6' }} />} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Revenue Chart */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 600 }}>Revenue vs. Ziel</h3>
              <Badge variant="green">+12.4% MoM</Badge>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2130" />
                <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `€${v/1000}K`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111318', border: '1px solid #1e2130', borderRadius: '8px', color: '#f1f5f9', fontSize: '12px' }}
                  formatter={(value) => [`€${Number(value).toLocaleString()}`, '']}
                />
                <Area type="monotone" dataKey="target" stroke="#1e2130" fill="none" strokeDasharray="4 4" />
                <Area type="monotone" dataKey="revenue" stroke="#22c55e" fill="url(#revenueGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Leads Chart */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 600 }}>Lead-Entwicklung (Wöchentlich)</h3>
              <Badge variant="red">-8.2% WoW</Badge>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={leadData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2130" />
                <XAxis dataKey="week" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#111318', border: '1px solid #1e2130', borderRadius: '8px', color: '#f1f5f9', fontSize: '12px' }} />
                <Bar dataKey="leads" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Metrics Grid */}
        <div>
          <h2 style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }} className="uppercase tracking-widest mb-3">
            Business Metriken
          </h2>
          <div className="grid grid-cols-4 gap-3">
            {metrics.map((m) => (
              <div key={m.label} className="card p-4">
                <p style={{ color: '#64748b', fontSize: '11px', fontWeight: 500 }} className="mb-1">{m.label}</p>
                <p style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 700 }}>{m.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  {m.change !== 0 && (
                    <>
                      {m.up ? (
                        <ArrowUpRight size={11} style={{ color: '#22c55e' }} />
                      ) : (
                        <ArrowDownRight size={11} style={{ color: '#ef4444' }} />
                      )}
                      <span style={{ color: m.up ? '#22c55e' : '#ef4444', fontSize: '10px', fontWeight: 600 }}>
                        {m.change > 0 ? '+' : ''}{m.change}%
                      </span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Goals Overview */}
        <div>
          <h2 style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }} className="uppercase tracking-widest mb-3">
            Aktive Ziele
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {goals.map((goal) => (
              <div key={goal.title} className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 style={{ color: '#f1f5f9', fontSize: '13px', fontWeight: 600 }}>{goal.title}</h4>
                  <span style={{ color: '#475569', fontSize: '11px' }}>{goal.deadline}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${goal.progress}%`,
                        backgroundColor: goal.progress > 70 ? '#22c55e' : goal.progress > 40 ? '#f59e0b' : '#ef4444',
                      }}
                    />
                  </div>
                  <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, minWidth: '32px' }}>{goal.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
