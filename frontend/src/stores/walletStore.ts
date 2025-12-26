import { create } from 'zustand'
import { AppConfig, UserSession, showConnect } from '@stacks/connect'
import { StacksMainnet, StacksTestnet } from '@stacks/network'

const appConfig = new AppConfig(['store_write', 'publish_data'])
export const userSession = new UserSession({ appConfig })

interface WalletState {
  address: string | null
  isConnected: boolean
  network: 'mainnet' | 'testnet'
  balance: string
  votingPower: string
  connect: () => void
  disconnect: () => void
  setBalance: (balance: string) => void
  setVotingPower: (power: string) => void
  getNetwork: () => StacksMainnet | StacksTestnet
}

export const useWalletStore = create<WalletState>((set, get) => ({
  address: null,
  isConnected: false,
  network: 'testnet',
  balance: '0',
  votingPower: '0',
  
  connect: () => {
    showConnect({
      appDetails: {
        name: 'GovernStack DAO Hub',
        icon: window.location.origin + '/logo.svg',
      },
      redirectTo: '/',
      onFinish: () => {
        const userData = userSession.loadUserData()
        const address = userData.profile.stxAddress.testnet
        set({ address, isConnected: true })
      },
      userSession,
    })
  },
  
  disconnect: () => {
    userSession.signUserOut()
    set({ address: null, isConnected: false, balance: '0', votingPower: '0' })
  },
  
  setBalance: (balance: string) => set({ balance }),
  
  setVotingPower: (power: string) => set({ votingPower: power }),
  
  getNetwork: () => {
    const state = get()
    return state.network === 'mainnet' ? new StacksMainnet() : new StacksTestnet()
  },
}))
