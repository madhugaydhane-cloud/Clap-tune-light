import type { LightTemperature } from '../types'

export const DEFAULT_TEMPERATURES: LightTemperature[] = [
  { id: 'candle', label: 'Candle', kelvin: 2200, color: '#FFB56A' },
  { id: 'warm', label: 'Warm', kelvin: 2700, color: '#FFD19A' },
  { id: 'soft-white', label: 'Soft White', kelvin: 3000, color: '#FFE4B8' },
  { id: 'neutral', label: 'Neutral', kelvin: 4000, color: '#FFF4DE' },
  { id: 'cool', label: 'Cool', kelvin: 5000, color: '#F3F7FF' },
  { id: 'daylight', label: 'Daylight', kelvin: 6500, color: '#EAF2FF' },
]

export const BRIGHTNESS_PRESETS = [
  { id: 'night', label: 'Night', value: 15 },
  { id: 'relax', label: 'Relax', value: 35 },
  { id: 'reading', label: 'Reading', value: 60 },
  { id: 'focus', label: 'Focus', value: 80 },
  { id: 'full', label: 'Full Brightness', value: 100 },
] as const

export function roomAmbientFromTemp(kelvin: number, brightness: number, isOn: boolean): number {
  if (!isOn) return 0.02
  return 0.05 + (brightness / 100) * (kelvin > 4000 ? 0.35 : 0.28)
}

export function hexToRgb(hex: string): [number, number, number] {
  const cleaned = hex.replace('#', '')
  const full =
    cleaned.length === 3
      ? cleaned
          .split('')
          .map((c) => c + c)
          .join('')
      : cleaned
  const num = Number.parseInt(full, 16)
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255]
}
