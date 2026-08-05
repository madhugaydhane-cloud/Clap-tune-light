import { Outlet } from 'react-router-dom'
import { BottomNavigation } from './BottomNavigation'

export function AppLayout() {
  return (
    <div className="min-h-dvh bg-app text-forest">
      <div className="lg:pl-56">
        <main className="mx-auto min-h-dvh w-full max-w-5xl px-4 pb-28 pt-6 sm:px-6 lg:pb-10 lg:pt-8">
          <Outlet />
        </main>
      </div>
      <BottomNavigation />
    </div>
  )
}
