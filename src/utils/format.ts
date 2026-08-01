export function formatPrice(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function discountPercent(price: number, originalPrice: number): number {
  if (originalPrice <= price) return 0
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}

export function kelvinToRgb(kelvin: number): string {
  const temp = kelvin / 100
  let r: number
  let g: number
  let b: number

  if (temp <= 66) {
    r = 255
    g = Math.min(255, Math.max(0, 99.4708025861 * Math.log(temp) - 161.1195681661))
    b =
      temp <= 19
        ? 0
        : Math.min(255, Math.max(0, 138.5177312231 * Math.log(temp - 10) - 305.0447927307))
  } else {
    r = Math.min(255, Math.max(0, 329.698727446 * Math.pow(temp - 60, -0.1332047592)))
    g = Math.min(255, Math.max(0, 288.1221695283 * Math.pow(temp - 60, -0.0755148492)))
    b = 255
  }

  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}
