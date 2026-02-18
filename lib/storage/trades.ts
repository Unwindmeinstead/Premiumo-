import type { Trade } from '@/types'
import { loadPayload, savePayload } from './persist'
import { DEFAULT_PAYLOAD } from './schema'

export function getTrades(): Trade[] {
  return loadPayload().trades
}

export function saveTrades(trades: Trade[]): void {
  savePayload({ ...DEFAULT_PAYLOAD, trades })
}

export function addTrade(trade: Trade): void {
  const payload = loadPayload()
  payload.trades.push(trade)
  savePayload(payload)
}

export function updateTrade(id: string, updates: Partial<Trade>): void {
  const payload = loadPayload()
  const index = payload.trades.findIndex((t) => t.id === id)
  if (index !== -1) {
    payload.trades[index] = { ...payload.trades[index], ...updates }
    savePayload(payload)
  }
}

export function deleteTrade(id: string): void {
  const payload = loadPayload()
  payload.trades = payload.trades.filter((t) => t.id !== id)
  savePayload(payload)
}

function downloadCsv(trades: Trade[], filenameSuffix: string): void {
  if (typeof window === 'undefined') return
  const headers = [
    'Type',
    'Symbol',
    'Strike',
    'Premium',
    'Qty',
    'Total',
    'Opened',
    'Expiration',
    'Status',
    'BuybackCost',
    'Notes',
  ]
  const rows = trades.map((t) => [
    t.type === 'covered_call' ? 'Covered Call' : 'Cash Secured Put',
    t.symbol,
    t.strike,
    t.premium,
    t.quantity,
    (t.premium * t.quantity).toFixed(2),
    t.dateOpened,
    t.expiration,
    t.status,
    (t.buybackCost ?? 0).toFixed(2),
    (t.notes || '').replace(/"/g, '""'),
  ])
  const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `p-plus-trades-${filenameSuffix}-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function exportTradesToCsv(trades: Trade[]): void {
  downloadCsv(trades, 'all')
}

export function exportTradesToCsvWithFilename(trades: Trade[], filenameSuffix: string): void {
  downloadCsv(trades, filenameSuffix)
}

export function exportTradesToJson(trades: Trade[]): void {
  if (typeof window === 'undefined') return
  const payload = { exportedAt: new Date().toISOString(), version: 1, trades }
  const json = JSON.stringify(payload, null, 2)
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `p-plus-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}
