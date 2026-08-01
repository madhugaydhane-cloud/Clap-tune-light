import { Heart } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { cn } from '../../utils/format'

type Props = {
  productId: string
  finishId: string
  temperatureId: string
  className?: string
}

export function WishlistButton({ productId, finishId, temperatureId, className }: Props) {
  const { wishlist, pushToast } = useApp()
  const liked = wishlist.has(productId)

  return (
    <button
      type="button"
      aria-pressed={liked}
      aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
      onClick={() => {
        wishlist.toggle(productId, finishId, temperatureId)
        pushToast(liked ? 'Removed from wishlist' : 'Added to wishlist', 'success')
      }}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm hover:bg-white/5',
        className,
      )}
    >
      <Heart className={cn('h-4 w-4', liked && 'fill-accent-warm text-accent-warm')} />
      {liked ? 'Saved' : 'Wishlist'}
    </button>
  )
}
