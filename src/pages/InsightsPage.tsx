import { Flame, NotebookPen, Sprout } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { EmptyState } from '../components/common/EmptyState'
import { InsightCard } from '../components/insights/InsightCard'
import {
  MoodDistributionChart,
  MoodTrendChart,
} from '../components/insights/MoodChart'
import { useMoodBloom } from '../context/MoodBloomContext'
import { MOOD_MAP } from '../data/moods'
import { generateWeeklyReflection } from '../services/aiReflection'
import {
  buildWeekInsight,
  countJournalEntries,
  getEntriesInRange,
  getMoodDistribution,
  getMostFrequentMood,
  getWeeklyTrend,
} from '../utils/insights'

export function InsightsPage() {
  const { entries, garden } = useMoodBloom()
  const [aiNote, setAiNote] = useState('Gathering a gentle reflection…')

  const week = useMemo(() => getEntriesInRange(entries, 7), [entries])
  const topMood = getMostFrequentMood(week) ?? getMostFrequentMood(entries)
  const distribution = getMoodDistribution(week.length ? week : entries)
  const trend = getWeeklyTrend(entries)
  const reflections = countJournalEntries(entries)
  const weekInsight = buildWeekInsight(entries)
  const growthProgress = Math.min(100, (garden.totalCheckIns % 7) * (100 / 7))

  useEffect(() => {
    let active = true
    void generateWeeklyReflection(entries).then((text) => {
      if (active) setAiNote(text)
    })
    return () => {
      active = false
    }
  }, [entries])

  if (entries.length === 0) {
    return (
      <div className="space-y-5">
        <header>
          <h1 className="font-display text-3xl text-forest sm:text-4xl">Insights</h1>
          <p className="mt-1 text-sm text-muted">Patterns from your garden check-ins.</p>
        </header>
        <EmptyState
          icon="📊"
          title="No insights available yet"
          description="Complete a few check-ins and your weekly bloom patterns will appear here."
        />
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="font-display text-3xl text-forest sm:text-4xl">Insights</h1>
        <p className="mt-1 text-sm text-muted">
          A gentle look at how your week has been blooming.
        </p>
      </header>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <InsightCard
          title="Most frequent"
          value={topMood ? MOOD_MAP[topMood].label : '—'}
          detail={topMood ? MOOD_MAP[topMood].emoji : undefined}
        />
        <InsightCard
          title="Check-ins"
          value={garden.totalCheckIns}
          icon={<Sprout className="h-4 w-4 text-sage-deep" aria-hidden />}
        />
        <InsightCard
          title="Current streak"
          value={garden.currentStreak}
          icon={<Flame className="h-4 w-4 text-peach" aria-hidden />}
        />
        <InsightCard
          title="Longest streak"
          value={garden.longestStreak}
          detail={`${reflections} reflections`}
          icon={<NotebookPen className="h-4 w-4 text-lavender" aria-hidden />}
        />
      </section>

      <section className="rounded-[28px] bg-surface p-5 shadow-soft">
        <h2 className="font-display text-2xl text-forest">Your Week in Bloom</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{weekInsight}</p>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-[28px] bg-surface p-5 shadow-soft">
          <h2 className="mb-3 text-sm font-semibold text-forest">Mood distribution</h2>
          <MoodDistributionChart data={distribution} />
        </div>
        <div className="rounded-[28px] bg-surface p-5 shadow-soft">
          <h2 className="mb-3 text-sm font-semibold text-forest">Weekly mood trend</h2>
          <MoodTrendChart data={trend} />
        </div>
      </section>

      <section className="rounded-[28px] bg-surface p-5 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-forest">Plant growth progress</h2>
          <span className="text-xs text-muted">
            {garden.totalCheckIns % 7}/7 to next milestone
          </span>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-cream">
          <div
            className="h-full rounded-full bg-sage-deep transition-all"
            style={{ width: `${growthProgress || (garden.totalCheckIns > 0 ? 4 : 0)}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted">
          Level {garden.plantLevel} · {garden.unlockedItems.length} collection items unlocked
        </p>
      </section>

      <section className="rounded-[28px] bg-lavender-soft p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-forest-muted">
          AI-style reflection
        </p>
        <p className="mt-2 font-display text-xl leading-snug text-forest">
          {aiNote}
        </p>
        <p className="mt-3 text-xs text-muted">
          Placeholder reflection service — ready to connect to a real AI API later.
        </p>
      </section>

      <p className="text-center text-xs leading-relaxed text-muted">
        These insights are based only on your MoodBloom check-ins and are not medical
        or psychological assessments.
      </p>
    </div>
  )
}
