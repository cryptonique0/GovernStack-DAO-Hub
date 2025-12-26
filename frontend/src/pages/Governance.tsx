import { Settings, Users, Clock, Shield } from 'lucide-react'

export function Governance() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Governance Settings</h1>
        <p className="text-gray-500 mt-1">Configure DAO parameters and settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <Settings className="text-primary-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Voting Parameters</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voting Period
              </label>
              <input
                type="number"
                defaultValue="1440"
                className="input"
              />
              <p className="text-sm text-gray-500 mt-1">Blocks (~10 days)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quorum Percentage
              </label>
              <input
                type="number"
                defaultValue="40"
                className="input"
              />
              <p className="text-sm text-gray-500 mt-1">% of total supply</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proposal Threshold
              </label>
              <input
                type="number"
                defaultValue="1000000"
                className="input"
              />
              <p className="text-sm text-gray-500 mt-1">Minimum tokens to create proposal</p>
            </div>

            <button className="btn btn-primary w-full">
              Update Parameters
            </button>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Timelock Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Execution Delay
              </label>
              <input
                type="number"
                defaultValue="144"
                className="input"
              />
              <p className="text-sm text-gray-500 mt-1">Blocks (~1 day)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grace Period
              </label>
              <input
                type="number"
                defaultValue="1440"
                className="input"
              />
              <p className="text-sm text-gray-500 mt-1">Blocks (~10 days)</p>
            </div>

            <button className="btn btn-primary w-full">
              Update Timelock
            </button>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="text-green-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Delegation</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delegate Voting Power To
              </label>
              <input
                type="text"
                placeholder="ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
                className="input font-mono text-sm"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Current Delegation</h3>
              <p className="text-sm text-blue-800">
                You have delegated your voting power to yourself
              </p>
            </div>

            <button className="btn btn-primary w-full">
              Delegate Votes
            </button>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="text-purple-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Security</h2>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Multi-sig Threshold</h3>
              <p className="text-2xl font-bold text-primary-600">3 of 5</p>
              <p className="text-sm text-gray-600 mt-1">Signers required for treasury</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Emergency Actions</h3>
              <button className="btn bg-red-600 text-white hover:bg-red-700 w-full mt-2">
                Pause Governance
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
