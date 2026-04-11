import useWindowSize from '@rooks/use-window-size'
import pianoKeys from './piano-keys.js'
import playPiano from './play-piano'
import { 
  WhiteBtn,
  BlackBtn,
  PianoContainer
} from './styles.jsx'
import { useRef } from 'react'
import { useAnimate } from 'framer-motion'
import styled from 'styled-components'
import texture from './../../assets/texture.png'
import watermark from './../../assets/watermark.png'

const Line = styled.div`
  box-shadow: inset 0 4px 4px 0 rgba(0, 0, 0, 0.25), 0 4px 4px 1px rgba(0, 0, 0, 0.25);
  background: #9e8a00;
  width: 100%;
  height: 0.6cqw;
  position: absolute;
  z-index: 4444;
`

const Watermark = styled.img`
  width: 8cqw;
  position: absolute;
  z-index: 6666;
  margin: 0 calc(50cqw - 4cqw);
  margin-bottom: 1cqw;
  opacity: 0.9;
`

const ratio = 1

const duration = { duration: 0.1 }

const startAnimate = isBlack => ({ 
  scale: isBlack ? 0.88 : 0.98, 
  background: isBlack 
                ? '#000' 
                : '#fff',
  boxShadow: isBlack 
              ? `inset 0 -4px 22px 13px rgba(0, 0, 0, 0.25)`
              : `inset 0 -4px 22px 13px rgba(0, 0, 0, 0.25)`
})

const endAnimate = isBlack => ({ 
  scale: 1, 
  background: isBlack 
                ? 'radial-gradient(116.03% 22.4% at 50% 86.34%, #272727 0%, #000 100%)' 
                : 'radial-gradient(57.96% 22.4% at 50% 86.34%, #fff 0%, #e7e7e7 100%)',
  boxShadow: isBlack 
              ? `inset 0 0px 0px 0px rgba(0, 0, 0, 0.25)`
              : `inset 0 0px 0px 0px rgba(0, 0, 0, 0.25)`
})

const Body = styled.div`
  background: linear-gradient(180deg, rgba(15, 15, 15, 0.6) 0%, rgba(19, 19, 19, 0.6) 4.81%, rgba(12, 12, 12, 0.6) 81.73%, rgba(25, 24, 24, 0.6) 92.31%, rgba(4, 4, 4, 0.6) 100%), url(${texture});
  background-size: cover;
  width: 100cqw;
  height: 3cqw;
  display: flex;
  align-items: flex-end;
  border-top: 1px solid #2f2f2f;
  box-shadow: 0px 0px 3px 1px #000000;
`

