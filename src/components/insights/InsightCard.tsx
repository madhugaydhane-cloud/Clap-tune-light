import type { ReactNode } from 'react'

interface InsightCardProps {
  title: string
  value: string | number
  detail?: string
  icon?: ReactNode
}

export function InsightCard({ title, value, detail, icon }: InsightCardProps) {
  return (
    <div className="rounded-[24px] bg-surface p-4 shadow-soft">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">
          {title}
        </p>
        {icon}
      </div>
      <p className="mt-2 font-display text-3xl text-forest">{value}</p>
      {detail ? <p className="mt-1 text-xs text-muted">{detail}</p> : null}
    </div>
  )
}
