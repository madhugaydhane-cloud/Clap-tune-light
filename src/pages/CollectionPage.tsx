import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { UnlockableItemCard } from '../components/collection/UnlockableItemCard'
import { EmptyState } from '../components/common/EmptyState'
import { useMoodBloom } from '../context/MoodBloomContext'
import { UNLOCKABLE_ITEMS } from '../data/gardenRewards'
import type { UnlockCategory } from '../types'

const CATEGORIES: Array<{ id: UnlockCategory | 'all'; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'leaves', label: 'Leaves' },
  { id: 'flowers', label: 'Flowers' },
  { id: 'buds', label: 'Buds' },
  { id: 'pots', label: 'Pots' },
  { id: 'backgrounds', label: 'Backgrounds' },
  { id: 'companions', label: 'Companions' },
]

export function CollectionPage() {
  const {
    garden,
    setSelectedBackground,
    setSelectedPot,
  } = useMoodBloom()
  const [category, setCategory] = useState<UnlockCategory | 'all'>('all')

  const items = useMemo(
    () =>
      UNLOCKABLE_ITEMS.filter(
        (item) => category === 'all' || item.category === category,
      ),
    [category],
  )

  const unlockedCount = garden.unlockedItems.length

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted">
            <Link to="/" className="hover:underline">
              Garden
            </Link>{' '}
            / Collection
          </p>
          <h1 className="mt-1 font-display text-3xl text-forest sm:text-4xl">
            Garden Collection
          </h1>
          <p className="mt-1 text-sm text-muted">
            {unlockedCount} unlocked · grow through check-ins and streaks
          </p>
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategory(cat.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
              category === cat.id
                ? 'bg-sage-deep text-white'
                : 'bg-surface text-forest-muted shadow-soft'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No items in this category"
          description="Keep checking in to unlock new garden elements."
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((item) => {
            const unlocked = garden.unlockedItems.includes(item.id)
            const selected =
              item.id === garden.selectedBackground ||
              item.id === garden.selectedPot
            return (
              <UnlockableItemCard
                key={item.id}
                item={item}
                unlocked={unlocked}
                selected={selected}
                onSelect={
                  unlocked
                    ? () => {
                        if (item.category === 'backgrounds') {
                          setSelectedBackground(item.id)
                        }
                        if (item.category === 'pots') {
                          setSelectedPot(item.id)
                        }
                      }
                    : undefined
                }
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
