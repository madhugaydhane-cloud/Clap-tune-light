import { Link } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { EmptyState } from '../components/common/EmptyState'
import { Button } from '../components/common/Button'
import { formatPrice } from '../utils/format'

export function CartPage() {
  const { cart, wishlist, pushToast } = useApp()
  const delivery = cart.subtotal > 0 ? (cart.subtotal > 10000 ? 0 : 199) : 0
  const discount = cart.subtotal > 15000 ? Math.round(cart.subtotal * 0.05) : 0
  const tax = Math.round((cart.subtotal - discount) * 0.05)
  const total = cart.subtotal + delivery + tax - discount

  if (cart.detailed.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          title="Your cart is empty"
          description="Add a lamp from the experience page and continue to checkout."
          icon={<ShoppingBag className="h-8 w-8" />}
          action={
            <Link to="/shop">
              <Button>Continue shopping</Button>
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1.4fr_0.8fr] md:px-6">
      <div>
        <h1 className="text-4xl font-semibold">Shopping cart</h1>
        <div className="mt-8 space-y-4">
          {cart.detailed.map(({ item, product }) => {
            const finish = product.finishes.find((f) => f.id === item.finishId) ?? product.finishes[0]
            const temp =
              product.lightTemperatures.find((t) => t.id === item.temperatureId) ??
              product.lightTemperatures[0]

            return (
              <article
                key={`${product.id}-${item.finishId}`}
                className="glass flex flex-col gap-4 rounded-3xl p-4 sm:flex-row"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-32 w-full rounded-2xl object-cover sm:w-32"
                />
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold">{product.name}</h2>
                      <p className="text-sm text-text-secondary">
                        {item.material} · {finish.name} · {temp.label}
                      </p>
                      <p className="text-xs text-text-secondary">{product.deliveryEstimate}</p>
                    </div>
                    <p className="font-semibold">{formatPrice(product.price * item.quantity)}</p>
                  </div>
                  <div className="mt-auto flex flex-wrap items-center gap-3">
                    <label className="text-sm text-text-secondary">
                      Qty
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          cart.updateQuantity(product.id, item.finishId, Number(e.target.value) || 1)
                        }
                        className="ml-2 w-16 rounded-xl border border-border bg-bg-primary px-2 py-1"
                      />
                    </label>
                    <button
                      type="button"
                      className="text-sm text-text-secondary hover:text-error"
                      onClick={() => cart.removeItem(product.id, item.finishId)}
                    >
                      Remove
                    </button>
                    <button
                      type="button"
                      className="text-sm text-text-secondary hover:text-accent-soft"
                      onClick={() => {
                        wishlist.toggle(product.id, item.finishId, item.temperatureId)
                        cart.removeItem(product.id, item.finishId)
                        pushToast('Saved for later', 'success')
                      }}
                    >
                      Save for Later
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>

      <aside className="glass h-fit rounded-3xl p-6">
        <h2 className="text-xl font-semibold">Order summary</h2>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-text-secondary">Subtotal</dt>
            <dd>{formatPrice(cart.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-text-secondary">Delivery</dt>
            <dd>{delivery === 0 ? 'Free' : formatPrice(delivery)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-text-secondary">Discount</dt>
            <dd>-{formatPrice(discount)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-text-secondary">Tax</dt>
            <dd>{formatPrice(tax)}</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
            <dt>Total</dt>
            <dd>{formatPrice(total)}</dd>
          </div>
        </dl>
        <Link to="/checkout" className="mt-6 block">
          <Button className="w-full" size="lg">
            Checkout
          </Button>
        </Link>
      </aside>
    </div>
  )
}
