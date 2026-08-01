import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../utils/format'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: Props) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-medium transition disabled:cursor-not-allowed disabled:opacity-50',
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-5 py-2.5 text-sm',
        size === 'lg' && 'px-7 py-3.5 text-base',
        variant === 'primary' &&
          'bg-accent-warm text-bg-primary hover:bg-accent-soft shadow-[0_0_24px_rgba(244,182,91,0.25)]',
        variant === 'secondary' &&
          'border border-border bg-surface-light/60 text-text-primary hover:bg-surface-light',
        variant === 'ghost' && 'text-text-secondary hover:bg-white/5 hover:text-text-primary',
        variant === 'danger' && 'bg-error/20 text-error hover:bg-error/30',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
