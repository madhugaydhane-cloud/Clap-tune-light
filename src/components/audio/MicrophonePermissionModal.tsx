import { Mic, Shield } from 'lucide-react'
import { Button } from '../common/Button'

type Props = {
  open: boolean
  onAllow: () => void
  onManual: () => void
  busy?: boolean
}

export function MicrophonePermissionModal({ open, onAllow, onManual, busy }: Props) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mic-permission-title"
    >
      <div className="glass w-full max-w-md rounded-3xl p-6 shadow-2xl">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-warm/15 text-accent-warm">
          <Mic className="h-6 w-6" />
        </div>
        <h2 id="mic-permission-title" className="text-2xl font-semibold">
          Experience the lamp using sound
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">
          ClapLight uses your microphone only to detect a clap. Audio is processed locally in your
          browser and is not recorded or stored.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button onClick={onAllow} disabled={busy} className="flex-1">
            Allow Microphone
          </Button>
          <Button variant="secondary" onClick={onManual} className="flex-1">
            Use Manual Controls
          </Button>
        </div>
        <p className="mt-5 flex items-start gap-2 text-xs text-text-secondary">
          <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-soft" />
          Your audio never leaves your device. Your microphone is used only to detect sound
          intensity.
        </p>
      </div>
    </div>
  )
}
