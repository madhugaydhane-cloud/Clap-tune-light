import { motion } from 'framer-motion'
import { UNLOCKABLE_ITEMS } from '../../data/gardenRewards'
import { MOOD_MAP } from '../../data/moods'
import { getSupportiveMessage } from '../../data/messages'
import type { GardenState, MoodEntry } from '../../types'
import { SupportiveMessage } from '../common/SupportiveMessage'
import { PlantScene } from '../plant/PlantScene'

interface PlantReactionProps {
  entry: MoodEntry
  garden: GardenState
  newlyUnlocked: string[]
  onOfferBreathing?: () => void
  onDone: () => void
}

export function PlantReaction({
  entry,
  garden,
  newlyUnlocked,
  onOfferBreathing,
  onDone,
}: PlantReactionProps) {
  const mood = MOOD_MAP[entry.mood]
  const message = getSupportiveMessage(entry.createdAt.length)

  return (
    <div className="space-y-5">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sage-deep">
          Plant reaction
        </p>
        <h2 className="mt-2 font-display text-3xl text-forest">
          {mood.reactionMessage}
        </h2>
        <p className="mt-2 text-sm text-muted">
          {mood.emoji} {mood.growthLabel}
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <PlantScene
          garden={garden}
          atmosphere={entry.mood}
          showRain={entry.mood === 'sad'}
        />
      </motion.div>

      <SupportiveMessage message={message} />

      {newlyUnlocked.length > 0 ? (
        <div className="rounded-[20px] bg-lavender-soft px-4 py-3 text-sm text-forest">
          New unlock{newlyUnlocked.length > 1 ? 's' : ''}:{' '}
          <span className="font-semibold">
            {newlyUnlocked
              .map(
                (id) =>
                  UNLOCKABLE_ITEMS.find((item) => item.id === id)?.name ?? id,
              )
              .join(', ')}
          </span>
        </div>
      ) : null}

      {entry.mood === 'stressed' && onOfferBreathing ? (
        <button
          type="button"
          onClick={onOfferBreathing}
          className="w-full rounded-2xl border border-cream-dark bg-cream px-4 py-3 text-sm font-semibold text-forest"
        >
          Try a soft breathing exercise
        </button>
      ) : null}

      <button
        type="button"
        onClick={onDone}
        className="w-full rounded-2xl bg-sage-deep px-4 py-3.5 text-sm font-semibold text-white"
      >
        Return to My Garden
      </button>
    </div>
  )
}
