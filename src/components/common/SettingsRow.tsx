import type { ReactNode } from 'react'

interface SettingsRowProps {
  label: string
  description?: string
  control: ReactNode
}

export function SettingsRow({ label, description, control }: SettingsRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-surface px-4 py-4 shadow-soft">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-forest">{label}</p>
        {description ? (
          <p className="mt-0.5 text-xs text-muted">{description}</p>
        ) : null}
      </div>
      <div className="shrink-0">{control}</div>
    </div>
  )
}

interface ToggleProps {
  checked: boolean
  onChange: (next: boolean) => void
  label: string
}

export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-8 w-14 rounded-full transition ${
        checked ? 'bg-sage-deep' : 'bg-cream-dark'
      }`}
    >
      <span
        className={`absolute top-1 left-1 h-6 w-6 rounded-full bg-white shadow transition ${
          checked ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  )
}
