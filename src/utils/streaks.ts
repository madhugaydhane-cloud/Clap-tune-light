import type { MoodEntry } from '../types'
import { daysBetween, toDateKey } from './dates'

/** Recalculate streak from sorted unique check-in date keys (newest first optional). */
export function calculateStreaks(entries: MoodEntry[]): {
  currentStreak: number
  longestStreak: number
} {
  if (entries.length === 0) {
    return { currentStreak: 0, longestStreak: 0 }
  }

  const uniqueDays = Array.from(
    new Set(entries.map((entry) => toDateKey(entry.createdAt))),
  ).sort()

  let longest = 1
  let run = 1

  for (let i = 1; i < uniqueDays.length; i += 1) {
    const gap = daysBetween(uniqueDays[i - 1], uniqueDays[i])
    if (gap === 1) {
      run += 1
      longest = Math.max(longest, run)
    } else {
      run = 1
    }
  }

  const today = toDateKey()
  const lastDay = uniqueDays[uniqueDays.length - 1]
  const gapFromToday = daysBetween(lastDay, today)

  let currentStreak = 0
  if (gapFromToday === 0 || gapFromToday === 1) {
    currentStreak = 1
    for (let i = uniqueDays.length - 1; i > 0; i -= 1) {
      if (daysBetween(uniqueDays[i - 1], uniqueDays[i]) === 1) {
        currentStreak += 1
      } else {
        break
      }
    }
  }

  return { currentStreak, longestStreak: Math.max(longest, currentStreak) }
}

export function nextStreakIfCheckingIn(
  lastCheckInDate: string | null,
  currentStreak: number,
): number {
  const today = toDateKey()
  if (!lastCheckInDate) return 1
  if (lastCheckInDate === today) return currentStreak
  const gap = daysBetween(lastCheckInDate, today)
  if (gap === 1) return currentStreak + 1
  return 1
}
