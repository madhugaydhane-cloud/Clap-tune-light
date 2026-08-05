import { BarChart3, Flower2, History, UserRound } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import type { NavTab } from '../../types'

const ITEMS: Array<{
  id: NavTab
  label: string
  to: string
  icon: typeof Flower2
}> = [
  { id: 'garden', label: 'Garden', to: '/', icon: Flower2 },
  { id: 'history', label: 'History', to: '/history', icon: History },
  { id: 'insights', label: 'Insights', to: '/insights', icon: BarChart3 },
  { id: 'profile', label: 'Profile', to: '/profile', icon: UserRound },
]

export function BottomNavigation() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-cream-dark/60 bg-surface/95 backdrop-blur-md lg:left-0 lg:top-0 lg:bottom-0 lg:w-56 lg:border-t-0 lg:border-r"
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 lg:max-w-none lg:flex-col lg:gap-2 lg:px-4 lg:py-8">
        <li className="mb-6 hidden px-3 lg:block">
          <p className="font-display text-2xl text-forest">MoodBloom</p>
          <p className="mt-1 text-xs text-muted">Your digital garden</p>
        </li>
        {ITEMS.map(({ id, label, to, icon: Icon }) => (
          <li key={id} className="flex-1 lg:flex-none">
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-xs font-medium transition lg:flex-row lg:gap-3 lg:px-3 lg:py-3 lg:text-sm ${
                  isActive
                    ? 'bg-sage-soft text-sage-deep'
                    : 'text-forest-muted hover:bg-cream/80'
                }`
              }
            >
              <Icon className="h-5 w-5" aria-hidden />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
