import { Link, useLocation, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../components/common/Button'
import { formatPrice } from '../utils/format'

export function OrderConfirmationPage() {
  const { orderId = 'CL-00000000' } = useParams()
  const location = useLocation()
  const state = location.state as { total?: number; email?: string } | null

  return (
    <div className="relative mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 50% 40%, rgba(244,182,91,0.15), transparent 50%)',
            'radial-gradient(circle at 50% 40%, rgba(255,220,160,0.28), transparent 55%)',
            'radial-gradient(circle at 50% 40%, rgba(244,182,91,0.15), transparent 50%)',
          ],
        }}
        transition={{ duration: 3.5, repeat: Infinity }}
      />
      <div className="relative z-10">
        <p className="text-sm uppercase tracking-[0.2em] text-accent-soft">Order confirmed</p>
        <h1 className="mt-4 text-4xl font-semibold md:text-5xl glow-text">
          Your new ambience is on its way.
        </h1>
        <p className="mt-4 text-text-secondary">
          Order ID <span className="text-text-primary">{orderId}</span>
          {state?.email ? <> · Confirmation sent to {state.email}</> : null}
        </p>
        {typeof state?.total === 'number' ? (
          <p className="mt-2 text-lg font-medium">Total {formatPrice(state.total)}</p>
        ) : null}
        <p className="mt-3 text-sm text-text-secondary">Estimated delivery in 3–5 business days.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button variant="secondary" onClick={() => alert(`Tracking for ${orderId} (demo)`)}>
            Track order
          </Button>
          <Link to="/shop">
            <Button>Continue shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
