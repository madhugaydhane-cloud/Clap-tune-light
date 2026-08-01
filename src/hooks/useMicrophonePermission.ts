import { useCallback, useState } from 'react'
import type { MicPermissionState } from '../types'

export function useMicrophonePermission() {
  const [state, setState] = useState<MicPermissionState>('idle')
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)

  const stopStream = useCallback(() => {
    setStream((current) => {
      current?.getTracks().forEach((track) => track.stop())
      return null
    })
  }, [])

  const requestPermission = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setState('unavailable')
      setError('We could not find a microphone.')
      return null
    }

    setState('requesting')
    setError(null)

    try {
      const media = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false,
        },
      })
      setStream(media)
      setState('granted')
      return media
    } catch (err) {
      const name = err instanceof DOMException ? err.name : ''
      if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
        setState('unavailable')
        setError('We could not find a microphone.')
      } else {
        setState('denied')
        setError('Microphone access was denied.')
      }
      return null
    }
  }, [])

  const reset = useCallback(() => {
    stopStream()
    setState('idle')
    setError(null)
  }, [stopStream])

  return {
    state,
    stream,
    error,
    requestPermission,
    stopStream,
    reset,
    setManual: () => setState('idle'),
  }
}
