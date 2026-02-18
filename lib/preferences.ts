const PREF_KEY = 'premiumo-plus-preferences'

export type CurrencyStyle = 'symbol' | 'code' | 'plain'
export type DateFormatStyle = 'MMM dd, yyyy' | 'yyyy-MM-dd' | 'dd/MM/yyyy' | 'MM/dd/yyyy'
export type DefaultSortField = 'dateOpened' | 'expiration' | 'premium' | 'symbol'
export type DefaultFilter = 'all' | 'covered_call' | 'cash_secured_put'

export interface Preferences {
  currencyStyle: CurrencyStyle
  currencyDecimals: number
  dateFormat: DateFormatStyle
  defaultSortField: DefaultSortField
  defaultSortDesc: boolean
  defaultFilter: DefaultFilter
  metricsCompact: boolean
  dashboardShowCostCard: boolean
}

export const DEFAULT_PREFERENCES: Preferences = {
  currencyStyle: 'symbol',
  currencyDecimals: 2,
  dateFormat: 'MMM dd, yyyy',
  defaultSortField: 'dateOpened',
  defaultSortDesc: true,
  defaultFilter: 'all',
  metricsCompact: false,
  dashboardShowCostCard: true,
}

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

export function getPreferences(): Preferences {
  if (!isBrowser()) return DEFAULT_PREFERENCES
  try {
    const raw = localStorage.getItem(PREF_KEY)
    if (!raw) return DEFAULT_PREFERENCES
    const parsed = JSON.parse(raw) as Partial<Preferences>
    return { ...DEFAULT_PREFERENCES, ...parsed }
  } catch {
    return DEFAULT_PREFERENCES
  }
}

export function setPreferences(next: Partial<Preferences>): void {
  if (!isBrowser()) return
  const current = getPreferences()
  const merged = { ...current, ...next }
  localStorage.setItem(PREF_KEY, JSON.stringify(merged))
  window.dispatchEvent(new CustomEvent('preferences-changed'))
}
