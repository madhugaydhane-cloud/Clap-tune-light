import { Lock } from 'lucide-react'
import type { UnlockableItem } from '../../types'

interface UnlockableItemCardProps {
  item: UnlockableItem
  unlocked: boolean
  selected?: boolean
  onSelect?: () => void
}

export function UnlockableItemCard({
  item,
  unlocked,
  selected = false,
  onSelect,
}: UnlockableItemCardProps) {
  const interactive =
    unlocked &&
    onSelect &&
    (item.category === 'backgrounds' || item.category === 'pots')

  return (
    <div
      className={`relative rounded-[24px] p-4 shadow-soft transition ${
        unlocked ? 'bg-surface' : 'bg-cream/70'
      } ${selected ? 'ring-2 ring-sage-deep' : ''}`}
    >
      {!unlocked ? (
        <span className="absolute top-3 right-3 text-muted" aria-hidden>
          <Lock className="h-4 w-4" />
        </span>
      ) : null}
      <div className={`text-3xl ${unlocked ? '' : 'grayscale opacity-50'}`} aria-hidden>
        {item.emoji}
      </div>
      <h3 className="mt-3 text-sm font-semibold text-forest">{item.name}</h3>
      <p className="mt-1 text-xs leading-relaxed text-muted">{item.description}</p>
      <p className="mt-3 text-xs font-medium text-sage-deep">
        {unlocked ? 'Unlocked' : item.requirement}
      </p>
      {interactive ? (
        <button
          type="button"
          onClick={onSelect}
          className="mt-3 w-full rounded-xl bg-sage-soft px-3 py-2 text-xs font-semibold text-sage-deep"
        >
          {selected ? 'In use' : 'Use in garden'}
        </button>
      ) : null}
    </div>
  )
}
