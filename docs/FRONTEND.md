# Frontend Development Guide

## Table of Contents
1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [State Management](#state-management)
5. [Component Architecture](#component-architecture)
6. [Services & API Integration](#services--api-integration)
7. [Routing](#routing)
8. [Styling](#styling)
9. [Wallet Integration](#wallet-integration)
10. [Best Practices](#best-practices)
11. [Development Workflow](#development-workflow)

## Overview

The GovernStack DAO Hub frontend is a modern React application built with TypeScript, Vite, and TailwindCSS. It provides a comprehensive interface for interacting with the DAO's governance system on the Stacks blockchain.

### Key Features
- **Wallet Integration**: Seamless connection with Leather & Xverse wallets
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Real-time Updates**: Live proposal and voting data
- **Type Safety**: Full TypeScript coverage
- **Fast Development**: Vite for instant HMR

## Tech Stack

### Core
- **React 18.2** - UI library
- **TypeScript 5.3** - Type safety
- **Vite 5.0** - Build tool and dev server

### Blockchain
- **@stacks/connect 7.8** - Wallet connection
- **@stacks/transactions 6.13** - Transaction building
- **@stacks/network 6.13** - Network configuration

### State Management
- **Zustand 4.5** - Lightweight state management
- **TanStack Query 5.17** - Server state management

### UI & Styling
- **TailwindCSS 3.4** - Utility-first CSS
- **Lucide React 0.312** - Icon library
- **Recharts 2.10** - Charts and graphs
- **clsx 2.1** - Conditional class names

### Utilities
- **React Router DOM 6.21** - Client-side routing
- **date-fns 3.2** - Date manipulation

## Project Structure

```
frontend/
├── public/                 # Static assets
│   └── logo.svg
├── src/
│   ├── components/        # Reusable components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Layout.tsx
│   │   └── ...
│   ├── pages/            # Page components (routes)
│   │   ├── Dashboard.tsx
│   │   ├── Proposals.tsx
│   │   ├── ProposalDetail.tsx
│   │   ├── CreateProposal.tsx
│   │   ├── Governance.tsx
│   │   ├── Staking.tsx
│   │   └── Treasury.tsx
│   ├── services/         # External services
│   │   ├── stacks.ts    # Blockchain interactions
│   │   └── api.ts       # Backend API client
│   ├── stores/          # Zustand stores
│   │   ├── walletStore.ts
│   │   └── proposalStore.ts
│   ├── hooks/           # Custom React hooks
│   │   ├── useProposals.ts
│   │   ├── useVoting.ts
│   │   └── ...
│   ├── types/           # TypeScript types
│   │   ├── proposal.ts
│   │   ├── vote.ts
│   │   └── ...
│   ├── utils/           # Utility functions
│   │   ├── format.ts
│   │   ├── validation.ts
│   │   └── ...
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── index.html           # HTML template
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## State Management

### Zustand Stores

#### WalletStore
Manages wallet connection and user state.

```typescript
// src/stores/walletStore.ts
import { create } from 'zustand'
import { AppConfig, UserSession, showConnect } from '@stacks/connect'

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
}

export const useWalletStore = create<WalletState>((set) => ({
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
    set({ 
      address: null, 
      isConnected: false, 
      balance: '0', 
      votingPower: '0' 
    })
  },
  
  setBalance: (balance) => set({ balance }),
  setVotingPower: (power) => set({ votingPower: power }),
}))
```

**Usage:**
```typescript
import { useWalletStore } from '@/stores/walletStore'

function WalletButton() {
  const { address, isConnected, connect, disconnect } = useWalletStore()
  
  return (
    <button onClick={isConnected ? disconnect : connect}>
      {isConnected ? `${address.slice(0, 6)}...` : 'Connect Wallet'}
    </button>
  )
}
```

#### ProposalStore
Manages proposal state and operations.

```typescript
// src/stores/proposalStore.ts
import { create } from 'zustand'
import { Proposal } from '@/types/proposal'
import { getProposals, getProposalById } from '@/services/api'

interface ProposalState {
  proposals: Proposal[]
  selectedProposal: Proposal | null
  loading: boolean
  error: string | null
  
  fetchProposals: () => Promise<void>
  fetchProposal: (id: number) => Promise<void>
  createProposal: (data: CreateProposalData) => Promise<void>
  voteOnProposal: (id: number, vote: 0 | 1 | 2) => Promise<void>
}

export const useProposalStore = create<ProposalState>((set, get) => ({
  proposals: [],
  selectedProposal: null,
  loading: false,
  error: null,
  
  fetchProposals: async () => {
    set({ loading: true, error: null })
    try {
      const proposals = await getProposals()
      set({ proposals, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },
  
  fetchProposal: async (id: number) => {
    set({ loading: true, error: null })
    try {
      const proposal = await getProposalById(id)
      set({ selectedProposal: proposal, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },
  
  // ... other methods
}))
```

### TanStack Query (React Query)

For server state management with automatic caching and refetching:

```typescript
// src/hooks/useProposals.ts
import { useQuery } from '@tanstack/react-query'
import { getProposals } from '@/services/api'

export function useProposals() {
  return useQuery({
    queryKey: ['proposals'],
    queryFn: getProposals,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000,
  })
}

// Usage in component
function ProposalsList() {
  const { data, isLoading, error } = useProposals()
  
  if (isLoading) return <Spinner />
  if (error) return <Error message={error.message} />
  
  return (
    <div>
      {data.map(proposal => (
        <ProposalCard key={proposal.id} proposal={proposal} />
      ))}
    </div>
  )
}
```

## Component Architecture

### Layout Components

#### Layout
Main layout wrapper with header and sidebar.

```typescript
// src/components/Layout.tsx
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
```

#### Header
Navigation header with wallet connection.

```typescript
// src/components/Header.tsx
import { useWalletStore } from '@/stores/walletStore'

export function Header() {
  const { address, isConnected, connect, disconnect } = useWalletStore()
  
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">GovernStack DAO</h1>
        
        <button
          onClick={isConnected ? disconnect : connect}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {isConnected 
            ? `${address?.slice(0, 6)}...${address?.slice(-4)}` 
            : 'Connect Wallet'
          }
        </button>
      </div>
    </header>
  )
}
```

### Page Components

#### Dashboard
Overview of DAO metrics and recent activity.

```typescript
// src/pages/Dashboard.tsx
import { useQuery } from '@tanstack/react-query'
import { getAnalytics } from '@/services/api'

export function Dashboard() {
  const { data: analytics } = useQuery({
    queryKey: ['analytics'],
    queryFn: getAnalytics,
  })
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Proposals"
          value={analytics?.totalProposals}
          icon={<FileText />}
        />
        <StatCard
          title="Active Voters"
          value={analytics?.activeVoters}
          icon={<Users />}
        />
        <StatCard
          title="Treasury Balance"
          value={`${analytics?.treasuryBalance} STX`}
          icon={<Wallet />}
        />
      </div>
      
      <RecentProposals />
    </div>
  )
}
```

#### Proposals
List of all proposals with filtering.

```typescript
// src/pages/Proposals.tsx
import { useState } from 'react'
import { useProposals } from '@/hooks/useProposals'
import { ProposalCard } from '@/components/ProposalCard'

export function Proposals() {
  const [filter, setFilter] = useState<'all' | 'active' | 'passed'>('all')
  const { data: proposals, isLoading } = useProposals()
  
  const filtered = proposals?.filter(p => {
    if (filter === 'all') return true
    if (filter === 'active') return p.status === 'active'
    if (filter === 'passed') return p.status === 'succeeded'
    return true
  })
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Proposals</h1>
        <Link to="/proposals/create">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
            Create Proposal
          </button>
        </Link>
      </div>
      
      <FilterBar value={filter} onChange={setFilter} />
      
      <div className="space-y-4">
        {isLoading ? (
          <Spinner />
        ) : (
          filtered?.map(proposal => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))
        )}
      </div>
    </div>
  )
}
```

#### CreateProposal
Form for creating new proposals.

```typescript
// src/pages/CreateProposal.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
    
    try {
      await createProposalTx(formData)
      navigate('/proposals')
    } catch (error) {
      console.error('Failed to create proposal:', error)
    }
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create Proposal</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            maxLength={256}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            rows={6}
            maxLength={1024}
            required
          />
        </div>
        
        {/* Contract execution fields */}
        <div>
          <label className="block text-sm font-medium mb-2">Contract Address</label>
          <input
            type="text"
            value={formData.contractAddress}
            onChange={e => setFormData({ ...formData, contractAddress: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="ST1PQHQ..."
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create Proposal
        </button>
      </form>
    </div>
  )
}
```

## Services & API Integration

### Stacks Service
Handles blockchain interactions.

```typescript
// src/services/stacks.ts
import { openContractCall } from '@stacks/connect'
import { userSession } from '@/stores/walletStore'
import {
  uintCV,
  principalCV,
  stringAsciiCV,
  stringUtf8CV,
  listCV,
  bufferCV
} from '@stacks/transactions'

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS
const GOVERNANCE_CONTRACT = 'governance-core'

export async function createProposalTx(args: {
  title: string
  description: string
  contractAddress: string
  functionName: string
  parameters?: string[]
}) {
  const functionArgs = [
    stringAsciiCV(args.title),
    stringUtf8CV(args.description),
    principalCV(args.contractAddress),
    stringAsciiCV(args.functionName),
    listCV((args.parameters || []).map(p => bufferCV(Buffer.from(p, 'hex'))))
  ]

  return openContractCall({
    userSession,
    contractAddress: CONTRACT_ADDRESS,
    contractName: GOVERNANCE_CONTRACT,
    functionName: 'create-proposal',
    functionArgs,
    onFinish: data => {
      console.log('Proposal created:', data.txId)
    },
  })
}

export async function castVoteTx(proposalId: number, support: 0 | 1 | 2) {
  return openContractCall({
    userSession,
    contractAddress: CONTRACT_ADDRESS,
    contractName: GOVERNANCE_CONTRACT,
    functionName: 'cast-vote',
    functionArgs: [uintCV(proposalId), uintCV(support)],
    onFinish: data => {
      console.log('Vote cast:', data.txId)
    },
  })
}

export async function stakeTokensTx(amount: number, lockDuration: number) {
  return openContractCall({
    userSession,
    contractAddress: CONTRACT_ADDRESS,
    contractName: 'staking',
    functionName: 'stake',
    functionArgs: [uintCV(amount), uintCV(lockDuration)],
  })
}
```

### API Service
Backend API client.

```typescript
// src/services/api.ts
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export async function getProposals() {
  const response = await fetch(`${API_URL}/api/proposals`)
  if (!response.ok) throw new Error('Failed to fetch proposals')
  const data = await response.json()
  return data.data
}

export async function getProposalById(id: number) {
  const response = await fetch(`${API_URL}/api/proposals/${id}`)
  if (!response.ok) throw new Error('Failed to fetch proposal')
  const data = await response.json()
  return data.data
}

export async function getAnalytics() {
  const response = await fetch(`${API_URL}/api/analytics/overview`)
  if (!response.ok) throw new Error('Failed to fetch analytics')
  const data = await response.json()
  return data.data
}
```

## Routing

```typescript
// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { Proposals } from './pages/Proposals'
import { ProposalDetail } from './pages/ProposalDetail'
import { CreateProposal } from './pages/CreateProposal'
import { Treasury } from './pages/Treasury'
import { Staking } from './pages/Staking'
import { Governance } from './pages/Governance'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/proposals" element={<Proposals />} />
          <Route path="/proposals/:id" element={<ProposalDetail />} />
          <Route path="/proposals/create" element={<CreateProposal />} />
          <Route path="/treasury" element={<Treasury />} />
          <Route path="/staking" element={<Staking />} />
          <Route path="/governance" element={<Governance />} />
        </Routes>
      </Layout>
    </Router>
  )
}
```

## Styling

### TailwindCSS Configuration

```javascript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
    },
  },
  plugins: [],
}
```

### Global Styles

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition;
  }
  
  .card {
    @apply bg-white rounded-lg shadow-md p-6;
  }
  
  .input {
    @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500;
  }
}
```

## Wallet Integration

### Connect Wallet

```typescript
import { showConnect } from '@stacks/connect'
import { AppConfig, UserSession } from '@stacks/connect'

const appConfig = new AppConfig(['store_write', 'publish_data'])
const userSession = new UserSession({ appConfig })

function connectWallet() {
  showConnect({
    appDetails: {
      name: 'GovernStack DAO Hub',
      icon: window.location.origin + '/logo.svg',
    },
    redirectTo: '/',
    onFinish: () => {
      const userData = userSession.loadUserData()
      console.log('Connected:', userData.profile.stxAddress.testnet)
    },
    userSession,
  })
}
```

### Sign Transactions

```typescript
import { openContractCall } from '@stacks/connect'

function signTransaction() {
  openContractCall({
    userSession,
    contractAddress: 'ST1...',
    contractName: 'governance-core',
    functionName: 'cast-vote',
    functionArgs: [uintCV(1), uintCV(1)],
    onFinish: data => {
      console.log('Transaction ID:', data.txId)
    },
    onCancel: () => {
      console.log('Transaction canceled')
    },
  })
}
```

## Best Practices

### 1. TypeScript Types

```typescript
// src/types/proposal.ts
export interface Proposal {
  id: number
  proposer: string
  title: string
  description: string
  status: ProposalStatus
  forVotes: string
  againstVotes: string
  abstainVotes: string
  startBlock: number
  endBlock: number
  createdAt: number
}

export type ProposalStatus = 
  | 'pending'
  | 'active'
  | 'canceled'
  | 'defeated'
  | 'succeeded'
  | 'queued'
  | 'executed'
```

### 2. Error Handling

```typescript
import { useState } from 'react'

function useAsyncAction<T>() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const execute = async (fn: () => Promise<T>) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await fn()
      return result
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      throw err
    } finally {
      setLoading(false)
    }
  }
  
  return { execute, loading, error }
}
```

### 3. Form Validation

```typescript
import { z } from 'zod'

const proposalSchema = z.object({
  title: z.string().min(10).max(256),
  description: z.string().min(50).max(1024),
  contractAddress: z.string().regex(/^S[TM][0-9A-Z]{38,40}$/),
  functionName: z.string().min(1).max(128),
})

function validateProposal(data: unknown) {
  return proposalSchema.parse(data)
}
```

### 4. Custom Hooks

```typescript
// src/hooks/useProposalVote.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { castVoteTx } from '@/services/stacks'

export function useProposalVote() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ proposalId, vote }: { proposalId: number; vote: 0 | 1 | 2 }) =>
      castVoteTx(proposalId, vote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proposals'] })
    },
  })
}

// Usage
function VoteButtons({ proposalId }: { proposalId: number }) {
  const { mutate: vote, isPending } = useProposalVote()
  
  return (
    <div>
      <button onClick={() => vote({ proposalId, vote: 1 })} disabled={isPending}>
        Vote For
      </button>
      <button onClick={() => vote({ proposalId, vote: 0 })} disabled={isPending}>
        Vote Against
      </button>
    </div>
  )
}
```

## Development Workflow

### Running Development Server

```bash
cd frontend
npm run dev
```

Server starts at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

Output in `dist/` folder.

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npx tsc --noEmit
```

### Environment Variables

Create `.env` file:

```bash
VITE_CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
VITE_API_URL=http://localhost:3001
VITE_STACKS_NETWORK=testnet
```

### Testing

```bash
npm run test
```

---

## Resources

- **React Docs**: https://react.dev
- **Vite**: https://vitejs.dev
- **TailwindCSS**: https://tailwindcss.com
- **Stacks.js**: https://docs.hiro.so/stacks.js
- **Zustand**: https://github.com/pmndrs/zustand
- **TanStack Query**: https://tanstack.com/query

---

For questions or contributions, see [CONTRIBUTING.md](CONTRIBUTING.md).
