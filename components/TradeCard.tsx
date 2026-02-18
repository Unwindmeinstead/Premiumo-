'use client'

import { Trade } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Edit2, Trash2, Copy } from 'lucide-react'

interface TradeCardProps {
  trade: Trade
  onEdit: (trade: Trade) => void
  onDuplicate: (trade: Trade) => void
  onDelete: (id: string) => void
}

export default function TradeCard({ trade, onEdit, onDuplicate, onDelete }: TradeCardProps) {
  const totalPremium = trade.premium * trade.quantity
  const isCall = trade.type === 'covered_call'

  const statusClass = 'bg-white/10 text-white border border-white/20 rounded-lg'

  return (
    <div className="bg-dark-card border border-dark-border rounded-lg sm:rounded-xl p-4 sm:p-5 hover:border-white/25 transition-colors">
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
            <h3 className="text-lg sm:text-xl font-bold text-white truncate">{trade.symbol}</h3>
            <span className={`text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 ${statusClass} shrink-0`}>
              {trade.status}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-dark-muted">
            {isCall ? 'Covered Call' : 'Cash Secured Put'}
          </p>
        </div>
        <div className="flex gap-0.5 sm:gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onDuplicate(trade)}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-dark-surface text-dark-muted hover:text-white active:bg-dark-border transition-colors touch-manipulation"
            aria-label="Duplicate"
          >
            <Copy size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(trade)}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-dark-surface text-dark-muted hover:text-white active:bg-dark-border transition-colors touch-manipulation"
            aria-label="Edit"
          >
            <Edit2 size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(trade.id)}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-dark-surface text-dark-muted hover:text-white active:bg-dark-border transition-colors touch-manipulation"
            aria-label="Delete"
          >
            <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div>
          <p className="text-xs text-dark-muted mb-0.5">Strike</p>
          <p className="font-semibold text-white">{formatCurrency(trade.strike)}</p>
        </div>
        <div>
          <p className="text-xs text-dark-muted mb-0.5">Premium</p>
          <p className="font-semibold text-white">{formatCurrency(trade.premium)}</p>
        </div>
        <div>
          <p className="text-xs text-dark-muted mb-0.5">Qty</p>
          <p className="font-semibold text-white">{trade.quantity}</p>
        </div>
        <div>
          <p className="text-xs text-dark-muted mb-0.5">Total</p>
          <p className="font-semibold text-white">{formatCurrency(totalPremium)}</p>
        </div>
      </div>
      {trade.buybackCost != null && trade.buybackCost > 0 && (
        <div className="mb-3 sm:mb-4 rounded-lg bg-dark-surface px-2.5 sm:px-3 py-1.5 sm:py-2">
          <p className="text-[10px] sm:text-xs text-dark-muted">Cost (closed early)</p>
          <p className="text-xs sm:text-sm font-semibold text-white">{formatCurrency(trade.buybackCost)}</p>
        </div>
      )}

      <div className="pt-3 sm:pt-4 border-t border-dark-border">
        <div className="flex justify-between text-xs sm:text-sm">
          <div>
            <p className="text-dark-muted text-xs">Opened</p>
            <p className="text-white">{formatDate(trade.dateOpened)}</p>
          </div>
          <div className="text-right">
            <p className="text-dark-muted text-xs">Expires</p>
            <p className="text-white">{formatDate(trade.expiration)}</p>
          </div>
        </div>
        {trade.notes && (
          <div className="mt-3 pt-3 border-t border-dark-border">
            <p className="text-xs text-dark-muted">{trade.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
