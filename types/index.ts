export type TradeType = 'covered_call' | 'cash_secured_put'

export interface Trade {
  id: string
  type: TradeType
  symbol: string
  strike: number
  premium: number
  expiration: string
  quantity: number
  dateOpened: string
  dateClosed?: string
  status: 'open' | 'closed' | 'assigned' | 'expired'
  notes?: string
  /** Cost paid when closing early (buying back the option). Reduces net. */
  buybackCost?: number
}

export interface TradeStats {
  totalPremium: number
  /** Sum of buybackCost across all trades (money paid when closing early) */
  totalBuybackCost: number
  /** Premium received − cost to close (net) */
  netPremium: number
  openTrades: number
  closedTrades: number
  monthlyPremium: number
  averagePremium: number
  ytdPremium: number
  weeklyPremium: number
  callsPremium: number
  putsPremium: number
  winRate: number
  avgPerContract: number
  totalContracts: number
}

export type TradeStatus = Trade['status']
export type SortField = 'dateOpened' | 'expiration' | 'premium' | 'symbol' | 'totalPremium'
export type SortDir = 'asc' | 'desc'
