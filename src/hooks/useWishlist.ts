import { useCallback, useMemo } from 'react'
import { getProductById } from '../data/products'
import type { WishlistItem } from '../types'
import { useLocalStorage } from './useLocalStorage'

export function useWishlist() {
  const [items, setItems] = useLocalStorage<WishlistItem[]>('claplight-wishlist', [])

  const toggle = useCallback(
    (productId: string, finishId: string, temperatureId: string) => {
      setItems((prev) => {
        const exists = prev.find((p) => p.productId === productId)
        if (exists) return prev.filter((p) => p.productId !== productId)
        return [
          ...prev,
          {
            productId,
            finishId,
            temperatureId,
            addedAt: new Date().toISOString(),
          },
        ]
      })
    },
    [setItems],
  )

  const remove = useCallback(
    (productId: string) => {
      setItems((prev) => prev.filter((p) => p.productId !== productId))
    },
    [setItems],
  )

  const has = useCallback((productId: string) => items.some((p) => p.productId === productId), [items])

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

  return { items, detailed, toggle, remove, has, count: items.length }
}
