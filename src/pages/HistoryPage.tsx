import { useMemo, useState } from 'react'
import { ConfirmationModal } from '../components/common/ConfirmationModal'
import { EmptyState } from '../components/common/EmptyState'
import { HistoryEntryCard } from '../components/history/HistoryEntry'
import { MoodCalendar } from '../components/history/MoodCalendar'
import { DailyCheckInModal } from '../components/checkin/DailyCheckInModal'
import { useMoodBloom } from '../context/MoodBloomContext'
import { MOOD_FILTERS, MOOD_MAP } from '../data/moods'
import type { MoodEntry, MoodType } from '../types'
import { toDateKey } from '../utils/dates'

export function HistoryPage() {
  const { entries, deleteEntry, hasCheckedInToday } = useMoodBloom()
  const [month, setMonth] = useState(new Date())
  const [filter, setFilter] = useState<'all' | MoodType>('all')
  const [selectedDate, setSelectedDate] = useState<string | null>(toDateKey())
  const [pendingDelete, setPendingDelete] = useState<MoodEntry | null>(null)
  const [editOpen, setEditOpen] = useState(false)

  const filtered = useMemo(() => {
    const list =
      filter === 'all' ? entries : entries.filter((e) => e.mood === filter)
    return [...list].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  }, [entries, filter])

  const selectedEntry = useMemo(
    () =>
      selectedDate
        ? entries.find((e) => toDateKey(e.createdAt) === selectedDate)
        : undefined,
    [entries, selectedDate],
  )

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-3xl text-forest sm:text-4xl">History</h1>
        <p className="mt-1 text-sm text-muted">
          Your emotional garden, day by day.
        </p>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {MOOD_FILTERS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              filter === id
                ? 'bg-sage-deep text-white'
                : 'bg-surface text-forest-muted shadow-soft'
            }`}
          >
            {id === 'all' ? 'All' : `${MOOD_MAP[id].emoji} ${MOOD_MAP[id].label}`}
          </button>
        ))}
      </div>

      {entries.length === 0 ? (
        <EmptyState
          icon="🌱"
          title="Your emotional garden is just beginning"
          description="Complete your first check-in to create a memory."
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <MoodCalendar
            month={month}
            entries={filtered}
            selectedDate={selectedDate}
            onMonthChange={setMonth}
            onSelectDate={setSelectedDate}
          />

          <div className="space-y-4">
            {selectedEntry ? (
              <HistoryEntryCard
                entry={selectedEntry}
                onEdit={(entry) => {
                  if (toDateKey(entry.createdAt) === toDateKey()) {
                    setEditOpen(true)
                  }
                }}
                onDelete={setPendingDelete}
              />
            ) : (
              <EmptyState
                title="No check-in this day"
                description="Select a colored day on the calendar, or complete today’s check-in from the garden."
              />
            )}

            {selectedEntry &&
            toDateKey(selectedEntry.createdAt) !== toDateKey() ? (
              <p className="text-xs text-muted">
                Editing is available for today’s check-in. Older entries can be deleted.
              </p>
            ) : null}

            {hasCheckedInToday ? null : (
              <p className="text-xs text-muted">
                Tip: today’s square is highlighted with a soft peach ring.
              </p>
            )}
          </div>
        </div>
      )}

      <ConfirmationModal
        open={Boolean(pendingDelete)}
        title="Delete this memory?"
        message="This removes the check-in and its growth element from your garden history on this device."
        confirmLabel="Delete"
        tone="danger"
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => {
          if (pendingDelete) deleteEntry(pendingDelete.id)
          setPendingDelete(null)
        }}
      />

      <DailyCheckInModal
        open={editOpen}
        forceEdit
        onClose={() => setEditOpen(false)}
      />
    </div>
  )
}
