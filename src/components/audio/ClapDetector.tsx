import { Mic, MicOff } from 'lucide-react'
import type { ClapDetectorState, MicPermissionState, SensitivityLevel } from '../../types'
import { cn } from '../../utils/format'
import { Button } from '../common/Button'
import { SoundLevelMeter } from './SoundLevelMeter'

type Props = {
  micState: MicPermissionState
  detectorState: ClapDetectorState
  level: number
  threshold: number
  sensitivity: SensitivityLevel
  onSensitivityChange: (value: SensitivityLevel) => void
  listeningHint: boolean
  onEnableMic: () => void
  onStopMic: () => void
  doubleClapEnabled: boolean
  onDoubleClapToggle: (value: boolean) => void
}

export function ClapDetectorPanel({
  micState,
  detectorState,
  level,
  threshold,
  sensitivity,
  onSensitivityChange,
  listeningHint,
  onEnableMic,
  onStopMic,
  doubleClapEnabled,
  onDoubleClapToggle,
}: Props) {
  return (
    <div className="glass space-y-4 rounded-3xl p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium">Microphone settings</p>
          <p className="text-xs text-text-secondary">
            Status:{' '}
            <span className="text-accent-soft">
              {detectorState === 'noisy'
                ? 'Noisy'
                : detectorState === 'clap-detected'
                  ? 'Clap detected'
                  : detectorState === 'listening'
                    ? 'Listening'
                    : detectorState === 'manual'
                      ? 'Manual'
                      : micState}
            </span>
          </p>
        </div>
        {micState === 'granted' ? (
          <Button size="sm" variant="secondary" onClick={onStopMic}>
            <MicOff className="h-4 w-4" /> Stop
          </Button>
        ) : (
          <Button size="sm" onClick={onEnableMic}>
            <Mic className="h-4 w-4" /> Enable
          </Button>
        )}
      </div>

      <SoundLevelMeter
        level={level}
        threshold={threshold}
        listening={detectorState === 'listening' || detectorState === 'noisy'}
      />

      <div>
        <p className="mb-2 text-xs font-medium text-text-secondary">Sensitivity</p>
        <div className="flex flex-wrap gap-2">
          {(['low', 'medium', 'high', 'auto'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onSensitivityChange(s)}
              className={cn(
                'rounded-full border px-3 py-1 text-xs capitalize',
                sensitivity === s
                  ? 'border-accent-warm bg-accent-warm/15 text-accent-soft'
                  : 'border-border text-text-secondary',
              )}
            >
              {s === 'auto' ? 'Automatic calibration' : s}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-start gap-3 rounded-2xl border border-dashed border-border p-3 text-xs text-text-secondary">
        <input
          type="checkbox"
          checked={doubleClapEnabled}
          onChange={(e) => onDoubleClapToggle(e.target.checked)}
          className="mt-0.5 accent-accent-warm"
        />
        <span>
          <span className="font-medium text-text-primary">Experimental:</span> Double clap to cycle
          light temperature. Disabled by default and may be less reliable.
        </span>
      </label>

      {detectorState === 'noisy' ? (
        <p className="rounded-2xl bg-error/10 px-3 py-2 text-xs text-error" role="status">
          Background noise is high. Try lowering the sensitivity or use manual controls.
        </p>
      ) : null}

      {listeningHint && detectorState === 'listening' ? (
        <p className="rounded-2xl bg-accent-warm/10 px-3 py-2 text-xs text-accent-soft" role="status">
          We’re listening. Try one clear clap near your device.
        </p>
      ) : null}

      <p className="text-[11px] leading-relaxed text-text-secondary">
        Your microphone is used only to detect sound intensity. Audio is processed locally and is
        never recorded or uploaded.
      </p>
    </div>
  )
}
