import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RedstoneProvider } from '@prohetamine/redstone'
import { StasPayProvider } from 'stas-pay'
import { ModalWindowProvider } from './components/modal-window/index.jsx'

const config = {
  metadata: {
    name: 'Web3 Piano',
    description: 'Example DApp with React Redstone',
    url: 'https://piano.prohetamine.ru',
    icons: ['https://piano.prohetamine.ru/icon.svg']
  },
  projectId: '1febfd92481d4ea997711d2ac4a363c0',
  host: '/web3-piano-testnet-2/'
}

createRoot(document.getElementById('root')).render(
  <RedstoneProvider config={config}>
    <ModalWindowProvider>
      <StasPayProvider>
        <App />
      </StasPayProvider>
    </ModalWindowProvider>
  </RedstoneProvider>
)
