import { AnimatePresence, motion } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

type Phase = 'inhale' | 'hold' | 'exhale' | 'done'

interface BreathingExerciseProps {
  open: boolean
  soundEnabled: boolean
  onToggleSound: (enabled: boolean) => void
  onSkip: () => void
  onComplete: () => void
}

const CYCLES = 3

export function BreathingExercise({
  open,
  soundEnabled,
  onToggleSound,
  onSkip,
  onComplete,
}: BreathingExerciseProps) {
  const [phase, setPhase] = useState<Phase>('inhale')
  const [cycle, setCycle] = useState(1)
  const [secondsLeft, setSecondsLeft] = useState(4)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const oscRef = useRef<OscillatorNode | null>(null)

  const phaseMeta = useMemo(() => {
    switch (phase) {
      case 'inhale':
        return { label: 'Inhale', duration: 4, scale: 1.35 }
      case 'hold':
        return { label: 'Hold', duration: 4, scale: 1.35 }
      case 'exhale':
        return { label: 'Exhale', duration: 6, scale: 0.85 }
      default:
        return { label: 'Complete', duration: 0, scale: 1 }
    }
  }, [phase])

  useEffect(() => {
    if (!open) {
      setPhase('inhale')
      setCycle(1)
      setSecondsLeft(4)
      return
    }

    if (phase === 'done') return

    setSecondsLeft(phaseMeta.duration)
    const tick = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(tick)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    const advance = window.setTimeout(() => {
      if (phase === 'inhale') setPhase('hold')
      else if (phase === 'hold') setPhase('exhale')
      else if (phase === 'exhale') {
        if (cycle >= CYCLES) setPhase('done')
        else {
          setCycle((c) => c + 1)
          setPhase('inhale')
        }
      }
    }, phaseMeta.duration * 1000)

    return () => {
      window.clearInterval(tick)
      window.clearTimeout(advance)
    }
  }, [open, phase, cycle, phaseMeta.duration])

  useEffect(() => {
    if (!open || !soundEnabled || phase === 'done') {
      oscRef.current?.stop()
      oscRef.current = null
      return
    }

    try {
      const ctx = audioCtxRef.current ?? new AudioContext()
      audioCtxRef.current = ctx
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = phase === 'inhale' ? 196 : phase === 'hold' ? 220 : 174
      gain.gain.value = 0.03
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      oscRef.current = osc
      return () => {
        osc.stop()
        oscRef.current = null
      }
    } catch {
      // Ambient sound is optional
    }
  }, [open, soundEnabled, phase])

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-forest/40 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="breathing-title"
        >
          <motion.div
            className="w-full max-w-md rounded-[32px] bg-surface p-6 text-center shadow-soft"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
          >
            <div className="flex items-center justify-between">
              <h2 id="breathing-title" className="font-display text-2xl text-forest">
                Soft breath
              </h2>
              <button
                type="button"
                onClick={() => onToggleSound(!soundEnabled)}
                className="rounded-full bg-cream p-2 text-forest"
                aria-label={soundEnabled ? 'Mute ambient sound' : 'Enable ambient sound'}
              >
                {soundEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="mt-2 text-sm text-muted">
              A short relaxation activity — not medical treatment.
            </p>

            {phase !== 'done' ? (
              <>
                <div className="relative mx-auto mt-10 flex h-52 w-52 items-center justify-center">
                  <motion.div
                    className="absolute inset-0 rounded-full bg-sage-soft"
                    animate={{ scale: phaseMeta.scale }}
                    transition={{ duration: phaseMeta.duration, ease: 'easeInOut' }}
                  />
                  <motion.div
                    className="absolute inset-6 rounded-full border border-sage/40 bg-sage/20"
                    animate={{ scale: phaseMeta.scale * 0.92 }}
                    transition={{ duration: phaseMeta.duration, ease: 'easeInOut' }}
                  />
                  <div className="relative z-10">
                    <p className="font-display text-3xl text-forest">{phaseMeta.label}</p>
                    <p className="mt-1 text-sm text-muted" aria-live="polite">
                      {secondsLeft}s · Cycle {cycle}/{CYCLES}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onSkip}
                  className="mt-8 text-sm font-semibold text-forest-muted underline-offset-4 hover:underline"
                >
                  Skip for now
                </button>
              </>
            ) : (
              <div className="mt-10 space-y-4">
                <p className="font-display text-2xl text-forest">
                  Nicely done.
                </p>
                <p className="text-sm text-muted">
                  Your plant rested with you. Carry a little more softness into the next moment.
                </p>
                <button
                  type="button"
                  onClick={onComplete}
                  className="w-full rounded-2xl bg-sage-deep px-4 py-3 text-sm font-semibold text-white"
                >
                  I feel a little better
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
