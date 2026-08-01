import type { ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { cn } from '../../utils/format'

type Props = {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}

export function ErrorState({ title, description, actions, className }: Props) {
  return (
    <div
      role="alert"
      className={cn(
        'glass rounded-3xl border border-error/30 px-6 py-8 text-center',
        className,
      )}
    >
      <AlertTriangle className="mx-auto mb-4 h-8 w-8 text-error" aria-hidden />
      <h3 className="text-xl font-semibold text-text-primary">{title}</h3>
      {description ? <p className="mt-2 text-sm text-text-secondary">{description}</p> : null}
      {actions ? <div className="mt-6 flex flex-wrap justify-center gap-3">{actions}</div> : null}
    </div>
  )
}
