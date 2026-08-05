import { MOOD_MAP } from '../../data/moods'
import type { MoodEntry } from '../../types'
import { formatShortDate, formatTime } from '../../utils/dates'

interface HistoryEntryProps {
  entry: MoodEntry
  onEdit: (entry: MoodEntry) => void
  onDelete: (entry: MoodEntry) => void
}

export function HistoryEntryCard({ entry, onEdit, onDelete }: HistoryEntryProps) {
  const mood = MOOD_MAP[entry.mood]

  return (
    <article className="rounded-[28px] bg-surface p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-2xl" aria-hidden>
            {mood.emoji}
          </p>
          <h3 className="mt-1 font-display text-2xl text-forest">{mood.label}</h3>
          <p className="text-sm text-muted">
            {formatShortDate(entry.createdAt)} · {formatTime(entry.createdAt)}
          </p>
        </div>
        <span
          className="rounded-full px-3 py-1 text-xs font-semibold text-forest"
          style={{ backgroundColor: mood.color }}
        >
          {mood.growthLabel}
        </span>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Journal
          </p>
          <p className="mt-1 text-sm leading-relaxed text-forest">
            {entry.note.trim()
              ? entry.note
              : 'No written reflection for this day.'}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Voice note
          </p>
          {entry.voiceNoteUrl ? (
            <audio
              controls
              src={entry.voiceNoteUrl}
              className="mt-2 w-full"
              aria-label="Voice note"
            />
          ) : (
            <p className="mt-1 text-sm text-muted">
              No voice note saved. Cloud storage can be connected later.
            </p>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Prompt
          </p>
          <p className="mt-1 font-display text-base italic text-sage-deep">
            “{entry.reflectionPrompt}”
          </p>
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        <button
          type="button"
          onClick={() => onEdit(entry)}
          className="flex-1 rounded-2xl bg-sage-soft px-3 py-2.5 text-sm font-semibold text-sage-deep"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(entry)}
          className="flex-1 rounded-2xl bg-cream px-3 py-2.5 text-sm font-semibold text-forest-muted"
        >
          Delete
        </button>
      </div>
    </article>
  )
}
