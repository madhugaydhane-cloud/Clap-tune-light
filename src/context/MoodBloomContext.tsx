import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getNewlyUnlocked, MILESTONE_EVERY } from '../data/gardenRewards'
import { MOOD_MAP } from '../data/moods'
import { getReflectionPrompt } from '../data/prompts'
import {
  clearAppState,
  defaultAppState,
  defaultGarden,
  defaultSettings,
  exportMoodHistory,
  isStorageAvailable,
  readAppState,
  writeAppState,
} from '../services/localStorage'
import type {
  GardenState,
  MoodEntry,
  MoodType,
  Settings,
  User,
} from '../types'
import { toDateKey } from '../utils/dates'
import { calculateStreaks, nextStreakIfCheckingIn } from '../utils/streaks'

interface CheckInInput {
  mood: MoodType
  note: string
  voiceNoteUrl: string | null
  reflectionPrompt: string
}

interface MoodBloomContextValue {
  user: User | null
  entries: MoodEntry[]
  garden: GardenState
  settings: Settings
  storageAvailable: boolean
  ready: boolean
  todayEntry: MoodEntry | undefined
  hasCheckedInToday: boolean
  completeOnboarding: (input: {
    name: string
    gardenName: string
    reminderTime: string
  }) => void
  skipOnboarding: () => void
  submitCheckIn: (input: CheckInInput) => {
    entry: MoodEntry
    newlyUnlocked: string[]
  }
  updateEntry: (id: string, patch: Partial<Pick<MoodEntry, 'mood' | 'note'>>) => void
  deleteEntry: (id: string) => void
  updateSettings: (patch: Partial<Settings>) => void
  updateProfile: (patch: Partial<Pick<User, 'name' | 'gardenName' | 'reminderTime'>>) => void
  setSelectedBackground: (id: string) => void
  setSelectedPot: (id: string) => void
  resetGarden: () => void
  exportHistory: () => string
  clearAllData: () => void
}

const MoodBloomContext = createContext<MoodBloomContextValue | null>(null)

function createId(): string {
  return crypto.randomUUID()
}

