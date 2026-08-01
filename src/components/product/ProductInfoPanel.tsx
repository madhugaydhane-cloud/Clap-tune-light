import type { ReactNode } from 'react'
import {
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  ShoppingBag,
  Star,
  Truck,
} from 'lucide-react'
import type { Product } from '../../types'
import { discountPercent, formatPrice } from '../../utils/format'
import { Button } from '../common/Button'
import { CompareButton } from './CompareButton'
import { WishlistButton } from './WishlistButton'

type Props = {
  product: Product
  collapsed: boolean
  onToggleCollapse: () => void
  quantity: number
  onQuantity: (n: number) => void
  onAddToCart: () => void
  onRoomPreview: () => void
  finishName: string
  finishId: string
  temperatureId: string
  children?: ReactNode
}

export function ProductInfoPanel({
  product,
  collapsed,
  onToggleCollapse,
  quantity,
  onQuantity,
  onAddToCart,
  onRoomPreview,
  finishName,
  finishId,
  temperatureId,
  children,
}: Props) {
  const discount = discountPercent(product.price, product.originalPrice)

  return (
    <aside className="glass flex max-h-[calc(100vh-6rem)] flex-col overflow-hidden rounded-3xl">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-text-secondary">{product.category}</p>
          <h1 className="text-xl font-semibold md:text-2xl">{product.name}</h1>
        </div>
        <button
          type="button"
          onClick={onToggleCollapse}
          className="rounded-full border border-border p-2 hover:bg-white/5"
          aria-label={collapsed ? 'Expand product panel' : 'Collapse product panel'}
        >
          {collapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {!collapsed ? (
        <div className="scrollbar-thin space-y-5 overflow-y-auto px-5 py-5">
          <div className="flex items-center gap-2 text-sm text-accent-soft">
            <Star className="h-4 w-4 fill-accent-soft" />
            {product.rating.toFixed(1)} · {product.reviewsCount} reviews
          </div>
          <p className="text-sm leading-relaxed text-text-secondary">{product.shortDescription}</p>

          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-semibold">{formatPrice(product.price)}</span>
            {discount > 0 ? (
              <>
                <span className="text-text-secondary line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="rounded-full bg-accent-warm/15 px-2 py-0.5 text-xs text-accent-soft">
                  {discount}% off
                </span>
              </>
            ) : null}
          </div>

          <p className="flex items-center gap-2 text-xs text-text-secondary">
            <Truck className="h-3.5 w-3.5 text-accent-warm" />
            {product.deliveryEstimate} · Finish: {finishName}
          </p>

          {children}

          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-full border border-border">
              <button
                type="button"
                aria-label="Decrease quantity"
                className="p-2"
                onClick={() => onQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-8 text-center text-sm">{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                className="p-2"
                onClick={() => onQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid gap-2">
            <Button
              onClick={onAddToCart}
              disabled={!product.inStock}
              className="w-full"
            >
              <ShoppingBag className="h-4 w-4" />
              {product.inStock ? 'Add to Cart' : 'Currently unavailable'}
            </Button>
            {!product.inStock ? (
              <p className="text-xs text-error">
                Currently unavailable. Join the waitlist to be notified.
              </p>
            ) : null}
            <div className="grid grid-cols-2 gap-2">
              <WishlistButton
                productId={product.id}
                finishId={finishId}
                temperatureId={temperatureId}
              />
              <CompareButton productId={product.id} />
            </div>
            <Button variant="secondary" onClick={onRoomPreview} className="w-full">
              View in Your Space
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {product.features.map((feature) => (
              <div
                key={feature}
                className="rounded-2xl border border-border bg-bg-primary/40 px-3 py-2 text-xs text-text-secondary"
              >
                {feature}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="px-5 py-4 text-sm text-text-secondary">Panel collapsed for full immersion.</p>
      )}
    </aside>
  )
}
