import type { AppState, GardenState, MoodEntry, Settings, User } from '../types'
import { DEFAULT_UNLOCKED } from '../data/gardenRewards'

const STORAGE_KEY = 'moodbloom:v1'

export const defaultGarden = (): GardenState => ({
  plantLevel: 1,
  totalCheckIns: 0,
  currentStreak: 0,
  longestStreak: 0,
  unlockedItems: [...DEFAULT_UNLOCKED],
  selectedPot: 'pot-clay',
  selectedBackground: 'bg-sunrise',
  plantElements: [],
  lastCheckInDate: null,
})

export const defaultSettings = (): Settings => ({
  soundEnabled: true,
  animationsEnabled: true,
  darkMode: false,
  remindersEnabled: true,
})

export const defaultAppState = (): AppState => ({
  user: null,
  entries: [],
  garden: defaultGarden(),
  settings: defaultSettings(),
})

export function isStorageAvailable(): boolean {
  try {
    const key = '__moodbloom_test__'
    window.localStorage.setItem(key, '1')
    window.localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}

export function readAppState(): AppState {
  if (!isStorageAvailable()) return defaultAppState()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultAppState()
    const parsed = JSON.parse(raw) as Partial<AppState>
    return {
      user: parsed.user ?? null,
      entries: parsed.entries ?? [],
      garden: { ...defaultGarden(), ...parsed.garden },
      settings: { ...defaultSettings(), ...parsed.settings },
    }
  } catch {
    return defaultAppState()
  }
}

export function writeAppState(state: AppState): void {
  if (!isStorageAvailable()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function updateAppState(
  updater: (prev: AppState) => AppState,
): AppState {
  const next = updater(readAppState())
  writeAppState(next)
  return next
}

export function clearAppState(): void {
  if (!isStorageAvailable()) return
  window.localStorage.removeItem(STORAGE_KEY)
}

export function exportMoodHistory(entries: MoodEntry[], user: User | null): string {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      user: user
        ? { name: user.name, gardenName: user.gardenName }
        : null,
      entries,
    },
    null,
    2,
  )
}

/** Ready for future Supabase/Firebase sync adapters. */
export const remoteSyncPlaceholder = {
  // async pushState(_state: AppState) { /* cloud sync */ },
  // async pullState() { /* cloud sync */ },
}
