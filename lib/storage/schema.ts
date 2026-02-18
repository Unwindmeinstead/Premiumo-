import type { Trade } from '@/types'
import { STORAGE_VERSION } from './constants'

export interface StoragePayload {
  v: number
  trades: Trade[]
}

export const DEFAULT_PAYLOAD: StoragePayload = {
  v: STORAGE_VERSION,
  trades: [],
}

const TRADE_STATUSES = ['open', 'closed', 'assigned', 'expired'] as const
const TRADE_TYPES = ['covered_call', 'cash_secured_put'] as const

function isTrade(raw: unknown): raw is Trade {
  if (!raw || typeof raw !== 'object') return false
  const o = raw as Record<string, unknown>
  return (
    typeof o.id === 'string' &&
    TRADE_TYPES.includes(o.type as (typeof TRADE_TYPES)[number]) &&
    typeof o.symbol === 'string' &&
    typeof o.strike === 'number' &&
    typeof o.premium === 'number' &&
    typeof o.expiration === 'string' &&
    typeof o.quantity === 'number' &&
    typeof o.dateOpened === 'string' &&
    TRADE_STATUSES.includes(o.status as (typeof TRADE_STATUSES)[number])
  )
}

function normalizeTrade(raw: unknown): Trade | null {
  if (!isTrade(raw)) return null
  return {
    id: raw.id,
    type: raw.type,
    symbol: String(raw.symbol).toUpperCase(),
    strike: Number(raw.strike),
    premium: Number(raw.premium),
    expiration: String(raw.expiration),
    quantity: Math.max(1, Math.floor(Number(raw.quantity))),
    dateOpened: String(raw.dateOpened),
    dateClosed: raw.dateClosed != null ? String(raw.dateClosed) : undefined,
    status: raw.status,
    notes: raw.notes != null ? String(raw.notes) : undefined,
    buybackCost:
      raw.buybackCost != null && Number(raw.buybackCost) >= 0
        ? Number(raw.buybackCost)
        : undefined,
  }
}

export function validatePayload(raw: unknown): StoragePayload {
  if (!raw || typeof raw !== 'object') return DEFAULT_PAYLOAD
  const o = raw as Record<string, unknown>
  // Legacy: stored as plain array
  if (Array.isArray(raw)) {
    const trades = raw.map(normalizeTrade).filter((t): t is Trade => t !== null)
    return { v: STORAGE_VERSION, trades }
  }
  const v = typeof o.v === 'number' ? o.v : STORAGE_VERSION
  const arr = Array.isArray(o.trades) ? o.trades : []
  const trades = arr.map(normalizeTrade).filter((t): t is Trade => t !== null)
  return { v, trades }
}
