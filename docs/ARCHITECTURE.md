# Architecture Documentation

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Layers](#architecture-layers)
3. [Smart Contract Architecture](#smart-contract-architecture)
4. [Frontend Architecture](#frontend-architecture)
5. [Backend Architecture](#backend-architecture)
6. [Data Flow](#data-flow)
7. [Security Model](#security-model)
8. [Design Decisions](#design-decisions)

## System Overview

GovernStack DAO Hub is a full-stack decentralized autonomous organization (DAO) platform built on the Stacks blockchain (Bitcoin Layer 2). The system enables trustless governance, proposal management, voting, and treasury operations with Bitcoin-level security.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Users                                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Wallet     │  │  Components  │  │    Stores    │      │
│  │  Connection  │  │   (UI/UX)    │  │   (State)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
┌───────────────────────────┐  ┌───────────────────────────┐
│   Stacks.js SDK           │  │   Backend API (Express)   │
│   (Blockchain Interface)  │  │   ┌─────────────────┐     │
└───────────────────────────┘  │   │   Controllers   │     │
                │              │   └─────────────────┘     │
                │              │   ┌─────────────────┐     │
                │              │   │    Services     │     │
                │              │   └─────────────────┘     │
                │              │   ┌─────────────────┐     │
                │              │   │   PostgreSQL    │     │
                │              │   │     Redis       │     │
                │              │   └─────────────────┘     │
                │              └───────────────────────────┘
                ▼
┌─────────────────────────────────────────────────────────────┐
│              Stacks Blockchain (Bitcoin L2)                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Smart Contracts (Clarity)                    │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │   │
│  │  │Governance│  │  Token   │  │ Treasury │          │   │
│  │  │   Core   │  │ (SIP-010)│  │          │          │   │
│  │  └──────────┘  └──────────┘  └──────────┘          │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │   │
│  │  │ Timelock │  │Delegation│  │  Staking │          │   │
│  │  └──────────┘  └──────────┘  └──────────┘          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Bitcoin Blockchain                        │
│                  (Settlement Layer)                          │
└─────────────────────────────────────────────────────────────┘
```

## Architecture Layers

### Layer 1: Smart Contract Layer (Clarity)

The foundation of the system is built on Clarity smart contracts deployed on Stacks blockchain.

**Key Components:**
- **Governance Core**: Proposal lifecycle management
- **Governance Token**: SIP-010 compliant token
- **Treasury**: Fund management and allocation
- **Timelock**: Delayed execution for security
- **Delegation**: Voting power delegation
- **Staking**: Token staking and rewards

**Benefits:**
- Bitcoin-level security through Stacks
- Decidable and predictable execution (Clarity)
- No reentrancy vulnerabilities
- Full transparency and auditability

### Layer 2: Backend API Layer (Node.js/Express)

Provides indexing, caching, and enhanced query capabilities.

**Key Components:**
- **REST API**: Standardized endpoints for data access
- **PostgreSQL**: Indexed blockchain data
- **Redis**: Caching and performance optimization
- **Stacks API Client**: Blockchain interaction

**Responsibilities:**
- Index and cache blockchain data
- Provide fast queries for UI
- Aggregate analytics and metrics
- Rate limiting and security

### Layer 3: Frontend Layer (React)

User interface for interacting with the DAO.

**Key Components:**
- **React Components**: Modular UI components
- **Stacks.js**: Wallet connection and transactions
- **Zustand**: State management
- **TailwindCSS**: Styling

**Responsibilities:**
- User interaction and experience
- Wallet integration
- Transaction signing and broadcasting
- Real-time updates

## Smart Contract Architecture

### Contract Interaction Flow

```
┌──────────────────┐
│      User        │
└────────┬─────────┘
         │ 1. Create Proposal
         ▼
┌──────────────────────────────────────┐
│      governance-core.clar            │
│                                      │
│  ┌───────────────────────────────┐  │
│  │ create-proposal()             │  │
│  │  - Validate proposer balance  │──┼─→ governance-token.clar
│  │  - Create proposal record     │  │   (check balance >= threshold)
│  │  - Set voting period          │  │
│  └───────────────────────────────┘  │
└──────────────────────────────────────┘
         │
         │ 2. Cast Vote
         ▼
┌──────────────────────────────────────┐
│      governance-core.clar            │
│                                      │
│  ┌───────────────────────────────┐  │
│  │ cast-vote()                   │  │
│  │  - Check voting power         │──┼─→ delegation.clar
│  │  - Record vote                │  │   (get-voting-power)
│  │  - Update vote tallies        │  │
│  └───────────────────────────────┘  │
└──────────────────────────────────────┘
         │
         │ 3. Queue Proposal (if passed)
         ▼
┌──────────────────────────────────────┐
│      governance-core.clar            │
│                                      │
│  ┌───────────────────────────────┐  │
│  │ queue-proposal()              │  │
│  │  - Verify proposal succeeded  │  │
│  │  - Calculate ETA              │──┼─→ timelock.clar
│  │  - Queue for execution        │  │   (queue transaction)
│  └───────────────────────────────┘  │
└──────────────────────────────────────┘
         │
         │ 4. Execute Proposal (after timelock)
         ▼
┌──────────────────────────────────────┐
│      timelock.clar                   │
│                                      │
│  ┌───────────────────────────────┐  │
│  │ execute()                     │  │
│  │  - Verify ETA passed          │  │
│  │  - Execute target contract    │──┼─→ treasury.clar
│  │  - Mark as executed           │  │   (execute-payment)
│  └───────────────────────────────┘  │
└──────────────────────────────────────┘
```

### Contract Dependencies

```
governance-core.clar
    ├── governance-token.clar (SIP-010)
    ├── delegation.clar
    └── timelock.clar
         └── treasury.clar

staking.clar
    └── governance-token.clar
```

## Frontend Architecture

### Component Hierarchy

```
App
├── Layout
│   ├── Header
│   │   ├── WalletConnect
│   │   └── Navigation
│   └── Sidebar
│       ├── MenuItems
│       └── UserProfile
└── Router
    ├── Dashboard
    │   ├── StatCard
    │   ├── ProposalList
    │   └── ActivityFeed
    ├── Proposals
    │   ├── ProposalCard
    │   ├── FilterBar
    │   └── SearchInput
    ├── ProposalDetail
    │   ├── ProposalHeader
    │   ├── VotingCard
    │   ├── ProposalTimeline
    │   └── DiscussionThread
    ├── CreateProposal
    │   ├── ProposalForm
    │   └── PreviewCard
    ├── Governance
    │   ├── DelegationPanel
    │   └── VotingPowerChart
    ├── Staking
    │   ├── StakeForm
    │   ├── StakingStats
    │   └── RewardsPanel
    └── Treasury
        ├── BalanceCard
        ├── TransactionHistory
        └── AllocationChart
```

### State Management (Zustand)

```typescript
// walletStore.ts
interface WalletStore {
  address: string | null
  isConnected: boolean
  network: StacksNetwork
  connect: () => Promise<void>
  disconnect: () => void
}

// proposalStore.ts
interface ProposalStore {
  proposals: Proposal[]
  loading: boolean
  error: string | null
  fetchProposals: () => Promise<void>
  createProposal: (data: ProposalData) => Promise<void>
  voteOnProposal: (id: number, vote: number) => Promise<void>
}
```

### Service Layer

```
services/
├── stacks.ts          # Core blockchain interactions
│   ├── connectWallet()
│   ├── createProposal()
│   ├── castVote()
│   └── delegateVotes()
├── api.ts             # Backend API client
│   ├── getProposals()
│   ├── getProposalDetails()
│   └── getAnalytics()
└── notifications.ts   # User notifications
    ├── showSuccess()
    ├── showError()
    └── showInfo()
```

## Backend Architecture

### API Structure

```
backend/
├── index.ts                    # Application entry
├── config/
│   └── index.ts               # Configuration management
├── middleware/
│   ├── errorHandler.ts        # Global error handling
│   └── rateLimiter.ts         # Rate limiting
├── routes/
│   ├── proposals.ts           # Proposal endpoints
│   ├── governance.ts          # Governance endpoints
│   ├── staking.ts             # Staking endpoints
│   ├── treasury.ts            # Treasury endpoints
│   ├── token.ts               # Token endpoints
│   └── analytics.ts           # Analytics endpoints
├── controllers/
│   ├── proposalController.ts  # Proposal business logic
│   ├── governanceController.ts
│   ├── stakingController.ts
│   ├── treasuryController.ts
│   ├── tokenController.ts
│   └── analyticsController.ts
└── services/
    └── stacksService.ts       # Stacks API integration
```

### Database Schema

```sql
-- Proposals (cached from blockchain)
CREATE TABLE proposals (
    id SERIAL PRIMARY KEY,
    proposal_id BIGINT UNIQUE NOT NULL,
    proposer VARCHAR(64) NOT NULL,
    title VARCHAR(256) NOT NULL,
    description TEXT,
    contract_address VARCHAR(64),
    function_name VARCHAR(128),
    start_block BIGINT NOT NULL,
    end_block BIGINT NOT NULL,
    for_votes NUMERIC(30, 0) DEFAULT 0,
    against_votes NUMERIC(30, 0) DEFAULT 0,
    abstain_votes NUMERIC(30, 0) DEFAULT 0,
    status VARCHAR(20) NOT NULL,
    eta BIGINT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Votes (cached from blockchain)
CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    proposal_id BIGINT NOT NULL,
    voter VARCHAR(64) NOT NULL,
    vote_type SMALLINT NOT NULL, -- 0=against, 1=for, 2=abstain
    voting_power NUMERIC(30, 0) NOT NULL,
    block_height BIGINT NOT NULL,
    tx_id VARCHAR(66) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(proposal_id, voter)
);

-- Analytics
CREATE TABLE dao_metrics (
    id SERIAL PRIMARY KEY,
    date DATE UNIQUE NOT NULL,
    total_proposals INT,
    active_proposals INT,
    total_votes INT,
    unique_voters INT,
    total_staked NUMERIC(30, 0),
    treasury_balance NUMERIC(30, 0)
);
```

## Data Flow

### Proposal Creation Flow

```
1. User fills form in CreateProposal component
   └─> Validates input locally

2. User signs transaction with wallet
   └─> Stacks.js prepares transaction
   └─> Leather/Xverse wallet prompts user

3. Transaction broadcast to Stacks blockchain
   └─> Mempool processing
   └─> Inclusion in block
   └─> Bitcoin finalization

4. Backend indexer detects new proposal
   └─> Queries Stacks API
   └─> Stores in PostgreSQL
   └─> Caches in Redis

5. Frontend polls for updates
   └─> Fetches from backend API
   └─> Updates proposalStore
   └─> UI re-renders with new data
```

### Voting Flow

```
1. User views proposal details
   └─> Fetches from backend API (fast)
   └─> Optionally verifies on-chain

2. User casts vote
   └─> Frontend checks voting eligibility
   └─> Prepares vote transaction
   └─> User signs with wallet

3. Vote recorded on blockchain
   └─> governance-core.cast-vote()
   └─> Updates vote tallies
   └─> Emits event

4. Backend indexes vote
   └─> Updates vote tallies in DB
   └─> Invalidates cache
   └─> Updates analytics

5. Real-time update in UI
   └─> WebSocket notification (optional)
   └─> Polling update
   └─> UI shows updated vote count
```

## Security Model

### Smart Contract Security

1. **Access Control**
   - Owner-only functions for admin operations
   - Proposal threshold to prevent spam
   - Timelock for critical operations

2. **Input Validation**
   - All parameters validated before use
   - Range checks for numeric values
   - Address validation

3. **State Integrity**
   - Atomic operations
   - No reentrancy (Clarity guarantee)
   - Consistent state transitions

4. **Economic Security**
   - Token-weighted voting
   - Quorum requirements
   - Execution delay for review

### Frontend Security

1. **Wallet Security**
   - Never request private keys
   - User confirmation for all transactions
   - Network verification

2. **Input Sanitization**
   - XSS prevention
   - SQL injection prevention (parameterized queries)
   - CSRF protection

3. **Transaction Verification**
   - Display transaction details before signing
   - Verify contract address
   - Check transaction status

### Backend Security

1. **API Security**
   - Rate limiting
   - CORS configuration
   - Helmet.js security headers

2. **Data Validation**
   - Joi schema validation
   - Type checking
   - Range validation

3. **Database Security**
   - Parameterized queries
   - Connection encryption
   - Read replicas for scaling

## Design Decisions

### Why Stacks?

1. **Bitcoin Security**: Leverages Bitcoin's proof-of-work
2. **Clarity Language**: Decidable, safer smart contracts
3. **No Gas Wars**: Predictable transaction costs
4. **BTC Integration**: Native Bitcoin operations

### Why Separate Backend?

1. **Performance**: Fast queries without blockchain latency
2. **Indexing**: Complex data aggregation
3. **Caching**: Reduced blockchain load
4. **Analytics**: Off-chain computation

### Why Zustand over Redux?

1. **Simplicity**: Less boilerplate
2. **Performance**: Fine-grained reactivity
3. **TypeScript**: Better type inference
4. **Bundle Size**: Smaller footprint

### Why PostgreSQL + Redis?

1. **PostgreSQL**: Rich query capabilities, ACID compliance
2. **Redis**: Fast caching, pub/sub for real-time
3. **Proven Stack**: Battle-tested reliability

### Timelock Design

1. **Security**: Prevention of immediate malicious execution
2. **Transparency**: Community can review before execution
3. **Cancellation**: Ability to stop harmful proposals
4. **Standard**: Follows industry best practices (Compound, Uniswap)

## Scalability Considerations

### Current Limits

- **Proposals**: ~1000 active proposals
- **Votes**: Unlimited (indexed by backend)
- **Users**: Unlimited (wallet-based)

### Scaling Strategy

1. **Backend Scaling**
   - Horizontal scaling with load balancer
   - Read replicas for PostgreSQL
   - Redis cluster for distributed caching

2. **Frontend Scaling**
   - CDN for static assets
   - Code splitting
   - Lazy loading

3. **Blockchain Scaling**
   - Batch operations where possible
   - Off-chain computation with on-chain verification
   - Layer 3 solutions if needed

## Future Architecture Enhancements

1. **Multi-DAO Support**
   - Contract factory pattern
   - Shared infrastructure
   - Isolated governance

2. **Off-chain Voting**
   - Snapshot-style voting
   - On-chain execution only
   - Gasless voting

3. **Advanced Analytics**
   - Machine learning insights
   - Predictive modeling
   - Voter behavior analysis

4. **Mobile Apps**
   - React Native
   - Native wallet integration
   - Push notifications

5. **Decentralized Storage**
   - IPFS for proposals
   - Arweave for permanent storage
   - Distributed file system

---

This architecture provides a robust, secure, and scalable foundation for decentralized governance on Bitcoin through Stacks.
