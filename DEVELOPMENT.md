# GovernStack DAO Hub - Development Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [Smart Contract Development](#smart-contract-development)
3. [Frontend Development](#frontend-development)
4. [Backend Development](#backend-development)
5. [Testing](#testing)
6. [Deployment](#deployment)

## Getting Started

### Prerequisites
- Node.js 18+
- Clarinet (Stacks smart contract development tool)
- PostgreSQL 14+
- Redis 6+

### Initial Setup

1. **Clone and Install Dependencies**
```bash
git clone <your-repo-url>
cd "GovernStack DAO Hub"
chmod +x scripts/setup.sh
./scripts/setup.sh
```

2. **Configure Environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start Development Servers**
```bash
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Backend
cd backend
npm run dev
```

## Smart Contract Development

### Contract Structure
```
contracts/
├── governance-core.clar      # Main governance logic
├── governance-token.clar     # SIP-010 token
├── treasury.clar            # Treasury management
├── timelock.clar            # Delayed execution
├── delegation.clar          # Vote delegation
├── staking.clar             # Token staking
└── sip-010-trait.clar       # Token trait
```

### Testing Contracts

```bash
cd contracts
clarinet test
```

### Running Contract REPL

```bash
clarinet console
```

Example REPL commands:
```clarity
;; Deploy contracts
(contract-call? .governance-token get-balance tx-sender)

;; Create a proposal
(contract-call? .governance-core create-proposal 
  "Test Proposal" 
  u"Description" 
  .treasury 
  "execute-payment" 
  (list))
```

### Contract Functions

#### Governance Core
- `create-proposal` - Create new governance proposal
- `cast-vote` - Vote on active proposal (0=against, 1=for, 2=abstain)
- `queue-proposal` - Queue successful proposal for execution
- `execute-proposal` - Execute queued proposal
- `cancel-proposal` - Cancel active proposal

#### Governance Token
- `transfer` - Transfer tokens
- `mint` - Mint new tokens (owner only)
- `burn` - Burn tokens
- `approve` - Approve spender
- `transfer-from` - Transfer from approved amount

#### Treasury
- `deposit` - Deposit STX to treasury
- `create-payment` - Create payment request
- `execute-payment` - Execute approved payment
- `create-payment-stream` - Create streaming payment
- `claim-stream` - Claim from payment stream

#### Staking
- `stake` - Stake tokens with lock period
- `unstake` - Unstake tokens after lock period
- `claim-rewards` - Claim staking rewards

#### Delegation
- `delegate-vote` - Delegate voting power
- `revoke-delegation` - Revoke delegation

## Frontend Development

### Tech Stack
- React 18 + TypeScript
- TailwindCSS for styling
- Stacks.js for blockchain interaction
- Zustand for state management
- React Router for navigation

### Project Structure
```
frontend/src/
├── components/       # Reusable components
├── pages/           # Page components
├── stores/          # Zustand stores
├── services/        # API services
├── utils/           # Utility functions
└── hooks/           # Custom React hooks
```

### Key Components

**WalletStore** (`stores/walletStore.ts`)
- Manages wallet connection
- Handles Stacks authentication
- Tracks user balance and voting power

**ProposalStore** (`stores/proposalStore.ts`)
- Manages proposal state
- Handles proposal CRUD operations

### Stacks.js Integration

```typescript
import { openContractCall } from '@stacks/connect'
import { uintCV, principalCV } from '@stacks/transactions'

// Example: Cast a vote
const castVote = async (proposalId: number, support: number) => {
  await openContractCall({
    contractAddress: 'ST1PQHQ...PGZGM',
    contractName: 'governance-core',
    functionName: 'cast-vote',
    functionArgs: [uintCV(proposalId), uintCV(support)],
    onFinish: (data) => {
      console.log('Transaction ID:', data.txId)
    },
  })
}
```

## Backend Development

### API Endpoints

#### Proposals
- `GET /api/proposals` - List all proposals
- `GET /api/proposals/:id` - Get proposal details
- `POST /api/proposals` - Create new proposal
- `POST /api/proposals/:id/vote` - Vote on proposal
- `POST /api/proposals/:id/queue` - Queue proposal
- `POST /api/proposals/:id/execute` - Execute proposal

#### Treasury
- `GET /api/treasury/balance` - Get treasury balance
- `GET /api/treasury/payments` - List payments
- `POST /api/treasury/payments` - Create payment
- `POST /api/treasury/payments/:id/execute` - Execute payment

#### Staking
- `GET /api/staking/info` - Get staking info
- `GET /api/staking/stakes/:address` - Get user stakes
- `POST /api/staking/stake` - Stake tokens
- `POST /api/staking/unstake` - Unstake tokens
- `POST /api/staking/claim-rewards` - Claim rewards

### Adding New Endpoints

1. **Create Route** (`routes/myRoute.ts`)
```typescript
import { Router } from 'express'
import { MyController } from '../controllers/myController'

const router = Router()
const controller = new MyController()

router.get('/', controller.getAll)
router.post('/', controller.create)

export default router
```

2. **Create Controller** (`controllers/myController.ts`)
```typescript
import { Request, Response } from 'express'

export class MyController {
  getAll = async (req: Request, res: Response) => {
    try {
      // Your logic here
      res.json({ success: true, data: [] })
    } catch (error: any) {
      res.status(500).json({ 
        success: false, 
        error: error.message 
      })
    }
  }
}
```

3. **Register in `index.ts`**
```typescript
import myRoutes from './routes/myRoute'
app.use('/api/my-route', myRoutes)
```

## Testing

### Contract Tests
```bash
cd contracts
clarinet test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

### Backend Tests
```bash
cd backend
npm run test
```

## Deployment

### Testnet Deployment

1. **Deploy Contracts**
```bash
chmod +x scripts/deploy-testnet.sh
./scripts/deploy-testnet.sh
```

2. **Update Environment Variables**
Update `.env` with deployed contract addresses

3. **Deploy Backend**
```bash
cd backend
npm run build
npm start
```

4. **Deploy Frontend**
```bash
cd frontend
npm run build
# Deploy dist/ folder to your hosting service
```

### Mainnet Deployment

1. **Review and Test Thoroughly**
   - Ensure all tests pass
   - Audit smart contracts
   - Test on testnet extensively

2. **Deploy to Mainnet**
```bash
npm run deploy:mainnet
```

3. **Update Configuration**
   - Set `STACKS_NETWORK=mainnet`
   - Update all contract addresses
   - Configure production API URLs

## Common Development Tasks

### Add New Governance Parameter

1. **Update Contract**
```clarity
(define-data-var new-parameter uint u0)

(define-public (set-new-parameter (value uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set new-parameter value)
    (ok true)
  )
)
```

2. **Update Frontend**
```typescript
// Add to governance settings page
const updateParameter = async (value: number) => {
  await contractCall({
    contractName: 'governance-core',
    functionName: 'set-new-parameter',
    functionArgs: [uintCV(value)],
  })
}
```

### Add New Proposal Type

1. Update proposal creation form
2. Add validation for new type
3. Update backend controller
4. Test thoroughly

## Best Practices

### Smart Contracts
- Always validate inputs
- Use appropriate error codes
- Write comprehensive tests
- Follow Clarity best practices
- Audit before mainnet deployment

### Frontend
- Handle loading and error states
- Validate user input
- Show transaction confirmation
- Update UI after blockchain confirmations

### Backend
- Validate all API inputs
- Use proper error handling
- Implement rate limiting
- Cache frequently accessed data

## Troubleshooting

### Common Issues

**Contract deployment fails**
- Check Clarinet.toml configuration
- Verify network connectivity
- Ensure sufficient STX balance

**Frontend can't connect to wallet**
- Check wallet extension is installed
- Verify network configuration
- Clear browser cache

**Backend API errors**
- Check environment variables
- Verify database connection
- Check contract addresses

## Resources

- [Stacks Documentation](https://docs.stacks.co)
- [Clarity Language Reference](https://docs.stacks.co/clarity)
- [Stacks.js Documentation](https://stacks.js.org)
- [Clarinet Documentation](https://github.com/hirosystems/clarinet)
