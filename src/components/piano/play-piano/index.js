import piano_C4 from './Piano-C4.wav'

const audioCtx = new AudioContext()
let pianoBuffer = null

;(async () => {
  const res = await fetch(piano_C4)
  const arrayBuffer = await res.arrayBuffer()
  pianoBuffer = await audioCtx.decodeAudioData(arrayBuffer)
})()

const playPiano = (freq, velocity = 1) => {
  if (!pianoBuffer) return

  const source = audioCtx.createBufferSource()
  source.buffer = pianoBuffer

  const baseFreq = 261.63
  source.playbackRate.value = freq / baseFreq

  const gain = audioCtx.createGain()
  const now = audioCtx.currentTime

  gain.gain.setValueAtTime(0, now)
  gain.gain.linearRampToValueAtTime(velocity, now + 0.005)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5)

  source.connect(gain)
  gain.connect(audioCtx.destination)

  source.start(now)
  source.stop(now + 3)
}

export default playPiano