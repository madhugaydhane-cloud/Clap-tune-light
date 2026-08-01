import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-bg-secondary">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-accent-warm shadow-[0_0_12px_#F4B65B]" />
            <span className="text-lg font-bold">ClapLight</span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-text-secondary">
            Clap. Glow. Experience. Premium designer lamps in immersive spaces — controlled by sound,
            refined by light.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm text-text-secondary">
            <li><Link to="/shop" className="hover:text-accent-soft">Shop</Link></li>
            <li><Link to="/compare" className="hover:text-accent-soft">Compare</Link></li>
            <li><Link to="/about" className="hover:text-accent-soft">How It Works</Link></li>
            <li><Link to="/wishlist" className="hover:text-accent-soft">Wishlist</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Privacy</h3>
          <p className="mt-4 text-sm leading-relaxed text-text-secondary">
            Microphone audio is processed locally in your browser and is never recorded or uploaded.
          </p>
        </div>
      </div>
      <div className="border-t border-border px-4 py-6 text-center text-xs text-text-secondary">
        © {new Date().getFullYear()} ClapLight. Crafted for immersive lighting experiences.
      </div>
    </footer>
  )
}
