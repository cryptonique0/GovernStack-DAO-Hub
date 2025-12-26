# API Documentation - GovernStack DAO Hub

## Base URL
```
Testnet: https://api.testnet.governstack.io
Mainnet: https://api.governstack.io
Local: http://localhost:3001
```

## Authentication
Most endpoints are read-only and don't require authentication. Write operations are performed through wallet signatures on the frontend.

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Error description"
  }
}
```

## Endpoints

### Proposals

#### List All Proposals
```http
GET /api/proposals
```

**Query Parameters:**
- `status` (optional) - Filter by status: active, pending, succeeded, defeated, executed, canceled
- `limit` (optional, default: 10) - Number of results per page
- `offset` (optional, default: 0) - Pagination offset

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "proposer": "ST1PQHQ...",
      "title": "Allocate funds for marketing",
      "description": "...",
      "status": "active",
      "forVotes": "1000000",
      "againstVotes": "500000",
      "abstainVotes": "100000",
      "startBlock": 12345,
      "endBlock": 13785,
      "createdAt": 1234567890
    }
  ]
}
```

#### Get Proposal Details
```http
GET /api/proposals/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "proposer": "ST1PQHQ...",
    "title": "Allocate funds for marketing",
    "description": "Detailed description...",
    "contractAddress": "ST1PQHQ...PGZGM.treasury",
    "functionName": "execute-payment",
    "parameters": [],
    "status": "active",
    "forVotes": "1000000",
    "againstVotes": "500000",
    "abstainVotes": "100000",
    "startBlock": 12345,
    "endBlock": 13785,
    "eta": null,
    "createdAt": 1234567890
  }
}
```

#### Create Proposal
```http
POST /api/proposals
```

**Request Body:**
```json
{
  "title": "Proposal Title",
  "description": "Detailed description",
  "contractAddress": "ST1PQHQ...PGZGM.treasury",
  "functionName": "execute-payment",
  "parameters": []
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "txData": {
      "contractAddress": "...",
      "contractName": "governance-core",
      "functionName": "create-proposal",
      "functionArgs": [...]
    }
  }
}
```

#### Vote on Proposal
```http
POST /api/proposals/:id/vote
```

**Request Body:**
```json
{
  "support": 1  // 0 = against, 1 = for, 2 = abstain
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "txData": { ... }
  }
}
```

#### Queue Proposal
```http
POST /api/proposals/:id/queue
```

**Response:**
```json
{
  "success": true,
  "data": {
    "txData": { ... }
  }
}
```

#### Execute Proposal
```http
POST /api/proposals/:id/execute
```

**Response:**
```json
{
  "success": true,
  "data": {
    "txData": { ... }
  }
}
```

### Treasury

#### Get Treasury Balance
```http
GET /api/treasury/balance
```

**Response:**
```json
{
  "success": true,
  "data": {
    "balance": "1234567",
    "currency": "STX"
  }
}
```

#### List Payments
```http
GET /api/treasury/payments
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "recipient": "ST1PQHQ...",
      "amount": "10000",
      "description": "Payment for services",
      "status": "executed",
      "createdAt": 1234567890,
      "executedAt": 1234568000
    }
  ]
}
```

#### Create Payment
```http
POST /api/treasury/payments
```

**Request Body:**
```json
{
  "recipient": "ST1PQHQ...PGZGM",
  "amount": "10000",
  "description": "Payment description"
}
```

#### Execute Payment
```http
POST /api/treasury/payments/:id/execute
```

#### List Payment Streams
```http
GET /api/treasury/streams
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "recipient": "ST1PQHQ...",
      "amountPerBlock": "100",
      "startBlock": 12345,
      "endBlock": 13785,
      "claimedAmount": "50000",
      "isActive": true
    }
  ]
}
```

#### Create Payment Stream
```http
POST /api/treasury/streams
```

**Request Body:**
```json
{
  "recipient": "ST1PQHQ...PGZGM",
  "amountPerBlock": "100",
  "duration": 1440
}
```

### Staking

#### Get Staking Info
```http
GET /api/staking/info
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalStaked": "5000000",
    "rewardRate": "100",
    "minStakeAmount": "1000000"
  }
}
```

#### Get User Stakes
```http
GET /api/staking/stakes/:address
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "amount": "5000",
      "stakedAt": 12345,
      "lockUntil": 13785,
      "rewardDebt": "0",
      "lockMultiplier": 2
    }
  ]
}
```

#### Stake Tokens
```http
POST /api/staking/stake
```

**Request Body:**
```json
{
  "amount": "1000000",
  "lockDuration": 4320  // blocks
}
```

#### Unstake Tokens
```http
POST /api/staking/unstake
```

**Request Body:**
```json
{
  "amount": "1000000"
}
```

#### Claim Rewards
```http
POST /api/staking/claim-rewards
```

#### Get Rewards
```http
GET /api/staking/rewards/:address
```

**Response:**
```json
{
  "success": true,
  "data": {
    "rewards": "125000"
  }
}
```

### Governance

#### Get Governance Parameters
```http
GET /api/governance/params
```

**Response:**
```json
{
  "success": true,
  "data": {
    "votingPeriod": 1440,
    "quorumPercentage": 40,
    "proposalThreshold": 1000000,
    "executionDelay": 144
  }
}
```

#### Update Parameters
```http
PUT /api/governance/params
```

**Request Body:**
```json
{
  "votingPeriod": 2880,
  "quorumPercentage": 50
}
```

#### Get Delegation
```http
GET /api/governance/delegation/:address
```

**Response:**
```json
{
  "success": true,
  "data": {
    "delegate": "ST1PQHQ...",
    "delegatedAt": 12345
  }
}
```

#### Delegate Votes
```http
POST /api/governance/delegate
```

**Request Body:**
```json
{
  "delegate": "ST1PQHQ...PGZGM"
}
```

#### Revoke Delegation
```http
POST /api/governance/revoke-delegation
```

### Analytics

#### Get Overview
```http
GET /api/analytics/overview
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalProposals": 45,
    "activeProposals": 5,
    "totalStaked": "5000000",
    "treasuryBalance": "1234567",
    "totalVoters": 456
  }
}
```

#### Get Proposal Statistics
```http
GET /api/analytics/proposals
```

**Response:**
```json
{
  "success": true,
  "data": {
    "byStatus": {
      "active": 5,
      "succeeded": 20,
      "defeated": 10,
      "executed": 15
    },
    "byMonth": [
      { "month": "2024-01", "count": 10 },
      { "month": "2024-02", "count": 15 }
    ]
  }
}
```

#### Get Voting Statistics
```http
GET /api/analytics/voting
```

#### Get Treasury Statistics
```http
GET /api/analytics/treasury
```

## Rate Limiting

API requests are limited to:
- **100 requests per 15 minutes** per IP address

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

## Error Codes

- `400` - Bad Request: Invalid parameters
- `404` - Not Found: Resource doesn't exist
- `429` - Too Many Requests: Rate limit exceeded
- `500` - Internal Server Error: Server error

## Webhooks (Coming Soon)

Subscribe to events:
- Proposal created
- Proposal voted
- Proposal executed
- Payment executed
- Stake created
