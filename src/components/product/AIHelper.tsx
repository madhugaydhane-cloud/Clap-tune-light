import { useMemo, useState } from 'react'
import { MessageCircle, Sparkles } from 'lucide-react'
import type { Product } from '../../types'
import { formatPrice } from '../../utils/format'
import { products } from '../../data/products'
import { Button } from '../common/Button'

const prompts = [
  'Will this work in a small bedroom?',
  'Which light is best for reading?',
  'Should I choose warm or neutral light?',
  'Does this match a beige interior?',
  'Suggest a similar lamp under ₹10,000.',
  'Which lamp is better for a study room?',
]

type Props = {
  product: Product
}

export function AIHelper({ product }: Props) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ role: 'assistant' | 'user'; text: string }>>([
    {
      role: 'assistant',
      text: 'Hi! I can help you choose the right lamp, brightness, and light temperature for your space. (Prototype assistant — rule-based, no live AI API.)',
    },
  ])

  const answer = useMemo(
    () => (prompt: string) => {
      const lower = prompt.toLowerCase()
      if (lower.includes('bedroom') || lower.includes('small')) {
        return `${product.name} works well in compact bedrooms when kept at Night or Relax brightness (15–35%) with Warm (2700K) or Candle (2200K). Recommended rooms: ${product.roomRecommendations.join(', ')}.`
      }
      if (lower.includes('reading')) {
        return `For reading, use Soft White (3000K) or Neutral (4000K) around 60% brightness. ${product.roomRecommendations.includes('Reading Corner') ? 'This lamp is recommended for reading corners.' : 'If you need a stronger task light, consider Solis Wooden Desk Lamp.'}`
      }
      if (lower.includes('warm') || lower.includes('neutral')) {
        return 'Choose Warm (2700K) for evening ambience and Neutral (4000K) for clarity. Cool/Daylight suits desks and study sessions.'
      }
      if (lower.includes('beige')) {
        return 'Beige interiors pair beautifully with Warm or Soft White temperatures and finishes like Ivory, Walnut, or Brushed Gold.'
      }
      if (lower.includes('10,000') || lower.includes('10000') || lower.includes('under')) {
        const alt = products.find((p) => p.price < 10000 && p.id !== product.id)
        return alt
          ? `Try ${alt.name} at ${formatPrice(alt.price)} — ${alt.shortDescription}`
          : 'Browse table and desk lamps under ₹10,000 in the shop filters.'
      }
      if (lower.includes('study')) {
        return `For study rooms, prefer Neutral to Cool light at Focus brightness (≈80%). ${product.roomRecommendations.includes('Study Room') ? `${product.name} is a strong match.` : 'Echo Smart Lamp or Solis Wooden Desk Lamp are excellent study options.'}`
      }
      return `${product.name} is a ${product.category.toLowerCase()} priced at ${formatPrice(product.price)}. Key features: ${product.features.slice(0, 3).join(', ')}.`
    },
    [product],
  )

  const ask = (prompt: string) => {
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: prompt },
      { role: 'assistant', text: answer(prompt) },
    ])
  }

  return (
    <div className="glass rounded-3xl p-4">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="flex items-center gap-2 text-sm font-medium">
          <Sparkles className="h-4 w-4 text-accent-warm" />
          Lighting Assistant
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-text-secondary">
            Prototype
          </span>
        </span>
        <MessageCircle className="h-4 w-4 text-text-secondary" />
      </button>

      {open ? (
        <div className="mt-4 space-y-4">
          <div className="scrollbar-thin max-h-56 space-y-3 overflow-y-auto pr-1">
            {messages.map((m, i) => (
              <div
                key={`${m.role}-${i}`}
                className={
                  m.role === 'assistant'
                    ? 'rounded-2xl bg-white/5 px-3 py-2 text-sm text-text-secondary'
                    : 'rounded-2xl bg-accent-warm/15 px-3 py-2 text-sm text-accent-soft'
                }
              >
                {m.text}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {prompts.map((p) => (
              <Button key={p} size="sm" variant="secondary" onClick={() => ask(p)}>
                {p}
              </Button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
