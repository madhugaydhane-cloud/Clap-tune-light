import { GitCompare } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { cn } from '../../utils/format'

export function CompareButton({ productId, className }: { productId: string; className?: string }) {
  const { compare, pushToast } = useApp()
  const active = compare.has(productId)

  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => {
        if (!active && compare.count >= 3) {
          pushToast('You can compare up to 3 lamps', 'info')
          return
        }
        compare.toggle(productId)
        pushToast(active ? 'Removed from compare' : 'Added to compare', 'success')
      }}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm hover:bg-white/5',
        active && 'border-accent-warm/50 text-accent-soft',
        className,
      )}
    >
      <GitCompare className="h-4 w-4" />
      Compare
    </button>
  )
}
