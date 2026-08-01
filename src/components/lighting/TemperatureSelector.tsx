import type { LightTemperature } from '../../types'
import { cn } from '../../utils/format'

type Props = {
  temperatures: LightTemperature[]
  value: string
  onChange: (id: string) => void
  disabled?: boolean
}

export function TemperatureSelector({ temperatures, value, onChange, disabled }: Props) {
  const selected = temperatures.find((t) => t.id === value) ?? temperatures[0]

  return (
    <div className={cn('space-y-3', disabled && 'opacity-50')}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Light temperature</p>
        <p className="text-sm text-accent-soft">{selected?.kelvin}K · {selected?.label}</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {temperatures.map((temp) => (
          <button
            key={temp.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(temp.id)}
            className={cn(
              'rounded-2xl border px-2 py-3 text-left transition',
              value === temp.id
                ? 'border-accent-warm bg-accent-warm/10'
                : 'border-border hover:border-white/20',
            )}
          >
            <span
              className="mb-2 block h-2 w-full rounded-full"
              style={{ background: temp.color, boxShadow: `0 0 12px ${temp.color}` }}
            />
            <span className="block text-xs font-medium">{temp.label}</span>
            <span className="text-[10px] text-text-secondary">{temp.kelvin}K</span>
          </button>
        ))}
      </div>
    </div>
  )
}
