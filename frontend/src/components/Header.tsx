import { useWalletStore } from '../stores/walletStore'
import { Wallet, LogOut } from 'lucide-react'

export function Header() {
  const { address, isConnected, balance, connect, disconnect } = useWalletStore()

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">GovernStack</h1>
              <p className="text-sm text-gray-500">DAO Hub on Stacks</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isConnected ? (
              <>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {balance} STX
                  </p>
                  <p className="text-xs text-gray-500">
                    {truncateAddress(address!)}
                  </p>
                </div>
                <button
                  onClick={disconnect}
                  className="btn btn-secondary flex items-center space-x-2"
                >
                  <LogOut size={18} />
                  <span>Disconnect</span>
                </button>
              </>
            ) : (
              <button
                onClick={connect}
                className="btn btn-primary flex items-center space-x-2"
              >
                <Wallet size={18} />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