const Piano = ({ offset, keydownRef, onKeydown }) => {
  const shadowKeydown = useRef()
  const keyRefs = pianoKeys.map(useAnimate)
      , shadowKeyRefs = pianoKeys.map(useAnimate)

  const { innerWidth: _innerWidth } = useWindowSize()
  const innerWidth = _innerWidth > 1280 ? 1280 : _innerWidth

  const size = innerWidth / 0.5

  const PianoWidth = size * ratio
      , screen = innerWidth * ratio
      , position = offset * PianoWidth
      , halfScreen = screen / 2
      , left = Math.max(0, Math.min(position - halfScreen, PianoWidth - screen))
      , right = left + screen

  const getAnimation = async index => {
    const [ref, animate] = keyRefs[index]
    const [shadowRef, shadowAnimate] = shadowKeyRefs[index]
  
    const isBlack = ref.current.getAttribute('data-animation') === 'black'
    
    const sa = startAnimate(isBlack)  
        , ea = endAnimate(isBlack)

    await Promise.all([
      animate(ref.current, sa, duration),
      shadowAnimate(shadowRef.current, sa, duration)
    ])

    await Promise.all([
      animate(ref.current, ea, duration),
      shadowAnimate(shadowRef.current, ea, duration)
    ])
  }

  const handleKeydown = async(event, index, freq) => {
    if (event) {
      event.stopPropagation()
      event.preventDefault()
    }

    playPiano(freq)
    onKeydown(index)
    if (shadowKeydown.current) {
      shadowKeydown.current(index)
    }
    getAnimation(index)
  }

  keydownRef.current = keydown => {
    if (shadowKeydown.current) {
      shadowKeydown.current(keydown)
    }
    if (keyRefs[0][0].current) {
      ;(async () => {
        if (!keydown) {
          return
        }
        const [ref] = keyRefs[keydown]
        playPiano(ref.current.getAttribute('data-freq'))
        getAnimation(keydown)
      })()
    }
  }

  return (
    <>
      <Body>
        <Watermark src={watermark} />
        <PianoContainer
          style={{
            width: `${size * ratio}px`,
            height: `${(innerWidth / 5) * ratio}px`,
            maxHeight: '1.5cqw',
            transform: `translateX(-${left}px) rotateZ(180deg) rotateY(180deg)`,
            clipPath: `rect(0px ${right}px ${(innerWidth / 5) * ratio}px ${left}px)`,
            filter: 'blur(4px) brightness(0.3)',
            opacity: '0.5'
          }}
        >
        {
          pianoKeys.map(
            ({ freq, type }, key) => 
              type === 'black'
                ? (
                  <BlackBtn 
                    style={{
                      width: `${(size / 72.48484848484848) * ratio}px`,
                      maxHeight: '150px',
                      marginLeft: `-${((size / 72.48484848484848) / 2) * ratio}px`,
                      marginRight: `-${((size / 72.48484848484848) / 2) * ratio}px`,
                      borderRadius: `${(size / 598) * ratio}px ${(size / 598) * ratio}px ${(size / 398) * ratio}px ${(size / 398) * ratio}px`,
                      position: 'relative',
                    }}
                    ref={shadowKeyRefs[key][0]} 
                    data-animation='black'
                    key={key}
                    data-freq={freq}
                  />
                )
                : (
                  <WhiteBtn 
                    style={{
                      width: `${(size / 52) * ratio}px`,
                      maxHeight: '100%',
                      borderLeft: `1px solid #444`,
                      borderRight: `1px solid #444`,
                      borderRadius: `0px 0px ${(size / 1196) * ratio}px ${(size / 1196) * ratio}px`,
                    }}
                    ref={shadowKeyRefs[key][0]}
                    key={key}
                    data-freq={freq}
                    data-animation='white'
                  />
                )
          )
        }
        </PianoContainer>
      </Body>
      <Line style={{
        position: 'relative',
        zIndex: '1'
      }}/>
      <PianoContainer
        style={{
          marginTop: `-0.3cqw`,
          width: `${size * ratio}px`,
          height: `${(innerWidth / 5) * ratio}px`,
          maxHeight: '250px',
          transform: `translateX(-${left}px)`,
          clipPath: `rect(0px ${right}px ${(innerWidth / 5) * ratio}px ${left}px)`,
          position: 'relative',
          zIndex: '5555'
        }}
      >
      {
        pianoKeys.map(
          ({ freq, type, note }, key) => 
            type === 'black'
              ? (
                <BlackBtn 
                  style={{
                    width: `${(size / 72.48484848484848) * ratio}px`,
                    maxHeight: '150px',
                    marginLeft: `-${((size / 72.48484848484848) / 2) * ratio}px`,
                    marginRight: `-${((size / 72.48484848484848) / 2) * ratio}px`,
                    borderRadius: `${(size / 598) * ratio}px ${(size / 598) * ratio}px ${(size / 398) * ratio}px ${(size / 398) * ratio}px`,
                    position: 'relative'
                  }}
                  ref={keyRefs[key][0]} 
                  data-animation='black'
                  key={key}
                  data-freq={freq}
                  onTap={event => handleKeydown(event, key, freq)}
                />
              )
              : (
                <WhiteBtn 
                  style={{
                    marginTop: `0.3cqw`,
                    width: `${(size / 52) * ratio}px`,
                    maxHeight: '250px',
                    borderLeft: `1px solid #444`,
                    borderRight: `1px solid #444`,
                    borderRadius: `0px 0px ${(size / 1196) * ratio}px ${(size / 1196) * ratio}px`,
                    fontSize: `${(size / 200) * ratio}px`
                  }}
                  ref={keyRefs[key][0]}
                  key={key}
                  data-freq={freq}
                  data-animation='white'
                  onTap={event => handleKeydown(event, key, freq)}
                >{note}</WhiteBtn>
              )
        )
      }
      </PianoContainer>
    </>
  )
}

export default Piano