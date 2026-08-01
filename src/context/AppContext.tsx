import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useCart } from '../hooks/useCart'
import { useCompare } from '../hooks/useCompare'
import { useWishlist } from '../hooks/useWishlist'
import type { Toast } from '../types'

type AppContextValue = {
  cart: ReturnType<typeof useCart>
  wishlist: ReturnType<typeof useWishlist>
  compare: ReturnType<typeof useCompare>
  toasts: Toast[]
  pushToast: (message: string, type?: Toast['type']) => void
  dismissToast: (id: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const cart = useCart()
  const wishlist = useWishlist()
  const compare = useCompare()
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const pushToast = useCallback(
    (message: string, type: Toast['type'] = 'info') => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      setToasts((prev) => [...prev, { id, message, type }])
      window.setTimeout(() => dismissToast(id), 3200)
    },
    [dismissToast],
  )

  const value = useMemo(
    () => ({ cart, wishlist, compare, toasts, pushToast, dismissToast }),
    [cart, wishlist, compare, toasts, pushToast, dismissToast],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
