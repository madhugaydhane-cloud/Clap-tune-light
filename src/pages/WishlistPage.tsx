import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { EmptyState } from '../components/common/EmptyState'
import { Button } from '../components/common/Button'
import { formatPrice } from '../utils/format'

export function WishlistPage() {
  const { wishlist, cart, pushToast } = useApp()

  if (wishlist.detailed.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          title="Your collection is waiting to glow."
          description="Save lamps you love and experience them again anytime."
          icon={<Heart className="h-8 w-8" />}
          action={
            <Link to="/shop">
              <Button>Explore the Collection</Button>
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <h1 className="text-4xl font-semibold">Wishlist</h1>
      <p className="mt-2 text-text-secondary">{wishlist.count} saved lamps</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {wishlist.detailed.map(({ item, product }) => {
          const finish = product.finishes.find((f) => f.id === item.finishId) ?? product.finishes[0]
          const temp =
            product.lightTemperatures.find((t) => t.id === item.temperatureId) ??
            product.lightTemperatures[0]

          return (
            <article key={product.id} className="glass overflow-hidden rounded-3xl">
              <img src={product.images[0]} alt={product.name} className="aspect-[4/3] w-full object-cover" />
              <div className="space-y-3 p-5">
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <p className="text-lg">{formatPrice(product.price)}</p>
                <p className="text-sm text-text-secondary">
                  {finish.name} · {temp.label} ({temp.kelvin}K)
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      cart.addItem({
                        productId: product.id,
                        quantity: 1,
                        finishId: finish.id,
                        material: product.materials[0],
                        temperatureId: temp.id,
                        shadeColourId: product.shadeColours[0].id,
                        cableColourId: product.cableColours[0].id,
                      })
                      pushToast('Added to cart', 'success')
                    }}
                    disabled={!product.inStock}
                  >
                    Add to Cart
                  </Button>
                  <Link to={`/product/${product.slug}`}>
                    <Button size="sm" variant="secondary">
                      Experience Again
                    </Button>
                  </Link>
                  <Button size="sm" variant="ghost" onClick={() => wishlist.remove(product.id)}>
                    Remove
                  </Button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