export function MoodBloomProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [storageAvailable, setStorageAvailable] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [entries, setEntries] = useState<MoodEntry[]>([])
  const [garden, setGarden] = useState<GardenState>(defaultGarden())
  const [settings, setSettings] = useState<Settings>(defaultSettings())

  useEffect(() => {
    const available = isStorageAvailable()
    setStorageAvailable(available)
    const state = readAppState()
    setUser(state.user)
    setEntries(state.entries)
    // Soft-refresh streak if a day was missed
    const streaks = calculateStreaks(state.entries)
    setGarden({
      ...state.garden,
      currentStreak: streaks.currentStreak,
      longestStreak: Math.max(state.garden.longestStreak, streaks.longestStreak),
    })
    setSettings(state.settings)
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready || !storageAvailable) return
    writeAppState({ user, entries, garden, settings })
  }, [ready, storageAvailable, user, entries, garden, settings])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.darkMode)
  }, [settings.darkMode])

  const todayEntry = useMemo(
    () => entries.find((entry) => toDateKey(entry.createdAt) === toDateKey()),
    [entries],
  )

  const persistUserBasics = useCallback(
    (name: string, gardenName: string, reminderTime: string) => {
      const nextUser: User = {
        id: user?.id ?? createId(),
        name: name.trim() || 'Friend',
        gardenName: gardenName.trim() || 'My Quiet Garden',
        reminderTime: reminderTime || '20:00',
        onboardingCompleted: true,
        createdAt: user?.createdAt ?? new Date().toISOString(),
      }
      setUser(nextUser)
    },
    [user],
  )

  const completeOnboarding = useCallback(
    (input: { name: string; gardenName: string; reminderTime: string }) => {
      persistUserBasics(input.name, input.gardenName, input.reminderTime)
    },
    [persistUserBasics],
  )

  const skipOnboarding = useCallback(() => {
    persistUserBasics('Friend', 'My Quiet Garden', '20:00')
  }, [persistUserBasics])

  const submitCheckIn = useCallback(
    (input: CheckInInput) => {
      const today = toDateKey()
      const existing = entries.find(
        (entry) => toDateKey(entry.createdAt) === today,
      )

      const moodConfig = MOOD_MAP[input.mood]
      const prompt =
        input.reflectionPrompt || getReflectionPrompt(input.mood)

      if (existing) {
        const updated: MoodEntry = {
          ...existing,
          mood: input.mood,
          note: input.note,
          voiceNoteUrl: input.voiceNoteUrl,
          growthReward: moodConfig.growthReward,
          reflectionPrompt: prompt,
        }
        const nextEntries = entries.map((entry) =>
          entry.id === existing.id ? updated : entry,
        )
        setEntries(nextEntries)

        const nextElements = garden.plantElements.map((el) =>
          el.id === `growth-${existing.id}`
            ? { ...el, type: moodConfig.growthReward, mood: input.mood }
            : el,
        )
        const nextGarden = { ...garden, plantElements: nextElements }
        const unlocked = getNewlyUnlocked(
          nextGarden.unlockedItems,
          nextGarden,
          nextEntries,
        ).map((item) => item.id)
        if (unlocked.length) {
          nextGarden.unlockedItems = [
            ...nextGarden.unlockedItems,
            ...unlocked,
          ]
        }
        setGarden(nextGarden)
        return { entry: updated, newlyUnlocked: unlocked }
      }

      const entry: MoodEntry = {
        id: createId(),
        mood: input.mood,
        note: input.note,
        voiceNoteUrl: input.voiceNoteUrl,
        createdAt: new Date().toISOString(),
        growthReward: moodConfig.growthReward,
        reflectionPrompt: prompt,
      }

      const nextEntries = [...entries, entry]
      const nextStreak = nextStreakIfCheckingIn(
        garden.lastCheckInDate,
        garden.currentStreak,
      )
      const totalCheckIns = garden.totalCheckIns + 1
      const plantLevel = Math.max(1, Math.floor(totalCheckIns / 3) + 1)

      const plantElement = {
        id: `growth-${entry.id}`,
        type: moodConfig.growthReward,
        mood: input.mood,
        createdAt: entry.createdAt,
        index: garden.plantElements.length,
      }

      let unlockedItems = [...garden.unlockedItems]
      // Milestone unlock every 7 check-ins is also covered by reward checks
      if (totalCheckIns % MILESTONE_EVERY === 0) {
        // keep for explicit progress tracking
      }

      let nextGarden: GardenState = {
        ...garden,
        totalCheckIns,
        plantLevel,
        currentStreak: nextStreak,
        longestStreak: Math.max(garden.longestStreak, nextStreak),
        lastCheckInDate: today,
        plantElements: [...garden.plantElements, plantElement],
        unlockedItems,
      }

      const newlyUnlocked = getNewlyUnlocked(
        unlockedItems,
        nextGarden,
        nextEntries,
      ).map((item) => item.id)
      if (newlyUnlocked.length) {
        unlockedItems = [...unlockedItems, ...newlyUnlocked]
        nextGarden = { ...nextGarden, unlockedItems }
      }

      setEntries(nextEntries)
      setGarden(nextGarden)
      return { entry, newlyUnlocked }
    },
    [entries, garden],
  )

  const updateEntry = useCallback(
    (id: string, patch: Partial<Pick<MoodEntry, 'mood' | 'note'>>) => {
      setEntries((prev) =>
        prev.map((entry) => {
          if (entry.id !== id) return entry
          const mood = patch.mood ?? entry.mood
          return {
            ...entry,
            ...patch,
            mood,
            growthReward: MOOD_MAP[mood].growthReward,
          }
        }),
      )
      if (patch.mood) {
        setGarden((prev) => ({
          ...prev,
          plantElements: prev.plantElements.map((el) =>
            el.id === `growth-${id}`
              ? {
                  ...el,
                  type: MOOD_MAP[patch.mood!].growthReward,
                  mood: patch.mood!,
                }
              : el,
          ),
        }))
      }
    },
    [],
  )

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => {
      const next = prev.filter((entry) => entry.id !== id)
      const streaks = calculateStreaks(next)
      setGarden((g) => ({
        ...g,
        totalCheckIns: Math.max(0, g.totalCheckIns - 1),
        currentStreak: streaks.currentStreak,
        longestStreak: Math.max(g.longestStreak, streaks.longestStreak),
        plantElements: g.plantElements.filter((el) => el.id !== `growth-${id}`),
        lastCheckInDate:
          next.length > 0
            ? toDateKey(
                [...next].sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
                )[0].createdAt,
              )
            : null,
        plantLevel: Math.max(1, Math.floor(Math.max(0, next.length) / 3) + 1),
      }))
      return next
    })
  }, [])

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...patch }))
  }, [])

  const updateProfile = useCallback(
    (patch: Partial<Pick<User, 'name' | 'gardenName' | 'reminderTime'>>) => {
      setUser((prev) => (prev ? { ...prev, ...patch } : prev))
    },
    [],
  )

  const setSelectedBackground = useCallback((id: string) => {
    setGarden((prev) => ({ ...prev, selectedBackground: id }))
  }, [])

  const setSelectedPot = useCallback((id: string) => {
    setGarden((prev) => ({ ...prev, selectedPot: id }))
  }, [])

  const resetGarden = useCallback(() => {
    setEntries([])
    setGarden(defaultGarden())
  }, [])

  const exportHistory = useCallback(
    () => exportMoodHistory(entries, user),
    [entries, user],
  )

  const clearAllData = useCallback(() => {
    clearAppState()
    const fresh = defaultAppState()
    setUser(fresh.user)
    setEntries(fresh.entries)
    setGarden(fresh.garden)
    setSettings(fresh.settings)
  }, [])

  const value = useMemo<MoodBloomContextValue>(
    () => ({
      user,
      entries,
      garden,
      settings,
      storageAvailable,
      ready,
      todayEntry,
      hasCheckedInToday: Boolean(todayEntry),
      completeOnboarding,
      skipOnboarding,
      submitCheckIn,
      updateEntry,
      deleteEntry,
      updateSettings,
      updateProfile,
      setSelectedBackground,
      setSelectedPot,
      resetGarden,
      exportHistory,
      clearAllData,
    }),
    [
      user,
      entries,
      garden,
      settings,
      storageAvailable,
      ready,
      todayEntry,
      completeOnboarding,
      skipOnboarding,
      submitCheckIn,
      updateEntry,
      deleteEntry,
      updateSettings,
      updateProfile,
      setSelectedBackground,
      setSelectedPot,
      resetGarden,
      exportHistory,
      clearAllData,
    ],
  )

  return (
    <MoodBloomContext.Provider value={value}>
      {children}
    </MoodBloomContext.Provider>
  )
}

export function useMoodBloom(): MoodBloomContextValue {
  const ctx = useContext(MoodBloomContext)
  if (!ctx) {
    throw new Error('useMoodBloom must be used within MoodBloomProvider')
  }
  return ctx
}
