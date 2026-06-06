export interface KPI {
  id: string
  name: string
  category: string
  unit: string
  target: number
  current: number
  previous: number
  trend: 'up' | 'down' | 'neutral'
  period: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Goal {
  id: string
  title: string
  description?: string
  category: string
  status: 'active' | 'completed' | 'paused' | 'failed'
  priority: number
  targetValue?: number
  currentValue?: number
  unit?: string
  deadline?: Date
  progress: number
  createdAt: Date
  updatedAt: Date
  milestones?: Milestone[]
}

export interface Milestone {
  id: string
  goalId: string
  title: string
  completed: boolean
  dueDate?: Date
  createdAt: Date
}

export interface Bottleneck {
  id: string
  title: string
  description?: string
  impact: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'in_progress' | 'resolved'
  area: string
  duration?: string
  actions?: string
  createdAt: Date
  updatedAt: Date
}

export interface Opportunity {
  id: string
  title: string
  description?: string
  potential: 'low' | 'medium' | 'high' | 'very_high'
  timeframe?: string
  status: 'identified' | 'pursuing' | 'converted' | 'dismissed'
  area: string
  actions?: string
  createdAt: Date
  updatedAt: Date
}

export interface Strategy {
  id: string
  title: string
  description?: string
  type: 'strategy' | 'hypothesis' | 'experiment'
  status: 'active' | 'testing' | 'validated' | 'failed'
  priority: number
  hypothesis?: string
  result?: string
  createdAt: Date
  updatedAt: Date
}

export interface Agent {
  id: string
  name: string
  type: string
  status: 'active' | 'paused' | 'error'
  lastRun?: Date
  config?: string
  createdAt: Date
}

export interface Alert {
  id: string
  title: string
  description?: string
  severity: 'info' | 'warning' | 'danger' | 'success'
  category: string
  isRead: boolean
  actionUrl?: string
  createdAt: Date
}

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  startTime: Date
  endTime: Date
  type: 'meeting' | 'call' | 'focus' | 'review'
  location?: string
  color: string
  createdAt: Date
}

export interface ContentItem {
  id: string
  title: string
  body?: string
  platform: string
  type: string
  status: 'draft' | 'scheduled' | 'published'
  scheduledAt?: Date
  publishedAt?: Date
  tags?: string
  metrics?: string
  createdAt: Date
  updatedAt: Date
}

export interface Memory {
  id: string
  title: string
  content: string
  category: string
  tags?: string
  importance: number
  source?: string
  createdAt: Date
}

export interface Review {
  id: string
  weekNumber: number
  year: number
  title: string
  wins?: string
  losses?: string
  learnings?: string
  nextWeekFocus?: string
  kpiSnapshot?: string
  createdAt: Date
}

export interface DashboardData {
  kpis: KPI[]
  alerts: Alert[]
  bottlenecks: Bottleneck[]
  opportunities: Opportunity[]
  goals: Goal[]
  agents: Agent[]
  events: CalendarEvent[]
}

export interface NavItem {
  label: string
  href: string
  icon: string
  badge?: number
}
