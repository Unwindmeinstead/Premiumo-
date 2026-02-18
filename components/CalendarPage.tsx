'use client'

import { useState, useMemo } from 'react'
import { Trade } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import {
  format,
  startOfMonth,
  startOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
  eachDayOfInterval,
  endOfMonth,
} from 'date-fns'
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'

const cardBase =
  'bg-dark-card border border-white/10 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-5 lg:p-6 hover:border-white/20 transition-colors'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface CalendarPageProps {
  trades: Trade[]
}

type DayActivity = { opened: Trade[]; expiring: Trade[]; openedPremium: number; expiringPremium: number }

export default function CalendarPage({ trades }: CalendarPageProps) {
  const [currentMonth, setCurrentMonth] = useState(() => new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 })
    const end = addDays(start, 41)
    return eachDayOfInterval({ start, end })
  }, [currentMonth])

  const activityByDay = useMemo(() => {
    const map = new Map<string, DayActivity>()
    trades.forEach((t) => {
      const opened = t.dateOpened
      const exp = t.expiration
      const openPremium = t.premium * t.quantity
      const add = (dateStr: string, type: 'opened' | 'expiring', trade: Trade, premium: number) => {
        const key = dateStr
        if (!map.has(key)) map.set(key, { opened: [], expiring: [], openedPremium: 0, expiringPremium: 0 })
        const a = map.get(key)!
        if (type === 'opened') {
          a.opened.push(trade)
          a.openedPremium += premium
        } else {
          a.expiring.push(trade)
          a.expiringPremium += premium
        }
      }
      add(opened, 'opened', t, openPremium)
      if (exp !== opened) add(exp, 'expiring', t, 0)
    })
    return map
  }, [trades])

  const selectedDayActivity = selectedDate
    ? activityByDay.get(format(selectedDate, 'yyyy-MM-dd'))
    : null

  return (
    <div className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto px-0 sm:px-1 space-y-4 sm:space-y-5 md:space-y-6 pb-24 sm:pb-28 md:pb-32 lg:pb-36">
      <div className="flex items-center justify-between gap-2 md:gap-3">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="p-2 md:p-2.5 bg-dark-card border border-white/10 rounded-xl shrink-0">
            <CalendarIcon size={20} className="md:w-6 md:h-6 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-0.5">Calendar</h1>
            <p className="text-xs sm:text-sm text-dark-muted">Trades by open and expiration date</p>
          </div>
        </div>
      </div>

      <section className={cardBase}>
        {/* Month nav */}
        <div className="flex items-center justify-between mb-3 sm:mb-4 md:mb-4">
          <button
            type="button"
            onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
            className="p-2 rounded-lg text-dark-muted hover:text-white hover:bg-dark-surface transition-colors touch-manipulation"
            aria-label="Previous month"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-sm sm:text-base md:text-lg font-semibold text-white capitalize">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <button
            type="button"
            onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
            className="p-2 rounded-lg text-dark-muted hover:text-white hover:bg-dark-surface transition-colors touch-manipulation"
            aria-label="Next month"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-px mb-1 md:mb-2">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="text-center text-[10px] sm:text-xs md:text-sm font-medium text-dark-muted py-1 md:py-1.5"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5 md:gap-2">
          {calendarDays.map((day) => {
            const key = format(day, 'yyyy-MM-dd')
            const activity = activityByDay.get(key)
            const isCurrentMonth = isSameMonth(day, currentMonth)
            const isSelected = selectedDate && isSameDay(day, selectedDate)
            const today = isToday(day)

            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedDate(day)}
                className={`min-h-[56px] sm:min-h-[72px] md:min-h-[80px] lg:min-h-[88px] rounded-lg sm:rounded-md p-1 sm:p-1.5 md:p-2 text-left flex flex-col transition-colors touch-manipulation ${
                  !isCurrentMonth
                    ? 'text-dark-muted/60 bg-dark-surface/30'
                    : isSelected
                      ? 'bg-white text-black ring-2 ring-white'
                      : today
                        ? 'bg-white/10 text-white border border-white/20'
                        : 'text-white bg-dark-surface hover:bg-white/10'
                }`}
              >
                <span className={`text-xs sm:text-sm md:text-base font-medium ${!isCurrentMonth ? 'opacity-70' : ''}`}>
                  {format(day, 'd')}
                </span>
                {activity && (activity.opened.length > 0 || activity.expiring.length > 0) && (
                  <div className="mt-0.5 flex flex-col gap-0.5 overflow-hidden">
                    {activity.opened.length > 0 && (
                      <span className="text-[9px] sm:text-[10px] md:text-xs leading-tight truncate" title={`Opened: ${formatCurrency(activity.openedPremium)}`}>
                        ↑{activity.opened.length} {formatCurrency(activity.openedPremium)}
                      </span>
                    )}
                    {activity.expiring.length > 0 && (
                      <span className="text-[9px] sm:text-[10px] md:text-xs leading-tight truncate text-red-300/90" title="Expiring">
                        ↓{activity.expiring.length}
                      </span>
                    )}
                  </div>
                )}
              </button>
            )
          })}
        </div>

        <p className="text-[10px] sm:text-xs md:text-sm text-dark-muted mt-2 md:mt-3">
          ↑ opened · ↓ expiring. Tap a day to see trades.
        </p>
      </section>

      {/* Selected day detail */}
      {selectedDate && (
        <section className={cardBase}>
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-2 md:mb-3">
            {format(selectedDate, 'EEEE, MMM d, yyyy')}
          </h3>
          {selectedDayActivity && (selectedDayActivity.opened.length > 0 || selectedDayActivity.expiring.length > 0) ? (
            <div className="space-y-3 md:space-y-4">
              {selectedDayActivity.opened.length > 0 && (
                <div>
                  <p className="text-xs sm:text-sm font-medium text-dark-muted mb-1.5 md:mb-2">Opened</p>
                  <ul className="space-y-1.5 md:space-y-2">
                    {selectedDayActivity.opened.map((t) => (
                      <li
                        key={t.id}
                        className="flex justify-between items-center text-xs sm:text-sm md:text-base py-1.5 md:py-2 px-2 md:px-3 rounded-lg bg-dark-surface"
                      >
                        <span className="font-medium text-white">{t.symbol}</span>
                        <span className="text-dark-muted">
                          {t.type === 'covered_call' ? 'Call' : 'Put'} · {formatCurrency(t.premium * t.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-[10px] text-dark-muted mt-1">
                    Total opened: {formatCurrency(selectedDayActivity.openedPremium)}
                  </p>
                </div>
              )}
              {selectedDayActivity.expiring.length > 0 && (
                <div>
                  <p className="text-xs sm:text-sm font-medium text-dark-muted mb-1.5 md:mb-2">Expiring</p>
                  <ul className="space-y-1.5 md:space-y-2">
                    {selectedDayActivity.expiring.map((t) => (
                      <li
                        key={t.id}
                        className="flex justify-between items-center text-xs sm:text-sm md:text-base py-1.5 md:py-2 px-2 md:px-3 rounded-lg bg-dark-surface"
                      >
                        <span className="font-medium text-white">{t.symbol}</span>
                        <span className="text-dark-muted">
                          {t.type === 'covered_call' ? 'Call' : 'Put'} · {formatCurrency(t.premium * t.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm md:text-base text-dark-muted">No trades opened or expiring on this day.</p>
          )}
        </section>
      )}
    </div>
  )
}
