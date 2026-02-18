import { Trade, TradeStats } from '@/types'
import { format, startOfMonth, startOfYear, startOfWeek, isWithinInterval, subDays } from 'date-fns'
import { getPreferences } from '@/lib/preferences'

export const calculateStats = (trades: Trade[]): TradeStats => {
  const now = new Date()
  const totalPremium = trades.reduce((sum, t) => sum + t.premium * t.quantity, 0)
  const totalBuybackCost = trades.reduce((sum, t) => sum + (t.buybackCost ?? 0), 0)
  const totalContracts = trades.reduce((sum, t) => sum + t.quantity, 0)
  const openTrades = trades.filter(t => t.status === 'open').length
  const closedTrades = trades.filter(t => t.status === 'closed' || t.status === 'assigned' || t.status === 'expired').length

  const monthStart = startOfMonth(now)
  const monthlyPremium = trades
    .filter(t => isWithinInterval(new Date(t.dateOpened), { start: monthStart, end: now }))
    .reduce((sum, t) => sum + t.premium * t.quantity, 0)

  const yearStart = startOfYear(now)
  const ytdPremium = trades
    .filter(t => isWithinInterval(new Date(t.dateOpened), { start: yearStart, end: now }))
    .reduce((sum, t) => sum + t.premium * t.quantity, 0)

  const weekStart = startOfWeek(now, { weekStartsOn: 1 })
  const weeklyPremium = trades
    .filter(t => isWithinInterval(new Date(t.dateOpened), { start: weekStart, end: now }))
    .reduce((sum, t) => sum + t.premium * t.quantity, 0)

  const callsPremium = trades
    .filter(t => t.type === 'covered_call')
    .reduce((sum, t) => sum + t.premium * t.quantity, 0)
  const putsPremium = trades
    .filter(t => t.type === 'cash_secured_put')
    .reduce((sum, t) => sum + t.premium * t.quantity, 0)

  const closedResolved = trades.filter(t => t.status === 'closed' || t.status === 'expired' || t.status === 'assigned')
  const keptPremium = closedResolved.filter(t => t.status === 'closed' || t.status === 'expired').length
  const winRate = closedResolved.length > 0 ? (keptPremium / closedResolved.length) * 100 : 0

  const averagePremium = trades.length > 0 ? totalPremium / trades.length : 0
  const avgPerContract = totalContracts > 0 ? totalPremium / totalContracts : 0

  return {
    totalPremium,
    totalBuybackCost,
    openTrades,
    closedTrades,
    monthlyPremium,
    averagePremium,
    ytdPremium,
    weeklyPremium,
    callsPremium,
    putsPremium,
    winRate,
    avgPerContract,
    totalContracts,
  }
}

export const formatCurrency = (amount: number): string => {
  if (typeof window !== 'undefined') {
    const p = getPreferences()
    const opts: Intl.NumberFormatOptions =
      p.currencyStyle === 'plain'
        ? { minimumFractionDigits: p.currencyDecimals, maximumFractionDigits: p.currencyDecimals }
        : { style: 'currency', currency: 'USD', minimumFractionDigits: p.currencyDecimals, maximumFractionDigits: p.currencyDecimals }
    return new Intl.NumberFormat('en-US', opts).format(amount)
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

export const formatDate = (dateString: string): string => {
  const fmt = typeof window !== 'undefined' ? getPreferences().dateFormat : 'MMM dd, yyyy'
  return format(new Date(dateString), fmt)
}

export const getPremiumByMonth = (trades: Trade[]): { month: string; premium: number }[] => {
  const byMonth: Record<string, number> = {}
  trades.forEach(t => {
    const key = format(new Date(t.dateOpened), 'yyyy-MM')
    byMonth[key] = (byMonth[key] || 0) + t.premium * t.quantity
  })
  return Object.entries(byMonth)
    .map(([month, premium]) => ({ month, premium }))
    .sort((a, b) => b.month.localeCompare(a.month))
    .slice(0, 12)
}

export const getPremiumBySymbol = (trades: Trade[]): { symbol: string; premium: number }[] => {
  const bySymbol: Record<string, number> = {}
  trades.forEach(t => {
    bySymbol[t.symbol] = (bySymbol[t.symbol] || 0) + t.premium * t.quantity
  })
  return Object.entries(bySymbol)
    .map(([symbol, premium]) => ({ symbol, premium }))
    .sort((a, b) => b.premium - a.premium)
    .slice(0, 10)
}
