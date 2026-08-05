import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DailyCheckInModal } from '../components/checkin/DailyCheckInModal'
import { StreakBadge } from '../components/common/StreakBadge'
import { PlantScene } from '../components/plant/PlantScene'
import { useMoodBloom } from '../context/MoodBloomContext'
import { MOOD_MAP } from '../data/moods'
import { GARDEN_QUOTES } from '../data/messages'
import { formatDisplayDate, greetingForHour } from '../utils/dates'

export function GardenPage() {
  const { user, garden, todayEntry, hasCheckedInToday } = useMoodBloom()
  const [checkInOpen, setCheckInOpen] = useState(false)
  const [forceEdit, setForceEdit] = useState(false)
  const quote = GARDEN_QUOTES[garden.totalCheckIns % GARDEN_QUOTES.length]
  const name = user?.name || 'Friend'

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted">{formatDisplayDate(new Date())}</p>
          <h1 className="mt-1 font-display text-3xl text-forest sm:text-4xl">
            {greetingForHour()}, {name}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {user?.gardenName || 'My Quiet Garden'}
          </p>
        </div>
        <StreakBadge streak={garden.currentStreak} />
      </header>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr] lg:items-start">
        <PlantScene
          garden={garden}
          atmosphere={todayEntry?.mood ?? null}
        />

        <aside className="space-y-4">
          <motion.div
            className="rounded-[28px] bg-surface p-5 shadow-soft"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">
              Latest mood
            </p>
            {todayEntry ? (
              <div className="mt-2 flex items-center gap-3">
                <span className="text-3xl" aria-hidden>
                  {MOOD_MAP[todayEntry.mood].emoji}
                </span>
                <div>
                  <p className="font-semibold text-forest">
                    {MOOD_MAP[todayEntry.mood].label}
                  </p>
                  <p className="text-xs text-muted">
                    {MOOD_MAP[todayEntry.mood].growthLabel}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-2 font-display text-xl text-forest">
                Your garden is waiting for today’s check-in.
              </p>
            )}
          </motion.div>

          <div className="rounded-[28px] bg-sage-soft/80 p-5">
            <p className="font-display text-xl italic text-forest">“{quote}”</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[24px] bg-peach-soft p-4">
              <p className="text-xs text-muted">Plant level</p>
              <p className="font-display text-2xl text-forest">{garden.plantLevel}</p>
            </div>
            <div className="rounded-[24px] bg-sky-soft p-4">
              <p className="text-xs text-muted">Check-ins</p>
              <p className="font-display text-2xl text-forest">{garden.totalCheckIns}</p>
            </div>
          </div>

          <Link
            to="/collection"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-cream-dark bg-surface px-4 py-3 text-sm font-semibold text-forest"
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            Garden collection
          </Link>
        </aside>
      </div>

      <div className="sticky bottom-24 z-20 lg:static lg:bottom-auto">
        <button
          type="button"
          onClick={() => {
            setForceEdit(false)
            setCheckInOpen(true)
          }}
          className="w-full rounded-[22px] bg-sage-deep px-5 py-4 text-sm font-semibold text-white shadow-soft transition hover:bg-forest"
        >
          {hasCheckedInToday
            ? 'Review today’s feeling'
            : 'How are you feeling today?'}
        </button>
        {hasCheckedInToday ? (
          <button
            type="button"
            onClick={() => {
              setForceEdit(true)
              setCheckInOpen(true)
            }}
            className="mt-2 w-full text-center text-sm font-semibold text-forest-muted"
          >
            Edit today’s check-in
          </button>
        ) : null}
      </div>

      <DailyCheckInModal
        open={checkInOpen}
        forceEdit={forceEdit}
        onClose={() => setCheckInOpen(false)}
      />
    </div>
  )
}
