import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { getReflectionPrompt } from '../../data/prompts'
import { useMoodBloom } from '../../context/MoodBloomContext'
import type { MoodEntry, MoodType } from '../../types'
import { BreathingExercise } from '../breathing/BreathingExercise'
import { MoodSelector } from '../mood/MoodSelector'
import { JournalInput } from './JournalInput'
import { PlantReaction } from './PlantReaction'
import { VoiceNoteButton } from './VoiceNoteButton'

interface DailyCheckInModalProps {
  open: boolean
  onClose: () => void
  forceEdit?: boolean
}

type Step = 'mood' | 'journal' | 'reaction'

export function DailyCheckInModal({
  open,
  onClose,
  forceEdit = false,
}: DailyCheckInModalProps) {
  const {
    submitCheckIn,
    garden,
    settings,
    updateSettings,
    hasCheckedInToday,
    todayEntry,
  } = useMoodBloom()

  const [step, setStep] = useState<Step>('mood')
  const [mood, setMood] = useState<MoodType | null>(null)
  const [note, setNote] = useState('')
  const [voiceUrl, setVoiceUrl] = useState<string | null>(null)
  const [savedEntry, setSavedEntry] = useState<MoodEntry | null>(null)
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([])
  const [showBreathing, setShowBreathing] = useState(false)
  const [editing, setEditing] = useState(forceEdit)

  useEffect(() => {
    if (!open) return
    setEditing(forceEdit)
    if (forceEdit && todayEntry) {
      setMood(todayEntry.mood)
      setNote(todayEntry.note)
      setVoiceUrl(todayEntry.voiceNoteUrl)
      setStep('mood')
    } else {
      setStep('mood')
      setMood(null)
      setNote('')
      setVoiceUrl(null)
    }
    setSavedEntry(null)
    setNewlyUnlocked([])
    setShowBreathing(false)
  }, [open, forceEdit, todayEntry])

  const prompt = useMemo(
    () => (mood ? getReflectionPrompt(mood, note.length) : ''),
    [mood, note.length],
  )

  const resetAndClose = () => {
    onClose()
  }

  const saveCheckIn = (nextNote: string) => {
    if (!mood) return
    const result = submitCheckIn({
      mood,
      note: nextNote,
      voiceNoteUrl: voiceUrl,
      reflectionPrompt: prompt,
    })
    setSavedEntry(result.entry)
    setNewlyUnlocked(result.newlyUnlocked)
    setStep('reaction')
  }

  const showGate = hasCheckedInToday && !editing && step === 'mood' && !savedEntry

  return (
    <>
      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-forest/35 sm:items-center sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkin-title"
          >
            <button
              type="button"
              className="absolute inset-0"
              aria-label="Close check-in"
              onClick={resetAndClose}
            />
            <motion.div
              className="relative max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-[32px] bg-surface p-5 shadow-soft scrollbar-thin sm:rounded-[32px] sm:p-6"
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex gap-1.5" aria-hidden>
                  {(['mood', 'journal', 'reaction'] as Step[]).map((s) => (
                    <span
                      key={s}
                      className={`h-1.5 w-8 rounded-full ${
                        step === s ? 'bg-sage-deep' : 'bg-cream-dark'
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="rounded-full bg-cream p-2 text-forest"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {showGate && todayEntry ? (
                <div className="space-y-4 py-4 text-center">
                  <h2 id="checkin-title" className="font-display text-3xl text-forest">
                    You’ve already checked in today
                  </h2>
                  <p className="text-sm text-muted">
                    You can review or edit today’s reflection.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(true)
                      setMood(todayEntry.mood)
                      setNote(todayEntry.note)
                      setVoiceUrl(todayEntry.voiceNoteUrl)
                    }}
                    className="w-full rounded-2xl bg-sage-deep px-4 py-3 text-sm font-semibold text-white"
                  >
                    Edit today’s check-in
                  </button>
                  <button
                    type="button"
                    onClick={resetAndClose}
                    className="w-full rounded-2xl px-4 py-3 text-sm font-semibold text-forest-muted"
                  >
                    Return to garden
                  </button>
                </div>
              ) : null}

              {!showGate && step === 'mood' ? (
                <div className="space-y-5">
                  <div>
                    <h2 id="checkin-title" className="font-display text-3xl text-forest">
                      How are you feeling right now?
                    </h2>
                    <p className="mt-2 text-sm text-muted">
                      Choose the mood that fits this moment.
                    </p>
                  </div>
                  <MoodSelector value={mood} onChange={setMood} />
                  <button
                    type="button"
                    disabled={!mood}
                    onClick={() => setStep('journal')}
                    className="w-full rounded-2xl bg-sage-deep px-4 py-3.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Continue
                  </button>
                </div>
              ) : null}

              {!showGate && step === 'journal' && mood ? (
                <div className="space-y-5">
                  <div>
                    <h2 id="checkin-title" className="font-display text-3xl text-forest">
                      Would you like to capture this moment?
                    </h2>
                    <p className="mt-2 text-sm text-muted">
                      Writing is optional — your mood alone helps your plant grow.
                    </p>
                  </div>
                  <JournalInput value={note} onChange={setNote} prompt={prompt} />
                  <VoiceNoteButton onAudioChange={setVoiceUrl} />
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => saveCheckIn(note)}
                      className="w-full rounded-2xl bg-sage-deep px-4 py-3.5 text-sm font-semibold text-white"
                    >
                      Save check-in
                    </button>
                    <button
                      type="button"
                      onClick={() => saveCheckIn('')}
                      className="w-full rounded-2xl px-4 py-3 text-sm font-semibold text-forest-muted"
                    >
                      Skip writing & save mood
                    </button>
                  </div>
                </div>
              ) : null}

              {!showGate && step === 'reaction' && savedEntry ? (
                <PlantReaction
                  entry={savedEntry}
                  garden={garden}
                  newlyUnlocked={newlyUnlocked}
                  onOfferBreathing={() => setShowBreathing(true)}
                  onDone={resetAndClose}
                />
              ) : null}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <BreathingExercise
        open={showBreathing}
        soundEnabled={settings.soundEnabled}
        onToggleSound={(enabled) => updateSettings({ soundEnabled: enabled })}
        onSkip={() => setShowBreathing(false)}
        onComplete={() => setShowBreathing(false)}
      />
    </>
  )
}
