import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { products } from '../data/products'
import { ProductFilters, type ShopFilters } from '../components/product/ProductFilters'
import { ProductGrid } from '../components/product/ProductGrid'

const initialFilters: ShopFilters = {
  category: 'All',
  priceMax: 25000,
  temperatureId: 'All',
  material: 'All',
  colour: 'All',
  room: 'All',
  smartOnly: false,
  inStockOnly: false,
  minRating: 0,
  sort: 'recommended',
  query: '',
}

export function ShopPage() {
  const [params] = useSearchParams()
  const view = params.get('view')
  const [filters, setFilters] = useState<ShopFilters>(initialFilters)
  const [showFilters, setShowFilters] = useState(false)

  const materials = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.materials))).sort(),
    [],
  )
  const colours = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.finishes.map((f) => f.name)))).sort(),
    [],
  )

  const filtered = useMemo(() => {
    let list = [...products]
    if (filters.query) {
      const q = filters.query.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q),
      )
    }
    if (filters.category !== 'All') list = list.filter((p) => p.category === filters.category)
    list = list.filter((p) => p.price <= filters.priceMax)
    if (filters.temperatureId !== 'All') {
      list = list.filter((p) => p.lightTemperatures.some((t) => t.id === filters.temperatureId))
    }
    if (filters.material !== 'All') list = list.filter((p) => p.materials.includes(filters.material))
    if (filters.colour !== 'All') {
      list = list.filter((p) => p.finishes.some((f) => f.name === filters.colour))
    }
    if (filters.room !== 'All') {
      const room = filters.room
      list = list.filter((p) => p.roomRecommendations.includes(room))
    }
    if (filters.smartOnly) list = list.filter((p) => p.smartFeatures.length > 0 || p.category === 'Smart Lamps')
    if (filters.inStockOnly) list = list.filter((p) => p.inStock)
    list = list.filter((p) => p.rating >= filters.minRating)

    switch (filters.sort) {
      case 'new':
        list.sort((a, b) => Number(b.isNew) - Number(a.isNew))
        break
      case 'price-asc':
        list.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        list.sort((a, b) => b.price - a.price)
        break
      case 'popular':
        list.sort((a, b) => Number(b.isPopular) - Number(a.isPopular) || b.reviewsCount - a.reviewsCount)
        break
      case 'rating':
        list.sort((a, b) => b.rating - a.rating)
        break
      default:
        list.sort((a, b) => Number(b.isPopular) - Number(a.isPopular) || b.rating - a.rating)
    }
    return list
  }, [filters])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.18em] text-accent-soft">
          {view === 'rooms' ? 'Rooms' : view === 'collections' ? 'Collections' : 'Shop'}
        </p>
        <h1 className="mt-2 text-4xl font-semibold">Designer lamps, ready to experience</h1>
        <p className="mt-3 max-w-2xl text-text-secondary">
          Browse the ClapLight collection. Open any product to enter a dark virtual room and clap the
          lamp to life.
        </p>
      </div>

      <div className="mb-4 lg:hidden">
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          className="rounded-full border border-border px-4 py-2 text-sm"
        >
          {showFilters ? 'Hide filters' : 'Show filters'}
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <div className={showFilters ? 'block' : 'hidden lg:block'}>
          <ProductFilters
            filters={filters}
            onChange={setFilters}
            materials={materials}
            colours={colours}
          />
        </div>
        <div>
          <p className="mb-4 text-sm text-text-secondary">{filtered.length} lamps</p>
          <ProductGrid products={filtered} />
        </div>
      </div>
    </div>
  )
}
