import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { cn } from '../../utils/format'

const links = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/shop?view=collections', label: 'Collections' },
  { to: '/shop?view=rooms', label: 'Rooms' },
  { to: '/about', label: 'How It Works' },
  { to: '/about#technology', label: 'About' },
]

export function Navbar() {
  const { cart, wishlist } = useApp()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isExperience = location.pathname.startsWith('/product/')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.search])

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled || !isExperience
          ? 'border-b border-border bg-bg-primary/80 backdrop-blur-xl'
          : 'bg-transparent',
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Link to="/" className="flex items-center gap-2" aria-label="ClapLight home">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-warm/15 ring-1 ring-accent-warm/40">
            <span className="h-2.5 w-2.5 rounded-full bg-accent-warm shadow-[0_0_12px_#F4B65B]" />
          </span>
          <span className="text-lg font-bold tracking-tight">ClapLight</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'rounded-full px-3 py-2 text-sm text-text-secondary transition hover:text-text-primary',
                  isActive && link.to === location.pathname && 'text-accent-soft',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/shop"
            aria-label="Search products"
            className="rounded-full p-2 text-text-secondary hover:bg-white/5 hover:text-text-primary"
          >
            <Search className="h-5 w-5" />
          </Link>
          <Link
            to="/wishlist"
            aria-label={`Wishlist, ${wishlist.count} items`}
            className="relative rounded-full p-2 text-text-secondary hover:bg-white/5 hover:text-text-primary"
          >
            <Heart className="h-5 w-5" />
            {wishlist.count > 0 ? (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-warm px-1 text-[10px] font-bold text-bg-primary">
                {wishlist.count}
              </span>
            ) : null}
          </Link>
          <Link
            to="/cart"
            aria-label={`Cart, ${cart.count} items`}
            className="relative rounded-full p-2 text-text-secondary hover:bg-white/5 hover:text-text-primary"
          >
            <ShoppingBag className="h-5 w-5" />
            {cart.count > 0 ? (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent-warm px-1 text-[10px] font-bold text-bg-primary">
                {cart.count}
              </span>
            ) : null}
          </Link>
          <Link
            to="/profile"
            aria-label="User profile"
            className="rounded-full p-2 text-text-secondary hover:bg-white/5 hover:text-text-primary"
          >
            <User className="h-5 w-5" />
          </Link>
          <button
            type="button"
            className="rounded-full p-2 text-text-secondary hover:bg-white/5 lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="border-t border-border bg-bg-primary/95 px-4 py-4 lg:hidden" aria-label="Mobile">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="rounded-xl px-3 py-3 text-text-secondary hover:bg-white/5 hover:text-text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  )
}
