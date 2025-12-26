import { useParams } from 'react-router-dom'
import { useProposalStore } from '../stores/proposalStore'
import { ThumbsUp, ThumbsDown, Minus, Clock } from 'lucide-react'
import { castVoteTx } from '@/services/stacks'

export function ProposalDetail() {
  const { id } = useParams<{ id: string }>()
  const { proposals } = useProposalStore()
  const proposal = proposals.find(p => p.id === Number(id))

  if (!proposal) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500">Proposal not found</p>
      </div>
    )
  }

  const totalVotes = Number(proposal.forVotes) + Number(proposal.againstVotes) + Number(proposal.abstainVotes)
  const forPercentage = totalVotes > 0 ? (Number(proposal.forVotes) / totalVotes) * 100 : 0
  const againstPercentage = totalVotes > 0 ? (Number(proposal.againstVotes) / totalVotes) * 100 : 0
  const abstainPercentage = totalVotes > 0 ? (Number(proposal.abstainVotes) / totalVotes) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Proposal #{proposal.id}
          </h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
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

        <h2 className="text-2xl font-bold text-gray-900 mb-4">{proposal.title}</h2>
        <p className="text-gray-600 mb-6">{proposal.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Proposer</p>
            <p className="font-mono text-sm">{proposal.proposer}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Voting Period</p>
            <p className="text-sm">Block {proposal.startBlock} - {proposal.endBlock}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-bold text-gray-900">Voting Results</h3>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-green-600 font-medium">For</span>
              <span className="text-gray-900">{proposal.forVotes} ({forPercentage.toFixed(1)}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-500 h-3 rounded-full transition-all"
                style={{ width: `${forPercentage}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-red-600 font-medium">Against</span>
              <span className="text-gray-900">{proposal.againstVotes} ({againstPercentage.toFixed(1)}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-red-500 h-3 rounded-full transition-all"
                style={{ width: `${againstPercentage}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 font-medium">Abstain</span>
              <span className="text-gray-900">{proposal.abstainVotes} ({abstainPercentage.toFixed(1)}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gray-400 h-3 rounded-full transition-all"
                style={{ width: `${abstainPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {proposal.status === 'active' && (
          <div className="mt-8 grid grid-cols-3 gap-4">
            <button
              className="btn btn-primary flex items-center justify-center space-x-2"
              onClick={() => castVoteTx(proposal.id, 1)}
            >
              <ThumbsUp size={20} />
              <span>Vote For</span>
            </button>
            <button
              className="btn bg-red-600 text-white hover:bg-red-700 flex items-center justify-center space-x-2"
              onClick={() => castVoteTx(proposal.id, 0)}
            >
              <ThumbsDown size={20} />
              <span>Vote Against</span>
            </button>
            <button
              className="btn btn-secondary flex items-center justify-center space-x-2"
              onClick={() => castVoteTx(proposal.id, 2)}
            >
              <Minus size={20} />
              <span>Abstain</span>
            </button>
          </div>
        )}

        {proposal.status === 'succeeded' && (
          <div className="mt-8">
            <button className="btn btn-primary w-full flex items-center justify-center space-x-2">
              <Clock size={20} />
              <span>Queue for Execution</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
