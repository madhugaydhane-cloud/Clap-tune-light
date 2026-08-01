import { Power } from 'lucide-react'
import { cn } from '../../utils/format'
import { Button } from '../common/Button'

type Props = {
  isOn: boolean
  onToggle: () => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function ManualLightControl({ isOn, onToggle, size = 'md', className }: Props) {
  return (
    <Button
      type="button"
      variant={isOn ? 'primary' : 'secondary'}
      size={size}
      onClick={onToggle}
      aria-pressed={isOn}
      aria-label={isOn ? 'Turn lamp off' : 'Turn lamp on'}
      className={cn(className)}
    >
      <Power className="h-4 w-4" />
      {isOn ? 'Lamp On' : 'Lamp Off'}
    </Button>
  )
}
