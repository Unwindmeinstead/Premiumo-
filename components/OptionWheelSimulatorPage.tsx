'use client'

import { useState, useMemo } from 'react'
import { formatCurrency } from '@/lib/utils'
import { CircleDot, ArrowDownCircle, ArrowUpCircle, Target, Info } from 'lucide-react'

const cardBase =
  'bg-dark-card border border-white/10 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-5 lg:p-6 hover:border-white/20 transition-colors'

const inputBase =
  'w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-white/40'

const labelBase = 'block text-xs md:text-sm font-medium text-dark-muted mb-1.5'

const CONTRACT_MULT = 100

export default function OptionWheelSimulatorPage() {
  const [stockPrice, setStockPrice] = useState('100')
  const [putStrike, setPutStrike] = useState('95')
  const [putPremium, setPutPremium] = useState('2.50')
  const [putContracts, setPutContracts] = useState('1')
  const [putDte, setPutDte] = useState('30')

  const [costBasis, setCostBasis] = useState('95')
  const [callStrike, setCallStrike] = useState('100')
  const [callPremium, setCallPremium] = useState('2.00')
  const [callContracts, setCallContracts] = useState('1')
  const [callDte, setCallDte] = useState('30')

  const results = useMemo(() => {
    const stock = parseFloat(stockPrice) || 0
    const pStrike = parseFloat(putStrike) || 0
    const pPrem = parseFloat(putPremium) || 0
    const pContracts = Math.max(0, Math.floor(parseFloat(putContracts) || 0))
    const pDte = Math.max(1, parseFloat(putDte) || 0)

    const basis = parseFloat(costBasis) || 0
    const cStrike = parseFloat(callStrike) || 0
    const cPrem = parseFloat(callPremium) || 0
    const cContracts = Math.max(0, Math.floor(parseFloat(callContracts) || 0))
    const cDte = Math.max(1, parseFloat(callDte) || 0)

    const putPremiumTotal = pPrem * CONTRACT_MULT * pContracts
    const putBreakEven = pStrike - pPrem
    const putMaxProfit = putPremiumTotal
    const assignedCostBasisPerShare = pStrike

    const callPremiumTotal = cPrem * CONTRACT_MULT * Math.min(cContracts, pContracts)
    const callBreakEven = cStrike + cPrem
    const shares = pContracts * CONTRACT_MULT
    const totalWheelPremium = putPremiumTotal + callPremiumTotal
    const basisForProfit = basis > 0 ? basis : pStrike
    const totalWheelProfitIfCalled = putPremiumTotal + callPremiumTotal + (cStrike - basisForProfit) * shares
    const effectiveCostBasisPerShare = pStrike - pPrem

    const totalDte = pDte + cDte
    const capitalAtRisk = pStrike * CONTRACT_MULT * pContracts
    const annualizedPct = capitalAtRisk > 0 && totalDte > 0
      ? (totalWheelProfitIfCalled / capitalAtRisk) * (365 / totalDte) * 100
      : 0

    return {
      putPremiumTotal,
      putBreakEven,
      putMaxProfit,
      assignedCostBasisPerShare: pStrike,
      callPremiumTotal,
      callBreakEven,
      effectiveCostBasisPerShare,
      totalWheelPremium,
      totalWheelProfitIfCalled,
      annualizedPct,
      capitalAtRisk,
      shares,
    }
  }, [stockPrice, putStrike, putPremium, putContracts, putDte, costBasis, callStrike, callPremium, callContracts, callDte])

  const syncCostBasisFromPut = () => setCostBasis(putStrike)

  return (
    <div className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto px-0 sm:px-1 space-y-4 sm:space-y-5 md:space-y-6 pb-24 sm:pb-28 md:pb-32 lg:pb-36">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="p-2 md:p-2.5 bg-dark-card border border-white/10 rounded-xl shrink-0">
          <CircleDot size={22} className="md:w-6 md:h-6 text-white" strokeWidth={2.5} />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-0.5">Option wheel simulator</h1>
          <p className="text-xs sm:text-sm text-dark-muted">Sell put → get assigned → sell call. See premiums and returns.</p>
        </div>
      </div>

      {/* How it works */}
      <section className={cardBase}>
        <div className="flex items-center gap-2 mb-2">
          <Info size={18} className="text-dark-muted shrink-0" />
          <h2 className="text-sm font-semibold text-white">How the wheel works</h2>
        </div>
        <ol className="text-xs sm:text-sm text-dark-muted space-y-1.5 list-decimal list-inside">
          <li><span className="text-white/90">Sell a cash-secured put</span> — collect premium; if stock closes below strike you’re assigned and buy shares.</li>
          <li><span className="text-white/90">Sell covered calls</span> on those shares — more premium; if stock closes above call strike, shares are called away.</li>
          <li>Repeat. This calculator shows break-evens and profit if the full cycle completes (assigned then called away).</li>
        </ol>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Step 1: Sell put */}
        <section className={cardBase}>
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <div className="p-1.5 md:p-2 bg-dark-surface rounded-lg">
              <ArrowDownCircle size={18} className="md:w-5 md:h-5 text-white" />
            </div>
            <h2 className="text-sm sm:text-base font-semibold text-white">Step 1: Sell cash-secured put</h2>
          </div>
          <div className="space-y-3 md:space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelBase}>Stock price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={stockPrice}
                  onChange={e => setStockPrice(e.target.value)}
                  className={inputBase}
                />
              </div>
              <div>
                <label className={labelBase}>Put strike ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={putStrike}
                  onChange={e => setPutStrike(e.target.value)}
                  className={inputBase}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelBase}>Premium per share ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={putPremium}
                  onChange={e => setPutPremium(e.target.value)}
                  className={inputBase}
                />
              </div>
              <div>
                <label className={labelBase}>Contracts</label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={putContracts}
                  onChange={e => setPutContracts(e.target.value)}
                  className={inputBase}
                />
              </div>
            </div>
            <div>
              <label className={labelBase}>Days to expiration (optional)</label>
              <input
                type="number"
                step="1"
                min="1"
                value={putDte}
                onChange={e => setPutDte(e.target.value)}
                className={inputBase}
              />
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5">
            <p className="text-xs text-dark-muted">Put premium: <span className="text-white font-medium">{formatCurrency(results.putPremiumTotal)}</span></p>
            <p className="text-xs text-dark-muted">Break-even (expiration): <span className="text-white font-medium">${results.putBreakEven.toFixed(2)}</span></p>
            <p className="text-xs text-dark-muted">If assigned, cost basis: <span className="text-white font-medium">${results.assignedCostBasisPerShare.toFixed(2)}/share</span></p>
          </div>
        </section>

        {/* Step 2: Sell call */}
        <section className={cardBase}>
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <div className="p-1.5 md:p-2 bg-dark-surface rounded-lg">
              <ArrowUpCircle size={18} className="md:w-5 md:h-5 text-white" />
            </div>
            <h2 className="text-sm sm:text-base font-semibold text-white">Step 2: Sell covered call</h2>
          </div>
          <div className="space-y-3 md:space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className={labelBase}>Cost basis per share ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={costBasis}
                  onChange={e => setCostBasis(e.target.value)}
                  className={inputBase}
                />
              </div>
              <button
                type="button"
                onClick={syncCostBasisFromPut}
                className="mt-6 shrink-0 px-2 py-1.5 rounded-lg bg-dark-surface border border-dark-border text-xs text-dark-muted hover:text-white"
              >
                = Put strike
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelBase}>Call strike ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={callStrike}
                  onChange={e => setCallStrike(e.target.value)}
                  className={inputBase}
                />
              </div>
              <div>
                <label className={labelBase}>Premium per share ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={callPremium}
                  onChange={e => setCallPremium(e.target.value)}
                  className={inputBase}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelBase}>Contracts</label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={callContracts}
                  onChange={e => setCallContracts(e.target.value)}
                  className={inputBase}
                />
              </div>
              <div>
                <label className={labelBase}>Days to expiration</label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={callDte}
                  onChange={e => setCallDte(e.target.value)}
                  className={inputBase}
                />
              </div>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5">
            <p className="text-xs text-dark-muted">Call premium: <span className="text-white font-medium">{formatCurrency(results.callPremiumTotal)}</span></p>
            <p className="text-xs text-dark-muted">Break-even (expiration): <span className="text-white font-medium">${results.callBreakEven.toFixed(2)}</span></p>
          </div>
        </section>
      </div>

      {/* Full wheel summary */}
      <section className={`${cardBase} border-white/20`}>
        <div className="flex items-center gap-2 mb-3 md:mb-4">
          <div className="p-1.5 md:p-2 bg-dark-surface rounded-lg">
            <Target size={18} className="md:w-5 md:h-5 text-white" />
          </div>
          <h2 className="text-sm sm:text-base font-semibold text-white">Full wheel outcome (if called away)</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-[10px] sm:text-xs text-dark-muted uppercase tracking-wide mb-0.5">Total premium</p>
            <p className="text-lg sm:text-xl font-bold text-white">{formatCurrency(results.totalWheelPremium)}</p>
          </div>
          <div>
            <p className="text-[10px] sm:text-xs text-dark-muted uppercase tracking-wide mb-0.5">Total profit</p>
            <p className="text-lg sm:text-xl font-bold text-green-400">{formatCurrency(results.totalWheelProfitIfCalled)}</p>
          </div>
          <div>
            <p className="text-[10px] sm:text-xs text-dark-muted uppercase tracking-wide mb-0.5">Capital at risk</p>
            <p className="text-sm sm:text-base font-medium text-white">{formatCurrency(results.capitalAtRisk)}</p>
          </div>
          <div>
            <p className="text-[10px] sm:text-xs text-dark-muted uppercase tracking-wide mb-0.5">Annualized return</p>
            <p className="text-lg sm:text-xl font-bold text-white">{results.annualizedPct.toFixed(1)}%</p>
          </div>
        </div>
        <p className="text-[10px] sm:text-xs text-dark-muted mt-3">
          Assumes: put assigned at strike, then call assigned at call strike. Effective cost basis (after put premium): ${results.effectiveCostBasisPerShare.toFixed(2)}/share.
        </p>
      </section>
    </div>
  )
}
