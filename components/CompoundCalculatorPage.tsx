'use client'

import { useState, useMemo } from 'react'
import { formatCurrency } from '@/lib/utils'

const cardBase =
  'bg-dark-card border border-white/10 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-5 lg:p-6 hover:border-white/20 transition-colors'

const inputBase =
  'w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-white/40'

const labelBase = 'block text-xs md:text-sm font-medium text-dark-muted mb-1.5'

export default function CompoundCalculatorPage() {
  const [principal, setPrincipal] = useState<string>('10000')
  const [ratePct, setRatePct] = useState<string>('5')
  const [years, setYears] = useState<string>('10')
  const [frequency, setFrequency] = useState<number>(12)
  const [contribution, setContribution] = useState<string>('0')
  const [contributionFreq, setContributionFreq] = useState<number>(12)
  const [inflationPct, setInflationPct] = useState<string>('')
  const [taxRatePct, setTaxRatePct] = useState<string>('')

  const { result, yearRows } = useMemo(() => {
    const P = parseFloat(principal) || 0
    const r = (parseFloat(ratePct) || 0) / 100
    const t = Math.min(50, Math.max(0.1, parseFloat(years) || 0))
    const contribPerPeriod = Math.max(0, parseFloat(contribution) || 0)
    const inf = (parseFloat(inflationPct) || 0) / 100
    const tax = (parseFloat(taxRatePct) || 0) / 100

    if (P <= 0 && contribPerPeriod <= 0) return { result: null, yearRows: [] }

    let balance = P
    const rows: { year: number; balance: number; interest: number }[] = []
    const periodsPerYear = frequency
    const contribPeriodsPerYear = contributionFreq
    const periodsBetweenContrib = frequency / contribPeriodsPerYear
    let totalContribAdded = 0

    for (let y = 1; y <= Math.ceil(t); y++) {
      let yearInterest = 0
      const periodsThisYear = y < Math.ceil(t)
        ? periodsPerYear
        : Math.round((t - (y - 1)) * periodsPerYear)

      for (let i = 0; i < periodsThisYear; i++) {
        const periodInterest = (balance * r) / frequency
        balance += periodInterest
        yearInterest += periodInterest
        if (contribPerPeriod > 0 && (i % Math.max(1, Math.floor(periodsBetweenContrib)) === 0)) {
          balance += contribPerPeriod
          totalContribAdded += contribPerPeriod
        }
      }

      rows.push({ year: y, balance, interest: yearInterest })
    }

    const last = rows[rows.length - 1]
    if (!last) return { result: null, yearRows: [] }

    const interestEarned = last.balance - P - totalContribAdded
    const realValue = inf > 0 ? last.balance / Math.pow(1 + inf, t) : null
    const afterTaxInterest = tax > 0 ? interestEarned * (1 - tax) : null
    const afterTaxValue = tax > 0 ? P + totalContribAdded + (afterTaxInterest ?? 0) : null

    return {
      result: {
        futureValue: last.balance,
        interest: interestEarned,
        totalContributions: totalContribAdded,
        realValue,
        afterTaxValue,
        afterTaxInterest: afterTaxInterest ?? undefined,
      },
      yearRows: rows,
    }
  }, [principal, ratePct, years, frequency, contribution, contributionFreq, inflationPct, taxRatePct])

  return (
    <div className="w-full max-w-md md:max-w-2xl lg:max-w-5xl mx-auto px-0 sm:px-1 space-y-4 sm:space-y-5 md:space-y-6 pb-24 sm:pb-28 md:pb-32 lg:pb-36">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="p-2 md:p-2.5 bg-dark-card border border-white/10 rounded-xl font-bold text-lg md:text-xl text-white shrink-0">
          %
        </div>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-0.5">Compound interest</h1>
          <p className="text-xs sm:text-sm text-dark-muted">Principal, contributions, inflation &amp; tax</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Inputs */}
        <div className="space-y-4 sm:space-y-5">
          <section className={cardBase}>
            <h2 className="text-sm md:text-base font-semibold text-white mb-3 md:mb-4">Basics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className={labelBase}>Principal ($)</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  className={inputBase}
                />
              </div>
              <div>
                <label className={labelBase}>Annual rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={ratePct}
                  onChange={(e) => setRatePct(e.target.value)}
                  className={inputBase}
                />
              </div>
              <div>
                <label className={labelBase}>Years</label>
                <input
                  type="number"
                  min="0.1"
                  max="50"
                  step="1"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  className={inputBase}
                />
              </div>
              <div>
                <label className={labelBase}>Compound frequency</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(Number(e.target.value))}
                  className={inputBase}
                >
                  <option value={1}>Yearly</option>
                  <option value={4}>Quarterly</option>
                  <option value={12}>Monthly</option>
                  <option value={365}>Daily</option>
                </select>
              </div>
            </div>
          </section>

          <section className={cardBase}>
            <h2 className="text-sm md:text-base font-semibold text-white mb-3 md:mb-4">Contributions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className={labelBase}>Amount per period ($)</label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={contribution}
                  onChange={(e) => setContribution(e.target.value)}
                  className={inputBase}
                />
              </div>
              <div>
                <label className={labelBase}>Frequency</label>
                <select
                  value={contributionFreq}
                  onChange={(e) => setContributionFreq(Number(e.target.value))}
                  className={inputBase}
                >
                  <option value={12}>Monthly</option>
                  <option value={4}>Quarterly</option>
                  <option value={1}>Yearly</option>
                </select>
              </div>
            </div>
          </section>

          <section className={cardBase}>
            <h2 className="text-sm md:text-base font-semibold text-white mb-3 md:mb-4">Optional</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className={labelBase}>Inflation (%/year)</label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  placeholder="0"
                  value={inflationPct}
                  onChange={(e) => setInflationPct(e.target.value)}
                  className={inputBase}
                />
              </div>
              <div>
                <label className={labelBase}>Tax rate (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  placeholder="0"
                  value={taxRatePct}
                  onChange={(e) => setTaxRatePct(e.target.value)}
                  className={inputBase}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Results + table */}
        <div className="space-y-4 sm:space-y-5 flex flex-col">
          {result && (
            <>
              <section className={cardBase}>
                <h2 className="text-sm md:text-base font-semibold text-white mb-3 md:mb-4">Result</h2>
                <div className="space-y-2 md:space-y-3 text-sm md:text-base">
                  <div className="flex justify-between items-baseline">
                    <span className="text-dark-muted">Future value</span>
                    <span className="font-semibold text-white">{formatCurrency(result.futureValue)}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-dark-muted">Interest earned</span>
                    <span className="font-semibold text-white">{formatCurrency(result.interest)}</span>
                  </div>
                  {result.afterTaxValue != null && (
                    <div className="flex justify-between items-baseline text-dark-muted">
                      <span>After tax (est.)</span>
                      <span>{formatCurrency(result.afterTaxValue)}</span>
                    </div>
                  )}
                  {result.realValue != null && (
                    <div className="flex justify-between items-baseline text-dark-muted">
                      <span>In today&apos;s $</span>
                      <span>{formatCurrency(result.realValue)}</span>
                    </div>
                  )}
                </div>
              </section>

              <section className={`${cardBase} flex-1 min-h-0`}>
                <h2 className="text-sm md:text-base font-semibold text-white mb-2 md:mb-3">Year-by-year</h2>
                <div className="overflow-x-auto -mx-1 px-1 overflow-y-auto max-h-[280px] sm:max-h-[320px] md:max-h-[360px]">
                  <table className="w-full text-xs md:text-sm border-collapse">
                    <thead>
                      <tr className="text-dark-muted border-b border-dark-border">
                        <th className="text-left py-1.5 md:py-2 font-medium">Year</th>
                        <th className="text-right py-1.5 md:py-2 font-medium">Balance</th>
                        <th className="text-right py-1.5 md:py-2 font-medium">Interest</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yearRows.map((row) => (
                        <tr key={row.year} className="border-b border-dark-border/50">
                          <td className="py-1.5 md:py-2 text-white">{row.year}</td>
                          <td className="py-1.5 md:py-2 text-right text-white">{formatCurrency(row.balance)}</td>
                          <td className="py-1.5 md:py-2 text-right text-dark-muted">{formatCurrency(row.interest)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
