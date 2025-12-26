import { Vault, Send, TrendingUp } from 'lucide-react'

export function Treasury() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Treasury</h1>
        <p className="text-gray-500 mt-1">Manage DAO funds and payments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Total Balance</p>
            <Vault className="text-primary-600" size={24} />
          </div>
          <p className="text-3xl font-bold text-gray-900">1,234,567 STX</p>
          <p className="text-sm text-green-600 mt-2">+5.2% this month</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Total Spent</p>
            <Send className="text-red-600" size={24} />
          </div>
          <p className="text-3xl font-bold text-gray-900">234,567 STX</p>
          <p className="text-sm text-gray-600 mt-2">This month</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Active Streams</p>
            <TrendingUp className="text-blue-600" size={24} />
          </div>
          <p className="text-3xl font-bold text-gray-900">12</p>
          <p className="text-sm text-gray-600 mt-2">Payment streams</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Transactions</h2>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Send className="text-primary-600" size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Payment to Contributor</p>
                  <p className="text-sm text-gray-500">ST1PQHQ...PGZGM</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">-10,000 STX</p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
