'use client'

import { useState, useRef, useEffect } from 'react'
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
import { ChevronLeft, ChevronRight } from 'lucide-react'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface DatePickerProps {
  value: string
  onChange: (date: string) => void
  label?: string
  required?: boolean
}

export default function DatePicker({ value, onChange, label, required }: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(() => {
    return value ? new Date(value) : new Date()
  })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (value) {
      setCurrentMonth(new Date(value))
    }
  }, [value])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const selectedDate = value ? new Date(value) : null
  const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 })
  const end = addDays(start, 41) // 6 weeks * 7 days - 1
  const calendarDays = eachDayOfInterval({ start, end })

  const handleDateSelect = (date: Date) => {
    onChange(format(date, 'yyyy-MM-dd'))
    setIsOpen(false)
  }

  const displayValue = value ? format(new Date(value), 'MMM dd, yyyy') : ''

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="block text-xs font-medium text-dark-muted mb-1">{label}</label>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-dark-surface border border-dark-border rounded-lg px-3 py-2 text-sm text-white placeholder:text-dark-muted focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-transparent transition-all text-left flex items-center justify-between"
      >
        <span className={value ? 'text-white' : 'text-dark-muted'}>
          {displayValue || 'Select date'}
        </span>
        <ChevronRight size={16} className={`text-dark-muted transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 left-1/2 -translate-x-1/2 bg-dark-card border border-white/10 rounded-lg shadow-2xl p-3 w-[280px] sm:w-[300px] animate-view-in">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="p-1.5 rounded-lg hover:bg-dark-surface text-dark-muted hover:text-white transition-colors touch-manipulation"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>
            <h3 className="text-sm font-semibold text-white">
              {format(currentMonth, 'MMMM yyyy')}
            </h3>
            <button
              type="button"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-1.5 rounded-lg hover:bg-dark-surface text-dark-muted hover:text-white transition-colors touch-manipulation"
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="text-center text-[10px] font-medium text-dark-muted py-1"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day) => {
              const isCurrentMonth = isSameMonth(day, currentMonth)
              const isSelected = selectedDate && isSameDay(day, selectedDate)
              const isTodayDate = isToday(day)

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => handleDateSelect(day)}
                  className={`min-h-[32px] rounded-md text-xs font-medium transition-colors touch-manipulation ${
                    !isCurrentMonth
                      ? 'text-dark-muted/30'
                      : isSelected
                      ? 'bg-white text-black'
                      : isTodayDate
                      ? 'bg-dark-surface text-white border border-white/20'
                      : 'text-white hover:bg-dark-surface'
                  }`}
                >
                  {format(day, 'd')}
                </button>
              )
            })}
          </div>

          {/* Quick actions */}
          <div className="mt-3 pt-3 border-t border-white/10 flex gap-2">
            <button
              type="button"
              onClick={() => {
                const today = new Date()
                handleDateSelect(today)
              }}
              className="flex-1 px-2 py-1.5 text-xs font-medium rounded-lg bg-dark-surface text-white hover:bg-white hover:text-black transition-colors touch-manipulation"
            >
              Today
            </button>
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange('')
                  setIsOpen(false)
                }}
                className="px-2 py-1.5 text-xs font-medium rounded-lg border border-dark-border text-dark-muted hover:text-white hover:border-white/20 transition-colors touch-manipulation"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
