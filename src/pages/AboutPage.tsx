import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Mic, Shield, Sparkles, Waves } from 'lucide-react'
import { Button } from '../components/common/Button'

const steps = [
  {
    title: 'Enter the dark room',
    body: 'Open any lamp product page. The showroom begins in darkness so light becomes the hero.',
  },
  {
    title: 'Allow the microphone',
    body: 'ClapLight asks for permission explicitly. Audio stays on-device and is never recorded.',
  },
  {
    title: 'Clap to illuminate',
    body: 'A short sound peak toggles the lamp. Manual controls and Spacebar are always available.',
  },
  {
    title: 'Tune the ambience',
    body: 'Adjust temperature, brightness, room environment, and finishes before you buy.',
  },
]

export function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6">
      <section className="text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-accent-soft">How it works</p>
        <h1 className="mt-3 text-4xl font-semibold md:text-5xl">Lighting you can feel before you buy</h1>
        <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
          ClapLight is an immersive product showroom. Instead of scrolling static photos, you step into a
          virtual room and awaken designer lamps with a clap.
        </p>
      </section>

      <section className="mt-14 grid gap-4 md:grid-cols-2">
        {steps.map((step, i) => (
          <article key={step.title} className="glass rounded-3xl p-6">
            <p className="text-xs text-accent-soft">Step {i + 1}</p>
            <h2 className="mt-2 text-xl font-semibold">{step.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">{step.body}</p>
          </article>
        ))}
      </section>

      <section id="technology" className="mt-16">
        <h2 className="text-3xl font-semibold">About the technology</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <TechCard
            icon={<Mic className="h-5 w-5" />}
            title="Web Audio clap detection"
            body="Amplitude analysis with cooldown and sensitivity controls. Experimental double-clap temperature cycling is opt-in."
          />
          <TechCard
            icon={<Waves className="h-5 w-5" />}
            title="Realtime lighting"
            body="React Three Fiber renders a procedural lamp and room. Temperature and brightness update the glow instantly."
          />
          <TechCard
            icon={<Shield className="h-5 w-5" />}
            title="Privacy-first audio"
            body="Your microphone is used only to detect sound intensity. Audio is processed locally and is never recorded or uploaded."
          />
        </div>
      </section>

      <section className="glass mt-16 rounded-3xl p-8 text-center">
        <Sparkles className="mx-auto h-6 w-6 text-accent-warm" />
        <h2 className="mt-3 text-2xl font-semibold">Ready to experience light?</h2>
        <p className="mt-2 text-text-secondary">Pick a lamp and clap it to life.</p>
        <Link to="/shop" className="mt-6 inline-block">
          <Button size="lg">Explore the Collection</Button>
        </Link>
      </section>
    </div>
  )
}

function TechCard({
  icon,
  title,
  body,
}: {
  icon: ReactNode
  title: string
  body: string
}) {
  return (
    <article className="glass rounded-3xl p-5">
      <div className="mb-3 text-accent-warm">{icon}</div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-text-secondary">{body}</p>
    </article>
  )
}
