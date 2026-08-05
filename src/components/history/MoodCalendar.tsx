import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MOOD_MAP } from '../../data/moods'
import type { MoodEntry, MoodType } from '../../types'
import {
  addMonths,
  endOfMonth,
  startOfMonth,
  toDateKey,
} from '../../utils/dates'

interface MoodCalendarProps {
  month: Date
  entries: MoodEntry[]
  selectedDate: string | null
  onMonthChange: (date: Date) => void
  onSelectDate: (dateKey: string) => void
}

export function MoodCalendar({
  month,
  entries,
  selectedDate,
  onMonthChange,
  onSelectDate,
}: MoodCalendarProps) {
  const start = startOfMonth(month)
  const end = endOfMonth(month)
  const startPad = start.getDay()
  const daysInMonth = end.getDate()
  const todayKey = toDateKey()

  const entryByDay = new Map<string, MoodEntry>()
  entries.forEach((entry) => {
    entryByDay.set(toDateKey(entry.createdAt), entry)
  })

  const cells: Array<{ key: string; day: number | null; entry?: MoodEntry }> = []
  for (let i = 0; i < startPad; i += 1) {
    cells.push({ key: `pad-${i}`, day: null })
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    const key = toDateKey(new Date(month.getFullYear(), month.getMonth(), day))
    cells.push({ key, day, entry: entryByDay.get(key) })
  }

  return (
    <div className="rounded-[28px] bg-surface p-4 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onMonthChange(addMonths(month, -1))}
          className="rounded-full bg-cream p-2"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h3 className="font-display text-xl text-forest">
          {month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
        </h3>
        <button
          type="button"
          onClick={() => onMonthChange(addMonths(month, 1))}
          className="rounded-full bg-cream p-2"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase tracking-wide text-muted">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell) => {
          if (cell.day === null) {
            return <div key={cell.key} className="aspect-square" />
          }
          const isToday = cell.key === todayKey
          const isSelected = cell.key === selectedDate
          const mood = cell.entry?.mood as MoodType | undefined
          const hasNote = Boolean(cell.entry?.note.trim())

          return (
            <button
              key={cell.key}
              type="button"
              onClick={() => onSelectDate(cell.key)}
              className={`relative aspect-square rounded-2xl text-sm font-medium transition ${
                isSelected
                  ? 'ring-2 ring-sage-deep'
                  : isToday
                    ? 'ring-1 ring-peach'
                    : ''
              }`}
              style={{
                backgroundColor: mood ? MOOD_MAP[mood].color : 'transparent',
              }}
              aria-label={`${cell.key}${mood ? `, mood ${MOOD_MAP[mood].label}` : ''}${hasNote ? ', has journal entry' : ''}`}
            >
              <span
                className={
                  mood ? 'text-forest/90' : 'text-forest-muted'
                }
              >
                {cell.day}
              </span>
              {hasNote ? (
                <span
                  className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-forest"
                  aria-hidden
                />
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}
