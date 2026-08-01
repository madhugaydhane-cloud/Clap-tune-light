import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { EmptyState } from '../components/common/EmptyState'
import { Button } from '../components/common/Button'
import { formatPrice } from '../utils/format'

export function ComparePage() {
  const { compare } = useApp()
  const { products } = compare

  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          title="No comparison products"
          description="Add up to three lamps from the shop to compare price, light, and suitability."
          action={
            <Link to="/shop">
              <Button>Browse lamps</Button>
            </Link>
          }
        />
      </div>
    )
  }

  const bestReading = [...products].sort((a, b) => {
    const score = (p: (typeof products)[0]) =>
      (p.roomRecommendations.includes('Reading Corner') || p.roomRecommendations.includes('Study Room')
        ? 2
        : 0) + p.rating
    return score(b) - score(a)
  })[0]

  const bestAmbience = [...products].sort((a, b) => b.lightTemperatures.length - a.lightTemperatures.length || b.rating - a.rating)[0]
  const bestValue = [...products].sort((a, b) => a.price / a.rating - b.price / b.rating)[0]

  const rows: Array<{ label: string; get: (p: (typeof products)[0]) => string }> = [
    { label: 'Price', get: (p) => formatPrice(p.price) },
    { label: 'Type', get: (p) => p.category },
    { label: 'Dimensions', get: (p) => `${p.dimensions.height} × ${p.dimensions.width}` },
    { label: 'Material', get: (p) => p.materials.join(', ') },
    { label: 'Brightness', get: (p) => `${Math.min(...p.brightnessLevels)}–${Math.max(...p.brightnessLevels)}%` },
    {
      label: 'Light temperature',
      get: (p) => `${p.lightTemperatures[0].kelvin}–${p.lightTemperatures[p.lightTemperatures.length - 1].kelvin}K`,
    },
    { label: 'Smart controls', get: (p) => (p.smartFeatures.length ? p.smartFeatures.join(', ') : '—') },
    { label: 'Energy usage', get: (p) => p.energyUsage },
    { label: 'Room suitability', get: (p) => p.roomRecommendations.join(', ') },
    { label: 'Warranty', get: (p) => p.warranty },
    { label: 'Rating', get: (p) => `${p.rating.toFixed(1)} (${p.reviewsCount})` },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold">Compare lamps</h1>
          <p className="mt-2 text-text-secondary">Up to three products side by side.</p>
        </div>
        <Button variant="secondary" onClick={() => compare.clear()}>
          Clear all
        </Button>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <SummaryCard title="Best for Reading" name={bestReading.name} />
        <SummaryCard title="Best for Ambience" name={bestAmbience.name} />
        <SummaryCard title="Best Value" name={bestValue.name} />
      </div>

      <div className="glass overflow-x-auto rounded-3xl">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-4 text-text-secondary">Feature</th>
              {products.map((p) => (
                <th key={p.id} className="px-4 py-4">
                  <div className="space-y-2">
                    <img src={p.images[0]} alt="" className="h-24 w-24 rounded-2xl object-cover" />
                    <Link to={`/product/${p.slug}`} className="block font-medium hover:text-accent-soft">
                      {p.name}
                    </Link>
                    <button
                      type="button"
                      className="text-xs text-text-secondary hover:text-error"
                      onClick={() => compare.remove(p.id)}
                    >
                      Remove
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-border/70">
                <td className="px-4 py-3 text-text-secondary">{row.label}</td>
                {products.map((p) => (
                  <td key={p.id} className="px-4 py-3">
                    {row.get(p)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SummaryCard({ title, name }: { title: string; name: string }) {
  return (
    <div className="glass rounded-3xl p-5">
      <p className="text-xs uppercase tracking-wide text-accent-soft">{title}</p>
      <p className="mt-2 text-lg font-semibold">{name}</p>
    </div>
  )
}
