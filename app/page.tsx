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
import { Plus, DollarSign, Calendar, TrendingUp, ArrowUpDown, Search, Trash2 } from 'lucide-react'

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
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

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

  const handleDelete = (id: string) => setDeleteConfirmId(id)

  const confirmDelete = () => {
    if (deleteConfirmId) {
      deleteTrade(deleteConfirmId)
      setTrades(getTrades())
      setDeleteConfirmId(null)
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingTrade(undefined)
    setDuplicateSource(undefined)
  }

  const deleteConfirmTrade = deleteConfirmId ? trades.find(t => t.id === deleteConfirmId) : null

  return (
    <div className="min-h-[100dvh] min-h-screen bg-dark-bg text-dark-text flex flex-col">
      {/* Delete confirmation modal - in-app UI */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" role="dialog" aria-modal="true" aria-labelledby="delete-dialog-title">
          <div className="w-full max-w-sm bg-dark-card border border-white/20 rounded-xl p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <Trash2 size={20} className="text-red-400" />
              </div>
              <h2 id="delete-dialog-title" className="text-lg font-semibold text-white">Delete trade</h2>
            </div>
            <p className="text-sm text-dark-muted mb-5">
              {deleteConfirmTrade
                ? `Delete ${deleteConfirmTrade.symbol} (${deleteConfirmTrade.type === 'covered_call' ? 'call' : 'put'})? This cannot be undone.`
                : 'Delete this trade? This cannot be undone.'}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium border border-dark-border bg-dark-surface text-white hover:bg-white/10 transition-colors touch-manipulation"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors touch-manipulation"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Sidebar activeView={view} onNavigate={setView}>
        <div key={view} className="px-3 py-3 sm:px-4 sm:py-5 md:px-6 md:py-8 lg:px-8 w-full max-w-full overflow-x-hidden animate-view-in pb-6">
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
          <section className="grid grid-cols-2 gap-1.5 sm:gap-3 md:gap-4 mb-3 sm:mb-5">
            <StatsCard
              title="Premium received − cost to close"
              value={formatCurrency(stats.netPremium)}
              icon={<DollarSign size={20} className="text-white" />}
              valueClassName={stats.netPremium >= 0 ? 'text-green-400' : 'text-red-500'}
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

          <p className="text-xs sm:text-sm text-dark-muted mb-2 sm:mb-5">
            {trades.length} trade{trades.length !== 1 ? 's' : ''}
            {stats.totalContracts > 0 && ` · ${stats.totalContracts} contract${stats.totalContracts !== 1 ? 's' : ''}`}
          </p>

          {/* Filters & sort + Add trade */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-5">
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 rounded-lg sm:rounded-xl bg-white text-black px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium hover:bg-gray-200 active:bg-gray-300 touch-manipulation shrink-0"
              aria-label="Add trade"
            >
              <Plus size={16} className="sm:w-[18px] sm:h-[18px]" strokeWidth={2.5} />
              <span className="hidden sm:inline">Add</span>
            </button>
            <div className="flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-dark-surface px-2 py-1.5 sm:px-3 sm:py-2 flex-1 min-w-[100px] sm:min-w-0 sm:flex-initial">
              <Search size={14} className="sm:w-[18px] sm:h-[18px] text-dark-muted shrink-0" />
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
            <section className="mb-4 sm:mb-10">
              <h2 className="text-base sm:text-lg font-semibold text-white tracking-wide mb-2 sm:mb-4 uppercase text-dark-muted">
                Open Trades
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
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
              <h2 className="text-base sm:text-lg font-semibold text-white tracking-wide mb-2 sm:mb-4 uppercase text-dark-muted">
                Closed Trades
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
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
            <p className="text-dark-muted text-sm py-6">
              {trades.length === 0
                ? 'No trades yet. Tap Add above to add one.'
                : 'No trades match the current filters.'}
            </p>
          )}
            </>
          )}
        </div>
      </Sidebar>

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
