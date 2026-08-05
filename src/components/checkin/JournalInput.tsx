interface JournalInputProps {
  value: string
  onChange: (value: string) => void
  prompt: string
  maxLength?: number
}

export function JournalInput({
  value,
  onChange,
  prompt,
  maxLength = 280,
}: JournalInputProps) {
  return (
    <div className="space-y-2">
      <label htmlFor="journal-note" className="block text-sm font-semibold text-forest">
        Journal note
        <span className="ml-1 font-normal text-muted">(optional)</span>
      </label>
      <p className="font-display text-lg italic text-sage-deep">“{prompt}”</p>
      <textarea
        id="journal-note"
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder="Capture a thought, or skip and continue…"
        className="w-full resize-none rounded-[20px] border border-cream-dark bg-surface px-4 py-3 text-sm leading-relaxed text-forest placeholder:text-muted/70 focus:border-sage focus:outline-none"
      />
      <div className="flex justify-between text-xs text-muted">
        <span>{value.trim() ? 'Reflection ready' : 'Empty journal is okay'}</span>
        <span>
          {value.length}/{maxLength}
        </span>
      </div>
    </div>
  )
}
