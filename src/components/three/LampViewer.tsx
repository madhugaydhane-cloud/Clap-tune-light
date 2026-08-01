import { Suspense, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import { Expand, RotateCcw, ZoomIn } from 'lucide-react'
import type { Product, RoomType } from '../../types'
import { hexToRgb } from '../../utils/lighting'
import { Button } from '../common/Button'
import { ProceduralLamp } from './ProceduralLamp'
import { VirtualRoom } from './VirtualRoom'

type Props = {
  product: Product
  isOn: boolean
  brightness: number
  lightColor: string
  baseColor: string
  shadeColor: string
  metalColor: string
  room: RoomType
  ambient: number
  onFallback?: boolean
}

export function LampViewer({
  product,
  isOn,
  brightness,
  lightColor,
  baseColor,
  shadeColor,
  metalColor,
  room,
  ambient,
  onFallback = false,
}: Props) {
  const [failed] = useState(onFallback)
  const [key, setKey] = useState(0)
  const revealed = isOn ? Math.min(1, brightness / 100) : 0.08

  const fogColor = useMemo(() => {
    const [r, g, b] = hexToRgb(lightColor.startsWith('#') ? lightColor : '#F4B65B')
    const mix = isOn ? 0.15 + revealed * 0.25 : 0.02
    return `rgb(${Math.round(9 + r * mix)}, ${Math.round(9 + g * mix * 0.85)}, ${Math.round(9 + b * mix * 0.6)})`
  }, [isOn, lightColor, revealed])

  const enterFullscreen = () => {
    const el = document.getElementById('lamp-viewer-root')
    if (!el) return
    if (document.fullscreenElement) void document.exitFullscreen()
    else void el.requestFullscreen()
  }

  if (failed) {
    return (
      <div className="relative flex h-full min-h-[420px] items-center justify-center overflow-hidden rounded-3xl bg-bg-secondary">
        <img
          src={isOn ? product.images[0] : product.images[1] ?? product.images[0]}
          alt={`${product.name} preview`}
          className="max-h-full max-w-full object-contain transition duration-700"
          style={{
            filter: isOn
              ? `brightness(${0.9 + brightness / 200}) drop-shadow(0 0 ${40 * revealed}px ${lightColor})`
              : 'brightness(0.45)',
          }}
        />
        <p className="absolute bottom-4 left-4 right-4 rounded-2xl bg-black/60 px-4 py-2 text-center text-xs text-text-secondary">
          Interactive preview is temporarily unavailable.
        </p>
      </div>
    )
  }

  return (
    <div
      id="lamp-viewer-root"
      className="relative h-full min-h-[420px] overflow-hidden rounded-3xl bg-black"
    >
      <Canvas
        key={key}
        shadows
        camera={{ position: [2.6, 1.4, 4.2], fov: 42 }}
        onCreated={({ gl }) => {
          gl.setClearColor('#090909')
        }}
      >
        <color attach="background" args={[fogColor]} />
        <fog attach="fog" args={[fogColor, 6, 16]} />
        <Suspense fallback={null}>
          <VirtualRoom room={room} ambient={ambient} lightColor={lightColor} revealed={revealed} />
          <ProceduralLamp
            product={product}
            isOn={isOn}
            brightness={brightness}
            lightColor={lightColor}
            baseColor={baseColor}
            shadeColor={shadeColor}
            metalColor={metalColor}
          />
          <ContactShadows
            position={[0, -1.49, 0]}
            opacity={0.35 + revealed * 0.35}
            scale={12}
            blur={2.5}
            far={4}
          />
          <Environment preset="night" environmentIntensity={isOn ? 0.25 : 0.05} />
        </Suspense>
        <OrbitControls
          enablePan={false}
          minDistance={2.2}
          maxDistance={7}
          maxPolarAngle={Math.PI / 1.7}
          target={[0, 0.2, 0]}
        />
      </Canvas>

      <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setKey((k) => k + 1)}
          aria-label="Reset camera"
        >
          <RotateCcw className="h-4 w-4" /> Reset
        </Button>
        <Button size="sm" variant="secondary" onClick={enterFullscreen} aria-label="Fullscreen">
          <Expand className="h-4 w-4" /> Full screen
        </Button>
        <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs text-text-secondary">
          <ZoomIn className="h-3.5 w-3.5" /> Drag to rotate · Scroll to zoom
        </span>
      </div>
    </div>
  )
}
