import { Mic, Pause, Play, Square, Trash2 } from 'lucide-react'
import { useEffect } from 'react'
import { useVoiceRecorder } from '../../hooks/useVoiceRecorder'

interface VoiceNoteButtonProps {
  onAudioChange: (url: string | null) => void
}

export function VoiceNoteButton({ onAudioChange }: VoiceNoteButtonProps) {
  const { status, audioUrl, error, start, pause, resume, stop, clear } =
    useVoiceRecorder()

  useEffect(() => {
    if (status === 'preview') {
      onAudioChange(audioUrl)
    }
  }, [status, audioUrl, onAudioChange])

  const handleClear = () => {
    clear()
    onAudioChange(null)
  }

  return (
    <div className="rounded-[20px] bg-sky-soft/60 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-forest">Voice reflection</p>
          <p className="text-xs text-muted">
            Optional · temporary in this prototype
          </p>
        </div>
        <div className="flex items-center gap-2">
          {status === 'idle' || status === 'denied' || status === 'unsupported' ? (
            <button
              type="button"
              onClick={() => void start()}
              className="inline-flex items-center gap-2 rounded-full bg-sage-deep px-3 py-2 text-xs font-semibold text-white"
              aria-label="Start voice recording"
            >
              <Mic className="h-4 w-4" aria-hidden />
              Record
            </button>
          ) : null}

          {status === 'recording' ? (
            <>
              <button
                type="button"
                onClick={pause}
                className="rounded-full bg-surface p-2 text-forest shadow-soft"
                aria-label="Pause recording"
              >
                <Pause className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={stop}
                className="rounded-full bg-forest p-2 text-white"
                aria-label="Stop recording"
              >
                <Square className="h-4 w-4" />
              </button>
            </>
          ) : null}

          {status === 'paused' ? (
            <>
              <button
                type="button"
                onClick={resume}
                className="rounded-full bg-surface p-2 text-forest shadow-soft"
                aria-label="Resume recording"
              >
                <Play className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={stop}
                className="rounded-full bg-forest p-2 text-white"
                aria-label="Stop recording"
              >
                <Square className="h-4 w-4" />
              </button>
            </>
          ) : null}

          {status === 'preview' && audioUrl ? (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-full bg-surface p-2 text-forest shadow-soft"
              aria-label="Delete recording"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      {status === 'recording' || status === 'paused' ? (
        <p className="mt-3 text-xs font-medium text-sage-deep" aria-live="polite">
          {status === 'recording' ? 'Recording…' : 'Paused'}
        </p>
      ) : null}

      {status === 'preview' && audioUrl ? (
        <audio
          controls
          src={audioUrl}
          className="mt-3 w-full"
          aria-label="Voice note preview"
        >
          Your browser does not support audio playback.
        </audio>
      ) : null}

      {error ? (
        <p className="mt-3 text-xs text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
