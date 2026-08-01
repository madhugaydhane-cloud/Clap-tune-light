export function playSwitchSound(isOn: boolean) {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = isOn ? 420 : 220
    gain.gain.value = 0.0001
    osc.connect(gain)
    gain.connect(ctx.destination)
    const now = ctx.currentTime
    gain.gain.exponentialRampToValueAtTime(0.05, now + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18)
    osc.start(now)
    osc.stop(now + 0.2)
    window.setTimeout(() => {
      void ctx.close()
    }, 300)
  } catch {
    // Audio may be blocked; ignore
  }
}
