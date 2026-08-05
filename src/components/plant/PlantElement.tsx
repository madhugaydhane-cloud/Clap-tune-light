import { motion } from 'framer-motion'
import type { GrowthRewardType } from '../../types'

interface PlantElementProps {
  type: GrowthRewardType
  index: number
  animate?: boolean
}

const POSITIONS = [
  { x: 118, y: 168, rotate: -18 },
  { x: 168, y: 150, rotate: 16 },
  { x: 140, y: 128, rotate: -8 },
  { x: 100, y: 145, rotate: -28 },
  { x: 186, y: 170, rotate: 24 },
  { x: 152, y: 110, rotate: 6 },
  { x: 120, y: 108, rotate: -12 },
  { x: 175, y: 125, rotate: 20 },
]

export function PlantElementGraphic({
  type,
  index,
  animate = true,
}: PlantElementProps) {
  const pos = POSITIONS[index % POSITIONS.length]

  if (type === 'evening' || type === 'breathing' || type === 'raindrop') {
    // Environment / atmosphere effects render at PlantScene level
    return null
  }

  return (
    <motion.g
      initial={animate ? { scale: 0, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.05 }}
      style={{ transformOrigin: `${pos.x}px ${pos.y + 20}px` }}
    >
      {type === 'leaf' ? (
        <g transform={`translate(${pos.x} ${pos.y}) rotate(${pos.rotate})`}>
          <ellipse cx="0" cy="0" rx="16" ry="9" fill="#7FA876" />
          <path d="M-12 0 Q0 -2 12 0" stroke="#5F7D58" strokeWidth="1" fill="none" />
        </g>
      ) : null}

      {type === 'flower' ? (
        <g transform={`translate(${pos.x} ${pos.y})`}>
          {[0, 72, 144, 216, 288].map((deg) => (
            <ellipse
              key={deg}
              cx="0"
              cy="-10"
              rx="6"
              ry="10"
              fill="#F0C9A8"
              transform={`rotate(${deg})`}
            />
          ))}
          <circle cx="0" cy="0" r="5" fill="#E8B86D" />
        </g>
      ) : null}

      {type === 'glowing-bud' ? (
        <g transform={`translate(${pos.x} ${pos.y})`}>
          <motion.circle
            cx="0"
            cy="0"
            r="14"
            fill="#E8C4F0"
            opacity={0.35}
            animate={animate ? { scale: [1, 1.25, 1], opacity: [0.25, 0.45, 0.25] } : undefined}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <ellipse cx="0" cy="2" rx="7" ry="10" fill="#C9B6D8" />
          <ellipse cx="0" cy="-2" rx="5" ry="7" fill="#F5E8FA" />
        </g>
      ) : null}
    </motion.g>
  )
}
