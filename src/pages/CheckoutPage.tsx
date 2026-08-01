import { useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Button } from '../components/common/Button'
import { formatPrice } from '../utils/format'
import type { CheckoutForm } from '../types'

const steps = ['Contact', 'Address', 'Delivery', 'Payment', 'Review'] as const

const emptyForm: CheckoutForm = {
  email: '',
  phone: '',
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  deliveryMethod: 'standard',
  cardName: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
}

export function CheckoutPage() {
  const { cart } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<CheckoutForm>(emptyForm)
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutForm, string>>>({})

  const delivery = cart.subtotal > 10000 ? 0 : form.deliveryMethod === 'express' ? 399 : 199
  const total = cart.subtotal + delivery + Math.round(cart.subtotal * 0.05)

  const set = <K extends keyof CheckoutForm>(key: K, value: CheckoutForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const validateStep = () => {
    const next: Partial<Record<keyof CheckoutForm, string>> = {}
    if (step === 0) {
      if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email'
      if (form.phone.trim().length < 10) next.phone = 'Enter a valid phone number'
    }
    if (step === 1) {
      if (!form.firstName) next.firstName = 'Required'
      if (!form.lastName) next.lastName = 'Required'
      if (!form.address) next.address = 'Required'
      if (!form.city) next.city = 'Required'
      if (!form.state) next.state = 'Required'
      if (!/^\d{6}$/.test(form.pincode)) next.pincode = 'Enter a 6-digit pincode'
    }
    if (step === 3) {
      if (!form.cardName) next.cardName = 'Required'
      if (!/^\d{16}$/.test(form.cardNumber.replace(/\s/g, ''))) next.cardNumber = 'Enter 16-digit demo card'
      if (!/^\d{2}\/\d{2}$/.test(form.expiry)) next.expiry = 'Use MM/YY'
      if (!/^\d{3}$/.test(form.cvv)) next.cvv = 'Enter 3-digit CVV'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  if (cart.detailed.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <h1 className="text-2xl font-semibold">Nothing to checkout</h1>
        <Link to="/shop" className="mt-6 inline-block">
          <Button>Continue shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
      <h1 className="text-4xl font-semibold">Checkout</h1>
      <p className="mt-2 text-sm text-accent-soft">Demonstration checkout — no real payment is processed.</p>

      <ol className="mt-8 flex flex-wrap gap-2">
        {steps.map((label, i) => (
          <li
            key={label}
            className={`rounded-full px-3 py-1 text-xs ${
              i === step
                ? 'bg-accent-warm text-bg-primary'
                : i < step
                  ? 'bg-accent-warm/20 text-accent-soft'
                  : 'bg-white/5 text-text-secondary'
            }`}
          >
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      <form
        className="glass mt-8 space-y-4 rounded-3xl p-6"
        onSubmit={(e) => {
          e.preventDefault()
          if (!validateStep()) return
          if (step < steps.length - 1) {
            setStep((s) => s + 1)
            return
          }
          const orderId = `CL-${Date.now().toString().slice(-8)}`
          cart.clear()
          navigate(`/order/${orderId}`, { state: { total, email: form.email } })
        }}
      >
        {step === 0 ? (
          <>
            <Field label="Email" error={errors.email}>
              <input
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                className="field"
                type="email"
                autoComplete="email"
              />
            </Field>
            <Field label="Phone" error={errors.phone}>
              <input
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                className="field"
                type="tel"
              />
            </Field>
          </>
        ) : null}

        {step === 1 ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name" error={errors.firstName}>
                <input value={form.firstName} onChange={(e) => set('firstName', e.target.value)} className="field" />
              </Field>
              <Field label="Last name" error={errors.lastName}>
                <input value={form.lastName} onChange={(e) => set('lastName', e.target.value)} className="field" />
              </Field>
            </div>
            <Field label="Address" error={errors.address}>
              <input value={form.address} onChange={(e) => set('address', e.target.value)} className="field" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="City" error={errors.city}>
                <input value={form.city} onChange={(e) => set('city', e.target.value)} className="field" />
              </Field>
              <Field label="State" error={errors.state}>
                <input value={form.state} onChange={(e) => set('state', e.target.value)} className="field" />
              </Field>
              <Field label="Pincode" error={errors.pincode}>
                <input value={form.pincode} onChange={(e) => set('pincode', e.target.value)} className="field" />
              </Field>
            </div>
          </>
        ) : null}

        {step === 2 ? (
          <div className="space-y-3">
            {(
              [
                ['standard', 'Standard (3–5 days)', 199],
                ['express', 'Express (1–2 days)', 399],
                ['scheduled', 'Scheduled delivery', 249],
              ] as const
            ).map(([id, label, price]) => (
              <label
                key={id}
                className={`flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3 ${
                  form.deliveryMethod === id ? 'border-accent-warm bg-accent-warm/10' : 'border-border'
                }`}
              >
                <span className="flex items-center gap-3 text-sm">
                  <input
                    type="radio"
                    name="delivery"
                    checked={form.deliveryMethod === id}
                    onChange={() => set('deliveryMethod', id)}
                  />
                  {label}
                </span>
                <span className="text-sm">{cart.subtotal > 10000 && id === 'standard' ? 'Free' : formatPrice(price)}</span>
              </label>
            ))}
          </div>
        ) : null}

        {step === 3 ? (
          <>
            <p className="rounded-2xl bg-accent-warm/10 px-3 py-2 text-xs text-accent-soft">
              Mock payment form for demonstration only.
            </p>
            <Field label="Name on card" error={errors.cardName}>
              <input value={form.cardName} onChange={(e) => set('cardName', e.target.value)} className="field" />
            </Field>
            <Field label="Card number" error={errors.cardNumber}>
              <input
                value={form.cardNumber}
                onChange={(e) => set('cardNumber', e.target.value)}
                className="field"
                placeholder="4242424242424242"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Expiry" error={errors.expiry}>
                <input
                  value={form.expiry}
                  onChange={(e) => set('expiry', e.target.value)}
                  className="field"
                  placeholder="08/28"
                />
              </Field>
              <Field label="CVV" error={errors.cvv}>
                <input value={form.cvv} onChange={(e) => set('cvv', e.target.value)} className="field" />
              </Field>
            </div>
          </>
        ) : null}

        {step === 4 ? (
          <div className="space-y-3 text-sm">
            <p>
              <span className="text-text-secondary">Contact:</span> {form.email} · {form.phone}
            </p>
            <p>
              <span className="text-text-secondary">Ship to:</span> {form.firstName} {form.lastName},{' '}
              {form.address}, {form.city}, {form.state} {form.pincode}
            </p>
            <p>
              <span className="text-text-secondary">Delivery:</span> {form.deliveryMethod}
            </p>
            <p className="text-lg font-semibold">Total: {formatPrice(total)}</p>
            <ul className="space-y-2 border-t border-border pt-3">
              {cart.detailed.map(({ item, product }) => (
                <li key={product.id} className="flex justify-between">
                  <span>
                    {product.name} × {item.quantity}
                  </span>
                  <span>{formatPrice(product.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="flex justify-between gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            Back
          </Button>
          <Button type="submit">{step === steps.length - 1 ? 'Place order' : 'Continue'}</Button>
        </div>
      </form>

      <style>{`
        .field {
          width: 100%;
          margin-top: 0.35rem;
          border-radius: 1rem;
          border: 1px solid var(--border);
          background: var(--background-primary);
          padding: 0.7rem 0.9rem;
          color: var(--text-primary);
        }
      `}</style>
    </div>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <label className="block text-sm">
      {label}
      {children}
      {error ? <span className="mt-1 block text-xs text-error">{error}</span> : null}
    </label>
  )
}
