import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { HelpCircle, X } from 'lucide-react'
import { getProductBySlug } from '../data/products'
import { useApp } from '../context/AppContext'
import { useClapDetection } from '../hooks/useClapDetection'
import { useMicrophonePermission } from '../hooks/useMicrophonePermission'
import { ClapDetectorPanel } from '../components/audio/ClapDetector'
import { MicrophonePermissionModal } from '../components/audio/MicrophonePermissionModal'
import { BrightnessSlider } from '../components/lighting/BrightnessSlider'
import { ManualLightControl } from '../components/lighting/ManualLightControl'
import { RoomSelector } from '../components/lighting/RoomSelector'
import { TemperatureSelector } from '../components/lighting/TemperatureSelector'
import { AIHelper } from '../components/product/AIHelper'
import { CustomisationPanel } from '../components/product/CustomisationPanel'
import { ProductInfoPanel } from '../components/product/ProductInfoPanel'
import { RoomPreviewModal } from '../components/product/RoomPreviewModal'
import { LampViewer } from '../components/three/LampViewer'
import { Button } from '../components/common/Button'
import { ErrorState } from '../components/common/ErrorState'
import type { RoomType, SensitivityLevel } from '../types'
import { roomAmbientFromTemp } from '../utils/lighting'
import { playSwitchSound } from '../utils/switchSound'

