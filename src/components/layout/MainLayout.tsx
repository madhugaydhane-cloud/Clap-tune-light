import { Outlet, useLocation } from 'react-router-dom'
import { ToastNotification } from '../common/ToastNotification'
import { Footer } from './Footer'
import { Navbar } from './Navbar'

export function MainLayout() {
  const location = useLocation()
  const hideFooter = location.pathname.startsWith('/product/')

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent-warm focus:px-4 focus:py-2 focus:text-bg-primary"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content">
        <Outlet />
      </main>
      {!hideFooter ? <Footer /> : null}
      <ToastNotification />
    </div>
  )
}
