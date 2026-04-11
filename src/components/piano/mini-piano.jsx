import { useEffect, useRef } from 'react'
import useWindowSize from '@rooks/use-window-size'
import pianoKeys from './piano-keys.js'
import { 
  WhiteBtn,
  BlackBtn,
  PianoContainer,
  PianoOverflowOutfit,
  Track
} from './styles.jsx'

const ratio = 0.15

const MiniPiano = ({ isPlay, onChange, value }) => {
  const trackRef = useRef()
  
  const { innerWidth: _innerWidth } = useWindowSize()
  const innerWidth = _innerWidth > 1280 ? 1280 : _innerWidth

  const size = innerWidth / 0.4

  const PianoWidth = size * ratio
      , screen = innerWidth * ratio
      , position = value * PianoWidth
      , halfScreen = screen / 2
      , left = Math.max(0, Math.min(position - halfScreen, PianoWidth - screen))
      , right = left + screen

  useEffect(() => {
    const node = trackRef.current

    if (node && !isPlay) {
      const handle = event => {
        const rect = node.getBoundingClientRect()

        event.stopPropagation()
        event.preventDefault()

        const clientX = event.touches
                          ? event.touches[0].clientX
                          : event.clientX

        const offsetX = clientX - rect.left

        const min = screen / 2
            , max = rect.width - screen / 2

        const clamped = Math.max(min, Math.min(offsetX, max))

        const value = (clamped - min) / (max - min)
        onChange(value)
      }

      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      node.addEventListener(isTouch ? 'touchmove' : 'mousemove', handle)
      node.addEventListener(isTouch ? 'touchstart' : 'mouseover', handle)
      return () => {
        node.removeEventListener(isTouch ? 'touchstart' : 'mouseover', handle)
        node.removeEventListener(isTouch ? 'touchmove' : 'mousemove', handle)
      }
    }
  }, [trackRef, isPlay, screen, onChange])

  return (
    <PianoOverflowOutfit 
      style={{
        width: `${PianoWidth}px`,
        minWidth: `${PianoWidth}px`,
        border: `1px solid #101010`
      }}
    >
      <Track 
        style={{
          width: `${PianoWidth}px`,
          minWidth: `${PianoWidth}px`,
          height: `${(innerWidth / 5) * ratio}px`,
          maxHeight: `${(innerWidth / 5) * ratio}px`
        }}
        ref={trackRef} 
      />
      <PianoContainer 
        style={{
          width: `${PianoWidth}px`,
          minWidth: `${PianoWidth}px`,
          height: `${(innerWidth / 5) * ratio}px`,
          maxHeight: `${(innerWidth / 5) * ratio}px`,
          position: 'absolute',
          clipPath: `rect(0px ${right}px ${(innerWidth / 5) * ratio}px ${left}px)`,
          zIndex: 6665
        }}
      >
      {
        pianoKeys.map(
          ({ freq, type }) => 
            type === 'black'
              ? (
                <BlackBtn 
                  style={{
                    width: `${(size / 72.48484848484848) * ratio}px`,
                    marginLeft: `-${((size / 72.48484848484848) / 2) * ratio}px`,
                    marginRight: `-${((size / 72.48484848484848) / 2) * ratio}px`,
                    borderRadius: `0px 0px ${(size / 398) * ratio}px ${(size / 398) * ratio}px`
                  }}
                  key={freq}   
                />
              )
              : (
                <WhiteBtn 
                  style={{
                    width: `${(size / 52) * ratio}px`,
                    borderLeft: `1px solid #444`,
                    borderRight: `1px solid #444`,
                    borderRadius: `0px 0px ${(size / 1196) * ratio}px ${(size / 1196) * ratio}px`,
                  }}
                  key={freq}
                />
              )
        )
      }
      </PianoContainer>
      <PianoContainer 
        style={{ 
          width: `${PianoWidth}px`,
          height: `${(innerWidth / 5) * ratio}px`,
          maxHeight: `${(innerWidth / 5) * ratio}px`,
          filter: 'brightness(0.5)' 
        }}
      >
      {
        pianoKeys.map(
          ({ freq, type }) => 
            type === 'black'
              ? (
                <BlackBtn 
                  style={{
                    width: `${(size / 72.48484848484848) * ratio}px`,
                    marginLeft: `-${((size / 72.48484848484848) / 2) * ratio}px`,
                    marginRight: `-${((size / 72.48484848484848) / 2) * ratio}px`,
                    borderRadius: `0px 0px ${(size / 398) * ratio}px ${(size / 398) * ratio}px`
                  }}
                  key={freq}   
                />
              )
              : (
                <WhiteBtn 
                  style={{
                    width: `${(size / 52) * ratio}px`,
                    borderLeft: `1px solid #444`,
                    borderRight: `1px solid #444`,
                    borderRadius: `0px 0px ${(size / 1196) * ratio}px ${(size / 1196) * ratio}px`,
                  }}
                  key={freq}
                />
              )
        )
      }
      </PianoContainer>
    </PianoOverflowOutfit>
  )
}

export default MiniPiano