# GovernStack DAO Hub

A comprehensive Governance DAO platform built on Stacks (Bitcoin Layer 2) blockchain, enabling decentralized governance, proposal management, voting, and treasury operations.

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

### Prerequisites
- Node.js 18+
- Clarinet (Stacks smart contract development)
- PostgreSQL
- Redis

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd "GovernStack DAO Hub"
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run smart contract tests
```bash
cd contracts
clarinet test
```

5. Start the development server
```bash
npm run dev
```

## Smart Contracts

### Core Contracts

1. **governance-core.clar** - Main governance logic
2. **governance-token.clar** - SIP-010 governance token
3. **proposal-voting.clar** - Proposal and voting system
4. **treasury.clar** - Treasury management
5. **timelock.clar** - Delayed execution
6. **delegation.clar** - Vote delegation

## Deployment

### Testnet Deployment
```bash
npm run deploy:testnet
```

### Mainnet Deployment
```bash
npm run deploy:mainnet
```

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License

MIT License

## Support

For support, join our Discord or open an issue on GitHub.
