'use client'

import { Trade } from '@/types'
import {
  exportTradesToCsv,
  exportTradesToCsvWithFilename,
  exportTradesToJson,
} from '@/lib/storage'
import { FileDown, FileText, Database, Info } from 'lucide-react'

const cardBase =
  'bg-dark-card border border-white/10 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-5 lg:p-6 hover:border-white/20 transition-colors'

const btnBase =
  'w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation'

interface ExportPageProps {
  trades: Trade[]
}

export default function ExportPage({ trades }: ExportPageProps) {
  const openTrades = trades.filter((t) => t.status === 'open')
  const closedTrades = trades.filter((t) => t.status !== 'open')

  return (
    <div className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto px-0 sm:px-1 space-y-4 sm:space-y-5 md:space-y-6 pb-24 sm:pb-28 md:pb-32 lg:pb-36">
      <div>
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1">Export</h1>
        <p className="text-xs sm:text-sm md:text-base text-dark-muted">
          Download your data as CSV for spreadsheets or JSON for full backup.
        </p>
      </div>

      {/* Spreadsheet (CSV) */}
      <section className={cardBase}>
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-dark-surface rounded-lg">
            <FileText size={16} className="text-white" />
          </div>
          <h2 className="text-sm font-semibold text-white">Spreadsheet (CSV)</h2>
        </div>
        <p className="text-xs text-dark-muted mb-3">
          One row per trade. Opens in Excel, Google Sheets, or any spreadsheet app.
        </p>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => exportTradesToCsv(trades)}
            disabled={trades.length === 0}
            className={`${btnBase} bg-white text-black hover:bg-gray-200 active:bg-gray-300`}
          >
            <FileDown size={16} />
            All trades ({trades.length})
          </button>
          <button
            type="button"
            onClick={() => exportTradesToCsvWithFilename(openTrades, 'open')}
            disabled={openTrades.length === 0}
            className={`${btnBase} border border-dark-border bg-dark-surface text-white hover:bg-white/10`}
          >
            <FileDown size={16} />
            Open only ({openTrades.length})
          </button>
          <button
            type="button"
            onClick={() => exportTradesToCsvWithFilename(closedTrades, 'closed')}
            disabled={closedTrades.length === 0}
            className={`${btnBase} border border-dark-border bg-dark-surface text-white hover:bg-white/10`}
          >
            <FileDown size={16} />
            Closed only ({closedTrades.length})
          </button>
        </div>
      </section>

      {/* Backup (JSON) */}
      <section className={cardBase}>
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 bg-dark-surface rounded-lg">
            <Database size={16} className="text-white" />
          </div>
          <h2 className="text-sm font-semibold text-white">Backup (JSON)</h2>
        </div>
        <p className="text-xs text-dark-muted mb-3">
          Full data with IDs and all fields. Use for backup or to restore into another device later (import not in app yet).
        </p>
        <button
          type="button"
          onClick={() => exportTradesToJson(trades)}
          disabled={trades.length === 0}
          className={`${btnBase} border border-dark-border bg-dark-surface text-white hover:bg-white/10`}
        >
          <FileDown size={16} />
          Download JSON backup ({trades.length} trade{trades.length !== 1 ? 's' : ''})
        </button>
      </section>

      {/* What gets exported */}
      <section className={cardBase}>
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-dark-surface rounded-lg">
            <Info size={16} className="text-white" />
          </div>
          <h2 className="text-sm font-semibold text-white">What gets exported</h2>
        </div>
        <ul className="text-xs text-dark-muted space-y-1">
          <li>· CSV: Type, Symbol, Strike, Premium, Qty, Total, Opened, Expiration, Status, BuybackCost, Notes</li>
          <li>· JSON: Same data plus IDs and export timestamp</li>
          <li>· Filenames include today’s date</li>
        </ul>
      </section>
    </div>
  )
}
