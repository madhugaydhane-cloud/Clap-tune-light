import { useCallback, useMemo } from 'react'
import { getProductById } from '../data/products'
import type { CartItem } from '../types'
import { useLocalStorage } from './useLocalStorage'

export function useCart() {
  const [items, setItems] = useLocalStorage<CartItem[]>('claplight-cart', [])

  const addItem = useCallback(
    (item: CartItem) => {
      setItems((prev) => {
        const existing = prev.find(
          (p) =>
            p.productId === item.productId &&
            p.finishId === item.finishId &&
            p.temperatureId === item.temperatureId &&
            p.material === item.material,
        )
        if (existing) {
          return prev.map((p) =>
            p === existing ? { ...p, quantity: p.quantity + item.quantity } : p,
          )
        }
        return [...prev, item]
      })
    },
    [setItems],
  )

  const removeItem = useCallback(
    (productId: string, finishId: string) => {
      setItems((prev) => prev.filter((p) => !(p.productId === productId && p.finishId === finishId)))
    },
    [setItems],
  )

  const updateQuantity = useCallback(
    (productId: string, finishId: string, quantity: number) => {
      setItems((prev) =>
        prev
          .map((p) =>
            p.productId === productId && p.finishId === finishId
              ? { ...p, quantity: Math.max(1, quantity) }
              : p,
          )
          .filter((p) => p.quantity > 0),
      )
    },
    [setItems],
  )

  const clear = useCallback(() => setItems([]), [setItems])

  const detailed = useMemo(
    () =>
      items
        .map((item) => {
          const product = getProductById(item.productId)
          if (!product) return null
          return { item, product }
        })
        .filter((x): x is NonNullable<typeof x> => Boolean(x)),
    [items],
  )

  const subtotal = detailed.reduce((sum, { item, product }) => sum + product.price * item.quantity, 0)
  const count = items.reduce((sum, item) => sum + item.quantity, 0)

  return {
    items,
    detailed,
    count,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clear,
  }
}
