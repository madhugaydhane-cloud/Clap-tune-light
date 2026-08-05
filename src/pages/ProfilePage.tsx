import { Download, Info, RotateCcw, Shield } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ConfirmationModal } from '../components/common/ConfirmationModal'
import { SettingsRow, Toggle } from '../components/common/SettingsRow'
import { useMoodBloom } from '../context/MoodBloomContext'

export function ProfilePage() {
  const {
    user,
    settings,
    updateSettings,
    updateProfile,
    resetGarden,
    exportHistory,
    clearAllData,
    storageAvailable,
  } = useMoodBloom()

  const [resetOpen, setResetOpen] = useState(false)
  const [devResetOpen, setDevResetOpen] = useState(false)
  const [name, setName] = useState(user?.name ?? '')
  const [gardenName, setGardenName] = useState(user?.gardenName ?? '')
  const [reminderTime, setReminderTime] = useState(user?.reminderTime ?? '20:00')
  const [savedFlash, setSavedFlash] = useState(false)

  useEffect(() => {
    setName(user?.name ?? '')
    setGardenName(user?.gardenName ?? '')
    setReminderTime(user?.reminderTime ?? '20:00')
  }, [user])

  const saveProfile = () => {
    updateProfile({
      name: name.trim() || 'Friend',
      gardenName: gardenName.trim() || 'My Quiet Garden',
      reminderTime,
    })
    setSavedFlash(true)
    window.setTimeout(() => setSavedFlash(false), 1600)
  }

  const handleExport = () => {
    const data = exportHistory()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `moodbloom-history-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto max-w-xl space-y-5">
      <header>
        <h1 className="font-display text-3xl text-forest sm:text-4xl">Profile</h1>
        <p className="mt-1 text-sm text-muted">Settings for your personal garden.</p>
      </header>

      {!storageAvailable ? (
        <div className="rounded-[24px] bg-peach-soft px-4 py-3 text-sm text-forest" role="alert">
          LocalStorage is unavailable in this browser. Your data may not persist after refresh.
        </div>
      ) : null}

      <section className="space-y-3 rounded-[28px] bg-surface p-5 shadow-soft">
        <h2 className="text-sm font-semibold text-forest">Your details</h2>
        <label className="block space-y-1">
          <span className="text-xs text-muted">Profile name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-2xl border border-cream-dark bg-cream/30 px-4 py-3 text-sm"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-muted">Garden name</span>
          <input
            value={gardenName}
            onChange={(e) => setGardenName(e.target.value)}
            className="w-full rounded-2xl border border-cream-dark bg-cream/30 px-4 py-3 text-sm"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs text-muted">Reminder time</span>
          <input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="w-full rounded-2xl border border-cream-dark bg-cream/30 px-4 py-3 text-sm"
          />
        </label>
        <button
          type="button"
          onClick={saveProfile}
          className="w-full rounded-2xl bg-sage-deep px-4 py-3 text-sm font-semibold text-white"
        >
          {savedFlash ? 'Saved' : 'Save profile'}
        </button>
      </section>

      <section className="space-y-3">
        <SettingsRow
          label="Sound"
          description="Ambient cues during breathing"
          control={
            <Toggle
              label="Sound enabled"
              checked={settings.soundEnabled}
              onChange={(v) => updateSettings({ soundEnabled: v })}
            />
          }
        />
        <SettingsRow
          label="Animations"
          description="Soft plant and particle motion"
          control={
            <Toggle
              label="Animations enabled"
              checked={settings.animationsEnabled}
              onChange={(v) => updateSettings({ animationsEnabled: v })}
            />
          }
        />
        <SettingsRow
          label="Dark mode"
          description="Evening-friendly interface"
          control={
            <Toggle
              label="Dark mode"
              checked={settings.darkMode}
              onChange={(v) => updateSettings({ darkMode: v })}
            />
          }
        />
        <SettingsRow
          label="Reminders"
          description="Preferred time saved locally"
          control={
            <Toggle
              label="Reminders enabled"
              checked={settings.remindersEnabled}
              onChange={(v) => updateSettings({ remindersEnabled: v })}
            />
          }
        />
      </section>

      <section className="space-y-3">
        <button
          type="button"
          onClick={handleExport}
          className="flex w-full items-center gap-3 rounded-[24px] bg-surface px-4 py-4 text-left shadow-soft"
        >
          <Download className="h-5 w-5 text-sage-deep" aria-hidden />
          <div>
            <p className="text-sm font-semibold text-forest">Export mood history</p>
            <p className="text-xs text-muted">Download a JSON file of your check-ins</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setResetOpen(true)}
          className="flex w-full items-center gap-3 rounded-[24px] bg-surface px-4 py-4 text-left shadow-soft"
        >
          <RotateCcw className="h-5 w-5 text-forest-muted" aria-hidden />
          <div>
            <p className="text-sm font-semibold text-forest">Reset garden</p>
            <p className="text-xs text-muted">Clear moods, streaks, and progress</p>
          </div>
        </button>

        <div className="rounded-[24px] bg-surface px-4 py-4 shadow-soft">
          <div className="flex items-start gap-3">
            <Shield className="mt-0.5 h-5 w-5 text-sage-deep" aria-hidden />
            <div>
              <p className="text-sm font-semibold text-forest">Privacy</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                MoodBloom stores your data on this device only. Voice notes stay temporary
                in the browser. A future update can sync to Supabase or Firebase if you choose.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] bg-surface px-4 py-4 shadow-soft">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-5 w-5 text-sage-deep" aria-hidden />
            <div>
              <p className="text-sm font-semibold text-forest">About MoodBloom</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                MoodBloom is a personal mood garden — a calm place to check in, reflect,
                and watch a digital plant grow with you. It is not a medical or clinical tool.
              </p>
              <Link
                to="/collection"
                className="mt-2 inline-block text-xs font-semibold text-sage-deep underline-offset-2 hover:underline"
              >
                View garden collection
              </Link>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setDevResetOpen(true)}
          className="w-full rounded-[24px] border border-dashed border-cream-dark px-4 py-3 text-left text-xs text-muted"
        >
          Developer: reset LocalStorage and return to onboarding
        </button>
      </section>

      <ConfirmationModal
        open={resetOpen}
        title="Reset your garden?"
        message="This will permanently remove your moods, reflections, streaks, and garden progress from this device."
        confirmLabel="Reset My Garden"
        tone="danger"
        onCancel={() => setResetOpen(false)}
        onConfirm={() => {
          resetGarden()
          setResetOpen(false)
        }}
      />

      <ConfirmationModal
        open={devResetOpen}
        title="Clear all MoodBloom data?"
        message="This wipes LocalStorage for MoodBloom, including profile and onboarding state."
        confirmLabel="Clear everything"
        tone="danger"
        onCancel={() => setDevResetOpen(false)}
        onConfirm={() => {
          clearAllData()
          setDevResetOpen(false)
          window.location.href = '/onboarding'
        }}
      />
    </div>
  )
}
