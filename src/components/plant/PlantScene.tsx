import { motion } from 'framer-motion'
import type { GardenState, MoodType } from '../../types'
import { useMoodBloom } from '../../context/MoodBloomContext'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { PlantElementGraphic } from './PlantElement'

interface PlantSceneProps {
  garden: GardenState
  atmosphere?: MoodType | null
  showRain?: boolean
  compact?: boolean
  className?: string
}

export function PlantScene({
  garden,
  atmosphere = null,
  showRain = false,
  compact = false,
  className = '',
}: PlantSceneProps) {
  const reduced = useReducedMotion()
  const { settings } = useMoodBloom()
  const animate = !reduced && settings.animationsEnabled
  const evening = atmosphere === 'tired' || garden.selectedBackground === 'bg-sunset'
  const rainy =
    showRain ||
    atmosphere === 'sad' ||
    garden.selectedBackground === 'bg-rainy'
  const moonlight = garden.selectedBackground === 'bg-moonlight'

  const leaves = garden.plantElements.filter((el) => el.type === 'leaf')
  const flowers = garden.plantElements.filter((el) => el.type === 'flower')
  const buds = garden.plantElements.filter((el) => el.type === 'glowing-bud')
  const visible = [...leaves, ...flowers, ...buds]

  const bgClass = evening
    ? 'evening-gradient'
    : rainy
      ? 'rain-gradient'
      : moonlight
        ? 'bg-gradient-to-b from-slate-700 via-indigo-950 to-slate-900'
        : 'garden-gradient'

  return (
    <div
      className={`relative overflow-hidden rounded-[36px] ${bgClass} ${
        compact ? 'h-56' : 'h-[360px] sm:h-[420px]'
      } ${className}`}
      aria-label="Your MoodBloom plant"
      role="img"
    >
      {/* Soft clouds */}
      {!evening && !moonlight ? (
        <>
          <motion.div
            className="absolute top-10 left-[-10%] h-16 w-40 rounded-full bg-white/35 blur-sm"
            animate={animate ? { x: [0, 40, 0] } : undefined}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden
          />
          <motion.div
            className="absolute top-20 right-[-5%] h-12 w-32 rounded-full bg-white/25 blur-sm"
            animate={animate ? { x: [0, -30, 0] } : undefined}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden
          />
        </>
      ) : null}

      {/* Floating particles */}
      {animate
        ? Array.from({ length: 8 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full bg-white/50"
              style={{ left: `${12 + i * 10}%`, top: `${20 + (i % 4) * 12}%` }}
              animate={{ y: [0, -18, 0], opacity: [0.2, 0.8, 0.2] }}
              transition={{
                duration: 4 + (i % 3),
                repeat: Infinity,
                delay: i * 0.35,
              }}
              aria-hidden
            />
          ))
        : null}

      {/* Rain */}
      {rainy && animate
        ? Array.from({ length: 14 }).map((_, i) => (
            <motion.span
              key={`rain-${i}`}
              className="absolute h-4 w-0.5 rounded-full bg-sky/60"
              style={{ left: `${8 + i * 6.5}%`, top: '-10%' }}
              animate={{ y: ['0%', '120%'], opacity: [0, 0.8, 0] }}
              transition={{
                duration: 1.4 + (i % 5) * 0.15,
                repeat: Infinity,
                delay: i * 0.12,
                ease: 'linear',
              }}
              aria-hidden
            />
          ))
        : null}

      {/* Companions */}
      {garden.unlockedItems.includes('companion-butterfly') ? (
        <motion.span
          className="absolute top-16 right-10 text-2xl"
          animate={animate ? { x: [0, -20, 10, 0], y: [0, -10, 5, 0] } : undefined}
          transition={{ duration: 8, repeat: Infinity }}
          aria-hidden
        >
          🦋
        </motion.span>
      ) : null}
      {garden.unlockedItems.includes('companion-firefly') || evening || moonlight ? (
        <motion.span
          className="absolute top-24 left-12 text-lg"
          animate={animate ? { opacity: [0.3, 1, 0.3], scale: [0.9, 1.1, 0.9] } : undefined}
          transition={{ duration: 2.2, repeat: Infinity }}
          aria-hidden
        >
          ✨
        </motion.span>
      ) : null}
      {garden.unlockedItems.includes('companion-bird') ? (
        <motion.span
          className="absolute top-12 left-1/3 text-xl"
          animate={animate ? { x: [0, 30, 0] } : undefined}
          transition={{ duration: 12, repeat: Infinity }}
          aria-hidden
        >
          🐦
        </motion.span>
      ) : null}

      <svg
        viewBox="0 0 280 320"
        className={`absolute inset-x-0 bottom-0 mx-auto ${
          compact ? 'h-[90%]' : 'h-full'
        } w-auto max-w-full`}
        aria-hidden
      >
        {/* Ground shadow */}
        <ellipse cx="140" cy="292" rx="70" ry="12" fill="rgba(36,54,43,0.12)" />

        {/* Pot */}
        <motion.g
          animate={
            animate
              ? { rotate: atmosphere === 'stressed' ? [-2, 2, -2] : [0, 0, 0] }
              : undefined
          }
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '140px 260px' }}
        >
          <path
            d="M98 230 H182 L172 285 Q140 298 108 285 Z"
            fill={
              garden.selectedPot === 'pot-ceramic' ? '#E8DFD4' : '#D4A574'
            }
          />
          <rect
            x="92"
            y="218"
            width="96"
            height="18"
            rx="6"
            fill={
              garden.selectedPot === 'pot-ceramic' ? '#F3EDE4' : '#E0B48A'
            }
          />
          <ellipse cx="140" cy="218" rx="48" ry="8" fill="#6B8F63" opacity="0.85" />

          {/* Stem & branches */}
          <motion.g
            animate={animate ? { rotate: [-1.5, 1.5, -1.5] } : undefined}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '140px 218px' }}
          >
            <path
              d="M140 218 C138 180 142 140 140 95"
              stroke="#5F7D58"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M140 170 C120 160 105 150 95 140"
              stroke="#6B8F63"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M140 155 C160 145 175 135 190 128"
              stroke="#6B8F63"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M140 125 C125 115 115 100 108 88"
              stroke="#7FA876"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />

            {/* Base leaves always present */}
            <ellipse
              cx="108"
              cy="148"
              rx="22"
              ry="11"
              fill="#8FAD86"
              transform="rotate(-30 108 148)"
            />
            <ellipse
              cx="175"
              cy="140"
              rx="24"
              ry="12"
              fill="#7FA876"
              transform="rotate(28 175 140)"
            />
            <ellipse
              cx="118"
              cy="100"
              rx="18"
              ry="9"
              fill="#A8C5A0"
              transform="rotate(-20 118 100)"
            />

            {/* Growth elements */}
            {visible.map((el, i) => (
              <PlantElementGraphic
                key={el.id}
                type={el.type}
                index={el.index + i}
                animate={animate}
              />
            ))}

            {/* Seed / tip glow when empty */}
            {visible.length === 0 ? (
              <motion.circle
                cx="140"
                cy="90"
                r="8"
                fill="#F0C9A8"
                animate={animate ? { scale: [1, 1.15, 1] } : undefined}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
            ) : null}
          </motion.g>
        </motion.g>
      </svg>

      <div className="pointer-events-none absolute inset-x-0 bottom-3 text-center">
        <p className="text-xs font-medium text-forest/70">
          Level {garden.plantLevel} · {garden.totalCheckIns}{' '}
          {garden.totalCheckIns === 1 ? 'check-in' : 'check-ins'}
        </p>
      </div>
    </div>
  )
}
