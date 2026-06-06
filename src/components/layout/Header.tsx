'use client'

import { Bell, Search, Zap } from 'lucide-react'
import { useState } from 'react'

interface HeaderProps {
  title?: string
  subtitle?: string
}

export default function Header({ title, subtitle }: HeaderProps) {
  const [hasAlerts] = useState(true)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Guten Morgen' : hour < 17 ? 'Guten Tag' : 'Guten Abend'

  return (
    <header
      style={{
        backgroundColor: '#0d0e13',
        borderBottom: '1px solid #1e2130',
      }}
      className="sticky top-0 z-20 px-6 py-3 flex items-center justify-between"
    >
      <div>
        <h1 style={{ color: '#f1f5f9' }} className="text-lg font-bold">
          {title || `${greeting}, Felix 👋`}
        </h1>
        {subtitle && (
          <p style={{ color: '#475569' }} className="text-xs mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div
          style={{ backgroundColor: '#111318', border: '1px solid #1e2130' }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
        >
          <Search size={14} style={{ color: '#475569' }} />
          <input
            type="text"
            placeholder="Suchen..."
            style={{
              backgroundColor: 'transparent',
              color: '#f1f5f9',
              outline: 'none',
              width: '160px',
              fontSize: '12px',
            }}
          />
        </div>

        {/* Frank Quick Action */}
        <button
          style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.08))',
            border: '1px solid rgba(245,158,11,0.3)',
            color: '#f59e0b',
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-amber-500/20 transition-all"
        >
          <Zap size={12} />
          Ask FRANK
        </button>

        {/* Notifications */}
        <button className="relative p-1.5 rounded-lg hover:bg-white/5 transition-all">
          <Bell size={16} style={{ color: '#94a3b8' }} />
          {hasAlerts && (
            <span
              style={{ backgroundColor: '#ef4444' }}
              className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full"
            />
          )}
        </button>
      </div>
    </header>
  )
}
