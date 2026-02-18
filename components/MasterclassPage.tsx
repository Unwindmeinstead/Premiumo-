'use client'

import { useState } from 'react'

const cardBase =
  'bg-dark-card border border-white/10 rounded-lg sm:rounded-xl p-4 sm:p-5 hover:border-white/20 transition-colors'

const TABS = [
  { id: 'core', label: 'Core idea' },
  { id: 'puts', label: 'Cash-secured puts' },
  { id: 'calls', label: 'Covered calls' },
  { id: 'reading', label: 'Read options' },
  { id: 'wheel', label: 'The wheel' },
  { id: 'risk', label: 'Risk management' },
  { id: 'checklist', label: 'Mastery checklist' },
  { id: 'resources', label: 'Resources' },
] as const

type TabId = (typeof TABS)[number]['id']

export default function MasterclassPage() {
  const [activeTab, setActiveTab] = useState<TabId>('core')

  return (
    <div className="w-full max-w-3xl space-y-4 sm:space-y-5 pb-24 sm:pb-32">
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-white mb-1">Options Masterclass</h1>
        <p className="text-xs sm:text-sm text-dark-muted">
          A practical overview of covered calls, cash-secured puts, and key income strategies.
        </p>
      </div>

      {/* Tabs - above the content card */}
      <div className="flex gap-1 p-1 rounded-lg sm:rounded-xl bg-dark-surface border border-white/10 overflow-x-auto">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`shrink-0 px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors touch-manipulation whitespace-nowrap ${
              activeTab === id
                ? 'bg-white text-black'
                : 'text-dark-muted hover:text-white hover:bg-white/10'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Single section card based on active tab */}
      <div className="min-h-[200px]">
        {activeTab === 'core' && (
          <section className={cardBase}>
            <h2 className="text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3">
              Core idea: get paid for taking risk you understand
            </h2>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed">
              Options income focuses on <span className="text-white">selling options</span> rather than buying lottery tickets.
              You collect premium up front and get paid to take on specific obligations:
              either buying stock you&apos;re happy to own (puts) or selling stock you already own (calls).
            </p>
          </section>
        )}

        {activeTab === 'puts' && (
          <section className={cardBase}>
            <h2 className="text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3">
              Cash-secured puts: get paid to wait
            </h2>
            <ul className="text-xs sm:text-sm text-dark-muted space-y-1.5 leading-relaxed">
              <li>
                <span className="text-white font-medium">Setup</span>: You sell a put below the current price and keep enough cash
                to buy 100 shares if assigned.
              </li>
              <li>
                <span className="text-white font-medium">Best use</span>: Stocks you actually want to own at your strike price or lower.
              </li>
              <li>
                <span className="text-white font-medium">Outcomes</span>: If price stays above your strike, you keep the premium.
                If it drops below, you buy shares at the strike (effectively at a discount minus premium).
              </li>
              <li>
                <span className="text-white font-medium">Risk</span>: Stock can keep falling after assignment. Size positions so you
                can own the shares without panic-selling.
              </li>
            </ul>
          </section>
        )}

        {activeTab === 'calls' && (
          <section className={cardBase}>
            <h2 className="text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3">
              Covered calls: rent out stock you own
            </h2>
            <ul className="text-xs sm:text-sm text-dark-muted space-y-1.5 leading-relaxed">
              <li>
                <span className="text-white font-medium">Setup</span>: You own at least 100 shares and sell a call above the current price.
              </li>
              <li>
                <span className="text-white font-medium">Income</span>: You keep the premium no matter what, plus stock gains up to the strike.
              </li>
              <li>
                <span className="text-white font-medium">Trade-off</span>: If price rips far above your strike, your upside is capped
                because shares may be called away.
              </li>
              <li>
                <span className="text-white font-medium">Use case</span>: Neutral-to-slightly-bullish outlook where you&apos;re okay selling at the strike.
              </li>
            </ul>
          </section>
        )}

        {activeTab === 'reading' && (
          <section className={cardBase}>
            <h2 className="text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3">
              How to read options (option chain basics)
            </h2>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed mb-2">
              When you open an option chain for a stock, here’s what matters for selling covered calls and cash-secured puts:
            </p>
            <ul className="text-xs sm:text-sm text-dark-muted space-y-1.5 leading-relaxed">
              <li>
                <span className="text-white font-medium">Strike</span>: The price at which the option is exercised. For a put you sell, it’s the price you’d buy the stock if assigned. For a call you sell, it’s the price at which your shares can be called away.
              </li>
              <li>
                <span className="text-white font-medium">Expiration</span>: The date the option expires. After that, it’s worthless if not exercised. Shorter dates usually mean less premium but less time risk.
              </li>
              <li>
                <span className="text-white font-medium">Premium (bid / ask)</span>: The bid is what buyers are offering; when you sell, you typically get the bid or somewhere between bid and ask. The premium you receive is what you enter in P+.
              </li>
              <li>
                <span className="text-white font-medium">In-the-money (ITM) vs out-of-the-money (OTM)</span>: A call is OTM when the stock is below the strike (you sell these for covered calls). A put is OTM when the stock is above the strike (you sell these for cash-secured puts). OTM options expire worthless if the stock doesn’t cross the strike—you keep the premium.
              </li>
              <li>
                <span className="text-white font-medium">Contract size</span>: One option contract = 100 shares. Premium per share × 100 = cash you receive per contract. In P+ you enter premium per share and quantity (number of contracts).
              </li>
            </ul>
            <p className="text-[11px] sm:text-xs text-dark-muted mt-2">
              When you place a trade, match the strike, expiration, and premium (per share) to what you see in your broker’s option chain so P+ tracks your real positions.
            </p>
          </section>
        )}

        {activeTab === 'wheel' && (
          <section className={cardBase}>
            <h2 className="text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3">
              The wheel: combine CSPs and covered calls
            </h2>
            <ol className="list-decimal list-inside text-xs sm:text-sm text-dark-muted space-y-1.5 leading-relaxed">
              <li>Sell a cash-secured put on a stock you want.</li>
              <li>If assigned, you now own 100 shares at your strike.</li>
              <li>Sell covered calls against those shares to collect more premium.</li>
              <li>If called away, repeat from step 1 or move to a new stock.</li>
            </ol>
            <p className="text-[11px] sm:text-xs text-dark-muted mt-2">
              Track each leg in P+ so you see total premium and any buyback cost across the full cycle.
            </p>
          </section>
        )}

        {activeTab === 'risk' && (
          <section className={cardBase}>
            <h2 className="text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3">
              Risk management: how not to blow up
            </h2>
            <ul className="text-xs sm:text-sm text-dark-muted space-y-1.5 leading-relaxed">
              <li>Size trades so assignment is never a crisis (cash in account matches worst-case obligations).</li>
              <li>Avoid highly speculative names or events (earnings, binary catalysts) when selling premium.</li>
              <li>Use buyback cost in P+ to track when you&apos;re paying to exit early; keep those small versus total premium.</li>
              <li>Think in distributions and many trades, not single big bets.</li>
            </ul>
          </section>
        )}

        {activeTab === 'checklist' && (
          <section className={cardBase}>
            <h2 className="text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3">
              Mastery checklist
            </h2>
            <ul className="text-xs sm:text-sm text-dark-muted space-y-1.5 leading-relaxed">
              <li>Can you explain covered calls and cash-secured puts in plain language?</li>
              <li>Do you know exactly what happens on assignment for each trade in P+?</li>
              <li>Is every trade sized so you&apos;re comfortable owning 100 shares (puts) or selling 100 shares (calls)?</li>
              <li>Are you tracking total premium, buyback cost, and win rate over many trades?</li>
            </ul>
          </section>
        )}

        {activeTab === 'resources' && (
          <section className={cardBase}>
            <h2 className="text-sm sm:text-base font-semibold text-white mb-2 sm:mb-3">
              Deep dive resources
            </h2>
            <p className="text-xs sm:text-sm text-dark-muted leading-relaxed mb-2">
              For longer-form education, look for high-quality material on:
            </p>
            <ul className="text-xs sm:text-sm text-dark-muted space-y-1.5 leading-relaxed">
              <li>Broker education centers (Fidelity, Schwab, etc.) on covered calls and cash-secured puts.</li>
              <li>Risk-focused options books that emphasize position sizing and probability over prediction.</li>
              <li>Income strategies like credit spreads and iron condors once you&apos;ve mastered the basics.</li>
            </ul>
            <p className="text-[11px] sm:text-xs text-dark-muted mt-2">
              Always cross-check strategies with your broker&apos;s latest margin and assignment rules before trading.
            </p>
          </section>
        )}
      </div>
    </div>
  )
}
