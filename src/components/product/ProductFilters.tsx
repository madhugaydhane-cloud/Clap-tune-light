import type { ReactNode } from 'react'
import { categories, rooms } from '../../data/products'
import { DEFAULT_TEMPERATURES } from '../../utils/lighting'
import type { ProductCategory, RoomType } from '../../types'
import { cn } from '../../utils/format'

export type ShopFilters = {
  category: ProductCategory | 'All'
  priceMax: number
  temperatureId: string | 'All'
  material: string | 'All'
  colour: string | 'All'
  room: RoomType | 'All'
  smartOnly: boolean
  inStockOnly: boolean
  minRating: number
  sort: string
  query: string
}

type Props = {
  filters: ShopFilters
  onChange: (next: ShopFilters) => void
  materials: string[]
  colours: string[]
}

export function ProductFilters({ filters, onChange, materials, colours }: Props) {
  const set = <K extends keyof ShopFilters>(key: K, value: ShopFilters[K]) =>
    onChange({ ...filters, [key]: value })

  return (
    <aside className="glass scrollbar-thin sticky top-24 max-h-[calc(100vh-7rem)] space-y-6 overflow-y-auto rounded-3xl p-5">
      <div>
        <label htmlFor="search" className="text-sm font-medium">
          Search
        </label>
        <input
          id="search"
          value={filters.query}
          onChange={(e) => set('query', e.target.value)}
          placeholder="Search lamps…"
          className="mt-2 w-full rounded-2xl border border-border bg-bg-primary px-3 py-2.5 text-sm outline-none focus:border-accent-warm"
        />
      </div>

      <FilterGroup label="Category">
        {(['All', ...categories] as const).map((cat) => (
          <Chip
            key={cat}
            active={filters.category === cat}
            onClick={() => set('category', cat)}
            label={cat}
          />
        ))}
      </FilterGroup>

      <div>
        <label htmlFor="price" className="text-sm font-medium">
          Max price: ₹{filters.priceMax.toLocaleString('en-IN')}
        </label>
        <input
          id="price"
          type="range"
          min={5000}
          max={25000}
          step={500}
          value={filters.priceMax}
          onChange={(e) => set('priceMax', Number(e.target.value))}
          className="mt-3 w-full accent-accent-warm"
        />
      </div>

      <FilterGroup label="Light temperature">
        <Chip
          active={filters.temperatureId === 'All'}
          onClick={() => set('temperatureId', 'All')}
          label="All"
        />
        {DEFAULT_TEMPERATURES.map((t) => (
          <Chip
            key={t.id}
            active={filters.temperatureId === t.id}
            onClick={() => set('temperatureId', t.id)}
            label={t.label}
          />
        ))}
      </FilterGroup>

      <div>
        <label htmlFor="material" className="text-sm font-medium">
          Material
        </label>
        <select
          id="material"
          value={filters.material}
          onChange={(e) => set('material', e.target.value)}
          className="mt-2 w-full rounded-2xl border border-border bg-bg-primary px-3 py-2.5 text-sm"
        >
          <option value="All">All materials</option>
          {materials.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="colour" className="text-sm font-medium">
          Colour
        </label>
        <select
          id="colour"
          value={filters.colour}
          onChange={(e) => set('colour', e.target.value)}
          className="mt-2 w-full rounded-2xl border border-border bg-bg-primary px-3 py-2.5 text-sm"
        >
          <option value="All">All colours</option>
          {colours.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <FilterGroup label="Room type">
        {(['All', ...rooms] as const).map((room) => (
          <Chip
            key={room}
            active={filters.room === room}
            onClick={() => set('room', room)}
            label={room}
          />
        ))}
      </FilterGroup>

      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={filters.smartOnly}
          onChange={(e) => set('smartOnly', e.target.checked)}
          className="accent-accent-warm"
        />
        Smart features
      </label>

      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={filters.inStockOnly}
          onChange={(e) => set('inStockOnly', e.target.checked)}
          className="accent-accent-warm"
        />
        In stock only
      </label>

      <div>
        <label htmlFor="rating" className="text-sm font-medium">
          Minimum rating: {filters.minRating.toFixed(1)}
        </label>
        <input
          id="rating"
          type="range"
          min={0}
          max={5}
          step={0.5}
          value={filters.minRating}
          onChange={(e) => set('minRating', Number(e.target.value))}
          className="mt-3 w-full accent-accent-warm"
        />
      </div>

      <div>
        <label htmlFor="sort" className="text-sm font-medium">
          Sort by
        </label>
        <select
          id="sort"
          value={filters.sort}
          onChange={(e) => set('sort', e.target.value)}
          className="mt-2 w-full rounded-2xl border border-border bg-bg-primary px-3 py-2.5 text-sm"
        >
          <option value="recommended">Recommended</option>
          <option value="new">New Arrivals</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="popular">Most Popular</option>
          <option value="rating">Best Rated</option>
        </select>
      </div>
    </aside>
  )
}

function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1.5 text-xs transition',
        active
          ? 'border-accent-warm bg-accent-warm/15 text-accent-soft'
          : 'border-border text-text-secondary hover:border-white/20 hover:text-text-primary',
      )}
    >
      {label}
    </button>
  )
}
