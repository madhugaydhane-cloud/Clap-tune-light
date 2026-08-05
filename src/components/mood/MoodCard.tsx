import { motion } from 'framer-motion'
import type { MoodConfig } from '../../types'

interface MoodCardProps {
  mood: MoodConfig
  selected?: boolean
  onSelect: (id: MoodConfig['id']) => void
}

export function MoodCard({ mood, selected = false, onSelect }: MoodCardProps) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(mood.id)}
      whileTap={{ scale: 0.97 }}
      aria-pressed={selected}
      aria-label={`${mood.label}: ${mood.phrase}`}
      className={`flex flex-col items-start gap-2 rounded-[24px] border-2 p-4 text-left transition ${
        mood.bgClass
      } ${
        selected
          ? `${mood.borderClass} shadow-soft ring-2 ring-sage-deep/20`
          : 'border-transparent hover:border-cream-dark'
      }`}
    >
      <span className="text-2xl" aria-hidden>
        {mood.emoji}
      </span>
      <span className="text-sm font-semibold text-forest">{mood.label}</span>
      <span className="text-xs leading-snug text-muted">{mood.phrase}</span>
    </motion.button>
  )
}
