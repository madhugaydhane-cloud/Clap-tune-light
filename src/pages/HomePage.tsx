import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Waves } from 'lucide-react'
import { products } from '../data/products'
import { useClapDetection } from '../hooks/useClapDetection'
import { useMicrophonePermission } from '../hooks/useMicrophonePermission'
import { Button } from '../components/common/Button'
import { ProductCard } from '../components/product/ProductCard'
import { playSwitchSound } from '../utils/switchSound'

export function HomePage() {
  const [lit, setLit] = useState(false)
  const [manualOnly, setManualOnly] = useState(false)
  const mic = useMicrophonePermission()

  const illuminate = useCallback(() => {
    setLit(true)
    playSwitchSound(true)
  }, [])

  const { detectorState, level } = useClapDetection({
    enabled: mic.state === 'granted' && !lit && !manualOnly,
    stream: mic.stream,
    sensitivity: 'medium',
    onClap: illuminate,
  })

  useEffect(() => {
    return () => {
      mic.stopStream()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="relative overflow-hidden">
      <section className="relative flex min-h-[calc(100vh-4.5rem)] items-center justify-center px-4 py-16">
        <div
          className="pointer-events-none absolute inset-0 transition-all duration-[1400ms]"
          style={{
            background: lit
              ? 'radial-gradient(circle at 50% 40%, rgba(244,182,91,0.28), transparent 45%), linear-gradient(180deg, #1a1410 0%, #090909 70%)'
              : 'radial-gradient(circle at 50% 45%, rgba(255,255,255,0.03), transparent 40%), #090909',
          }}
        />

        <AnimatePresence mode="wait">
          {!lit ? (
            <motion.div
              key="dark"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10 mx-auto max-w-2xl text-center"
            >
              <p className="text-sm uppercase tracking-[0.2em] text-text-secondary">ClapLight</p>
              <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
                Some products are meant to be experienced.
              </h1>
              <p className="mt-5 text-lg text-text-secondary md:text-xl">
                Clap to enter the world of light.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4">
                <div className="flex items-center gap-3 text-accent-soft">
                  <Mic className="h-5 w-5" />
                  <div className="flex items-end gap-1" aria-hidden>
                    {Array.from({ length: 8 }).map((_, i) => (
                      <span
                        key={i}
                        className="w-1 rounded-full bg-accent-warm"
                        style={{
                          height: `${8 + Math.sin(i + level * 40) * 10 + (detectorState === 'listening' ? 8 : 0)}px`,
                          opacity: 0.4 + (i % 3) * 0.2,
                        }}
                      />
                    ))}
                  </div>
                  <Waves className="h-5 w-5" />
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button
                    onClick={async () => {
                      const stream = await mic.requestPermission()
                      if (!stream) setManualOnly(true)
                    }}
                  >
                    Enable Microphone & Clap
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setManualOnly(true)
                      illuminate()
                    }}
                  >
                    Turn On Without Microphone
                  </Button>
                </div>
                <p className="max-w-md text-xs text-text-secondary">
                  Your microphone is used only to detect sound intensity. Audio is processed locally
                  and is never recorded or uploaded.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="lit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]"
            >
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-accent-soft">Clap. Glow. Experience.</p>
                <h1 className="mt-4 text-4xl font-bold leading-tight md:text-6xl glow-text">
                  Discover lighting that transforms your space.
                </h1>
                <p className="mt-5 max-w-xl text-lg text-text-secondary">
                  Lighting you can experience before you buy. Explore designer lamps in realistic
                  spaces, control them using sound, and discover the perfect ambience for your home.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/shop">
                    <Button size="lg">Explore the Collection</Button>
                  </Link>
                  <Link to="/about">
                    <Button size="lg" variant="secondary">
                      How it Works
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative mx-auto aspect-square w-full max-w-md">
                <div className="absolute inset-8 rounded-full bg-accent-warm/20 blur-3xl" />
                <img
                  src={products[0].images[0]}
                  alt="Hero lamp"
                  className="relative z-10 h-full w-full object-contain drop-shadow-[0_0_60px_rgba(244,182,91,0.45)]"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {lit ? (
        <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold">Featured lamps</h2>
              <p className="mt-2 text-text-secondary">Begin with pieces designed for immersive light.</p>
            </div>
            <Link to="/shop" className="text-sm text-accent-soft hover:underline">
              View all
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
