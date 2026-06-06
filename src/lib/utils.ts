import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number, currency = '€'): string {
  if (value >= 1000000) {
    return `${currency}${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `${currency}${(value / 1000).toFixed(1)}K`
  }
  return `${currency}${value.toFixed(0)}`
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
}

export function getImpactColor(impact: string): string {
  switch (impact) {
    case 'critical': return 'text-red-500'
    case 'high': return 'text-orange-500'
    case 'medium': return 'text-yellow-500'
    case 'low': return 'text-blue-500'
    default: return 'text-gray-400'
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'active': return 'text-green-500'
    case 'completed': return 'text-blue-500'
    case 'paused': return 'text-yellow-500'
    case 'failed': return 'text-red-500'
    case 'open': return 'text-orange-500'
    case 'in_progress': return 'text-blue-500'
    case 'resolved': return 'text-green-500'
    default: return 'text-gray-400'
  }
}

export function truncate(str: string, len: number): string {
  return str.length > len ? str.slice(0, len) + '...' : str
}
