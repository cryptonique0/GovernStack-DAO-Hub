import { useNavigate } from 'react-router-dom'
import { useProposalStore } from '../stores/proposalStore'
import { Plus, TrendingUp, Users, Vote, FileText, Vault } from 'lucide-react'

export function Dashboard() {
  const navigate = useNavigate()
  const { proposals } = useProposalStore()

  const activeProposals = proposals.filter(p => p.status === 'active').length
  const totalProposals = proposals.length

  const stats = [
    {
      name: 'Active Proposals',
      value: activeProposals,
      icon: Vote,
      change: '+12%',
      changeType: 'positive',
    },
    {
      name: 'Total Proposals',
      value: totalProposals,
      icon: FileText,
      change: '+8%',
      changeType: 'positive',
    },
    {
      name: 'Treasury Balance',
      value: '1.2M STX',
      icon: Vault,
      change: '+5%',
      changeType: 'positive',
    },
    {
      name: 'Total Stakers',
      value: '456',
      icon: Users,
      change: '+23%',
      changeType: 'positive',
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Overview of your DAO governance</p>
        </div>
        <button
          onClick={() => navigate('/proposals/create')}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Proposal</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <div className="p-3 bg-primary-50 rounded-lg">
                <stat.icon className="text-primary-600" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="text-green-500 mr-1" size={16} />
              <span className="text-green-500 font-medium">{stat.change}</span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Proposals</h2>
          <div className="space-y-4">
            {proposals.slice(0, 5).map((proposal) => (
              <div
                key={proposal.id}
                onClick={() => navigate(`/proposals/${proposal.id}`)}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 cursor-pointer transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{proposal.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {proposal.description.slice(0, 100)}...
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    proposal.status === 'active' 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {proposal.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Voting Power</p>
                <p className="text-2xl font-bold text-primary-600 mt-1">1,250 GSTK</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Proposals Created</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Votes Cast</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
