import { useMemo, useRef, useState } from 'react'
import { Download, Upload, X } from 'lucide-react'
import type { Product } from '../../types'
import { Button } from '../common/Button'
import { BrightnessSlider } from '../lighting/BrightnessSlider'
import { EmptyState } from '../common/EmptyState'

type Props = {
  open: boolean
  product: Product
  lightColor: string
  onClose: () => void
}

export function RoomPreviewModal({ open, product, lightColor, onClose }: Props) {
  const [image, setImage] = useState<string | null>(null)
  const [brightness, setBrightness] = useState(60)
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [pos, setPos] = useState({ x: 50, y: 55 })
  const [before, setBefore] = useState(false)
  const dragRef = useRef<{ x: number; y: number } | null>(null)

  const glow = useMemo(
    () => `drop-shadow(0 0 ${18 + brightness / 3}px ${lightColor}) brightness(${0.7 + brightness / 180})`,
    [brightness, lightColor],
  )

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div
        className="glass relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl p-5 md:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="room-preview-title"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="room-preview-title" className="text-2xl font-semibold">
              Room Preview
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Simulated placement — not true AR. Upload a room photo and position the lamp.
            </p>
          </div>
          <button type="button" aria-label="Close" onClick={onClose} className="rounded-full p-2 hover:bg-white/5">
            <X className="h-5 w-5" />
          </button>
        </div>

        {!image ? (
          <EmptyState
            title="No room image uploaded"
            description="Upload a photo of your space to preview this lamp."
            icon={<Upload className="h-8 w-8" />}
            action={
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-accent-warm px-5 py-2.5 text-sm font-medium text-bg-primary">
                <Upload className="h-4 w-4" />
                Upload room image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    const url = URL.createObjectURL(file)
                    setImage(url)
                  }}
                />
              </label>
            }
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div
              className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-bg-secondary"
              onPointerDown={(e) => {
                dragRef.current = { x: e.clientX, y: e.clientY }
              }}
              onPointerMove={(e) => {
                if (!dragRef.current) return
                const dx = e.clientX - dragRef.current.x
                const dy = e.clientY - dragRef.current.y
                dragRef.current = { x: e.clientX, y: e.clientY }
                setPos((p) => ({
                  x: Math.min(90, Math.max(10, p.x + dx * 0.15)),
                  y: Math.min(90, Math.max(10, p.y + dy * 0.15)),
                }))
              }}
              onPointerUp={() => {
                dragRef.current = null
              }}
              onPointerLeave={() => {
                dragRef.current = null
              }}
            >
              <img src={image} alt="Your room" className="h-full w-full object-cover" />
              {!before ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  draggable={false}
                  className="absolute w-28 cursor-grab active:cursor-grabbing md:w-36"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
                    filter: glow,
                  }}
                />
              ) : null}
            </div>

            <div className="space-y-5">
              <BrightnessSlider value={brightness} onChange={setBrightness} />
              <label className="block text-sm">
                Size
                <input
                  type="range"
                  min={0.6}
                  max={1.8}
                  step={0.05}
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="mt-2 w-full accent-accent-warm"
                />
              </label>
              <label className="block text-sm">
                Rotation
                <input
                  type="range"
                  min={-30}
                  max={30}
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="mt-2 w-full accent-accent-warm"
                />
              </label>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => setBefore((v) => !v)}>
                  {before ? 'Show after' : 'Before / after'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    const a = document.createElement('a')
                    a.href = product.images[0]
                    a.download = `${product.slug}-preview.svg`
                    a.click()
                  }}
                >
                  <Download className="h-4 w-4" /> Save preview
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
