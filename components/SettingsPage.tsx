'use client'

import { useState, useEffect } from 'react'
import {
  getPreferences,
  setPreferences,
  DEFAULT_PREFERENCES,
  type Preferences,
  type CurrencyStyle,
  type DateFormatStyle,
  type DefaultSortField,
  type DefaultFilter,
} from '@/lib/preferences'
import { Shield, Database, Download, Info, Palette, LayoutDashboard, BarChart3 } from 'lucide-react'

const cardBase =
  'bg-dark-card border border-white/10 rounded-lg sm:rounded-xl p-4 sm:p-5 hover:border-white/20 transition-colors'

const labelClass = 'text-xs sm:text-sm font-medium text-white'
const hintClass = 'text-[10px] sm:text-xs text-dark-muted mt-0.5'

function Select<T extends string>({
  value,
  onChange,
  options,
  label,
  hint,
}: {
  value: T
  onChange: (v: T) => void
  options: { value: T; label: string }[]
  label: string
  hint?: string
}) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="mt-1 w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/40"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && <p className={hintClass}>{hint}</p>}
    </div>
  )
}

function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  hint?: string
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className={labelClass}>{label}</p>
        {hint && <p className={hintClass}>{hint}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`shrink-0 w-10 h-6 rounded-full transition-colors touch-manipulation ${
          checked ? 'bg-white' : 'bg-dark-surface border border-dark-border'
        }`}
      >
        <span
          className={`block w-5 h-5 mt-0.5 rounded-full bg-dark-bg border border-dark-border transition-transform ${
            checked ? 'translate-x-[18px]' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  )
}

export default function SettingsPage() {
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFERENCES)

  useEffect(() => {
    setPrefs(getPreferences())
  }, [])

  useEffect(() => {
    const onChanged = () => setPrefs(getPreferences())
    window.addEventListener('preferences-changed', onChanged)
    return () => window.removeEventListener('preferences-changed', onChanged)
  }, [])

  const update = (partial: Partial<Preferences>) => {
    const next = { ...prefs, ...partial }
    setPrefs(next)
    setPreferences(partial)
  }

  return (
    <div className="w-full max-w-xl space-y-6 pb-8">
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-white mb-1">Settings</h1>
        <p className="text-xs sm:text-sm text-dark-muted">
          Preferences and data. All stored locally in your browser.
        </p>
      </div>

      {/* Display */}
      <section className={cardBase}>
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-dark-surface rounded-lg">
            <Palette size={16} className="text-white" />
          </div>
          <h2 className="text-sm font-semibold text-white">Display</h2>
        </div>
        <div className="space-y-3">
          <Select<CurrencyStyle>
            label="Currency style"
            value={prefs.currencyStyle}
            onChange={(v) => update({ currencyStyle: v })}
            options={[
              { value: 'symbol', label: '$ (e.g. $1,234.56)' },
              { value: 'code', label: 'USD' },
              { value: 'plain', label: 'Numbers only' },
            ]}
            hint="How amounts appear in dashboard and metrics"
          />
          <Select<string>
            label="Decimal places"
            value={String(prefs.currencyDecimals)}
            onChange={(v) => update({ currencyDecimals: Number(v) })}
            options={[
              { value: '0', label: '0' },
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
              { value: '4', label: '4' },
            ]}
          />
          <Select<DateFormatStyle>
            label="Date format"
            value={prefs.dateFormat}
            onChange={(v) => update({ dateFormat: v })}
            options={[
              { value: 'MMM dd, yyyy', label: 'Jan 15, 2025' },
              { value: 'yyyy-MM-dd', label: '2025-01-15' },
              { value: 'dd/MM/yyyy', label: '15/01/2025' },
              { value: 'MM/dd/yyyy', label: '01/15/2025' },
            ]}
            hint="Dates on cards and export"
          />
        </div>
      </section>

      {/* Dashboard defaults */}
      <section className={cardBase}>
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-dark-surface rounded-lg">
            <LayoutDashboard size={16} className="text-white" />
          </div>
          <h2 className="text-sm font-semibold text-white">Dashboard defaults</h2>
        </div>
        <div className="space-y-3">
          <Select<DefaultSortField>
            label="Default sort"
            value={prefs.defaultSortField}
            onChange={(v) => update({ defaultSortField: v })}
            options={[
              { value: 'dateOpened', label: 'Date opened' },
              { value: 'expiration', label: 'Expiration' },
              { value: 'premium', label: 'Premium' },
              { value: 'symbol', label: 'Symbol' },
            ]}
            hint="When you open the dashboard"
          />
          <Toggle
            label="Newest first"
            checked={prefs.defaultSortDesc}
            onChange={(v) => update({ defaultSortDesc: v })}
            hint="Sort descending (newest/highest first)"
          />
          <Select<DefaultFilter>
            label="Default filter"
            value={prefs.defaultFilter}
            onChange={(v) => update({ defaultFilter: v })}
            options={[
              { value: 'all', label: 'All types' },
              { value: 'covered_call', label: 'Covered calls only' },
              { value: 'cash_secured_put', label: 'Cash secured puts only' },
            ]}
          />
          <Toggle
            label="Show Total Cost (closed early) card"
            checked={prefs.dashboardShowCostCard}
            onChange={(v) => update({ dashboardShowCostCard: v })}
            hint="Dashboard stats row"
          />
        </div>
      </section>

      {/* Metrics */}
      <section className={cardBase}>
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-dark-surface rounded-lg">
            <BarChart3 size={16} className="text-white" />
          </div>
          <h2 className="text-sm font-semibold text-white">Metrics</h2>
        </div>
        <Toggle
          label="Compact metrics"
          checked={prefs.metricsCompact}
          onChange={(v) => update({ metricsCompact: v })}
          hint="Tighter spacing on Metrics page"
        />
      </section>

      {/* Data & privacy */}
      <section className={cardBase}>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-dark-surface rounded-lg">
            <Shield size={16} className="text-white" />
          </div>
          <h2 className="text-sm font-semibold text-white">Data & privacy</h2>
        </div>
        <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
          All trades and metrics stay on this device. Nothing is sent to the cloud. Clear site data in your browser to remove everything.
        </p>
      </section>

      {/* Backup */}
      <section className={cardBase}>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-dark-surface rounded-lg">
            <Download size={16} className="text-white" />
          </div>
          <h2 className="text-sm font-semibold text-white">Backup</h2>
        </div>
        <p className="text-xs sm:text-sm text-dark-muted leading-relaxed mb-2">
          Use Export from the menu to download your trades as CSV. Open in Excel or Google Sheets, or re-import elsewhere.
        </p>
        <p className="text-[10px] sm:text-xs text-dark-muted">
          Export includes: type, symbol, strike, premium, quantity, dates, status, notes, buyback cost.
        </p>
      </section>

      {/* About */}
      <section className={cardBase}>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-dark-surface rounded-lg">
            <Info size={16} className="text-white" />
          </div>
          <h2 className="text-sm font-semibold text-white">About</h2>
        </div>
        <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
          P+ is a premium tracker for covered calls and cash secured puts. Install as an app from your browser for offline access.
        </p>
      </section>
    </div>
  )
}
