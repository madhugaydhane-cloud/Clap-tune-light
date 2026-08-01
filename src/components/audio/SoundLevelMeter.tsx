import { cn } from '../../utils/format'

type Props = {
  level: number
  threshold: number
  listening?: boolean
  className?: string
}

export function SoundLevelMeter({ level, threshold, listening, className }: Props) {
  const pct = Math.min(100, Math.round(level * 220))
  const bars = Array.from({ length: 16 }, (_, i) => i)

  return (
    <div className={cn('space-y-2', className)} aria-live="polite">
      <div className="flex items-end gap-1" role="img" aria-label={`Sound level ${pct} percent`}>
        {bars.map((i) => {
          const active = pct > (i + 1) * (100 / bars.length)
          return (
            <span
              key={i}
              className={cn(
                'w-1.5 rounded-full transition-colors',
                active ? 'bg-accent-warm' : 'bg-white/10',
              )}
              style={{ height: `${10 + i * 2}px` }}
            />
          )
        })}
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-accent-warm transition-[width] duration-75"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-text-secondary">
        {listening ? 'Listening for a clap…' : 'Microphone idle'} · threshold{' '}
        {threshold.toFixed(2)}
      </p>
    </div>
  )
}
