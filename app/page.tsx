'use client'

import { useState, useEffect, useMemo } from 'react'
import { Trade } from '@/types'
import { getTrades, addTrade, updateTrade, deleteTrade } from '@/lib/storage'
import { getPreferences } from '@/lib/preferences'
import {
  calculateStats,
  formatCurrency,
  getPremiumByMonth,
  getPremiumBySymbol,
} from '@/lib/utils'
import TradeForm from '@/components/TradeForm'
import TradeCard from '@/components/TradeCard'
import StatsCard from '@/components/StatsCard'
import MetricsPage from '@/components/MetricsPage'
import CalendarPage from '@/components/CalendarPage'
import SettingsPage from '@/components/SettingsPage'
import ExportPage from '@/components/ExportPage'
import MasterclassPage from '@/components/MasterclassPage'
import CompoundCalculatorPage from '@/components/CompoundCalculatorPage'
import OptionWheelSimulatorPage from '@/components/OptionWheelSimulatorPage'
import Sidebar from '@/components/Sidebar'
import type { AppView } from '@/components/Sidebar'
import { Plus, DollarSign, Calendar, TrendingUp, ArrowUpDown, Search, Infinity } from 'lucide-react'

type FilterType = 'all' | 'covered_call' | 'cash_secured_put'
type SortField = 'dateOpened' | 'expiration' | 'premium' | 'symbol'

