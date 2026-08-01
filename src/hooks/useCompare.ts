import { useCallback, useMemo } from 'react'
import { getProductById } from '../data/products'
import { useLocalStorage } from './useLocalStorage'

export function useCompare() {
  const [ids, setIds] = useLocalStorage<string[]>('claplight-compare', [])

  const toggle = useCallback(
    (productId: string) => {
      setIds((prev) => {
        if (prev.includes(productId)) return prev.filter((id) => id !== productId)
        if (prev.length >= 3) return prev
        return [...prev, productId]
      })
    },
    [setIds],
  )

  const remove = useCallback(
    (productId: string) => setIds((prev) => prev.filter((id) => id !== productId)),
    [setIds],
  )

  const clear = useCallback(() => setIds([]), [setIds])

  const products = useMemo(
    () => ids.map((id) => getProductById(id)).filter((p): p is NonNullable<typeof p> => Boolean(p)),
    [ids],
  )

  return {
    ids,
    products,
    toggle,
    remove,
    clear,
    has: (id: string) => ids.includes(id),
    count: ids.length,
  }
}
