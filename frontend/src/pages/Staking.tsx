import { useState } from 'react'
import { Lock, Unlock, TrendingUp } from 'lucide-react'

export function Staking() {
  const [amount, setAmount] = useState('')
  const [lockPeriod, setLockPeriod] = useState('30')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Staking</h1>
        <p className="text-gray-500 mt-1">Stake tokens to earn rewards and voting power</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Stake Tokens</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount to Stake
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="input"
              />
              <p className="text-sm text-gray-500 mt-1">
                Balance: 10,000 GSTK
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lock Period
              </label>
              <select
                value={lockPeriod}
                onChange={(e) => setLockPeriod(e.target.value)}
                className="input"
              >
                <option value="30">1 Month (1x multiplier)</option>
                <option value="90">3 Months (1.5x multiplier)</option>
                <option value="180">6 Months (2x multiplier)</option>
                <option value="360">12 Months (3x multiplier)</option>
              </select>
            </div>

            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <h3 className="font-medium text-primary-900 mb-2">Staking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-primary-800">Voting Power:</span>
                  <span className="font-bold text-primary-900">
                    {amount ? Number(amount) * (lockPeriod === '360' ? 3 : lockPeriod === '180' ? 2 : lockPeriod === '90' ? 1.5 : 1) : 0} GSTK
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-800">APR:</span>
                  <span className="font-bold text-green-600">
                    {lockPeriod === '360' ? '15%' : lockPeriod === '180' ? '10%' : lockPeriod === '90' ? '7%' : '5%'}
                  </span>
                </div>
              </div>
            </div>

            <button className="btn btn-primary w-full flex items-center justify-center space-x-2">
              <Lock size={20} />
              <span>Stake Tokens</span>
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Staking</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Staked</span>
                <span className="text-2xl font-bold text-gray-900">5,000 GSTK</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Voting Power</span>
                <span className="text-2xl font-bold text-primary-600">10,000 GSTK</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Rewards Earned</span>
                <span className="text-2xl font-bold text-green-600">125 GSTK</span>
              </div>
              <button className="btn btn-primary w-full flex items-center justify-center space-x-2">
                <TrendingUp size={20} />
                <span>Claim Rewards</span>
              </button>
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Active Stakes</h2>
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">5,000 GSTK</span>
                  <span className="text-sm text-gray-500">2x multiplier</span>
                </div>
                <div className="text-sm text-gray-600">
                  Unlocks in 145 days
                </div>
                <button className="btn btn-secondary w-full mt-3 flex items-center justify-center space-x-2">
                  <Unlock size={18} />
                  <span>Unstake</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