export function ProductPage() {
  const { slug = '' } = useParams()
  const product = getProductBySlug(slug)
  const { cart, pushToast } = useApp()

  const [isOn, setIsOn] = useState(false)
  const [brightness, setBrightness] = useState(60)
  const [temperatureId, setTemperatureId] = useState(product?.lightTemperatures[1]?.id ?? 'warm')
  const [room, setRoom] = useState<RoomType>(product?.roomRecommendations[0] ?? 'Modern Living Room')
  const [finishId, setFinishId] = useState(product?.finishes[0]?.id ?? '')
  const [shadeId, setShadeId] = useState(product?.shadeColours[0]?.id ?? '')
  const [cableId, setCableId] = useState(product?.cableColours[0]?.id ?? '')
  const [material, setMaterial] = useState(product?.materials[0] ?? '')
  const [bulbStyle, setBulbStyle] = useState(product?.bulbStyle[0] ?? '')
  const [quantity, setQuantity] = useState(1)
  const [panelCollapsed, setPanelCollapsed] = useState(false)
  const [showMicModal, setShowMicModal] = useState(true)
  const [manualMode, setManualMode] = useState(false)
  const [sensitivity, setSensitivity] = useState<SensitivityLevel>('medium')
  const [doubleClap, setDoubleClap] = useState(false)
  const [roomPreview, setRoomPreview] = useState(false)
  const [mobileSheet, setMobileSheet] = useState<'info' | 'controls' | null>(null)

  const mic = useMicrophonePermission()

  useEffect(() => {
    if (!product) return
    setTemperatureId(product.lightTemperatures[1]?.id ?? product.lightTemperatures[0].id)
    setRoom(product.roomRecommendations[0] ?? 'Modern Living Room')
    setFinishId(product.finishes[0].id)
    setShadeId(product.shadeColours[0].id)
    setCableId(product.cableColours[0].id)
    setMaterial(product.materials[0])
    setBulbStyle(product.bulbStyle[0])
    setIsOn(false)
    setShowMicModal(true)
    setManualMode(false)
  }, [product])

  const temperature = useMemo(
    () => product?.lightTemperatures.find((t) => t.id === temperatureId) ?? product?.lightTemperatures[0],
    [product, temperatureId],
  )
  const finish = product?.finishes.find((f) => f.id === finishId) ?? product?.finishes[0]
  const shade = product?.shadeColours.find((s) => s.id === shadeId) ?? product?.shadeColours[0]

  const toggleLamp = useCallback(() => {
    setIsOn((prev) => {
      const next = !prev
      playSwitchSound(next)
      return next
    })
  }, [])

  const cycleTemperature = useCallback(() => {
    if (!product) return
    const idx = product.lightTemperatures.findIndex((t) => t.id === temperatureId)
    const next = product.lightTemperatures[(idx + 1) % product.lightTemperatures.length]
    setTemperatureId(next.id)
    pushToast(`Temperature: ${next.label} (${next.kelvin}K)`, 'info')
  }, [product, pushToast, temperatureId])

  const {
    detectorState,
    level,
    threshold,
    listeningHint,
    setManualMode: setDetectorManual,
  } = useClapDetection({
    enabled: mic.state === 'granted' && !manualMode,
    stream: mic.stream,
    sensitivity,
    onClap: toggleLamp,
    doubleClapEnabled: doubleClap,
    onDoubleClap: cycleTemperature,
  })

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (e.target as HTMLElement)?.isContentEditable) {
        return
      }
      if (e.code === 'Space') {
        e.preventDefault()
        toggleLamp()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggleLamp])

  useEffect(() => {
    return () => {
      mic.stopStream()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!product || !temperature || !finish || !shade) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <ErrorState
          title="Lamp not found"
          description="This product may have moved. Explore the collection instead."
          actions={
            <Link to="/shop">
              <Button>Back to Shop</Button>
            </Link>
          }
        />
      </div>
    )
  }

  const ambient = roomAmbientFromTemp(temperature.kelvin, brightness, isOn)

  const addToCart = () => {
    cart.addItem({
      productId: product.id,
      quantity,
      finishId,
      material,
      temperatureId,
      shadeColourId: shadeId,
      cableColourId: cableId,
    })
    pushToast('Added to cart', 'success')
  }

  const controls = (
    <div className="space-y-5">
      <RoomSelector value={room} onChange={setRoom} />
      <TemperatureSelector
        temperatures={product.lightTemperatures}
        value={temperatureId}
        onChange={setTemperatureId}
        disabled={!isOn}
      />
      <BrightnessSlider value={brightness} onChange={setBrightness} disabled={!isOn} />
      <CustomisationPanel
        product={product}
        finishId={finishId}
        shadeId={shadeId}
        cableId={cableId}
        material={material}
        bulbStyle={bulbStyle}
        onFinish={setFinishId}
        onShade={setShadeId}
        onCable={setCableId}
        onMaterial={setMaterial}
        onBulb={setBulbStyle}
      />
      <ClapDetectorPanel
        micState={mic.state}
        detectorState={manualMode ? 'manual' : detectorState}
        level={level}
        threshold={threshold}
        sensitivity={sensitivity}
        onSensitivityChange={setSensitivity}
        listeningHint={listeningHint}
        onEnableMic={async () => {
          setManualMode(false)
          setShowMicModal(false)
          await mic.requestPermission()
        }}
        onStopMic={() => {
          mic.stopStream()
          setManualMode(true)
          setDetectorManual()
        }}
        doubleClapEnabled={doubleClap}
        onDoubleClapToggle={setDoubleClap}
      />
      <AIHelper product={product} />
    </div>
  )

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 transition-all duration-1000"
        style={{
          background: isOn
            ? `radial-gradient(circle at 50% 40%, ${temperature.color}33, transparent 50%), #090909`
            : '#050505',
        }}
      />

      <div className="relative mx-auto grid max-w-[1600px] gap-4 px-3 py-4 lg:grid-cols-[280px_1fr_340px] lg:px-6 lg:py-6">
        <div className="hidden lg:block">
          <div className="glass sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-3xl p-4 scrollbar-thin">
            {controls}
          </div>
        </div>

        <div className="relative min-h-[55vh] lg:min-h-[calc(100vh-7rem)]">
          <LampViewer
            product={product}
            isOn={isOn}
            brightness={brightness}
            lightColor={temperature.color}
            baseColor={finish.color}
            shadeColor={shade.color}
            metalColor={finish.color}
            room={room}
            ambient={ambient}
          />

          <AnimatePresence>
            {!isOn ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
              >
                <p className="text-2xl font-semibold md:text-4xl glow-text">
                  Clap to switch on your lamp.
                </p>
                <p className="mt-3 text-sm text-text-secondary md:text-base">
                  Allow microphone access and clap once. Or use manual controls / Spacebar.
                </p>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <div className="absolute bottom-4 left-1/2 z-20 flex w-[min(520px,calc(100%-2rem))] -translate-x-1/2 flex-col items-center gap-3">
            <div className="glass flex flex-wrap items-center justify-center gap-3 rounded-full px-4 py-3">
              <ManualLightControl isOn={isOn} onToggle={toggleLamp} />
              <span className="text-xs text-text-secondary" role="status" aria-live="polite">
                {isOn ? 'Lamp On' : 'Lamp Off'}
                {detectorState === 'clap-detected' ? ' · Clap detected' : ''}
                {detectorState === 'listening' ? ' · Listening' : ''}
              </span>
              <Link to="/shop" className="rounded-full p-2 text-text-secondary hover:text-text-primary" aria-label="Close experience">
                <X className="h-4 w-4" />
              </Link>
              <a href="#help" className="rounded-full p-2 text-text-secondary hover:text-text-primary" aria-label="Help">
                <HelpCircle className="h-4 w-4" />
              </a>
            </div>
            {isOn ? (
              <p className="text-xs text-text-secondary">Clap again to turn it off.</p>
            ) : (
              <p className="text-xs text-text-secondary">Clap again to turn it on.</p>
            )}
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-24">
            <ProductInfoPanel
              product={product}
              collapsed={panelCollapsed}
              onToggleCollapse={() => setPanelCollapsed((v) => !v)}
              quantity={quantity}
              onQuantity={setQuantity}
              onAddToCart={addToCart}
              onRoomPreview={() => setRoomPreview(true)}
              finishName={finish.name}
              finishId={finishId}
              temperatureId={temperatureId}
            >
              <p className="text-xs text-text-secondary">{product.description}</p>
            </ProductInfoPanel>
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 left-4 right-4 z-30 flex gap-2 lg:hidden">
        <Button className="flex-1" variant="secondary" onClick={() => setMobileSheet('controls')}>
          Controls
        </Button>
        <Button className="flex-1" onClick={() => setMobileSheet('info')}>
          Details
        </Button>
      </div>

      {mobileSheet ? (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setMobileSheet(null)}>
          <div
            className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-3xl bg-surface p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex justify-between">
              <p className="font-medium">{mobileSheet === 'info' ? 'Product details' : 'Lighting controls'}</p>
              <button type="button" onClick={() => setMobileSheet(null)} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            {mobileSheet === 'info' ? (
              <ProductInfoPanel
                product={product}
                collapsed={false}
                onToggleCollapse={() => undefined}
                quantity={quantity}
                onQuantity={setQuantity}
                onAddToCart={addToCart}
                onRoomPreview={() => {
                  setMobileSheet(null)
                  setRoomPreview(true)
                }}
                finishName={finish.name}
                finishId={finishId}
                temperatureId={temperatureId}
              />
            ) : (
              controls
            )}
          </div>
        </div>
      ) : null}

      <MicrophonePermissionModal
        open={showMicModal && !manualMode}
        busy={mic.state === 'requesting'}
        onAllow={async () => {
          setShowMicModal(false)
          const stream = await mic.requestPermission()
          if (!stream) setManualMode(true)
        }}
        onManual={() => {
          setShowMicModal(false)
          setManualMode(true)
          setDetectorManual()
        }}
      />

      {(mic.state === 'denied' || mic.state === 'unavailable') && !manualMode ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4">
          <ErrorState
            title={
              mic.state === 'unavailable'
                ? 'We could not find a microphone.'
                : 'Microphone access was denied.'
            }
            description={
              mic.state === 'unavailable'
                ? 'Continue with on-screen controls to experience the lamp.'
                : 'You can update your browser settings or continue using manual controls.'
            }
            actions={
              <>
                {mic.state === 'denied' ? (
                  <Button
                    onClick={async () => {
                      await mic.requestPermission()
                    }}
                  >
                    Try Again
                  </Button>
                ) : null}
                <Button
                  variant="secondary"
                  onClick={() => {
                    setManualMode(true)
                    setDetectorManual()
                  }}
                >
                  {mic.state === 'unavailable' ? 'Continue Manually' : 'Use Manual Controls'}
                </Button>
              </>
            }
          />
        </div>
      ) : null}

      <RoomPreviewModal
        open={roomPreview}
        product={product}
        lightColor={temperature.color}
        onClose={() => setRoomPreview(false)}
      />

      <section id="help" className="sr-only">
        Press Spacebar to toggle the lamp when not typing. Manual On/Off is always available.
      </section>
    </div>
  )
}
