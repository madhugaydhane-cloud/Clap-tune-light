import { Minus, Plus } from 'lucide-react'
import { BRIGHTNESS_PRESETS } from '../../utils/lighting'
import { cn } from '../../utils/format'

type Props = {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
}

export function BrightnessSlider({ value, onChange, disabled }: Props) {
  return (
    <div className={cn('space-y-3', disabled && 'opacity-50')}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Brightness</p>
        <p className="text-sm text-accent-soft">{value}%</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Decrease brightness"
          disabled={disabled}
          onClick={() => onChange(Math.max(10, value - 5))}
          className="rounded-full border border-border p-2 hover:bg-white/5"
        >
          <Minus className="h-4 w-4" />
        </button>
        <input
          type="range"
          min={10}
          max={100}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-accent-warm"
          aria-label="Brightness slider"
        />
        <button
          type="button"
          aria-label="Increase brightness"
          disabled={disabled}
          onClick={() => onChange(Math.min(100, value + 5))}
          className="rounded-full border border-border p-2 hover:bg-white/5"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {BRIGHTNESS_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(preset.value)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs',
              value === preset.value
                ? 'border-accent-warm bg-accent-warm/15 text-accent-soft'
                : 'border-border text-text-secondary',
            )}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  )
}
