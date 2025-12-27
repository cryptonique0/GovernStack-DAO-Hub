# Smart Contract Documentation

## Table of Contents
1. [Overview](#overview)
2. [Contract Architecture](#contract-architecture)
3. [Governance Core](#governance-core)
4. [Governance Token](#governance-token)
5. [Treasury](#treasury)
6. [Staking](#staking)
7. [Delegation](#delegation)
8. [Timelock](#timelock)
9. [Integration Examples](#integration-examples)
10. [Security Considerations](#security-considerations)

## Overview

The GovernStack DAO Hub smart contracts are written in Clarity, a decidable language for the Stacks blockchain. All contracts are designed with security, transparency, and composability in mind.

### Contract Addresses

| Contract | Testnet | Mainnet |
|----------|---------|---------|
| governance-core | `ST1...core` | `SP1...core` |
| governance-token | `ST1...token` | `SP1...token` |
| treasury | `ST1...treasury` | `SP1...treasury` |
| staking | `ST1...staking` | `SP1...staking` |
| delegation | `ST1...delegation` | `SP1...delegation` |
| timelock | `ST1...timelock` | `SP1...timelock` |

## Contract Architecture

```
governance-core.clar (Main governance logic)
    ├── Depends on: governance-token.clar
    ├── Depends on: delegation.clar
    └── Depends on: timelock.clar
        └── Depends on: treasury.clar

staking.clar (Independent staking system)
    └── Depends on: governance-token.clar

delegation.clar (Vote delegation)
    └── Depends on: governance-token.clar
```

---

## Governance Core

**Contract**: `governance-core.clar`

The main governance contract that manages proposal creation, voting, and execution.

### Constants

```clarity
;; Error codes
(define-constant err-owner-only (err u100))
(define-constant err-not-authorized (err u101))
(define-constant err-invalid-proposal (err u102))
(define-constant err-proposal-not-active (err u103))
(define-constant err-already-voted (err u104))
(define-constant err-insufficient-balance (err u105))
(define-constant err-quorum-not-met (err u106))
(define-constant err-voting-period-ended (err u107))

;; Proposal statuses
(define-constant status-pending u1)
(define-constant status-active u2)
(define-constant status-canceled u3)
(define-constant status-defeated u4)
(define-constant status-succeeded u5)
(define-constant status-queued u6)
(define-constant status-executed u7)
```

### Configuration Parameters

| Parameter | Default Value | Description |
|-----------|---------------|-------------|
| `min-proposal-threshold` | 1,000,000 (1M tokens) | Minimum tokens required to create proposal |
| `voting-period` | 1,440 blocks (~10 days) | Duration of voting period |
| `quorum-percentage` | 40% | Minimum participation required |
| `execution-delay` | 144 blocks (~1 day) | Delay before execution |

### Data Structures

#### Proposal
```clarity
{
  proposer: principal,
  title: (string-ascii 256),
  description: (string-utf8 1024),
  contract-address: principal,
  function-name: (string-ascii 128),
  parameters: (list 10 (buff 32)),
  start-block: uint,
  end-block: uint,
  for-votes: uint,
  against-votes: uint,
  abstain-votes: uint,
  status: uint,
  eta: (optional uint)
}
```

#### Vote
```clarity
{
  support: uint,          ;; 0 = against, 1 = for, 2 = abstain
  voting-power: uint,
  block-height: uint
}
```

### Public Functions

#### create-proposal
Creates a new governance proposal.

```clarity
(define-public (create-proposal 
  (title (string-ascii 256))
  (description (string-utf8 1024))
  (contract-address principal)
  (function-name (string-ascii 128))
  (parameters (list 10 (buff 32)))
)
```

**Parameters:**
- `title`: Proposal title (max 256 characters)
- `description`: Detailed description (max 1024 characters)
- `contract-address`: Target contract to execute
- `function-name`: Function to call on target contract
- `parameters`: List of function parameters

**Returns:** `(response uint uint)` - Proposal ID on success

**Requirements:**
- Caller must have >= `min-proposal-threshold` tokens
- All parameters must be valid

**Example:**
```typescript
import { principalCV, uintCV } from '@stacks/transactions'

const proposalTx = await createProposal({
  title: 'Allocate Marketing Budget',
  description: 'Allocate 10,000 STX for Q1 marketing',
  contractAddress: 'ST1...treasury',
  functionName: 'execute-payment',
  parameters: [
    principalCV('ST1...recipient'),
    uintCV(10000000000) // 10,000 STX in microSTX
  ]
})
```

#### cast-vote
Cast a vote on an active proposal.

```clarity
(define-public (cast-vote (proposal-id uint) (support uint))
```

**Parameters:**
- `proposal-id`: ID of the proposal to vote on
- `support`: Vote type (0=against, 1=for, 2=abstain)

**Returns:** `(response bool uint)`

**Requirements:**
- Proposal must be active
- Current block must be within voting period
- Caller must not have already voted
- Caller must have voting power > 0

**Example:**
```typescript
// Vote FOR a proposal
await castVote(1, 1)

// Vote AGAINST a proposal
await castVote(1, 0)

// ABSTAIN from voting
await castVote(1, 2)
```

#### queue-proposal
Queue a successful proposal for execution.

```clarity
(define-public (queue-proposal (proposal-id uint))
```

**Parameters:**
- `proposal-id`: ID of the proposal to queue

**Returns:** `(response bool uint)`

**Requirements:**
- Voting period must have ended
- Proposal must be active
- Quorum must be met
- For votes must exceed against votes

**Example:**
```typescript
await queueProposal(1)
```

#### execute-proposal
Execute a queued proposal after timelock.

```clarity
(define-public (execute-proposal (proposal-id uint))
```

**Parameters:**
- `proposal-id`: ID of the proposal to execute

**Returns:** `(response bool uint)`

**Requirements:**
- Proposal must be queued
- ETA (execution time) must have passed

#### cancel-proposal
Cancel an active proposal.

```clarity
(define-public (cancel-proposal (proposal-id uint))
```

**Parameters:**
- `proposal-id`: ID of the proposal to cancel

**Returns:** `(response bool uint)`

**Requirements:**
- Caller must be proposer or contract owner

### Read-Only Functions

#### get-proposal
```clarity
(define-read-only (get-proposal (proposal-id uint))
```
Returns proposal details by ID.

#### get-vote
```clarity
(define-read-only (get-vote (proposal-id uint) (voter principal))
```
Returns vote information for a specific voter and proposal.

#### has-voted
```clarity
(define-read-only (has-voted (proposal-id uint) (voter principal))
```
Returns true if voter has voted on proposal.

#### get-proposal-state
```clarity
(define-read-only (get-proposal-state (proposal-id uint))
```
Returns current status of a proposal.

---

## Governance Token

**Contract**: `governance-token.clar`

SIP-010 compliant fungible token for governance and voting.

### Token Details

| Property | Value |
|----------|-------|
| Name | GovernStack Token |
| Symbol | GSTK |
| Decimals | 6 |
| Total Supply | 1,000,000,000 (1 billion) |
| Max Supply | 1,000,000,000,000,000 (with decimals) |

### SIP-010 Functions

#### transfer
```clarity
(define-public (transfer 
  (amount uint) 
  (sender principal) 
  (recipient principal) 
  (memo (optional (buff 34)))
))
```

**Example:**
```typescript
await transfer(1000000, senderAddress, recipientAddress, null)
```

#### get-balance
```clarity
(define-read-only (get-balance (account principal))
```

**Example:**
```typescript
const balance = await getBalance('ST1...')
```

#### get-total-supply
```clarity
(define-read-only (get-total-supply)
```

### Governance Functions

#### mint (Owner Only)
```clarity
(define-public (mint (amount uint) (recipient principal))
```
Mints new tokens to recipient address.

**Requirements:**
- Caller must be contract owner
- Amount must be > 0

#### burn
```clarity
(define-public (burn (amount uint))
```
Burns tokens from caller's balance.

**Requirements:**
- Caller must have sufficient balance
- Amount must be > 0

#### approve
```clarity
(define-public (approve (spender principal) (amount uint))
```
Approves spender to transfer tokens on behalf of caller.

#### transfer-from
```clarity
(define-public (transfer-from 
  (amount uint) 
  (owner principal) 
  (recipient principal)
))
```
Transfers tokens from owner to recipient using allowance.

### Snapshot Functions

#### snapshot-balance
```clarity
(define-public (snapshot-balance (account principal))
```
Records account balance at current block for historical queries.

#### get-balance-at
```clarity
(define-read-only (get-balance-at (account principal) (block uint))
```
Returns balance of account at specific block height.

---

## Treasury

**Contract**: `treasury.clar`

Manages DAO treasury assets and fund distribution.

### Data Structures

#### Payment
```clarity
{
  recipient: principal,
  amount: uint,
  description: (string-utf8 256),
  created-by: principal,
  created-at: uint,
  status: uint,
  executed-at: (optional uint),
  proposal-id: (optional uint)
}
```

#### Payment Stream
```clarity
{
  recipient: principal,
  amount-per-block: uint,
  start-block: uint,
  end-block: uint,
  claimed-amount: uint,
  is-active: bool
}
```

### Public Functions

#### deposit
```clarity
(define-public (deposit (amount uint))
```
Deposits STX into treasury.

**Example:**
```typescript
await depositToTreasury(10000000000) // 10,000 STX
```

#### create-payment
```clarity
(define-public (create-payment
  (recipient principal)
  (amount uint)
  (description (string-utf8 256))
))
```
Creates a new payment request.

#### execute-payment
```clarity
(define-public (execute-payment (payment-id uint))
```
Executes an approved payment.

**Requirements:**
- Payment must be approved
- Treasury must have sufficient balance
- Caller must be authorized

#### create-stream
```clarity
(define-public (create-stream
  (recipient principal)
  (amount-per-block uint)
  (duration uint)
))
```
Creates a streaming payment that releases funds per block.

**Example:**
```typescript
// Stream 1 STX per block for 1000 blocks
await createStream(
  recipientAddress,
  1000000, // 1 STX in microSTX
  1000     // 1000 blocks
)
```

#### claim-stream
```clarity
(define-public (claim-stream (stream-id uint))
```
Claims available funds from a payment stream.

### Read-Only Functions

#### get-treasury-balance
```clarity
(define-read-only (get-treasury-balance)
```
Returns current STX balance of treasury.

#### calculate-claimable-amount
```clarity
(define-read-only (calculate-claimable-amount (stream-id uint))
```
Calculates amount available to claim from stream.

---

## Staking

**Contract**: `staking.clar`

Allows users to stake governance tokens for rewards and voting power multipliers.

### Configuration

| Parameter | Value | Description |
|-----------|-------|-------------|
| `reward-rate` | 100 (1%) | Rewards per 1000 blocks |
| `min-stake-amount` | 1,000,000 (1 token) | Minimum stake |
| `lock-period` | 1,440 blocks (~10 days) | Default lock period |

### Lock Durations & Multipliers

| Duration | Blocks | Multiplier | Voting Power |
|----------|--------|------------|--------------|
| 1 month | 4,320 | 1x | Equal to stake |
| 3 months | 12,960 | 1.5x | 150% of stake |
| 6 months | 25,920 | 2x | 200% of stake |
| 12 months | 51,840 | 3x | 300% of stake |

### Data Structure

#### Stake
```clarity
{
  amount: uint,
  staked-at: uint,
  lock-until: uint,
  reward-debt: uint,
  lock-multiplier: uint
}
```

### Public Functions

#### stake
```clarity
(define-public (stake (amount uint) (lock-duration uint))
```

**Parameters:**
- `amount`: Amount of tokens to stake
- `lock-duration`: Duration to lock tokens (in blocks)

**Example:**
```typescript
// Stake 100 tokens for 6 months
await stake(
  100000000, // 100 tokens
  25920      // 6 months in blocks
)
```

#### unstake
```clarity
(define-public (unstake (amount uint))
```
Unstakes tokens after lock period.

**Requirements:**
- Must have active stake
- Lock period must have ended
- Amount <= staked amount

#### claim-rewards
```clarity
(define-public (claim-rewards)
```
Claims accumulated staking rewards.

### Read-Only Functions

#### calculate-rewards
```clarity
(define-read-only (calculate-rewards (staker principal))
```
Calculates pending rewards for staker.

#### get-voting-power
```clarity
(define-read-only (get-voting-power (staker principal))
```
Returns voting power including lock multiplier.

**Example:**
```typescript
// If staked 100 tokens with 3x multiplier
const power = await getVotingPower(address)
// Returns: 300 tokens worth of voting power
```

---

## Delegation

**Contract**: `delegation.clar`

Enables voting power delegation to trusted addresses.

### Data Structures

#### Delegation
```clarity
{
  delegate: principal,
  delegated-at: uint
}
```

### Public Functions

#### delegate-vote
```clarity
(define-public (delegate-vote (delegate principal))
```

**Parameters:**
- `delegate`: Address to delegate voting power to

**Returns:** `(response bool uint)`

**Requirements:**
- Cannot delegate to self
- Must have token balance > 0

**Example:**
```typescript
await delegateVotingPower('ST1...delegate-address')
```

#### undelegate-vote
```clarity
(define-public (undelegate-vote)
```
Removes current delegation and returns voting power to self.

### Read-Only Functions

#### get-delegate
```clarity
(define-read-only (get-delegate (delegator principal))
```
Returns current delegate for an address.

#### get-total-voting-power
```clarity
(define-read-only (get-total-voting-power (voter principal))
```
Returns total voting power including delegated tokens.

**Formula:**
```
Total Voting Power = Own Balance + Delegated Power
```

#### get-delegation-power
```clarity
(define-read-only (get-delegation-power (delegate principal))
```
Returns total tokens delegated to an address.

---

## Timelock

**Contract**: `timelock.clar`

Provides delayed execution for governance proposals.

### Configuration

| Parameter | Default | Description |
|-----------|---------|-------------|
| `min-delay` | 144 blocks (~1 day) | Minimum execution delay |
| `max-delay` | 2,880 blocks (~20 days) | Maximum execution delay |
| `grace-period` | 1,440 blocks (~10 days) | Window after ETA for execution |

### Public Functions

#### queue
```clarity
(define-public (queue
  (target principal)
  (function-name (string-ascii 128))
  (parameters (list 10 (buff 32)))
  (eta uint)
))
```
Queues a transaction for future execution.

#### execute
```clarity
(define-public (execute (transaction-id uint))
```
Executes a queued transaction after ETA.

#### cancel
```clarity
(define-public (cancel (transaction-id uint))
```
Cancels a queued transaction.

---

## Integration Examples

### Complete Proposal Flow

```typescript
import { 
  createProposal, 
  castVote, 
  queueProposal, 
  executeProposal 
} from './services/stacks'

// 1. Create proposal
const proposalId = await createProposal({
  title: 'Fund Development Team',
  description: 'Allocate 50,000 STX for Q1 development',
  contractAddress: treasuryContract,
  functionName: 'execute-payment',
  parameters: [
    principalCV(developerAddress),
    uintCV(50000000000)
  ]
})

// 2. Users vote (during voting period)
await castVote(proposalId, 1) // Vote FOR

// 3. Queue proposal (after voting ends, if passed)
await queueProposal(proposalId)

// 4. Execute (after timelock delay)
await executeProposal(proposalId)
```

### Staking with Voting

```typescript
// 1. Stake tokens for maximum voting power
await stake(
  1000000000, // 1,000 tokens
  51840       // 12 months lock (3x multiplier)
)
// Voting power: 3,000 tokens

// 2. Vote on proposal
await castVote(proposalId, 1)
```

### Delegation Example

```typescript
// Delegate voting power to expert
await delegateVotingPower(expertAddress)

// Expert votes with delegated power
// (executed by expert wallet)
await castVote(proposalId, 1)
```

---

## Security Considerations

### Access Control
- ✅ Owner-only functions protected by `contract-owner` check
- ✅ Proposal threshold prevents spam
- ✅ Timelock prevents immediate execution

### Input Validation
- ✅ All amounts checked for > 0
- ✅ Principal addresses validated
- ✅ Range checks on percentages and durations

### Economic Security
- ✅ Token-weighted voting prevents Sybil attacks
- ✅ Quorum requirements ensure legitimacy
- ✅ Execution delays allow review period

### State Integrity
- ✅ No reentrancy vulnerabilities (Clarity guarantee)
- ✅ Atomic operations
- ✅ Consistent state transitions

### Upgrade Path
- ⚠️ Contracts are immutable once deployed
- ✅ Can deploy new versions and migrate via governance
- ✅ Treasury can approve migration proposals

---

## Testing Contracts

```bash
# Run all contract tests
clarinet test

# Run specific contract test
clarinet test tests/governance_test.ts

# Test in console
clarinet console
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment instructions.

---

## Resources

- **Clarity Language**: https://docs.stacks.co/clarity
- **SIP-010 Standard**: https://github.com/stacksgov/sips/blob/main/sips/sip-010/sip-010-fungible-token-standard.md
- **Stacks Blockchain**: https://www.stacks.co
- **Contract Explorer**: https://explorer.stacks.co

---

For questions or issues, please open a GitHub issue or join our Discord community.
