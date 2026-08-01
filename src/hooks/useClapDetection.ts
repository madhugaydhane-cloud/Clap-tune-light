import { useCallback, useEffect, useRef, useState } from 'react'
import type { ClapDetectorState, SensitivityLevel } from '../types'

const SENSITIVITY: Record<Exclude<SensitivityLevel, 'auto'>, number> = {
  low: 0.42,
  medium: 0.28,
  high: 0.16,
}

type Options = {
  enabled: boolean
  stream: MediaStream | null
  sensitivity: SensitivityLevel
  cooldownMs?: number
  onClap?: () => void
  doubleClapEnabled?: boolean
  onDoubleClap?: () => void
}

export function useClapDetection({
  enabled,
  stream,
  sensitivity,
  cooldownMs = 1000,
  onClap,
  doubleClapEnabled = false,
  onDoubleClap,
}: Options) {
  const [detectorState, setDetectorState] = useState<ClapDetectorState>('idle')
  const [level, setLevel] = useState(0)
  const [threshold, setThreshold] = useState(SENSITIVITY.medium)
  const [listeningHint, setListeningHint] = useState(false)

  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const rafRef = useRef<number | null>(null)
  const lastClapRef = useRef(0)
  const lastPeakRef = useRef(0)
  const baselineRef = useRef(0.02)
  const clapTimesRef = useRef<number[]>([])
  const onClapRef = useRef(onClap)
  const onDoubleClapRef = useRef(onDoubleClap)

  useEffect(() => {
    onClapRef.current = onClap
    onDoubleClapRef.current = onDoubleClap
  }, [onClap, onDoubleClap])

  const cleanup = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null
    sourceRef.current?.disconnect()
    sourceRef.current = null
    analyserRef.current?.disconnect()
    analyserRef.current = null
    if (audioContextRef.current) {
      void audioContextRef.current.close()
      audioContextRef.current = null
    }
    setDetectorState('idle')
    setLevel(0)
  }, [])

  useEffect(() => {
    if (!enabled || !stream) {
      cleanup()
      return
    }

    let cancelled = false
    const ctx = new AudioContext()
    const analyser = ctx.createAnalyser()
    analyser.fftSize = 2048
    analyser.smoothingTimeConstant = 0.2
    const source = ctx.createMediaStreamSource(stream)
    source.connect(analyser)

    audioContextRef.current = ctx
    analyserRef.current = analyser
    sourceRef.current = source
    setDetectorState('listening')

    const data = new Uint8Array(analyser.fftSize)
    let quietFrames = 0
    const startedAt = performance.now()

    const tick = () => {
      if (cancelled || !analyserRef.current) return
      analyser.getByteTimeDomainData(data)

      let sum = 0
      for (let i = 0; i < data.length; i += 1) {
        const v = (data[i] - 128) / 128
        sum += v * v
      }
      const rms = Math.sqrt(sum / data.length)
      setLevel(rms)

      baselineRef.current = baselineRef.current * 0.98 + rms * 0.02
      const noiseFloor = baselineRef.current

      const activeThreshold =
        sensitivity === 'auto'
          ? Math.max(0.14, noiseFloor * 4.5 + 0.08)
          : SENSITIVITY[sensitivity]
      setThreshold(activeThreshold)

      if (noiseFloor > 0.12) {
        setDetectorState('noisy')
      } else if (detectorState !== 'clap-detected') {
        setDetectorState('listening')
      }

      const now = performance.now()
      const spike = rms > activeThreshold && rms > noiseFloor * 3.2
      const shortBurst = now - lastPeakRef.current > 40

      if (spike && shortBurst && now - lastClapRef.current > cooldownMs) {
        lastPeakRef.current = now
        // Confirm it falls quickly (clap-like)
        window.setTimeout(() => {
          if (!analyserRef.current) return
          analyserRef.current.getByteTimeDomainData(data)
          let sum2 = 0
          for (let i = 0; i < data.length; i += 1) {
            const v = (data[i] - 128) / 128
            sum2 += v * v
          }
          const rms2 = Math.sqrt(sum2 / data.length)
          if (rms2 < rms * 0.75) {
            lastClapRef.current = performance.now()
            setDetectorState('clap-detected')
            clapTimesRef.current = [...clapTimesRef.current.filter((t) => now - t < 700), now]

            if (doubleClapEnabled && clapTimesRef.current.length >= 2) {
              onDoubleClapRef.current?.()
              clapTimesRef.current = []
            } else {
              onClapRef.current?.()
            }

            window.setTimeout(() => {
              setDetectorState('listening')
            }, 400)
          }
        }, 60)
      } else if (spike) {
        lastPeakRef.current = now
      }

      if (rms < noiseFloor * 1.4) quietFrames += 1
      else quietFrames = 0

      if (performance.now() - startedAt > 8000 && quietFrames > 120) {
        setListeningHint(true)
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    void ctx.resume().then(() => {
      if (!cancelled) rafRef.current = requestAnimationFrame(tick)
    })

    return () => {
      cancelled = true
      cleanup()
    }
    // detectorState intentionally omitted to avoid restarting audio graph
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cleanup, cooldownMs, doubleClapEnabled, enabled, sensitivity, stream])

  return {
    detectorState,
    level,
    threshold,
    listeningHint,
    setManualMode: () => setDetectorState('manual'),
    cleanup,
  }
}
