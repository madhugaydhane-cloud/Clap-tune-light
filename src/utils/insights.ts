import { MOOD_MAP } from '../data/moods'
import type { MoodEntry, MoodType } from '../types'
import { toDateKey } from './dates'

export function countJournalEntries(entries: MoodEntry[]): number {
  return entries.filter((entry) => entry.note.trim().length > 0).length
}

export function getMostFrequentMood(entries: MoodEntry[]): MoodType | null {
  if (entries.length === 0) return null
  const counts = entries.reduce<Record<string, number>>((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] ?? 0) + 1
    return acc
  }, {})
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as MoodType
}

export function getMoodDistribution(
  entries: MoodEntry[],
): Array<{ mood: MoodType; label: string; count: number; color: string }> {
  const moods: MoodType[] = [
    'happy',
    'calm',
    'excited',
    'tired',
    'stressed',
    'sad',
  ]
  return moods.map((mood) => ({
    mood,
    label: MOOD_MAP[mood].label,
    count: entries.filter((entry) => entry.mood === mood).length,
    color: MOOD_MAP[mood].color,
  }))
}

export function getEntriesInRange(
  entries: MoodEntry[],
  days: number,
): MoodEntry[] {
  const cutoff = new Date()
  cutoff.setHours(0, 0, 0, 0)
  cutoff.setDate(cutoff.getDate() - (days - 1))
  return entries.filter((entry) => new Date(entry.createdAt) >= cutoff)
}

export function getWeeklyTrend(
  entries: MoodEntry[],
): Array<{ day: string; score: number; mood: string }> {
  const moodScore: Record<MoodType, number> = {
    happy: 5,
    excited: 4,
    calm: 4,
    tired: 2,
    stressed: 1,
    sad: 1,
  }

  const days: Array<{ key: string; label: string }> = []
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push({
      key: toDateKey(d),
      label: d.toLocaleDateString(undefined, { weekday: 'short' }),
    })
  }

  return days.map(({ key, label }) => {
    const dayEntries = entries.filter(
      (entry) => toDateKey(entry.createdAt) === key,
    )
    if (dayEntries.length === 0) {
      return { day: label, score: 0, mood: 'none' }
    }
    const latest = dayEntries[dayEntries.length - 1]
    return {
      day: label,
      score: moodScore[latest.mood],
      mood: latest.mood,
    }
  })
}

export function buildWeekInsight(entries: MoodEntry[]): string {
  const week = getEntriesInRange(entries, 7)
  if (week.length === 0) {
    return 'Your week in bloom is waiting. Complete a check-in to begin noticing patterns.'
  }

  const top = getMostFrequentMood(week)
  const reflections = countJournalEntries(week)
  const weekend = week.filter((entry) => {
    const day = new Date(entry.createdAt).getDay()
    return day === 0 || day === 6
  })

  const moodLabel = top ? MOOD_MAP[top].label.toLowerCase() : 'varied'
  const reflectionNote =
    reflections >= 3
      ? weekend.length >= Math.ceil(reflections / 2)
        ? ' Your reflections also became more consistent toward the weekend.'
        : ' You took time to write reflections through the week.'
      : reflections > 0
        ? ' A few thoughtful notes appeared alongside your moods.'
        : ' Try adding a short note next time to deepen your garden memories.'

  return `You felt ${moodLabel} most often this week.${reflectionNote}`
}
