import { STORAGE_KEYS } from './constants'

const PREF_KEY = 'premiumo-plus-preferences'

/**
 * Remove all app data from localStorage (trades, backup, preferences).
 * Call window.location.reload() after if you want the UI to reflect empty state.
 */
export function clearAllAppData(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(STORAGE_KEYS.TRADES)
    localStorage.removeItem(STORAGE_KEYS.TRADES_BACKUP)
    localStorage.removeItem(PREF_KEY)
  } catch {
    // ignore
  }
}
