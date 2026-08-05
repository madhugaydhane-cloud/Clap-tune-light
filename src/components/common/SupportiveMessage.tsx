interface SupportiveMessageProps {
  message: string
}

export function SupportiveMessage({ message }: SupportiveMessageProps) {
  return (
    <blockquote className="rounded-[24px] bg-sage-soft/70 px-5 py-4 text-center">
      <p className="font-display text-xl italic leading-snug text-forest">
        “{message}”
      </p>
    </blockquote>
  )
}
