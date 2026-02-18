'use client'

import { useState } from 'react'
import { Trade, TradeType } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { X } from 'lucide-react'

interface TradeFormProps {
  onSave: (trade: Trade) => void
  onClose: () => void
  initialTrade?: Trade
}

const inputBase =
  'w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm text-white placeholder:text-dark-muted focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all'

export default function TradeForm({ onSave, onClose, initialTrade }: TradeFormProps) {
  const [formData, setFormData] = useState<Partial<Trade>>({
    type: initialTrade?.type || 'covered_call',
    symbol: initialTrade?.symbol || '',
    strike: initialTrade?.strike || 0,
    premium: initialTrade?.premium || 0,
    expiration: initialTrade?.expiration || '',
    quantity: initialTrade?.quantity || 1,
    dateOpened: initialTrade?.dateOpened || new Date().toISOString().split('T')[0],
    status: initialTrade?.status || 'open',
    notes: initialTrade?.notes || '',
    buybackCost: initialTrade?.buybackCost ?? 0,
  })

  const totalPremium =
    (formData.premium ?? 0) * (formData.quantity ?? 1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trade: Trade = {
      id: initialTrade?.id || crypto.randomUUID(),
      type: formData.type as TradeType,
      symbol: formData.symbol?.toUpperCase() || '',
      strike: formData.strike || 0,
      premium: formData.premium || 0,
      expiration: formData.expiration || '',
      quantity: formData.quantity || 1,
      dateOpened: formData.dateOpened || new Date().toISOString().split('T')[0],
      status: formData.status || 'open',
      dateClosed: formData.dateClosed,
      notes: formData.notes,
      buybackCost: formData.buybackCost && formData.buybackCost > 0 ? formData.buybackCost : undefined,
    }
    onSave(trade)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 animate-modal-backdrop"
      onClick={onClose}
    >
      <div
        className="bg-dark-card rounded-xl sm:rounded-2xl w-full max-w-md shadow-2xl animate-modal-content overflow-hidden max-h-[95vh] sm:max-h-[90vh] flex flex-col will-change-transform"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 shrink-0">
          <h2 className="text-base sm:text-lg font-bold text-white">
            {initialTrade ? 'Edit Trade' : 'New Trade'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-dark-muted hover:text-white hover:bg-dark-surface active:bg-dark-border transition-colors touch-manipulation"
            aria-label="Close"
          >
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-4 pb-4 sm:px-5 sm:pb-5 space-y-3 sm:space-y-4 overflow-y-auto flex-1">
          {/* Type toggle */}
          <div>
            <label className="block text-xs font-medium text-dark-muted mb-1.5">Type</label>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-dark-surface rounded-lg">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'covered_call' })}
                className={`py-2 px-2 sm:px-3 rounded-md text-xs sm:text-sm font-medium transition-all touch-manipulation ${
                  formData.type === 'covered_call'
                    ? 'bg-white text-black'
                    : 'text-dark-muted hover:text-white active:bg-dark-border'
                }`}
              >
                Covered Call
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'cash_secured_put' })}
                className={`py-2 px-2 sm:px-3 rounded-md text-xs sm:text-sm font-medium transition-all touch-manipulation ${
                  formData.type === 'cash_secured_put'
                    ? 'bg-white text-black'
                    : 'text-dark-muted hover:text-white active:bg-dark-border'
                }`}
              >
                Cash Secured Put
              </button>
            </div>
          </div>

          {/* Symbol + Quantity */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div>
              <label className="block text-xs font-medium text-dark-muted mb-1">Symbol</label>
              <input
                type="text"
                value={formData.symbol}
                onChange={e => setFormData({ ...formData, symbol: e.target.value })}
                className={inputBase}
                placeholder="e.g. AAPL"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-muted mb-1">Qty</label>
              <input
                type="number"
                min={1}
                value={formData.quantity}
                onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                className={inputBase}
                required
              />
            </div>
          </div>

          {/* Strike + Premium */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div>
              <label className="block text-xs font-medium text-dark-muted mb-1">Strike</label>
              <input
                type="number"
                step="0.01"
                min={0}
                value={formData.strike || ''}
                onChange={e => setFormData({ ...formData, strike: parseFloat(e.target.value) || 0 })}
                className={inputBase}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-muted mb-1">Premium</label>
              <input
                type="number"
                step="0.01"
                min={0}
                value={formData.premium || ''}
                onChange={e => setFormData({ ...formData, premium: parseFloat(e.target.value) || 0 })}
                className={inputBase}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Total premium */}
          <div className="rounded-lg bg-dark-surface px-3 py-2 flex justify-between items-center">
            <span className="text-xs text-dark-muted">Total premium</span>
            <span className="text-base font-bold text-white">{formatCurrency(totalPremium)}</span>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div>
              <label className="block text-xs font-medium text-dark-muted mb-1">Opened</label>
              <input
                type="date"
                value={formData.dateOpened}
                onChange={e => setFormData({ ...formData, dateOpened: e.target.value })}
                className={inputBase}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-dark-muted mb-1">Expiration</label>
              <input
                type="date"
                value={formData.expiration}
                onChange={e => setFormData({ ...formData, expiration: e.target.value })}
                className={inputBase}
                required
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-medium text-dark-muted mb-1">Status</label>
            <select
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value as Trade['status'] })}
              className={inputBase}
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="assigned">Assigned</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          {/* Buyback cost (when closed early) */}
          <div>
            <label className="block text-xs font-medium text-dark-muted mb-1">Cost if closed early</label>
            <input
              type="number"
              step="0.01"
              min={0}
              value={formData.buybackCost ?? ''}
              onChange={e => setFormData({ ...formData, buybackCost: parseFloat(e.target.value) || 0 })}
              className={inputBase}
              placeholder="0 — paid to buy back"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-dark-muted mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className={`${inputBase} resize-none`}
              rows={2}
              placeholder="Optional"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-medium border border-dark-border bg-dark-surface text-white hover:bg-dark-border active:bg-dark-border transition-colors touch-manipulation"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-medium bg-white text-black hover:bg-gray-200 active:bg-gray-300 transition-colors touch-manipulation"
            >
              {initialTrade ? 'Update' : 'Add'} Trade
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