export default function Home() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [view, setView] = useState<AppView>('dashboard')
  const [showForm, setShowForm] = useState(false)
  const [editingTrade, setEditingTrade] = useState<Trade | undefined>()
  const [duplicateSource, setDuplicateSource] = useState<Trade | undefined>()
  const [filterType, setFilterType] = useState<FilterType>(() =>
    typeof window !== 'undefined' ? getPreferences().defaultFilter : 'all'
  )
  const [searchSymbol, setSearchSymbol] = useState('')
  const [sortField, setSortField] = useState<SortField>(() =>
    typeof window !== 'undefined' ? getPreferences().defaultSortField : 'dateOpened'
  )
  const [sortDesc, setSortDesc] = useState(() =>
    typeof window !== 'undefined' ? getPreferences().defaultSortDesc : true
  )
  const [prefs, setPrefs] = useState<ReturnType<typeof getPreferences> | null>(() =>
    typeof window !== 'undefined' ? getPreferences() : null
  )

  useEffect(() => {
    setTrades(getTrades())
  }, [])

  useEffect(() => {
    const onPrefs = () => setPrefs(getPreferences())
    window.addEventListener('preferences-changed', onPrefs)
    return () => window.removeEventListener('preferences-changed', onPrefs)
  }, [])

  const stats = calculateStats(trades)
  const premiumByMonth = useMemo(() => getPremiumByMonth(trades), [trades])
  const premiumBySymbol = useMemo(() => getPremiumBySymbol(trades), [trades])

  const filteredTrades = useMemo(() => {
    let list = [...trades]
    if (filterType !== 'all') list = list.filter(t => t.type === filterType)
    if (searchSymbol.trim())
      list = list.filter(t => t.symbol.toLowerCase().includes(searchSymbol.trim().toLowerCase()))
    return list
  }, [trades, filterType, searchSymbol])

  const openTrades = useMemo(() => {
    const open = filteredTrades.filter(t => t.status === 'open')
    return sortTrades(open, sortField, sortDesc)
  }, [filteredTrades, sortField, sortDesc])

  const closedTrades = useMemo(() => {
    const closed = filteredTrades.filter(t => t.status !== 'open')
    return sortTrades(closed, sortField, sortDesc)
  }, [filteredTrades, sortField, sortDesc])

  function sortTrades(list: Trade[], field: SortField, desc: boolean): Trade[] {
    const mult = desc ? -1 : 1
    return [...list].sort((a, b) => {
      let va: string | number = a[field]
      let vb: string | number = b[field]
      if (field === 'dateOpened' || field === 'expiration') {
        va = new Date(va as string).getTime()
        vb = new Date(vb as string).getTime()
      }
      if (field === 'premium') {
        va = a.premium * a.quantity
        vb = b.premium * b.quantity
      }
      if (typeof va === 'string') return mult * (va.localeCompare(vb as string))
      return mult * ((va as number) - (vb as number))
    })
  }

  const handleSave = (trade: Trade) => {
    if (editingTrade) updateTrade(trade.id, trade)
    else addTrade(trade)
    setTrades(getTrades())
    setEditingTrade(undefined)
    setDuplicateSource(undefined)
  }

  const handleEdit = (trade: Trade) => {
    setEditingTrade(trade)
    setDuplicateSource(undefined)
    setShowForm(true)
  }

  const handleDuplicate = (trade: Trade) => {
    setDuplicateSource(trade)
    setEditingTrade(undefined)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this trade?')) {
      deleteTrade(id)
      setTrades(getTrades())
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingTrade(undefined)
    setDuplicateSource(undefined)
  }

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text">
      <Sidebar activeView={view} onNavigate={setView}>
        <div key={view} className="px-3 py-4 sm:px-4 sm:py-6 md:px-6 md:py-8 lg:px-8 w-full max-w-full overflow-x-hidden animate-view-in">
          {view === 'metrics' && (
            <MetricsPage
              stats={stats}
              premiumByMonth={premiumByMonth}
              premiumBySymbol={premiumBySymbol}
              tradeCount={trades.length}
              compact={prefs?.metricsCompact ?? false}
            />
          )}
          {view === 'wheel' && <OptionWheelSimulatorPage />}
          {view === 'calendar' && <CalendarPage trades={trades} />}
          {view === 'compound' && <CompoundCalculatorPage />}
          {view === 'settings' && <SettingsPage />}
          {view === 'export' && <ExportPage trades={trades} />}
          {view === 'masterclass' && <MasterclassPage />}
          {view === 'dashboard' && (
            <>
          {/* Top metrics - 4 small cards - mobile-first */}
          <section className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
            <StatsCard
              title="Total Premium"
              value={formatCurrency(stats.totalPremium)}
              icon={<DollarSign size={20} className="text-white" />}
            />
            {prefs?.dashboardShowCostCard !== false && (
              <StatsCard
                title="Total Cost (Closed Early)"
                value={formatCurrency(stats.totalBuybackCost)}
                icon={<DollarSign size={20} className="text-white" />}
                valueClassName="text-red-500"
              />
            )}
            <StatsCard
              title="Total Options Traded"
              value={stats.totalContracts}
              icon={<TrendingUp size={20} className="text-white" />}
            />
            <StatsCard
              title="This Month"
              value={formatCurrency(stats.monthlyPremium)}
              icon={<Calendar size={20} className="text-white" />}
            />
          </section>

          <p className="text-xs sm:text-sm text-dark-muted mb-4 sm:mb-6">
            {trades.length} trade{trades.length !== 1 ? 's' : ''}
            {stats.totalContracts > 0 && ` · ${stats.totalContracts} contract${stats.totalContracts !== 1 ? 's' : ''}`}
          </p>

          {/* Filters & sort - mobile-first */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-dark-surface px-2 py-1.5 sm:px-3 sm:py-2 flex-1 min-w-[120px] sm:min-w-0 sm:flex-initial">
              <Search size={16} className="sm:w-[18px] sm:h-[18px] text-dark-muted shrink-0" />
              <input
                type="text"
                placeholder="Symbol..."
                value={searchSymbol}
                onChange={e => setSearchSymbol(e.target.value)}
                className="bg-transparent text-white text-xs sm:text-sm w-full min-w-0 focus:outline-none placeholder:text-dark-muted"
              />
            </div>
            <div className="flex gap-0.5 sm:gap-1 rounded-lg sm:rounded-xl bg-dark-surface p-0.5 sm:p-1">
              {(['all', 'covered_call', 'cash_secured_put'] as const).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFilterType(type)}
                  className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-colors touch-manipulation ${
                    filterType === type
                      ? 'bg-white text-black'
                      : 'text-dark-muted hover:text-white active:bg-dark-border'
                  }`}
                >
                  {type === 'all' ? 'All' : type === 'covered_call' ? 'Calls' : 'Puts'}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 rounded-lg sm:rounded-xl bg-dark-surface px-2 py-1.5 sm:px-3 sm:py-2">
              <ArrowUpDown size={14} className="sm:w-4 sm:h-4 text-dark-muted shrink-0" />
              <select
                value={sortField}
                onChange={e => setSortField(e.target.value as SortField)}
                className="bg-transparent text-white text-xs sm:text-sm focus:outline-none cursor-pointer pr-1 sm:pr-2"
              >
                <option value="dateOpened">Date</option>
                <option value="expiration">Expiration</option>
                <option value="premium">Premium</option>
                <option value="symbol">Symbol</option>
              </select>
              <button
                type="button"
                onClick={() => setSortDesc(d => !d)}
                className="text-dark-muted hover:text-white active:text-white text-xs sm:text-sm touch-manipulation p-0.5"
              >
                {sortDesc ? '↓' : '↑'}
              </button>
            </div>
          </div>

          {/* Trades - mobile-first grid */}
          {openTrades.length > 0 && (
            <section className="mb-6 sm:mb-10">
              <h2 className="text-base sm:text-lg font-semibold text-white tracking-wide mb-3 sm:mb-4 uppercase text-dark-muted">
                Open Trades
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {openTrades.map(trade => (
                  <TradeCard
                    key={trade.id}
                    trade={trade}
                    onEdit={handleEdit}
                    onDuplicate={handleDuplicate}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </section>
          )}

          {closedTrades.length > 0 && (
            <section>
              <h2 className="text-base sm:text-lg font-semibold text-white tracking-wide mb-3 sm:mb-4 uppercase text-dark-muted">
                Closed Trades
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {closedTrades.map(trade => (
                  <TradeCard
                    key={trade.id}
                    trade={trade}
                    onEdit={handleEdit}
                    onDuplicate={handleDuplicate}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </section>
          )}

          {filteredTrades.length === 0 && (
            <p className="text-dark-muted text-sm py-8">
              {trades.length === 0
                ? 'No trades yet. Tap + to add one.'
                : 'No trades match the current filters.'}
            </p>
          )}
            </>
          )}
        </div>
      </Sidebar>

      {/* Compound calculator - above masterclass */}
      <button
        onClick={() => setView('compound')}
        className={`fixed bottom-20 md:bottom-24 left-2 md:left-4 w-10 h-10 md:w-12 md:h-12 bg-dark-card border rounded-lg md:rounded-xl shadow-lg hover:border-white/20 transition-all duration-200 ease-out flex items-center justify-center z-40 touch-manipulation ${
          view === 'compound'
            ? 'bg-white text-black border-white/30'
            : 'border-dark-border text-dark-muted hover:text-white hover:bg-dark-surface active:bg-dark-border'
        }`}
        aria-label="Compound interest calculator"
      >
        <span className="font-bold text-lg md:text-xl">%</span>
      </button>

      {/* Masterclass button - bottom of page */}
      <button
        onClick={() => setView('masterclass')}
        className={`fixed bottom-4 left-2 md:bottom-6 md:left-4 w-10 h-10 md:w-12 md:h-12 bg-dark-card border rounded-lg md:rounded-xl shadow-lg hover:border-white/20 transition-all duration-200 ease-out flex items-center justify-center z-40 touch-manipulation ${
          view === 'masterclass'
            ? 'bg-white text-black border-white/30'
            : 'border-dark-border text-dark-muted hover:text-white hover:bg-dark-surface active:bg-dark-border'
        }`}
        aria-label="Masterclass"
      >
        <Infinity size={20} className="md:w-6 md:h-6" strokeWidth={2.5} />
      </button>

      {/* Floating Action Button - mobile-first positioning */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 sm:w-14 sm:h-14 bg-white text-black rounded-full shadow-2xl hover:bg-gray-200 active:scale-95 transition-all flex items-center justify-center z-40 touch-manipulation"
        style={{ boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)' }}
        aria-label="Add new trade"
      >
        <Plus size={24} strokeWidth={2.5} className="sm:w-[26px] sm:h-[26px]" />
      </button>

      {showForm && (
        <TradeForm
          onSave={handleSave}
          onClose={handleCloseForm}
          initialTrade={
            duplicateSource
              ? {
                  ...duplicateSource,
                  id: '',
                  status: 'open',
                  dateOpened: new Date().toISOString().split('T')[0],
                  dateClosed: undefined,
                  buybackCost: undefined,
                }
              : editingTrade
          }
        />
      )}

    </div>
  )
}
