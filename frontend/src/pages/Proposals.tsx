import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProposalStore } from '../stores/proposalStore'
import { Filter, Search, Plus } from 'lucide-react'

export function Proposals() {
  const navigate = useNavigate()
  const { proposals } = useProposalStore()
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState('')

  const filteredProposals = proposals.filter(p => {
    const matchesFilter = filter === 'all' || p.status === filter
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                         p.description.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Proposals</h1>
          <p className="text-gray-500 mt-1">Browse and vote on governance proposals</p>
        </div>
        <button
          onClick={() => navigate('/proposals/create')}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Proposal</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search proposals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter size={20} className="text-gray-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input w-48"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="succeeded">Succeeded</option>
            <option value="executed">Executed</option>
            <option value="defeated">Defeated</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredProposals.map((proposal) => (
          <div
            key={proposal.id}
            onClick={() => navigate(`/proposals/${proposal.id}`)}
            className="card hover:shadow-md cursor-pointer transition-all"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-xl font-bold text-gray-900">
                    #{proposal.id} {proposal.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    proposal.status === 'active' 
                      ? 'bg-green-100 text-green-700'
                      : proposal.status === 'succeeded'
                      ? 'bg-blue-100 text-blue-700'
                      : proposal.status === 'executed'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {proposal.status}
                  </span>
                </div>
                <p className="text-gray-600 mt-2">{proposal.description}</p>
                <div className="flex items-center space-x-6 mt-4 text-sm text-gray-500">
                  <span>Proposer: {proposal.proposer.slice(0, 10)}...</span>
                  <span>•</span>
                  <span>Block {proposal.startBlock} - {proposal.endBlock}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500">For</p>
                <p className="text-lg font-bold text-green-600">{proposal.forVotes}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Against</p>
                <p className="text-lg font-bold text-red-600">{proposal.againstVotes}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Abstain</p>
                <p className="text-lg font-bold text-gray-600">{proposal.abstainVotes}</p>
              </div>
            </div>
          </div>
        ))}

        {filteredProposals.length === 0 && (
          <div className="card text-center py-12">
            <p className="text-gray-500">No proposals found</p>
          </div>
        )}
      </div>
    </div>
  )
}
