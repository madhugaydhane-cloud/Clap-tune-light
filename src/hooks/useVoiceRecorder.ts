import { useCallback, useEffect, useRef, useState } from 'react'

export type VoiceStatus =
  | 'idle'
  | 'recording'
  | 'paused'
  | 'preview'
  | 'denied'
  | 'unsupported'

interface UseVoiceRecorderResult {
  status: VoiceStatus
  audioUrl: string | null
  error: string | null
  start: () => Promise<void>
  pause: () => void
  resume: () => void
  stop: () => void
  clear: () => void
}

/**
 * Prototype voice notes via MediaRecorder.
 * Store temporarily as blob URLs. Later: upload blob to Supabase Storage / Firebase
 * and persist `voiceNoteUrl` as a cloud path.
 */
export function useVoiceRecorder(): UseVoiceRecorderResult {
  const [status, setStatus] = useState<VoiceStatus>('idle')
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)

  const cleanupStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
  }

  const clear = useCallback(() => {
    if (audioUrl) URL.revokeObjectURL(audioUrl)
    setAudioUrl(null)
    setError(null)
    setStatus('idle')
    chunksRef.current = []
  }, [audioUrl])

  useEffect(() => {
    return () => {
      cleanupStream()
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setStatus('unsupported')
      setError('Voice recording is not supported in this browser.')
      return
    }

    try {
      if (audioUrl) URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
      setError(null)
      chunksRef.current = []

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        // Future: upload `blob` to cloud storage, then save returned URL on MoodEntry.
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        setStatus('preview')
        cleanupStream()
      }

      recorder.start()
      setStatus('recording')
    } catch {
      setStatus('denied')
      setError(
        'Microphone access was blocked. You can still journal with text, or enable mic permission in your browser settings.',
      )
      cleanupStream()
    }
  }, [audioUrl])

  const pause = useCallback(() => {
    const recorder = mediaRecorderRef.current
    if (recorder?.state === 'recording') {
      recorder.pause()
      setStatus('paused')
    }
  }, [])

  const resume = useCallback(() => {
    const recorder = mediaRecorderRef.current
    if (recorder?.state === 'paused') {
      recorder.resume()
      setStatus('recording')
    }
  }, [])

  const stop = useCallback(() => {
    const recorder = mediaRecorderRef.current
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop()
    }
  }, [])

  return { status, audioUrl, error, start, pause, resume, stop, clear }
}
