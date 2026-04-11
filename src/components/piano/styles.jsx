import { styled } from 'styled-components'
import { motion } from 'framer-motion'
import record from './../../assets/record.svg'
import activeRecord from './../../assets/active-record.svg'
import soundLibrary from './../../assets/sound-library.svg'
import play from './../../assets/play.svg'
import pause from './../../assets/pause.svg'
import stop from './../../assets/stop.svg'
import trash from './../../assets/trash.svg'
import upload from './../../assets/upload.svg'
import profile from './../../assets/profile.svg'
import wallet from './../../assets/wallet.svg'
import github from './../../assets/github.svg'
import prohetamine from './../../assets/prohetamine.svg'

export const PianoContainer = styled.div`
  display: flex;
`

export const PianoOverflowOutfit = styled.div`
  position: relative;
  overflow: hidden;
`

export const BlackBtn = styled(motion.div)`
  height: 50%;
  background: radial-gradient(116.03% 22.4% at 50% 86.34%, #272727 0%, #000 100%);
  z-index: 4444;
  position: relative;
  box-sizing: border-box;
  transform-origin: top;
  box-shadow: inset 0 0px 0px 0px rgba(0, 0, 0, 0.25);
  cursor: pointer;
`

export const WhiteBtn = styled(motion.div)`
  height: 100%;
  background: radial-gradient(57.96% 22.4% at 50% 86.34%, #fff 0%, #e7e7e7 100%);
  transform-origin: 50% 0%;
  touch-action: none;
  display: flex;
  box-sizing: border-box;
  justify-content: center;
  align-items: flex-end;
  box-shadow: inset 0 0px 0px 0px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  padding-bottom: 0.5%;
  color: rgb(53, 52, 52);
`

export const Track = styled.div`
  position: absolute;
  z-index: 6666;
  cursor: move;
`

export const Icon = styled.div`
  background-image: url("${props => props.src}");
  background-size: cover;
  width: 2.2cqw;
  height: 2.2cqw;
  max-width: 2.2cqw;
  max-height: 2.2cqw;
`

export const DefaultButton = styled.div`
  border-radius: 0.5cqw;
  background: linear-gradient(180deg, #2b2b2b 0%, #151515 100%);;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? '0.2' : '1'};

  &:active {
    opacity: 0.2;
  }
`

export const RecordButton = ({ isRecord, onClick }) => 
  isRecord ? (
    <DefaultButton 
      onClick={onClick}
      style={{
        background: 'radial-gradient(49.71% 50.01% at 50% 50%, #eea4a4 0%, #d83535 100%)'
      }}
    >
      <Icon src={activeRecord} />
    </DefaultButton>
  ) : (
    <DefaultButton onClick={onClick}>
      <Icon src={record} />
    </DefaultButton>
  )

export const PlaylistButton = ({ disabled = false, onClick }) => (
  <DefaultButton onClick={() => !disabled && onClick()} disabled={disabled}>
    <Icon src={soundLibrary} />
  </DefaultButton>
)

export const ControllButton = ({ disabled = false, isPlay, onPlay, onPause }) => 
  isPlay ? (
    <DefaultButton onClick={() => !disabled && onPause()} disabled={disabled}>
      <Icon src={pause} />
    </DefaultButton>
  ) : (
    <DefaultButton onClick={() => !disabled && onPlay()} disabled={disabled}>
      <Icon src={play} />
    </DefaultButton>
  )

export const StopButton = ({ disabled = false, onClick }) => (
  <DefaultButton onClick={() => !disabled && onClick()} disabled={disabled}>
    <Icon src={stop} />
  </DefaultButton>
)

export const TrashButton = ({ onClick }) => (
  <DefaultButton onClick={onClick}>
    <Icon src={trash} />
  </DefaultButton>
)

export const UploadButton = ({ disabled = false, onClick }) => (
  <DefaultButton onClick={() => !disabled && onClick()} disabled={disabled}>
    <Icon src={upload} />
  </DefaultButton>
)

export const ProfileButton = ({ disabled = false, onClick }) => (
  <DefaultButton onClick={() => !disabled && onClick()} disabled={disabled}>
    <Icon src={profile} />
  </DefaultButton>
)

export const WalletButton = ({ onClick }) => (
  <DefaultButton onClick={onClick}>
    <Icon src={wallet} />
  </DefaultButton>
)

export const LinkButton = ({ href, src }) => (
  <DefaultButton onClick={() => window.open(href, '_blank')}>
    <Icon src={src} />
  </DefaultButton>
)

export const ProhetamineButton = () => (
  <LinkButton src={prohetamine} href='https://prohetamine.ru/web3' />
)

export const GithubButton = () => (
  <LinkButton src={github} href='https://github.com/prohetamine/web3-piano' />
)