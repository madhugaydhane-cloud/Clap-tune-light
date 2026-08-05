import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description: string
  icon?: ReactNode
  action?: ReactNode
}

export function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[28px] bg-surface/80 px-6 py-12 text-center shadow-soft">
      {icon ? (
        <div className="text-4xl" aria-hidden>
          {icon}
        </div>
      ) : null}
      <h3 className="font-display text-2xl text-forest">{title}</h3>
      <p className="max-w-sm text-sm leading-relaxed text-muted">{description}</p>
      {action}
    </div>
  )
}
