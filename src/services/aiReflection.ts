import { MOOD_MAP } from '../data/moods'
import type { MoodEntry, MoodType } from '../types'
import { getMostFrequentMood, getEntriesInRange } from '../utils/insights'

/**
 * Mock AI reflection service.
 * Structure is ready for a real LLM/API later (OpenAI, Supabase Edge Function, etc.).
 */
export async function generateWeeklyReflection(
  entries: MoodEntry[],
): Promise<string> {
  // Simulate network latency for future API swap
  await new Promise((resolve) => setTimeout(resolve, 250))

  const week = getEntriesInRange(entries, 7)
  if (week.length === 0) {
    return 'When you begin checking in, MoodBloom will notice patterns and offer gentle reflections here.'
  }

  const top = getMostFrequentMood(week)
  const moods = new Set(week.map((entry) => entry.mood))
  const hasStress = moods.has('stressed')
  const hasExcited = moods.has('excited')
  const hasCalm = moods.has('calm')

  if (hasExcited && hasStress) {
    return 'Your week included a mix of excitement and stress. Consider protecting the routines that helped you feel calm.'
  }

  if (hasCalm && top === 'calm') {
    return 'Calm showed up often this week. Notice what protected that peace — those small rituals are worth keeping.'
  }

  if (top) {
    const label = MOOD_MAP[top as MoodType].label.toLowerCase()
    return `This week leaned toward feeling ${label}. Your garden grew because you kept showing up — even in ordinary moments.`
  }

  return 'Your emotional garden is collecting quiet stories. Keep checking in when you can.'
}
