import { MOODS } from '../../data/moods'
import type { MoodType } from '../../types'
import { MoodCard } from './MoodCard'

interface MoodSelectorProps {
  value: MoodType | null
  onChange: (mood: MoodType) => void
}

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div
      className="grid grid-cols-2 gap-3 sm:grid-cols-3"
      role="group"
      aria-label="Choose your mood"
    >
      {MOODS.map((mood) => (
        <MoodCard
          key={mood.id}
          mood={mood}
          selected={value === mood.id}
          onSelect={onChange}
        />
      ))}
    </div>
  )
}
