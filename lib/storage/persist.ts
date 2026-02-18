import { STORAGE_KEYS } from './constants'
import { DEFAULT_PAYLOAD, validatePayload, type StoragePayload } from './schema'

const isBrowser = () => typeof window !== 'undefined'

function readRaw(key: string): string | null {
  if (!isBrowser()) return null
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeRaw(key: string, value: string): boolean {
  if (!isBrowser()) return false
  try {
    localStorage.setItem(key, value)
    return true
  } catch {
    return false
  }
}

/**
 * Read and validate payload. On parse failure, tries backup key so we never lose data.
 */
export function loadPayload(): StoragePayload {
  if (!isBrowser()) return DEFAULT_PAYLOAD
  const raw = readRaw(STORAGE_KEYS.TRADES)
  if (raw == null || raw === '') return DEFAULT_PAYLOAD
  try {
    const parsed = JSON.parse(raw) as unknown
    return validatePayload(parsed)
  } catch {
    const backup = readRaw(STORAGE_KEYS.TRADES_BACKUP)
    if (backup != null && backup !== '') {
      try {
        const parsed = JSON.parse(backup) as unknown
        return validatePayload(parsed)
      } catch {
        return DEFAULT_PAYLOAD
      }
    }
    return DEFAULT_PAYLOAD
  }
}

/**
 * Write payload. Backs up current main key first, then writes so we can recover on failure.
 */
export function savePayload(payload: StoragePayload): boolean {
  if (!isBrowser()) return false
  const current = readRaw(STORAGE_KEYS.TRADES)
  if (current != null) writeRaw(STORAGE_KEYS.TRADES_BACKUP, current)
  const next = JSON.stringify({ v: payload.v, trades: payload.trades })
  return writeRaw(STORAGE_KEYS.TRADES, next)
}
