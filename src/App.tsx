import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { useMoodBloom } from './context/MoodBloomContext'
import { CollectionPage } from './pages/CollectionPage'
import { GardenPage } from './pages/GardenPage'
import { HistoryPage } from './pages/HistoryPage'
import { InsightsPage } from './pages/InsightsPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { ProfilePage } from './pages/ProfilePage'

function RequireOnboarding({ children }: { children: ReactNode }) {
  const { user, ready } = useMoodBloom()
  if (!ready) {
    return (
      <div className="garden-gradient flex min-h-dvh items-center justify-center">
        <p className="font-display text-2xl text-forest">MoodBloom</p>
      </div>
    )
  }
  if (!user?.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />
  }
  return children
}

function RedirectIfOnboarded({ children }: { children: ReactNode }) {
  const { user, ready } = useMoodBloom()
  if (!ready) return null
  if (user?.onboardingCompleted) {
    return <Navigate to="/" replace />
  }
  return children
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/onboarding"
        element={
          <RedirectIfOnboarded>
            <OnboardingPage />
          </RedirectIfOnboarded>
        }
      />
      <Route
        element={
          <RequireOnboarding>
            <AppLayout />
          </RequireOnboarding>
        }
      >
        <Route index element={<GardenPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="insights" element={<InsightsPage />} />
        <Route path="collection" element={<CollectionPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
