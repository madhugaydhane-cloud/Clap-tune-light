import { Link } from 'react-router-dom'
import { Package, Settings, User } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { EmptyState } from '../components/common/EmptyState'
import { Button } from '../components/common/Button'

export function ProfilePage() {
  const { cart, wishlist, compare } = useApp()

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
      <div className="glass flex flex-col items-start gap-4 rounded-3xl p-6 sm:flex-row sm:items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-warm/15 text-accent-warm">
          <User className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-3xl font-semibold">Guest profile</h1>
          <p className="mt-1 text-text-secondary">
            Mock account for the ClapLight prototype. Preferences stay in local storage.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Cart items" value={cart.count} to="/cart" />
        <Stat label="Wishlist" value={wishlist.count} to="/wishlist" />
        <Stat label="Compare" value={compare.count} to="/compare" />
      </div>

      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <article className="glass rounded-3xl p-6">
          <Package className="h-5 w-5 text-accent-warm" />
          <h2 className="mt-3 text-xl font-semibold">Orders</h2>
          <EmptyState
            className="mt-4 border-0 bg-transparent p-0"
            title="No recently viewed orders"
            description="Completed demo checkouts appear as confirmation pages only."
          />
        </article>
        <article className="glass rounded-3xl p-6">
          <Settings className="h-5 w-5 text-accent-warm" />
          <h2 className="mt-3 text-xl font-semibold">Preferences</h2>
          <ul className="mt-4 space-y-2 text-sm text-text-secondary">
            <li>Default sensitivity: Medium</li>
            <li>Reduced motion: respected via system setting</li>
            <li>Currency: INR</li>
            <li>Microphone: local processing only</li>
          </ul>
          <Link to="/about" className="mt-6 inline-block">
            <Button variant="secondary" size="sm">
              Privacy & technology
            </Button>
          </Link>
        </article>
      </section>
    </div>
  )
}

function Stat({ label, value, to }: { label: string; value: number; to: string }) {
  return (
    <Link to={to} className="glass rounded-3xl p-5 transition hover:border-accent-warm/40">
      <p className="text-sm text-text-secondary">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </Link>
  )
}
