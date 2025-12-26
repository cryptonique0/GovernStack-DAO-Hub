import { create } from 'zustand'

export interface Proposal {
  id: number
  proposer: string
  title: string
  description: string
  status: 'active' | 'pending' | 'succeeded' | 'defeated' | 'executed' | 'canceled' | 'queued'
  forVotes: string
  againstVotes: string
  abstainVotes: string
  startBlock: number
  endBlock: number
  createdAt: number
  eta?: number
}

interface ProposalState {
  proposals: Proposal[]
  loading: boolean
  setProposals: (proposals: Proposal[]) => void
  addProposal: (proposal: Proposal) => void
  updateProposal: (id: number, updates: Partial<Proposal>) => void
  setLoading: (loading: boolean) => void
}

export const useProposalStore = create<ProposalState>((set) => ({
  proposals: [],
  loading: false,
  
  setProposals: (proposals) => set({ proposals }),
  
  addProposal: (proposal) => set((state) => ({
    proposals: [proposal, ...state.proposals]
  })),
  
  updateProposal: (id, updates) => set((state) => ({
    proposals: state.proposals.map(p => 
      p.id === id ? { ...p, ...updates } : p
    )
  })),
  
  setLoading: (loading) => set({ loading }),
}))
