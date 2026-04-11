import styled from 'styled-components'
import * as Redstone from '@prohetamine/redstone'
import { WalletButton, ProhetamineButton, GithubButton, ProfileButton } from './styles.jsx'

const Body = styled.div`
  width: 15cqw;
  height: 4cqw;
  background: #101010;
  border-radius: 0.8cqw;
  box-sizing: border-box;
  padding: 0.25cqw;
  overflow: hidden;
  display: flex;
  gap: 0.25cqw;
  margin-left: 2cqw;
`

const Menu = ({ onProfile, isUpload }) => {
  const { open, isConnected } = Redstone.useApp()

  return (
    <Body>
      <ProfileButton 
        disabled={!isUpload}
        onClick={() => onProfile()} 
      />
      <WalletButton onClick={() => open()} />
      {
        isConnected 
          ? (
            <ProhetamineButton />
          )
          : (
            <GithubButton />
          )
      }
    </Body>
  )
}

export default Menu