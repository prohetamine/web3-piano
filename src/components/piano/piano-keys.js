const A4_FREQ = 440

const NOTES = [
  { note: 'C', type: 'white' },
  { note: 'C#', type: 'black' },
  { note: 'D', type: 'white' },
  { note: 'D#', type: 'black' },
  { note: 'E', type: 'white' },
  { note: 'F', type: 'white' },
  { note: 'F#', type: 'black' },
  { note: 'G', type: 'white' },
  { note: 'G#', type: 'black' },
  { note: 'A', type: 'white' },
  { note: 'A#', type: 'black' },
  { note: 'B', type: 'white' }
]

const noteToFreq = noteIndex => 
  +(A4_FREQ * Math.pow(2, (noteIndex - 57) / 12)).toFixed(2)

const pianoKeys = []
let keyIndex = 0

for (let octave = 0; octave <= 8; octave++) {
  for (const { note, type } of NOTES) {
    if (octave === 0 && !['A', 'A#', 'B'].includes(note)) continue
    if (octave === 8 && note !== 'C') continue

    pianoKeys.push({
      note: `${note}${octave}`,
      freq: noteToFreq(keyIndex),
      type,
    })

    keyIndex++
  }
}

export default pianoKeys