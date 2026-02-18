'use client'

import { useState, useEffect, useRef } from 'react'
import { Cog, TrendingUp, FileDown, Calendar, CircleDot, Percent, Infinity as InfinityIcon } from 'lucide-react'

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
  { view: 'compound', letter: '%' },
  { view: 'masterclass', letter: '∞' },
]

const cardSize = 'w-10 h-10 md:w-12 md:h-12'
const cardRadius = 'rounded-lg md:rounded-xl'
const cardBase = `${cardSize} ${cardRadius} font-bold text-base md:text-lg flex items-center justify-center shrink-0 border transition-all duration-200 ease-out touch-manipulation`

const SWIPE_THRESHOLD = 40
const LEFT_EDGE_MAX = 28

function NavContent({
  activeView,
  onNavigate,
  onLogoClick,
  collapsed,
  setCollapsed,
  isDrawer,
  onNavItemClick,
}: {
  activeView: AppView
  onNavigate: (view: AppView) => void
  onLogoClick: () => void
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  isDrawer?: boolean
  onNavItemClick?: () => void
}) {
  const handleNav = (view: AppView) => {
    onNavigate(view)
    onNavItemClick?.()
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (isDrawer) {
            onNavigate('dashboard')
            onNavItemClick?.()
          } else {
            onLogoClick()
          }
        }}
        aria-label={isDrawer ? 'Dashboard' : collapsed ? 'Expand menu' : 'Collapse menu'}
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
      {(!collapsed || isDrawer) && (
        <nav className="flex flex-col gap-3">
          {navItems.map(({ view }) => (
            <button
              key={view}
              type="button"
              onClick={() => handleNav(view)}
              aria-label={view}
              className={`${cardBase} ${
                activeView === view
                  ? 'bg-white text-black border-white/30'
                  : 'bg-dark-surface border-dark-border text-dark-muted hover:text-white hover:border-white/20 active:bg-dark-border'
              }`}
            >
              {view === 'metrics' && <TrendingUp size={18} className="md:w-5 md:h-5 shrink-0" strokeWidth={2.5} />}
              {view === 'wheel' && <CircleDot size={18} className="md:w-5 md:h-5 shrink-0" strokeWidth={2.5} />}
              {view === 'calendar' && <Calendar size={18} className="md:w-5 md:h-5 shrink-0" strokeWidth={2.5} />}
              {view === 'settings' && <Cog size={18} className="md:w-5 md:h-5 shrink-0" strokeWidth={2.5} />}
              {view === 'export' && <FileDown size={18} className="md:w-5 md:h-5 shrink-0" strokeWidth={2.5} />}
              {view === 'compound' && <Percent size={18} className="md:w-5 md:h-5 shrink-0" strokeWidth={2.5} />}
              {view === 'masterclass' && <InfinityIcon size={18} className="md:w-5 md:h-5 shrink-0" strokeWidth={2.5} />}
            </button>
          ))}
        </nav>
      )}
    </>
  )
}

export default function Sidebar({ children, activeView, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const touchStart = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const set = () => setIsMobile(mq.matches)
    set()
    mq.addEventListener('change', set)
    return () => mq.removeEventListener('change', set)
  }, [])

  const handleLogoClick = () => {
    if (collapsed) {
      setCollapsed(false)
      onNavigate('dashboard')
    } else {
      setCollapsed(true)
    }
  }

  const handleLeftEdgeTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }

  const handleLeftEdgeTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX
    const endY = e.changedTouches[0].clientY
    const dx = endX - touchStart.current.x
    const dy = endY - touchStart.current.y
    if (touchStart.current.x <= LEFT_EDGE_MAX && dx > SWIPE_THRESHOLD && Math.abs(dy) < 80) {
      setDrawerOpen(true)
    }
  }

  const handleDrawerTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }

  const handleDrawerTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX
    const dx = endX - touchStart.current.x
    if (dx < -SWIPE_THRESHOLD) setDrawerOpen(false)
  }

  if (isMobile) {
    return (
      <>
        {/* Left-edge swipe zone: swipe right to open */}
        <div
          className="md:hidden fixed left-0 top-0 bottom-0 w-6 z-40 touch-manipulation"
          onTouchStart={handleLeftEdgeTouchStart}
          onTouchEnd={handleLeftEdgeTouchEnd}
          aria-hidden
        />
        {/* Backdrop when drawer open */}
        {drawerOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
            onClick={() => setDrawerOpen(false)}
            onTouchStart={handleDrawerTouchStart}
            onTouchEnd={handleDrawerTouchEnd}
            aria-hidden
          />
        )}
        {/* Drawer panel */}
        <aside
          className={`md:hidden fixed left-0 top-0 bottom-0 w-14 p-2 bg-dark-card border-r border-dark-border shadow-xl z-50 flex flex-col gap-3 transition-transform duration-200 ease-out ${
            drawerOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onTouchStart={handleDrawerTouchStart}
          onTouchEnd={handleDrawerTouchEnd}
        >
          <NavContent
            activeView={activeView}
            onNavigate={onNavigate}
            onLogoClick={handleLogoClick}
            collapsed={false}
            setCollapsed={setCollapsed}
            isDrawer
            onNavItemClick={() => setDrawerOpen(false)}
          />
        </aside>
        <main className="ml-0 md:ml-[104px] min-w-0 h-screen overflow-y-auto overflow-x-hidden transition-all duration-200 ease-out">
          {children}
        </main>
      </>
    )
  }

  return (
    <>
      <aside className="hidden md:flex fixed left-4 top-4 bg-dark-card border border-dark-border rounded-xl shadow-lg z-50 w-[72px] p-3 flex-col gap-3 hover:border-white/20 transition-all duration-200 ease-out">
        <NavContent
          activeView={activeView}
          onNavigate={onNavigate}
          onLogoClick={handleLogoClick}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </aside>
      <main className="ml-0 md:ml-[104px] min-w-0 h-screen overflow-y-auto overflow-x-hidden transition-all duration-200 ease-out">
        {children}
      </main>
    </>
  )
}
