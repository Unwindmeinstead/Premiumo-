'use client'

import { useState } from 'react'
import { Cog, TrendingUp, FileDown, Calendar, CircleDot } from 'lucide-react'

export type AppView = 'dashboard' | 'metrics' | 'wheel' | 'calendar' | 'settings' | 'export' | 'compound' | 'masterclass'

interface SidebarProps {
  children: React.ReactNode
  activeView: AppView
  onNavigate: (view: AppView) => void
}

const navItems: { view: AppView; letter: string }[] = [
  { view: 'metrics', letter: 'M' },
  { view: 'wheel', letter: 'W' },
  { view: 'calendar', letter: 'C' },
  { view: 'settings', letter: 'S' },
  { view: 'export', letter: 'E' },
]

const cardSize = 'w-10 h-10 md:w-12 md:h-12'
const cardRadius = 'rounded-lg md:rounded-xl'
const cardBase = `${cardSize} ${cardRadius} font-bold text-base md:text-lg flex items-center justify-center shrink-0 border transition-all duration-200 ease-out touch-manipulation`

export default function Sidebar({ children, activeView, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  const handleLogoClick = () => {
    if (collapsed) {
      setCollapsed(false)
      onNavigate('dashboard')
    } else {
      setCollapsed(true)
    }
  }

  return (
    <>
      <aside className="fixed left-2 top-2 md:left-4 md:top-4 bg-dark-card border border-dark-border rounded-xl shadow-lg z-50 w-14 md:w-[72px] p-2 md:p-3 flex flex-col gap-3 hover:border-white/20 transition-all duration-200 ease-out">
        <button
          type="button"
          onClick={handleLogoClick}
          aria-label={collapsed ? 'Expand menu' : 'Collapse menu'}
          className={`${cardBase} ${
            activeView === 'dashboard'
              ? 'bg-green-600 text-white border-green-500'
              : 'bg-green-700 text-white border-green-600 hover:bg-green-600 hover:border-green-500 active:bg-green-800'
          }`}
        >
          <span className="inline-flex items-baseline leading-none text-inherit">
            <span className="text-xl md:text-2xl font-extrabold">P</span>
            <span className="text-xs md:text-sm font-semibold ml-0.5 align-top">+</span>
          </span>
        </button>
        {!collapsed && (
          <nav className="flex flex-col gap-3">
            {navItems.map(({ view, letter }) => (
            <button
              key={view}
              type="button"
              onClick={() => onNavigate(view)}
              aria-label={view}
              className={`${cardBase} ${
                activeView === view
                  ? 'bg-white text-black border-white/30'
                  : 'bg-dark-surface border-dark-border text-dark-muted hover:text-white hover:border-white/20 active:bg-dark-border'
              }`}
            >
              {view === 'metrics' && (
                <TrendingUp size={18} className="md:w-5 md:h-5 shrink-0" strokeWidth={2.5} />
              )}
              {view === 'wheel' && (
                <CircleDot size={18} className="md:w-5 md:h-5 shrink-0" strokeWidth={2.5} />
              )}
              {view === 'calendar' && (
                <Calendar size={18} className="md:w-5 md:h-5 shrink-0" strokeWidth={2.5} />
              )}
              {view === 'settings' && (
                <Cog size={18} className="md:w-5 md:h-5 shrink-0" strokeWidth={2.5} />
              )}
              {view === 'export' && (
                <FileDown size={18} className="md:w-5 md:h-5 shrink-0" strokeWidth={2.5} />
              )}
            </button>
          ))}
          </nav>
        )}
      </aside>

      <main className="ml-[60px] md:ml-[104px] min-w-0 h-screen overflow-y-auto overflow-x-hidden transition-all duration-200 ease-out">
        {children}
      </main>
    </>
  )
}
