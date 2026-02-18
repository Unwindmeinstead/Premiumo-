'use client'

import { Trade } from '@/types'
import { exportTradesToCsv } from '@/lib/storage'
import { FileDown, FileText } from 'lucide-react'

const cardBase =
  'bg-dark-card border border-dark-border rounded-lg sm:rounded-xl p-4 sm:p-5 hover:border-white/20 transition-colors'

interface ExportPageProps {
  trades: Trade[]
}

export default function ExportPage({ trades }: ExportPageProps) {
  const handleExportCsv = () => {
    exportTradesToCsv(trades)
  }

  return (
    <div className="w-full max-w-xl">
      <h1 className="text-lg sm:text-xl font-bold text-white mb-1">Export</h1>
      <p className="text-xs sm:text-sm text-dark-muted mb-4 sm:mb-6">
        Download your data to back up or use in a spreadsheet.
      </p>

      <section className={`${cardBase} mb-4 sm:mb-6`}>
        <div className="flex items-center gap-2 sm:gap-3 mb-3">
          <div className="p-2 sm:p-2.5 bg-dark-surface rounded-lg sm:rounded-xl shrink-0">
            <FileText size={18} className="sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-white">CSV export</h2>
            <p className="text-[10px] sm:text-xs text-dark-muted">Compatible with Excel and Google Sheets</p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-dark-muted mb-3 sm:mb-4 leading-relaxed">
          One row per trade. Columns: Type, Symbol, Strike, Premium, Quantity, Total premium, Date opened, Expiration, Status, BuybackCost, Notes.
        </p>
        <button
          type="button"
          onClick={handleExportCsv}
          disabled={trades.length === 0}
          className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 rounded-lg sm:rounded-xl bg-white text-black text-xs sm:text-sm font-medium hover:bg-gray-200 active:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
        >
          <FileDown size={16} className="sm:w-[18px] sm:h-[18px]" />
          Download CSV ({trades.length} trade{trades.length !== 1 ? 's' : ''})
        </button>
      </section>

      <section className={cardBase}>
        <h2 className="text-sm font-semibold text-white mb-2">What gets exported</h2>
        <ul className="text-xs sm:text-sm text-dark-muted space-y-1">
          <li>· All trades (open and closed)</li>
          <li>· Covered calls and cash secured puts</li>
          <li>· Filename includes today’s date</li>
        </ul>
      </section>
    </div>
  )
}
