'use client'

import { DollarSign, TrendingUp, Calendar, BarChart3 } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  trend?: number
  /** Use for cost/outflow values (e.g. buyback cost) */
  valueClassName?: string
}

export default function StatsCard({ title, value, icon, trend, valueClassName }: StatsCardProps) {
  return (
    <div className="bg-dark-card border border-dark-border rounded-lg sm:rounded-xl p-2.5 sm:p-4 md:p-5 hover:border-white/20 transition-colors">
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className="p-1.5 sm:p-2 md:p-2.5 bg-dark-surface rounded-lg sm:rounded-xl">
          {icon}
        </div>
        {trend !== undefined && (
          <span className="text-xs sm:text-sm font-medium text-white">
            {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
          </span>
        )}
      </div>
      <p className={`text-xl sm:text-2xl md:text-3xl font-bold tracking-tight break-words ${valueClassName ?? 'text-white'}`}>{value}</p>
      <p className="text-xs sm:text-sm text-dark-muted mt-0.5 leading-tight">{title}</p>
    </div>
  )
}
