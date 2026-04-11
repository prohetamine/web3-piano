const filterPianoData = ({ text, index, chainId, address, isDelete, hasEdit }) => {
  try {
    const data = text.split(',')

    if (isDelete) {
      return true
    }

    if (!Array.isArray(data) && data.length > 4) {
      return false
    }

    const title = data[0]
        , date = parseInt(data[1])

    if (typeof title !== 'string') {
      return false
    }

    if (!(Number.isInteger(date) && date >= 1769690008125)) {
      return false
    }

    const notes = []
    for (let i = 2; i + 2 < data.length; i += 3) {
      const offset  = data[i] === '' ? data[i] : parseFloat(data[i])
          , note    = parseInt(data[i + 1])
          , time    = parseInt(data[i + 2])

      const offsetValid =
        offset === '' ||
        (typeof offset === 'number' && offset >= 0 && offset <= 1)

      const noteValid =
        Number.isInteger(note) && note >= 0 && note <= 87

      const timeValid =
        Number.isInteger(time) && time >= 1 && time <= 9999

      if (offsetValid && noteValid && timeValid) {
        notes.push(offset, note, time)
      }
    }

    return {
      title,
      date,
      notes,
      index,
      chainId,
      isDelete,
      hasEdit,
      address
    }
  } catch (e) {
    console.log(e)
    return false
  }
}

const formatPianoData = items => 
  items
    .map(data => filterPianoData(data))
    .filter(data => data)

export default formatPianoData