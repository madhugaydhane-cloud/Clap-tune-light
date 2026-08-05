import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMoodBloom } from '../context/MoodBloomContext'
import { PlantScene } from '../components/plant/PlantScene'
import { defaultGarden } from '../services/localStorage'

const STEPS = [
  {
    headline: 'Meet the plant that grows with you.',
    description: 'MoodBloom turns your daily emotions into a living digital garden.',
  },
  {
    headline: 'Check in with yourself.',
    description: 'Choose how you feel, write a thought, and watch your plant respond.',
  },
  {
    headline: 'Grow one day at a time.',
    description: 'Every check-in adds a new leaf, flower, or memory to your garden.',
  },
]

export function OnboardingPage() {
  const navigate = useNavigate()
  const { completeOnboarding, skipOnboarding, garden } = useMoodBloom()
  const [step, setStep] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [gardenName, setGardenName] = useState('')
  const [reminderTime, setReminderTime] = useState('20:00')

  const finish = () => {
    completeOnboarding({ name, gardenName, reminderTime })
    navigate('/', { replace: true })
  }

  const skip = () => {
    skipOnboarding()
    navigate('/', { replace: true })
  }

  return (
    <div className="garden-gradient flex min-h-dvh items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <p className="font-display text-2xl text-forest">MoodBloom</p>
          <button
            type="button"
            onClick={skip}
            className="text-sm font-semibold text-forest-muted underline-offset-4 hover:underline"
          >
            Skip
          </button>
        </div>

        <div className="rounded-[32px] bg-surface/90 p-5 shadow-soft backdrop-blur-sm sm:p-6">
          {!showForm ? (
            <>
              <div className="mb-4 flex justify-center gap-2" aria-label="Onboarding progress">
                {STEPS.map((_, i) => (
                  <span
                    key={i}
                    className={`h-2 w-2 rounded-full ${
                      i === step ? 'bg-sage-deep' : 'bg-cream-dark'
                    }`}
                  />
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -28 }}
                  transition={{ duration: 0.28 }}
                  className="space-y-5"
                >
                  {step === 0 ? (
                    <PlantScene garden={defaultGarden()} compact />
                  ) : null}
                  {step === 1 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {['😊', '🌿', '✨'].map((emoji, i) => (
                        <motion.div
                          key={emoji}
                          className="rounded-2xl bg-sage-soft p-4 text-center text-2xl"
                          animate={{ y: [0, -6, 0] }}
                          transition={{
                            duration: 2.2,
                            repeat: Infinity,
                            delay: i * 0.2,
                          }}
                        >
                          {emoji}
                        </motion.div>
                      ))}
                      <div className="col-span-3">
                        <PlantScene garden={garden} compact />
                      </div>
                    </div>
                  ) : null}
                  {step === 2 ? (
                    <div className="rounded-[28px] bg-peach-soft p-6 text-center">
                      <p className="text-4xl" aria-hidden>
                        🌱 → 🌿 → 🌸
                      </p>
                      <p className="mt-3 font-display text-xl text-forest">
                        Leaves, flowers, and memories — one day at a time.
                      </p>
                    </div>
                  ) : null}

                  <div>
                    <h1 className="font-display text-3xl leading-tight text-forest">
                      {STEPS[step].headline}
                    </h1>
                    <p className="mt-3 text-sm leading-relaxed text-muted">
                      {STEPS[step].description}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 flex gap-3">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s - 1)}
                    className="rounded-2xl px-4 py-3 text-sm font-semibold text-forest-muted"
                  >
                    Back
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    if (step < STEPS.length - 1) setStep((s) => s + 1)
                    else setShowForm(true)
                  }}
                  className="ml-auto flex-1 rounded-2xl bg-sage-deep px-4 py-3.5 text-sm font-semibold text-white"
                >
                  {step < STEPS.length - 1 ? 'Next' : 'Get Started'}
                </button>
              </div>
            </>
          ) : (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault()
                finish()
              }}
            >
              <div>
                <h1 className="font-display text-3xl text-forest">
                  Name your garden
                </h1>
                <p className="mt-2 text-sm text-muted">
                  A few details so MoodBloom feels like yours.
                </p>
              </div>
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-forest">First name</span>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Madhura"
                  className="w-full rounded-2xl border border-cream-dark bg-cream/40 px-4 py-3 text-sm"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-forest">
                  Garden name <span className="font-normal text-muted">(optional)</span>
                </span>
                <input
                  value={gardenName}
                  onChange={(e) => setGardenName(e.target.value)}
                  placeholder="My Quiet Garden"
                  className="w-full rounded-2xl border border-cream-dark bg-cream/40 px-4 py-3 text-sm"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-forest">
                  Preferred daily reminder
                </span>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full rounded-2xl border border-cream-dark bg-cream/40 px-4 py-3 text-sm"
                />
              </label>
              <button
                type="submit"
                className="w-full rounded-2xl bg-sage-deep px-4 py-3.5 text-sm font-semibold text-white"
              >
                Enter my garden
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
