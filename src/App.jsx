import { useState } from 'react'
import { styled } from 'styled-components'
import Piano from './components/piano'
import { Playlist } from './components/modal-window/index.jsx'

const Body = styled.div`
  height: 100%;
  max-width: 100vw;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #272626;
`

const App = () => {
  const [track, setTrack] = useState(null)
  const [isShowPlaylist, setShowPlaylist] = useState(false)

  return (
    <Body>
      {
        isShowPlaylist 
          ? (
            <Playlist
              onSelect={track => 
                setTrack(track)
              }
              onClose={() => 
                setShowPlaylist(false)
              }
            />
          )
          : null
      }
      <Piano 
        onPlaylist={() => {
          setShowPlaylist(true)
          setTrack(null)
        }}
        trackData={track}
      />
    </Body>
  )
}

export default App