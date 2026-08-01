import type { Product } from '../../types'
import { EmptyState } from '../common/EmptyState'
import { ProductCard } from './ProductCard'

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <EmptyState
        title="No lamps match your filters"
        description="Try adjusting category, price, or light temperature to rediscover the collection."
      />
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
