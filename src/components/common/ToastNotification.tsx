import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { cn } from '../../utils/format'

export function ToastNotification() {
  const { toasts, dismissToast } = useApp()

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[80] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className={cn(
              'pointer-events-auto glass flex items-start gap-3 rounded-2xl px-4 py-3 shadow-xl',
              toast.type === 'success' && 'border-success/40',
              toast.type === 'error' && 'border-error/40',
            )}
            role="status"
          >
            <p className="flex-1 text-sm text-text-primary">{toast.message}</p>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => dismissToast(toast.id)}
              className="rounded-full p-1 text-text-secondary hover:text-text-primary"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
