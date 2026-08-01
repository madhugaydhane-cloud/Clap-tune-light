import { Link } from 'react-router-dom'
import { Heart, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Product } from '../../types'
import { discountPercent, formatPrice, cn } from '../../utils/format'
import { useApp } from '../../context/AppContext'

type Props = {
  product: Product
}

export function ProductCard({ product }: Props) {
  const { wishlist, pushToast } = useApp()
  const liked = wishlist.has(product.id)
  const discount = discountPercent(product.price, product.originalPrice)

  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-3xl border border-border bg-surface transition hover:border-accent-warm/30 hover:bg-surface-light"
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-bg-secondary">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-110"
          />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(244,182,91,0.18),transparent_55%)] opacity-0 transition group-hover:opacity-100" />
          {discount > 0 ? (
            <span className="absolute left-3 top-3 rounded-full bg-accent-warm px-2.5 py-1 text-xs font-semibold text-bg-primary">
              -{discount}%
            </span>
          ) : null}
          {!product.inStock ? (
            <span className="absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1 text-xs text-text-secondary">
              Waitlist
            </span>
          ) : null}
        </div>
      </Link>

      <button
        type="button"
        aria-label={liked ? 'Remove from wishlist' : 'Add to wishlist'}
        onClick={() => {
          wishlist.toggle(product.id, product.finishes[0].id, product.lightTemperatures[1]?.id ?? 'warm')
          pushToast(liked ? 'Removed from wishlist' : 'Saved to wishlist', 'success')
        }}
        className="absolute right-3 top-3 rounded-full bg-black/50 p-2 text-text-primary backdrop-blur hover:bg-black/70"
      >
        <Heart className={cn('h-4 w-4', liked && 'fill-accent-warm text-accent-warm')} />
      </button>

      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-text-secondary">{product.category}</p>
            <h3 className="mt-1 text-lg font-semibold leading-snug">
              <Link to={`/product/${product.slug}`} className="hover:text-accent-soft">
                {product.name}
              </Link>
            </h3>
          </div>
          <div className="flex items-center gap-1 text-sm text-accent-soft">
            <Star className="h-3.5 w-3.5 fill-accent-soft" />
            {product.rating.toFixed(1)}
          </div>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold">{formatPrice(product.price)}</span>
          {product.originalPrice > product.price ? (
            <span className="text-sm text-text-secondary line-through">
              {formatPrice(product.originalPrice)}
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {product.finishes.slice(0, 5).map((finish) => (
            <span
              key={finish.id}
              title={finish.name}
              className="h-4 w-4 rounded-full ring-1 ring-white/20"
              style={{ backgroundColor: finish.color }}
            />
          ))}
          <span
            className="ml-auto h-2 w-8 rounded-full bg-accent-warm/40 opacity-60 transition group-hover:bg-accent-warm group-hover:opacity-100"
            aria-hidden
          />
        </div>

        <Link
          to={`/product/${product.slug}`}
          className="inline-flex w-full items-center justify-center rounded-full bg-accent-warm px-4 py-2.5 text-sm font-medium text-bg-primary opacity-100 shadow-[0_0_24px_rgba(244,182,91,0.2)] transition md:opacity-0 md:group-hover:opacity-100"
        >
          Experience Light
        </Link>
      </div>
    </motion.article>
  )
}
