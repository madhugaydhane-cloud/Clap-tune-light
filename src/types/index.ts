export type MoodType =
  | 'happy'
  | 'calm'
  | 'excited'
  | 'tired'
  | 'stressed'
  | 'sad'

export type GrowthRewardType =
  | 'flower'
  | 'leaf'
  | 'glowing-bud'
  | 'evening'
  | 'breathing'
  | 'raindrop'

export type UnlockCategory =
  | 'leaves'
  | 'flowers'
  | 'buds'
  | 'pots'
  | 'backgrounds'
  | 'companions'

export type NavTab = 'garden' | 'history' | 'insights' | 'profile'

export interface User {
  id: string
  name: string
  gardenName: string
  reminderTime: string
  onboardingCompleted: boolean
  createdAt: string
}

export interface MoodEntry {
  id: string
  mood: MoodType
  note: string
  voiceNoteUrl: string | null
  createdAt: string
  growthReward: GrowthRewardType
  reflectionPrompt: string
}

export interface PlantElement {
  id: string
  type: GrowthRewardType
  mood: MoodType
  createdAt: string
  index: number
}

export interface GardenState {
  plantLevel: number
  totalCheckIns: number
  currentStreak: number
  longestStreak: number
  unlockedItems: string[]
  selectedPot: string
  selectedBackground: string
  plantElements: PlantElement[]
  lastCheckInDate: string | null
}

export interface Settings {
  soundEnabled: boolean
  animationsEnabled: boolean
  darkMode: boolean
  remindersEnabled: boolean
}

export interface MoodConfig {
  id: MoodType
  label: string
  emoji: string
  phrase: string
  color: string
  bgClass: string
  textClass: string
  borderClass: string
  growthReward: GrowthRewardType
  growthLabel: string
  reactionMessage: string
}

export interface UnlockableItem {
  id: string
  name: string
  category: UnlockCategory
  description: string
  emoji: string
  requirement: string
  check: (garden: GardenState, entries: MoodEntry[]) => boolean
}

export interface AppState {
  user: User | null
  entries: MoodEntry[]
  garden: GardenState
  settings: Settings
}
