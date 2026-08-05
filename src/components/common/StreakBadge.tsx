import { Flame } from 'lucide-react'

interface StreakBadgeProps {
  streak: number
  compact?: boolean
}

export function StreakBadge({ streak, compact = false }: StreakBadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full bg-peach-soft text-forest ${
        compact ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm'
      }`}
      aria-label={`Current streak: ${streak} day${streak === 1 ? '' : 's'}`}
    >
      <Flame className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} aria-hidden />
      <span className="font-semibold">
        {streak} day{streak === 1 ? '' : 's'}
      </span>
    </div>
  )
}
