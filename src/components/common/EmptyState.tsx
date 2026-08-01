import type { ReactNode } from 'react'
import { cn } from '../../utils/format'

type Props = {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

export function EmptyState({ title, description, icon, action, className }: Props) {
  return (
    <div
      className={cn(
        'glass flex flex-col items-center justify-center rounded-3xl px-8 py-16 text-center',
        className,
      )}
    >
      {icon ? <div className="mb-5 text-accent-warm">{icon}</div> : null}
      <h2 className="text-2xl font-semibold text-text-primary">{title}</h2>
      {description ? <p className="mt-3 max-w-md text-text-secondary">{description}</p> : null}
      {action ? <div className="mt-8">{action}</div> : null}
    </div>
  )
}
