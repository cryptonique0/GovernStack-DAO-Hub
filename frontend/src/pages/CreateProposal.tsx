import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { createProposalTx } from '@/services/stacks'

export function CreateProposal() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contractAddress: '',
    functionName: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createProposalTx({
      title: formData.title,
      description: formData.description,
      contractAddress: formData.contractAddress,
      functionName: formData.functionName,
      parameters: [],
    })
    navigate('/proposals')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/proposals')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft size={20} />
        <span>Back to Proposals</span>
      </button>

      <div className="card">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Proposal</h1>
        <p className="text-gray-500 mb-6">
          Submit a new governance proposal for the community to vote on
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proposal Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Allocate 100,000 STX to Marketing Campaign"
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide a detailed description of your proposal..."
              rows={6}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Target Contract Address
            </label>
            <input
              type="text"
              value={formData.contractAddress}
              onChange={(e) => setFormData({ ...formData, contractAddress: e.target.value })}
              placeholder="ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.treasury"
              className="input font-mono text-sm"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              The smart contract to execute if proposal passes
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Function Name
            </label>
            <input
              type="text"
              value={formData.functionName}
              onChange={(e) => setFormData({ ...formData, functionName: e.target.value })}
              placeholder="e.g., execute-payment"
              className="input font-mono text-sm"
              required
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-medium text-yellow-900 mb-2">Requirements</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Minimum 1,000 GSTK tokens required to create proposal</li>
              <li>• Voting period: 10 days (~1,440 blocks)</li>
              <li>• Quorum requirement: 40% of total supply</li>
              <li>• Execution delay: 1 day after successful vote</li>
            </ul>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="btn btn-primary flex-1"
            >
              Create Proposal
            </button>
            <button
              type="button"
              onClick={() => navigate('/proposals')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
