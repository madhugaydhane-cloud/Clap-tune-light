import type { FinishOption, Product } from '../../types'
import { cn } from '../../utils/format'

type Props = {
  product: Product
  finishId: string
  shadeId: string
  cableId: string
  material: string
  bulbStyle: string
  onFinish: (id: string) => void
  onShade: (id: string) => void
  onCable: (id: string) => void
  onMaterial: (value: string) => void
  onBulb: (value: string) => void
}

export function CustomisationPanel({
  product,
  finishId,
  shadeId,
  cableId,
  material,
  bulbStyle,
  onFinish,
  onShade,
  onCable,
  onMaterial,
  onBulb,
}: Props) {
  return (
    <div className="space-y-5">
      <SwatchRow label="Lamp base / metal finish" options={product.finishes} value={finishId} onChange={onFinish} />
      <SwatchRow label="Shade colour" options={product.shadeColours} value={shadeId} onChange={onShade} />
      <SwatchRow label="Cable colour" options={product.cableColours} value={cableId} onChange={onCable} />

      <div>
        <p className="mb-2 text-sm font-medium">Material</p>
        <div className="flex flex-wrap gap-2">
          {product.materials.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => onMaterial(m)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs',
                material === m
                  ? 'border-accent-warm bg-accent-warm/15 text-accent-soft'
                  : 'border-border text-text-secondary',
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Bulb style</p>
        <div className="flex flex-wrap gap-2">
          {product.bulbStyle.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => onBulb(b)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs',
                bulbStyle === b
                  ? 'border-accent-warm bg-accent-warm/15 text-accent-soft'
                  : 'border-border text-text-secondary',
              )}
            >
              {b}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function SwatchRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: FinishOption[]
  value: string
  onChange: (id: string) => void
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            title={option.name}
            aria-label={option.name}
            onClick={() => onChange(option.id)}
            className={cn(
              'flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs',
              value === option.id
                ? 'border-accent-warm bg-accent-warm/10'
                : 'border-border text-text-secondary',
            )}
          >
            <span className="h-3.5 w-3.5 rounded-full ring-1 ring-white/20" style={{ background: option.color }} />
            {option.name}
          </button>
        ))}
      </div>
    </div>
  )
}
