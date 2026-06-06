'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Briefcase,
  Target,
  BarChart3,
  Brain,
  AlertTriangle,
  Rocket,
  CheckSquare,
  CalendarDays,
  FileText,
  Bot,
  ClipboardList,
  Database,
  Zap,
  Link as LinkIcon,
  Settings,
  Activity,
  ChevronRight,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Founder Cockpit', href: '/founder-cockpit', icon: Briefcase },
  { label: 'Goals', href: '/goals', icon: Target },
  { label: 'KPIs', href: '/kpis', icon: BarChart3 },
  { label: 'Strategy', href: '/strategy', icon: Brain },
  { label: 'Bottlenecks', href: '/bottlenecks', icon: AlertTriangle },
  { label: 'Opportunities', href: '/opportunities', icon: Rocket },
  { label: 'Daily Planner', href: '/daily-planner', icon: CheckSquare },
  { label: 'Calendar', href: '/calendar', icon: CalendarDays },
  { label: 'Content Hub', href: '/content-hub', icon: FileText },
  { label: 'Agents', href: '/agents', icon: Bot },
  { label: 'Reviews', href: '/reviews', icon: ClipboardList },
  { label: 'Memory', href: '/memory', icon: Database },
  { label: 'Automations', href: '/automations', icon: Zap },
  { label: 'Integrations', href: '/integrations', icon: LinkIcon },
  { label: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      style={{ backgroundColor: '#0d0e13', borderRight: '1px solid #1e2130' }}
      className="fixed left-0 top-0 h-full w-60 flex flex-col z-30 overflow-hidden"
    >
      {/* Logo */}
      <div style={{ borderBottom: '1px solid #1e2130' }} className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
          >
            <span className="text-black font-black text-base">F</span>
          </div>
          <div>
            <div className="text-white font-bold text-sm tracking-widest">FRANK OS</div>
            <div style={{ color: '#475569', fontSize: '9px' }} className="font-medium tracking-widest uppercase">
              Founder Operating System
            </div>
          </div>
        </div>
      </div>

      {/* Frank Avatar */}
      <div style={{ borderBottom: '1px solid #1e2130', backgroundColor: 'rgba(245,158,11,0.04)' }} className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div
            style={{ background: 'linear-gradient(135deg, #f59e0b20, #f59e0b40)', border: '1px solid #f59e0b30' }}
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          >
            <Bot size={16} style={{ color: '#f59e0b' }} />
          </div>
          <div>
            <div style={{ color: '#f59e0b' }} className="text-xs font-semibold">FRANK AI</div>
            <div style={{ color: '#475569' }} className="text-xs">Dein digitaler COO</div>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <div style={{ backgroundColor: '#22c55e' }} className="w-1.5 h-1.5 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                backgroundColor: isActive ? 'rgba(245,158,11,0.1)' : 'transparent',
                color: isActive ? '#f59e0b' : '#94a3b8',
                borderRadius: '0.5rem',
                borderLeft: isActive ? '2px solid #f59e0b' : '2px solid transparent',
              }}
              className="flex items-center gap-2.5 px-3 py-2 mb-0.5 text-xs font-medium transition-all hover:bg-white/5 hover:text-white group"
            >
              <Icon size={14} className="flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight size={10} style={{ color: '#f59e0b' }} />}
            </Link>
          )
        })}
      </nav>

      {/* System Status */}
      <div style={{ borderTop: '1px solid #1e2130' }} className="px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          <Activity size={10} style={{ color: '#22c55e' }} />
          <span style={{ color: '#475569', fontSize: '9px' }} className="uppercase tracking-widest font-medium">System Status</span>
        </div>
        <div className="flex items-center justify-between mb-1">
          <span style={{ color: '#64748b', fontSize: '10px' }}>9 Agents Active</span>
          <div style={{ backgroundColor: '#22c55e' }} className="w-1.5 h-1.5 rounded-full" />
        </div>
        <div className="flex items-center justify-between">
          <span style={{ color: '#64748b', fontSize: '10px' }}>All Systems OK</span>
          <span style={{ color: '#22c55e', fontSize: '10px' }}>✓</span>
        </div>
      </div>

      {/* User Profile */}
      <div style={{ borderTop: '1px solid #1e2130', backgroundColor: '#0a0b0f' }} className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          >
            <span className="text-white text-xs font-bold">FO</span>
          </div>
          <div className="flex-1 min-w-0">
            <div style={{ color: '#f1f5f9' }} className="text-xs font-semibold truncate">Felix Okun</div>
            <div style={{ color: '#475569' }} className="text-xs truncate">Founder & CEO · OKUN Systems</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
