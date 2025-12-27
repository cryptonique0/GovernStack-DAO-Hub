# GovernStack DAO Hub

<div align="center">

![GovernStack DAO Hub](https://img.shields.io/badge/GovernStack-DAO%20Hub-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![Stacks](https://img.shields.io/badge/Stacks-Bitcoin%20L2-orange)
![Clarity](https://img.shields.io/badge/Clarity-Smart%20Contracts-red)

A comprehensive Governance DAO platform built on Stacks (Bitcoin Layer 2) blockchain, enabling decentralized governance, proposal management, voting, and treasury operations.

[Features](#features) • [Quick Start](#quick-start) • [Documentation](#documentation) • [Contributing](#contributing)

</div>

---

## Features

### Core Governance
- **Proposal Creation & Management** - Create, edit, and manage governance proposals
- **Voting System** - Token-weighted voting with quorum requirements
- **Timelock Execution** - Delayed execution for passed proposals
- **Delegation** - Delegate voting power to trusted addresses
- **Vote Escrow** - Lock tokens for increased voting power

### Treasury Management
- **Multi-sig Treasury** - Secure fund management with multi-signature
- **Budget Allocation** - Transparent fund distribution
- **Payment Streaming** - Continuous payment flows for contributors
- **Asset Management** - Support for STX, SIP-010 tokens, and NFTs

### Token Economics
- **Governance Token** - Custom SIP-010 compliant governance token
- **Staking Rewards** - Earn rewards for participation
- **Token Vesting** - Configurable vesting schedules
- **Token Gating** - Minimum token requirements for participation

### Additional Features
- **Reputation System** - Track and reward active contributors
- **Forum Integration** - Discussion threads for proposals
- **Notification System** - Real-time updates on governance activities
- **Analytics Dashboard** - DAO metrics and participation stats
- **Multi-DAO Support** - Manage multiple DAOs from one interface

## Tech Stack

### Smart Contracts (Clarity)
- Stacks blockchain native smart contracts
- Bitcoin-settled finality
- Provably secure with Clarity language

### Frontend
- React 18 with TypeScript
- Stacks.js for blockchain interaction
- TailwindCSS for styling
- Zustand for state management

### Backend
- Node.js/Express API
- PostgreSQL database
- Redis for caching
- IPFS for decentralized storage

## Project Structure

```
GovernStack DAO Hub/
├── contracts/               # Clarity smart contracts
│   ├── governance/         # Core governance contracts
│   ├── token/             # Token contracts
│   ├── treasury/          # Treasury management
│   └── utils/             # Helper contracts
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom hooks
│   │   ├── services/     # API services
│   │   └── utils/        # Utilities
├── backend/              # Node.js backend
│   ├── src/
│   │   ├── routes/      # API routes
│   │   ├── controllers/ # Controllers
│   │   ├── services/    # Business logic
│   │   └── models/      # Database models
├── tests/               # Test files
└── scripts/             # Deployment scripts
```

## Getting Started

### Quick Start

```bash
# Clone the repository
git clone <your-repo-url>
cd "GovernStack DAO Hub"

# Install all dependencies
npm run install:all

# Set up environment
cp .env.example .env

# Start development servers (frontend + backend)
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:3001`.

### Prerequisites

- **Node.js** 18.0.0 or higher
- **Clarinet** - Stacks smart contract development tool ([Install](https://docs.hiro.so/clarinet))
- **PostgreSQL** 14+ (for backend)
- **Redis** 6+ (for caching)
- **Git**

### Detailed Installation

#### 1. Clone Repository
```bash
git clone <your-repo-url>
cd "GovernStack DAO Hub"
```

#### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

#### 3. Environment Configuration

**Frontend** (`frontend/.env`):
```bash
VITE_STACKS_NETWORK=testnet
VITE_API_URL=http://localhost:3001
VITE_CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
```

**Backend** (`backend/.env`):
```bash
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/governstack
REDIS_URL=redis://localhost:6379
STACKS_API_URL=https://api.testnet.hiro.so
```

#### 4. Database Setup
```bash
cd backend
npm run migrate
npm run generate
```

#### 5. Run Development Servers

**Option 1: All at once**
```bash
npm run dev
```

**Option 2: Separately**
```bash
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Backend
cd backend
npm run dev
```

#### 6. Run Smart Contract Tests
```bash
clarinet test
```

## Smart Contracts

### Core Contracts

| Contract | Description | Key Functions |
|----------|-------------|---------------|
| `governance-core.clar` | Main governance logic | `create-proposal`, `cast-vote`, `execute-proposal` |
| `governance-token.clar` | SIP-010 governance token | `transfer`, `mint`, `burn`, `get-balance` |
| `treasury.clar` | Treasury management | `execute-payment`, `allocate-budget` |
| `timelock.clar` | Delayed execution | `queue`, `execute`, `cancel` |
| `delegation.clar` | Vote delegation | `delegate`, `undelegate`, `get-voting-power` |
| `staking.clar` | Token staking | `stake`, `unstake`, `claim-rewards` |

See [CONTRACTS.md](docs/CONTRACTS.md) for detailed documentation.

## Documentation

- **[Architecture Guide](docs/ARCHITECTURE.md)** - System design and architecture
- **[Smart Contracts](docs/CONTRACTS.md)** - Contract documentation and API
- **[Frontend Guide](docs/FRONTEND.md)** - Frontend development guide
- **[API Documentation](docs/API.md)** - Backend API reference
- **[Development Guide](docs/DEVELOPMENT.md)** - Developer setup and workflows
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Deployment instructions
- **[Testing Guide](docs/TESTING.md)** - Testing strategy and practices
- **[Contributing](docs/CONTRIBUTING.md)** - Contribution guidelines
- **[Security](docs/SECURITY.md)** - Security best practices
- **[FAQ](docs/FAQ.md)** - Frequently asked questions

## Deployment

### Testnet Deployment
```bash
npm run deploy:testnet
```

### Mainnet Deployment
```bash
npm run deploy:mainnet
```

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for complete deployment instructions.

## Usage Examples

### Creating a Proposal
```typescript
import { createProposal } from './services/stacks'

await createProposal({
  title: 'Allocate 10,000 STX for Marketing',
  description: 'Fund Q1 2024 marketing initiatives',
  contractAddress: 'ST1PQHQ...PGZGM.treasury',
  functionName: 'execute-payment',
  parameters: [recipientCV, amountCV]
})
```

### Voting on a Proposal
```typescript
import { castVote } from './services/stacks'

// Vote options: 0 = against, 1 = for, 2 = abstain
await castVote(proposalId, 1)
```

### Delegating Voting Power
```typescript
import { delegateVotes } from './services/stacks'

await delegateVotes(delegateAddress)
```

## Project Status

- ✅ Core governance contracts
- ✅ Token and staking system
- ✅ Treasury management
- ✅ Frontend UI (React + Stacks.js)
- ✅ Backend API
- 🚧 Multi-DAO support (in progress)
- 🚧 Mobile responsive design
- 📋 Governance analytics (planned)
- 📋 Forum integration (planned)

## Contributing

We welcome contributions! Please see our [Contributing Guide](docs/CONTRIBUTING.md) for details.

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Community & Support

- **Discord**: [Join our community](https://discord.gg/governstack)
- **Twitter**: [@GovernStack](https://twitter.com/governstack)
- **GitHub Issues**: [Report bugs or request features](https://github.com/governstack/dao-hub/issues)
- **Documentation**: [docs.governstack.io](https://docs.governstack.io)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built on [Stacks](https://www.stacks.co/) - Bitcoin Layer 2
- Inspired by leading DAO platforms
- Community contributors and supporters

---

<div align="center">

**Built with ❤️ by the GovernStack Team**

[Website](https://governstack.io) • [Documentation](https://docs.governstack.io) • [GitHub](https://github.com/governstack)

</div>
