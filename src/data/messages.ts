export const SUPPORTIVE_MESSAGES = [
  'Your garden is listening.',
  'Every feeling deserves space.',
  'A small check-in can create meaningful growth.',
  'You showed up for yourself today.',
  'Your plant grew because you took a moment to reflect.',
  'Growth happens quietly — and you are growing.',
  'This moment is enough.',
  'Your garden holds every feeling with care.',
]

export function getSupportiveMessage(seed?: number): string {
  const index =
    typeof seed === 'number'
      ? Math.abs(seed) % SUPPORTIVE_MESSAGES.length
      : Math.floor(Math.random() * SUPPORTIVE_MESSAGES.length)
  return SUPPORTIVE_MESSAGES[index]
}

export const GARDEN_QUOTES = [
  'Even the quietest days leave roots.',
  'Feelings are weather. You are the garden.',
  'Tend gently. Bloom honestly.',
  'You do not need to bloom every day to grow.',
]
