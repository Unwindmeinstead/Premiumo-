'use client'

import { useState } from 'react'
import { TradeStats } from '@/types'
import { formatCurrency } from '@/lib/utils'
import {
  DollarSign,
  Calendar,
  Target,
  TrendingUp,
  Percent,
  BarChart3,
  FileText,
  HelpCircle,
  X,
} from 'lucide-react'

interface MetricsPageProps {
  stats: TradeStats
  premiumByMonth: { month: string; premium: number }[]
  premiumBySymbol: { symbol: string; premium: number }[]
  tradeCount: number
  compact?: boolean
}

const cardBase =
  'bg-dark-card border border-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 hover:border-white/20 transition-colors'

export default function MetricsPage({
  stats,
  premiumByMonth,
  premiumBySymbol,
  tradeCount,
  compact = false,
}: MetricsPageProps) {
  const [guideOpen, setGuideOpen] = useState(false)
  const sectionSpacing = compact ? 'mb-4 sm:mb-5' : 'mb-6 sm:mb-8'
  const gridGap = compact ? 'gap-2 sm:gap-2' : 'gap-2 sm:gap-3'

  return (
    <div className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto px-0 sm:px-1 space-y-4 sm:space-y-5 md:space-y-6 pb-24 sm:pb-28 md:pb-32 lg:pb-36">
      <div className={`flex items-start justify-between gap-3 md:gap-4 ${compact ? 'mb-3 sm:mb-4' : 'mb-4 sm:mb-5 md:mb-6'}`}>
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1">Metrics</h1>
          <p className="text-xs sm:text-sm text-dark-muted">
            {tradeCount} trade{tradeCount !== 1 ? 's' : ''}
            {stats.totalContracts > 0 &&
              ` · ${stats.totalContracts} contract${stats.totalContracts !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setGuideOpen(!guideOpen)}
            className="p-2 rounded-lg bg-dark-card border border-dark-border text-dark-muted hover:text-white hover:border-white/20 transition-colors touch-manipulation"
            aria-label="How to read metrics"
          >
            <HelpCircle size={20} />
          </button>
          {guideOpen && (
            <>
              <div className="fixed inset-0 z-40" aria-hidden onClick={() => setGuideOpen(false)} />
              <div className="absolute right-0 top-full mt-2 z-50 w-72 sm:w-80 bg-dark-card border border-dark-border rounded-xl shadow-xl p-4 animate-view-in">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-white">How to read</h3>
                  <button
                    type="button"
                    onClick={() => setGuideOpen(false)}
                    className="p-1 rounded text-dark-muted hover:text-white"
                    aria-label="Close"
                  >
                    <X size={16} />
                  </button>
                </div>
                <ul className="text-xs text-dark-muted space-y-2">
                  <li><span className="text-white font-medium">Premium</span> = cash you received for selling the option.</li>
                  <li><span className="text-white font-medium">Total / Month / YTD / Week</span> = premium in that period (closed + open where applicable).</li>
                  <li><span className="text-white font-medium">Win rate</span> = % of closed trades where you kept the full premium (no buyback cost).</li>
                  <li><span className="text-white font-medium">Avg per trade</span> = total premium ÷ number of trades.</li>
                  <li><span className="text-white font-medium">Avg per contract</span> = total premium ÷ total contracts.</li>
                  <li>Charts show last 12 months and top symbols by premium.</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>

      <section className={sectionSpacing} aria-labelledby="premium-over-time-heading">
        <h2 id="premium-over-time-heading" className="text-sm font-semibold text-white uppercase tracking-wide text-dark-muted mb-3 sm:mb-4">
          Premium over time
        </h2>
        <p className="text-xs text-dark-muted mb-3 sm:mb-4 max-w-2xl">
          Total premium collected in different time windows. All time, this month, year to date, and this week.
        </p>
        <div className={`grid grid-cols-2 sm:grid-cols-4 ${gridGap}`}>
        <div className={cardBase}>
          <div className="p-1.5 sm:p-2 md:p-2.5 bg-dark-surface rounded-lg sm:rounded-xl w-fit mb-2 sm:mb-3">
            <DollarSign size={18} className="sm:w-5 sm:h-5 text-white" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white tracking-tight break-words">
            {formatCurrency(stats.totalPremium)}
          </p>
          <p className="text-xs sm:text-sm text-dark-muted mt-0.5">Total Premium</p>
          <p className="text-[10px] sm:text-xs text-dark-muted mt-1">All time</p>
        </div>
        <div className={cardBase}>
          <div className="p-1.5 sm:p-2 md:p-2.5 bg-dark-surface rounded-lg sm:rounded-xl w-fit mb-2 sm:mb-3">
            <Calendar size={18} className="sm:w-5 sm:h-5 text-white" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white tracking-tight break-words">
            {formatCurrency(stats.monthlyPremium)}
          </p>
          <p className="text-xs sm:text-sm text-dark-muted mt-0.5">This Month</p>
          <p className="text-[10px] sm:text-xs text-dark-muted mt-1">Calendar month</p>
        </div>
        <div className={cardBase}>
          <div className="p-1.5 sm:p-2 md:p-2.5 bg-dark-surface rounded-lg sm:rounded-xl w-fit mb-2 sm:mb-3">
            <Target size={18} className="sm:w-5 sm:h-5 text-white" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white tracking-tight break-words">
            {formatCurrency(stats.ytdPremium)}
          </p>
          <p className="text-xs sm:text-sm text-dark-muted mt-0.5">YTD</p>
          <p className="text-[10px] sm:text-xs text-dark-muted mt-1">Year to date</p>
        </div>
        <div className={cardBase}>
          <div className="p-1.5 sm:p-2 md:p-2.5 bg-dark-surface rounded-lg sm:rounded-xl w-fit mb-2 sm:mb-3">
            <Calendar size={18} className="sm:w-5 sm:h-5 text-white" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white tracking-tight break-words">
            {formatCurrency(stats.weeklyPremium)}
          </p>
          <p className="text-xs sm:text-sm text-dark-muted mt-0.5">This Week</p>
          <p className="text-[10px] sm:text-xs text-dark-muted mt-1">Mon–Sun</p>
        </div>
        </div>
      </section>

      <section className={sectionSpacing} aria-labelledby="positions-performance-heading">
        <h2 id="positions-performance-heading" className="text-sm font-semibold text-white uppercase tracking-wide text-dark-muted mb-3 sm:mb-4">
          Positions & performance
        </h2>
        <p className="text-xs text-dark-muted mb-3 sm:mb-4 max-w-2xl">
          Open positions count, premium from calls vs puts, and how often you kept the full premium (win rate).
        </p>
        <div className={`grid grid-cols-2 sm:grid-cols-4 ${gridGap}`}>
        <div className={cardBase}>
          <div className="p-1.5 sm:p-2 md:p-2.5 bg-dark-surface rounded-lg sm:rounded-xl w-fit mb-2 sm:mb-3">
            <TrendingUp size={18} className="sm:w-5 sm:h-5 text-white" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white tracking-tight">{stats.openTrades}</p>
          <p className="text-xs sm:text-sm text-dark-muted mt-0.5">Open</p>
          <p className="text-[10px] sm:text-xs text-dark-muted mt-1">Active positions</p>
        </div>
        <div className={cardBase}>
          <div className="p-1.5 sm:p-2 md:p-2.5 bg-dark-surface rounded-lg sm:rounded-xl w-fit mb-2 sm:mb-3">
            <DollarSign size={18} className="sm:w-5 sm:h-5 text-white" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white tracking-tight break-words">
            {formatCurrency(stats.callsPremium)}
          </p>
          <p className="text-xs sm:text-sm text-dark-muted mt-0.5">Calls</p>
          <p className="text-[10px] sm:text-xs text-dark-muted mt-1">Covered calls</p>
        </div>
        <div className={cardBase}>
          <div className="p-1.5 sm:p-2 md:p-2.5 bg-dark-surface rounded-lg sm:rounded-xl w-fit mb-2 sm:mb-3">
            <DollarSign size={18} className="sm:w-5 sm:h-5 text-white" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white tracking-tight break-words">
            {formatCurrency(stats.putsPremium)}
          </p>
          <p className="text-xs sm:text-sm text-dark-muted mt-0.5">Puts</p>
          <p className="text-[10px] sm:text-xs text-dark-muted mt-1">Cash secured</p>
        </div>
        <div className={cardBase}>
          <div className="p-1.5 sm:p-2 md:p-2.5 bg-dark-surface rounded-lg sm:rounded-xl w-fit mb-2 sm:mb-3">
            <Percent size={18} className="sm:w-5 sm:h-5 text-white" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {stats.winRate.toFixed(0)}%
          </p>
          <p className="text-xs sm:text-sm text-dark-muted mt-0.5">Win Rate</p>
          <p className="text-[10px] sm:text-xs text-dark-muted mt-1">Kept premium</p>
        </div>
        </div>
      </section>

      <section className={sectionSpacing} aria-labelledby="averages-heading">
        <h2 id="averages-heading" className="text-sm font-semibold text-white uppercase tracking-wide text-dark-muted mb-3 sm:mb-4">
          Averages
        </h2>
        <p className="text-xs text-dark-muted mb-3 sm:mb-4 max-w-2xl">
          Average premium per trade and per contract across all your closed and open positions.
        </p>
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridGap}`}>
        <div className={cardBase}>
          <div className="p-1.5 sm:p-2 md:p-2.5 bg-dark-surface rounded-lg sm:rounded-xl w-fit mb-2 sm:mb-3">
            <BarChart3 size={18} className="sm:w-5 sm:h-5 text-white" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white tracking-tight break-words">
            {formatCurrency(stats.averagePremium)}
          </p>
          <p className="text-xs sm:text-sm text-dark-muted mt-0.5">Avg per Trade</p>
        </div>
        <div className={cardBase}>
          <div className="p-1.5 sm:p-2 md:p-2.5 bg-dark-surface rounded-lg sm:rounded-xl w-fit mb-2 sm:mb-3">
            <BarChart3 size={18} className="sm:w-5 sm:h-5 text-white" />
          </div>
          <p className="text-xl sm:text-2xl font-bold text-white tracking-tight break-words">
            {formatCurrency(stats.avgPerContract)}
          </p>
          <p className="text-xs sm:text-sm text-dark-muted mt-0.5">Avg per Contract</p>
          <p className="text-[10px] sm:text-xs text-dark-muted mt-1">{stats.totalContracts} contracts</p>
        </div>
        </div>
      </section>

      <section className={sectionSpacing} aria-labelledby="breakdowns-heading">
        <h2 id="breakdowns-heading" className="text-sm font-semibold text-white uppercase tracking-wide text-dark-muted mb-3 sm:mb-4">
          Breakdowns
        </h2>
        <p className="text-xs text-dark-muted mb-3 sm:mb-4 max-w-2xl">
          Premium by month (last 12 months) and by underlying symbol so you can see where income comes from.
        </p>
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${compact ? 'gap-3 sm:gap-4' : 'gap-4 sm:gap-6'}`}>
        {premiumByMonth.length > 0 && (
          <div className={cardBase}>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="p-2 sm:p-2.5 bg-dark-surface rounded-lg sm:rounded-xl shrink-0">
                <Calendar size={16} className="sm:w-[18px] sm:h-[18px] text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-white">Premium by month</h2>
                <p className="text-[10px] sm:text-xs text-dark-muted">Last 12 months</p>
              </div>
            </div>
            <ul className="space-y-1.5 sm:space-y-2">
              {premiumByMonth.slice(0, 12).map(({ month, premium }) => (
                <li key={month} className="flex justify-between text-xs sm:text-sm">
                  <span className="text-dark-muted truncate pr-2">{month}</span>
                  <span className="font-semibold text-white shrink-0">{formatCurrency(premium)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {premiumBySymbol.length > 0 && (
          <div className={cardBase}>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <div className="p-2 sm:p-2.5 bg-dark-surface rounded-lg sm:rounded-xl shrink-0">
                <FileText size={16} className="sm:w-[18px] sm:h-[18px] text-white" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-white">Top symbols</h2>
                <p className="text-[10px] sm:text-xs text-dark-muted">By premium</p>
              </div>
            </div>
            <ul className="space-y-1.5 sm:space-y-2">
              {premiumBySymbol.slice(0, 10).map(({ symbol, premium }) => (
                <li key={symbol} className="flex justify-between text-xs sm:text-sm">
                  <span className="font-medium text-white truncate pr-2">{symbol}</span>
                  <span className="text-white shrink-0">{formatCurrency(premium)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        </div>
      </section>
    </div>
  )
}
