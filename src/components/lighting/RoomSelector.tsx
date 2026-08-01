import { rooms } from '../../data/products'
import type { RoomType } from '../../types'
import { cn } from '../../utils/format'

const roomHints: Record<RoomType, string> = {
  'Modern Living Room': 'Soft neutrals, open space',
  'Minimal Bedroom': 'Quiet walls, calm dusk',
  'Study Room': 'Focused desk ambience',
  'Reading Corner': 'Intimate warm corner',
  'Dining Space': 'Shared table glow',
}

type Props = {
  value: RoomType
  onChange: (room: RoomType) => void
}

export function RoomSelector({ value, onChange }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Room environment</p>
      <div className="space-y-2">
        {rooms.map((room) => (
          <button
            key={room}
            type="button"
            onClick={() => onChange(room)}
            className={cn(
              'w-full rounded-2xl border px-3 py-3 text-left transition',
              value === room
                ? 'border-accent-warm bg-accent-warm/10'
                : 'border-border hover:border-white/20',
            )}
          >
            <span className="block text-sm font-medium">{room}</span>
            <span className="text-xs text-text-secondary">{roomHints[room]}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
