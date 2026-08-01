import { cn } from '../../utils/format'

export function LoadingState({ label = 'Loading…', className }: { label?: string; className?: string }) {
  return (
    <div
      className={cn('flex min-h-40 flex-col items-center justify-center gap-4 text-text-secondary', className)}
      role="status"
      aria-live="polite"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-accent-warm/30 border-t-accent-warm" />
      <span className="text-sm">{label}</span>
    </div>
  )
}
