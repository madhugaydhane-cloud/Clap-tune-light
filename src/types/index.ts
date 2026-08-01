export type ProductCategory =
  | 'Table Lamps'
  | 'Floor Lamps'
  | 'Pendant Lights'
  | 'Wall Lights'
  | 'Desk Lamps'
  | 'Smart Lamps'

export type RoomType =
  | 'Modern Living Room'
  | 'Minimal Bedroom'
  | 'Study Room'
  | 'Reading Corner'
  | 'Dining Space'

export type LightTemperature = {
  id: string
  label: string
  kelvin: number
  color: string
}

export type FinishOption = {
  id: string
  name: string
  color: string
}

export type ProductReview = {
  id: string
  author: string
  rating: number
  title: string
  body: string
  date: string
}

export type Product = {
  id: string
  name: string
  slug: string
  category: ProductCategory
  price: number
  originalPrice: number
  currency: string
  description: string
  shortDescription: string
  images: string[]
  modelPath: string | null
  colours: FinishOption[]
  materials: string[]
  finishes: FinishOption[]
  lightTemperatures: LightTemperature[]
  brightnessLevels: number[]
  dimensions: {
    height: string
    width: string
    depth: string
    weight: string
  }
  rating: number
  reviewsCount: number
  features: string[]
  roomRecommendations: RoomType[]
  inStock: boolean
  isNew?: boolean
  isPopular?: boolean
  smartFeatures: string[]
  energyUsage: string
  warranty: string
  deliveryEstimate: string
  bulbStyle: string[]
  cableColours: FinishOption[]
  shadeColours: FinishOption[]
  reviews: ProductReview[]
  lampStyle: 'floor' | 'table' | 'pendant' | 'wall' | 'desk' | 'smart'
}

export type CartItem = {
  productId: string
  quantity: number
  finishId: string
  material: string
  temperatureId: string
  shadeColourId: string
  cableColourId: string
}

export type WishlistItem = {
  productId: string
  finishId: string
  temperatureId: string
  addedAt: string
}

export type CompareItem = {
  productId: string
}

export type MicPermissionState =
  | 'idle'
  | 'requesting'
  | 'granted'
  | 'denied'
  | 'unavailable'

export type ClapDetectorState =
  | 'idle'
  | 'listening'
  | 'clap-detected'
  | 'noisy'
  | 'manual'

export type SensitivityLevel = 'low' | 'medium' | 'high' | 'auto'

export type CheckoutForm = {
  email: string
  phone: string
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  pincode: string
  deliveryMethod: 'standard' | 'express' | 'scheduled'
  cardName: string
  cardNumber: string
  expiry: string
  cvv: string
}

export type Toast = {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}
