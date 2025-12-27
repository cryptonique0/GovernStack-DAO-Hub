# Frequently Asked Questions (FAQ)

## Table of Contents

### General
- [What is GovernStack DAO Hub?](#what-is-governstack-dao-hub)
- [Why Stacks/Bitcoin?](#why-stacksbitcoin)
- [Is this project open source?](#is-this-project-open-source)

### Getting Started
- [How do I connect my wallet?](#how-do-i-connect-my-wallet)
- [Which wallets are supported?](#which-wallets-are-supported)
- [How do I get test tokens?](#how-do-i-get-test-tokens)

### Governance
- [How do I create a proposal?](#how-do-i-create-a-proposal)
- [What is the proposal threshold?](#what-is-the-proposal-threshold)
- [How does voting work?](#how-does-voting-work)
- [What is quorum?](#what-is-quorum)
- [Can I change my vote?](#can-i-change-my-vote)

### Tokens & Staking
- [How do I get governance tokens?](#how-do-i-get-governance-tokens)
- [What is token staking?](#what-is-token-staking)
- [How do staking rewards work?](#how-do-staking-rewards-work)
- [What are lock periods?](#what-are-lock-periods)

### Delegation
- [What is vote delegation?](#what-is-vote-delegation)
- [Can I delegate to multiple addresses?](#can-i-delegate-to-multiple-addresses)
- [How do I revoke delegation?](#how-do-i-revoke-delegation)

### Treasury
- [How is the treasury managed?](#how-is-the-treasury-managed)
- [Who can access treasury funds?](#who-can-access-treasury-funds)
- [What are payment streams?](#what-are-payment-streams)

### Technical
- [What is Clarity?](#what-is-clarity)
- [Are contracts upgradeable?](#are-contracts-upgradeable)
- [How do I report a bug?](#how-do-i-report-a-bug)

### Troubleshooting
- [Transaction failed - why?](#transaction-failed---why)
- [Why can't I vote?](#why-cant-i-vote)
- [Wallet won't connect](#wallet-wont-connect)

---

## General

### What is GovernStack DAO Hub?

GovernStack DAO Hub is a comprehensive decentralized autonomous organization (DAO) platform built on Stacks (Bitcoin Layer 2). It enables communities to:

- **Govern collectively** through on-chain proposals and voting
- **Manage treasury** funds transparently
- **Stake tokens** for rewards and increased voting power
- **Delegate voting power** to trusted representatives

The platform combines Bitcoin's security with smart contract functionality, making it ideal for serious governance applications.

### Why Stacks/Bitcoin?

We chose Stacks for several key reasons:

1. **Bitcoin Security**: All transactions settle on Bitcoin, providing unmatched security
2. **Clarity Language**: Decidable smart contracts with no reentrancy vulnerabilities
3. **Lower Fees**: More predictable and often lower than Ethereum L1
4. **Bitcoin DeFi**: Access to Bitcoin's $1T+ market cap for DeFi applications
5. **Growing Ecosystem**: Active development and community

### Is this project open source?

Yes! GovernStack DAO Hub is fully open source under the MIT License. You can:

- View all code on GitHub
- Submit issues and feature requests
- Contribute via pull requests
- Fork and customize for your own DAO

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

---

## Getting Started

### How do I connect my wallet?

1. Click "Connect Wallet" in the top right
2. Choose your wallet (Leather or Xverse)
3. Approve the connection in your wallet
4. Your address will appear once connected

**First time?** Install a wallet:
- [Leather Wallet](https://leather.io) (Recommended)
- [Xverse Wallet](https://www.xverse.app)

### Which wallets are supported?

Currently supported wallets:

| Wallet | Support | Features |
|--------|---------|----------|
| **Leather** | ✅ Full | Desktop, browser extension |
| **Xverse** | ✅ Full | Mobile + desktop |
| **Hiro Wallet** | ✅ Full | Browser extension |

More wallets coming soon!

### How do I get test tokens?

For testnet testing:

1. **Get testnet STX** from faucet:
   - Visit: https://explorer.hiro.so/sandbox/faucet
   - Connect your wallet
   - Request testnet STX (free)

2. **Get governance tokens**:
   - Contact team on Discord
   - Or use the testnet faucet function

⚠️ **Testnet tokens have no value** - they're only for testing!

---

## Governance

### How do I create a proposal?

Requirements:
- Own at least 1,000,000 GSTK tokens (1M with 6 decimals)
- Connected wallet

Steps:
1. Navigate to "Proposals" → "Create Proposal"
2. Fill in proposal details:
   - **Title**: Clear, concise (max 256 chars)
   - **Description**: Detailed explanation (max 1024 chars)
   - **Contract to execute**: Target contract address
   - **Function**: Function name to call
   - **Parameters**: Function parameters (optional)
3. Click "Create Proposal"
4. Sign transaction in your wallet
5. Wait for confirmation (~10 minutes)

**Example proposal**:
```
Title: Allocate 10,000 STX for Marketing
Description: Fund Q1 2024 marketing campaign including:
- Social media advertising: 5,000 STX
- Content creation: 3,000 STX
- Community events: 2,000 STX

Expected outcomes: 50% increase in community engagement

Contract: treasury.clar
Function: execute-payment
Parameters: [recipient-address, 10000000000]
```

### What is the proposal threshold?

The **proposal threshold** is the minimum number of tokens required to create a proposal.

| Network | Threshold | Reasoning |
|---------|-----------|-----------|
| Testnet | 100,000 GSTK | Lower for testing |
| Mainnet | 1,000,000 GSTK | Prevent spam |

This threshold:
- Prevents spam proposals
- Ensures proposers have stake in the DAO
- Can be changed via governance vote

### How does voting work?

**Voting Power**: Based on token holdings at proposal creation

**Vote Options**:
- **For (1)**: Support the proposal
- **Against (0)**: Oppose the proposal  
- **Abstain (2)**: Record presence without taking a side

**Voting Period**: Default 1,440 blocks (~10 days)

**Process**:
1. Proposal created → voting starts after 1 block
2. Token holders vote during voting period
3. Voting closes after end block
4. If quorum met and FOR > AGAINST → proposal succeeds
5. Successful proposals can be queued for execution

**Important**: Your voting power is your token balance when the proposal was created, not when you vote.

### What is quorum?

**Quorum** is the minimum participation required for a valid vote.

- **Default**: 40% of total token supply must participate
- Includes all votes (for, against, abstain)
- Protects against low-participation attacks

**Example**:
```
Total Supply: 1,000,000,000 tokens
Quorum Required: 400,000,000 tokens (40%)

Vote Results:
- For: 300,000,000
- Against: 100,000,000
- Abstain: 50,000,000
- Total Votes: 450,000,000 ✅ Quorum met!

Result: Proposal SUCCEEDS (more for than against)
```

### Can I change my vote?

**No**, votes are final once submitted. This is by design to:

- Prevent vote manipulation
- Ensure certainty for all participants
- Simplify the voting mechanism

**Best practice**: Carefully review proposals and participate in discussions before voting.

---

## Tokens & Staking

### How do I get governance tokens?

**For testnet**:
- Use testnet faucet
- Contact team on Discord

**For mainnet** (when launched):
- Initial distribution to early supporters
- Earn through participation
- Purchase on DEXs (after launch)
- Receive as grants for contributions

### What is token staking?

**Staking** is locking your governance tokens for a period to:

1. **Earn rewards**: Passive income in GSTK tokens
2. **Increase voting power**: Get multipliers on your vote
3. **Show commitment**: Signal long-term alignment

**How it works**:
```
Stake 1,000 tokens for 12 months
↓
Receive 3x voting power = 3,000 votes
↓
Earn rewards based on time staked
```

### How do staking rewards work?

Rewards formula:
```
Rewards = Amount × Time Staked × Reward Rate × Lock Multiplier
```

**Reward Rate**: 1% per 1,000 blocks (~7 days)

**Example**:
```
Stake: 10,000 tokens
Lock: 12 months (51,840 blocks)
Multiplier: 3x

Rewards = 10,000 × (51,840/1,000) × 0.01 × 3
        = 10,000 × 51.84 × 0.01 × 3
        = 15,552 tokens
```

### What are lock periods?

Lock periods increase your voting power:

| Duration | Blocks | Multiplier | Voting Power |
|----------|--------|------------|--------------|
| 1 month  | 4,320  | 1x         | 100% |
| 3 months | 12,960 | 1.5x       | 150% |
| 6 months | 25,920 | 2x         | 200% |
| 12 months| 51,840 | 3x         | 300% |

**During lock period**:
- ✅ Earn rewards
- ✅ Vote with multiplied power
- ❌ Cannot unstake
- ❌ Cannot transfer staked tokens

**After lock period**:
- ✅ Unstake anytime
- ✅ Claim accumulated rewards
- ⚠️ Lose multiplier bonus

---

## Delegation

### What is vote delegation?

**Delegation** allows you to assign your voting power to another address (called a delegate).

**Use cases**:
- Delegate to experts in specific areas
- Participate while unavailable
- Support trusted community members

**How it works**:
```
You: 10,000 tokens
↓ Delegate to Expert
Expert: Can now vote with 10,000 additional power
```

**You retain**:
- Token ownership
- Ability to undelegate anytime
- Staking rewards

**You delegate**:
- Only voting power
- Not token custody

### Can I delegate to multiple addresses?

**No**, you can only delegate to one address at a time.

- Prevents complexity and gaming
- Simplifies tracking
- Common in governance systems (Compound, Uniswap, etc.)

**To change delegate**:
1. Call `delegate-vote` with new address
2. Old delegation is automatically removed
3. New delegate receives your voting power

### How do I revoke delegation?

Option 1: **Delegate to yourself**
```typescript
await delegateVotingPower(yourAddress)
```

Option 2: **Undelegate function**
```typescript
await undelegateVotes()
```

Both have the same effect - your voting power returns to you.

---

## Treasury

### How is the treasury managed?

The DAO treasury is managed entirely on-chain through governance:

**Deposits**:
- Anyone can deposit STX or tokens
- Donations are welcome
- Automatic from revenue streams (future)

**Withdrawals**:
- Only through approved proposals
- Requires governance vote
- Executed via timelock (safety delay)

**Transparency**:
- All transactions on-chain
- Real-time balance visible
- Complete audit trail

### Who can access treasury funds?

**Short answer**: Only approved governance proposals.

**Long answer**:
1. **No single person** controls the treasury
2. **Proposals must**:
   - Be created by token holder
   - Pass community vote
   - Meet quorum requirements
   - Wait through timelock period
3. **Then** funds can be transferred

This ensures collective control and prevents misuse.

### What are payment streams?

**Payment streams** release funds gradually over time:

```
Traditional: 10,000 STX → Sent immediately
Stream: 10 STX/block for 1,000 blocks
```

**Benefits**:
- Align incentives over time
- Reduce trust requirements
- Enable contributor payments
- Stop if work quality drops

**Example use cases**:
- Developer salaries
- Long-term partnerships
- Vesting schedules
- Grant disbursements

---

## Technical

### What is Clarity?

**Clarity** is a decidable smart contract language for Stacks.

**Key features**:
- **Decidable**: You can know what a program will do without running it
- **No reentrancy**: Prevents major vulnerability class
- **Readable**: Clear, explicit code
- **Bitcoin-aware**: Can read Bitcoin state

**vs Solidity**:
| Feature | Clarity | Solidity |
|---------|---------|----------|
| Decidability | ✅ Yes | ❌ No |
| Reentrancy protection | ✅ Built-in | ⚠️ Manual |
| Readability | ✅ High | ⚠️ Medium |
| Ecosystem | 🌱 Growing | 🌳 Mature |

Learn more: https://docs.stacks.co/clarity

### Are contracts upgradeable?

**No**, Clarity contracts are **immutable** once deployed.

**Reasoning**:
- Provides certainty to users
- Prevents malicious upgrades
- Forces careful design

**Migration path**:
1. Deploy new contract version
2. Create governance proposal to migrate
3. Vote and approve migration
4. Transfer treasury/state to new contract

This ensures the community controls any changes.

### How do I report a bug?

**For security issues**:
1. **DO NOT** open public issue
2. Email: security@governstack.io
3. Use responsible disclosure
4. Reward available for critical bugs

**For regular bugs**:
1. Check existing issues: https://github.com/governstack/dao-hub/issues
2. Create new issue with:
   - Clear title
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
3. Label appropriately

See [SECURITY.md](SECURITY.md) for details.

---

## Troubleshooting

### Transaction failed - why?

Common reasons:

**1. Insufficient balance**
- Need tokens for proposal creation
- Need STX for gas fees
- Solution: Get more tokens

**2. Already voted**
- Can only vote once per proposal
- Solution: Check if you already voted

**3. Voting period ended**
- Proposal no longer accepting votes
- Solution: Wait for next proposal

**4. Network issues**
- Stacks network congestion
- Solution: Try again later, increase fee

**5. Invalid parameters**
- Wrong contract address
- Invalid function name
- Solution: Double-check inputs

**Check transaction**:
```
https://explorer.hiro.so/txid/YOUR_TX_ID
```

### Why can't I vote?

Checklist:

- [ ] Wallet connected?
- [ ] Proposal is active? (not ended/canceled)
- [ ] You have tokens?
- [ ] Haven't already voted?
- [ ] Within voting period?

**Special case**: If you acquired tokens AFTER the proposal was created, you cannot vote on that proposal. This prevents vote buying.

### Wallet won't connect

**Try these steps**:

1. **Refresh page**
   - Simple browser refresh often works

2. **Clear cache**
   - Browser settings → Clear cache
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

3. **Check wallet extension**
   - Is wallet extension installed?
   - Is it unlocked?
   - Try updating wallet to latest version

4. **Check network**
   - Wallet on correct network (testnet vs mainnet)?
   - Switch network in wallet settings

5. **Try different browser**
   - Chrome/Brave recommended
   - Some browsers block wallet connections

6. **Reinstall wallet**
   - Last resort: Uninstall and reinstall wallet extension
   - ⚠️ **SAVE YOUR SEED PHRASE FIRST!**

**Still stuck?**
- Discord support: https://discord.gg/governstack
- GitHub issue: Include browser, wallet version, error message

---

## Need More Help?

### Community

- **Discord**: https://discord.gg/governstack
- **Twitter**: [@GovernStack](https://twitter.com/governstack)
- **GitHub**: https://github.com/governstack/dao-hub

### Documentation

- [Architecture Guide](ARCHITECTURE.md)
- [Smart Contracts](CONTRACTS.md)
- [API Documentation](API.md)
- [Development Guide](DEVELOPMENT.md)

### Support

- **Email**: support@governstack.io
- **GitHub Issues**: Bug reports and features
- **Discord**: Quick questions and discussion

---

**Can't find your question?** Ask in Discord or open a GitHub issue!
