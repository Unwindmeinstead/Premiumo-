'use client'

import { Cog, TrendingUp, FileDown, Calendar, CircleDot, Percent, Infinity as InfinityIcon } from 'lucide-react'

export type AppView = 'dashboard' | 'metrics' | 'wheel' | 'calendar' | 'settings' | 'export' | 'compound' | 'masterclass'

interface SidebarProps {
  children: React.ReactNode
  activeView: AppView
  onNavigate: (view: AppView) => void
}

const navItems: { view: AppView }[] = [
  { view: 'metrics' },
  { view: 'calendar' },
  { view: 'settings' },
  { view: 'export' },
  { view: 'wheel' },
  { view: 'compound' },
  { view: 'masterclass' },
]

const btnSize = 'w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-xl flex items-center justify-center border transition-all duration-200 ease-out touch-manipulation'
const iconSize = 20

export default function Sidebar({ children, activeView, onNavigate }: SidebarProps) {
  return (
    <>
      <main
        className="min-w-0 flex-1 min-h-0 overflow-y-auto overflow-x-hidden w-full transition-all duration-200 ease-out"
        style={{
          paddingTop: 'max(0.75rem, env(safe-area-inset-top))',
          paddingBottom: 'max(5.5rem, env(safe-area-inset-bottom))',
          boxSizing: 'border-box',
        }}
      >
        {children}
      </main>

      {/* Floating bottom bar: P+ left, rest scrollable left-to-right */}
      <nav
        className="fixed left-0 right-0 bottom-0 z-50 flex items-center gap-2 px-2 sm:px-3 py-2 bg-dark-card/95 border-t border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.3)]"
        style={{
          paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
          paddingLeft: 'max(0.5rem, env(safe-area-inset-left))',
          paddingRight: 'max(0.5rem, env(safe-area-inset-right))',
        }}
      >
        {/* P+ on the left */}
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          aria-label="Dashboard"
          className={`${btnSize} ${
            activeView === 'dashboard'
              ? 'bg-green-600 text-white border-green-500'
              : 'bg-green-700 text-white border-green-600 hover:bg-green-600 hover:border-green-500 active:bg-green-800 border'
          }`}
        >
          <span className="inline-flex items-baseline leading-none text-inherit">
            <span className="text-xl sm:text-2xl font-extrabold">P</span>
            <span className="text-xs sm:text-sm font-semibold ml-0.5 align-top">+</span>
          </span>
        </button>

        {/* Scrollable row of the rest */}
        <div className="flex-1 min-w-0 overflow-x-auto overflow-y-hidden flex items-center gap-2 py-0.5 scrollbar-hide">
          {navItems.map(({ view }) => (
            <button
              key={view}
              type="button"
              onClick={() => onNavigate(view)}
              aria-label={view === 'masterclass' ? 'Options masterclass' : view}
              className={`${btnSize} ${
                activeView === view
                  ? 'bg-white text-black border-white/30'
                  : 'bg-dark-surface border-dark-border text-dark-muted hover:text-white hover:border-white/20 active:bg-dark-border border'
              }`}
            >
              {view === 'metrics' && <TrendingUp size={iconSize} className="shrink-0" strokeWidth={2.5} />}
              {view === 'wheel' && <CircleDot size={iconSize} className="shrink-0" strokeWidth={2.5} />}
              {view === 'calendar' && <Calendar size={iconSize} className="shrink-0" strokeWidth={2.5} />}
              {view === 'settings' && <Cog size={iconSize} className="shrink-0" strokeWidth={2.5} />}
              {view === 'export' && <FileDown size={iconSize} className="shrink-0" strokeWidth={2.5} />}
              {view === 'compound' && <Percent size={iconSize} className="shrink-0" strokeWidth={2.5} />}
              {view === 'masterclass' && <InfinityIcon size={iconSize} className="shrink-0" strokeWidth={2.5} />}
            </button>
          ))}
        </div>
      </nav>
    </>
  )
}
