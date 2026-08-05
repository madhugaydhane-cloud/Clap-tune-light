import { AnimatePresence, motion } from 'framer-motion'

interface ConfirmationModalProps {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  cancelLabel?: string
  tone?: 'danger' | 'default'
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmationModal({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  tone = 'default',
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-forest/30 p-4 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Close dialog"
            onClick={onCancel}
          />
          <motion.div
            className="relative w-full max-w-md rounded-[28px] bg-surface p-6 shadow-soft"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
          >
            <h2 id="confirm-title" className="font-display text-2xl text-forest">
              {title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{message}</p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-2xl px-4 py-3 text-sm font-semibold text-forest-muted transition hover:bg-cream"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={`rounded-2xl px-4 py-3 text-sm font-semibold text-white transition ${
                  tone === 'danger'
                    ? 'bg-red-700/90 hover:bg-red-800'
                    : 'bg-sage-deep hover:bg-forest'
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
