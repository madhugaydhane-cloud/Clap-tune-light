import type { MoodType } from '../types'

export const REFLECTION_PROMPTS: Record<MoodType, string[]> = {
  happy: [
    'What made today feel good?',
    'What moment brought you a smile?',
    'Who or what lifted your spirits?',
  ],
  calm: [
    'What helped you feel peaceful?',
    'Where did you find stillness today?',
    'What slowed your mind in a good way?',
  ],
  excited: [
    'What are you looking forward to?',
    'What sparked this energy?',
    'What possibility feels alive right now?',
  ],
  tired: [
    'What would help you recharge?',
    'What can wait until tomorrow?',
    'How can you offer yourself rest tonight?',
  ],
  stressed: [
    'What is taking up most of your mental space?',
    'What feels heavy that you can set down for a moment?',
    'What small thing would bring a little relief?',
  ],
  sad: [
    'What would you like to be gentle with yourself about?',
    'What do you need most right now?',
    'Is there anything you wish someone would say to you?',
  ],
}

export function getReflectionPrompt(mood: MoodType, seed?: number): string {
  const prompts = REFLECTION_PROMPTS[mood]
  const index =
    typeof seed === 'number'
      ? Math.abs(seed) % prompts.length
      : Math.floor(Math.random() * prompts.length)
  return prompts[index]
}
