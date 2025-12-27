# Testing Guide

## Table of Contents
1. [Overview](#overview)
2. [Testing Strategy](#testing-strategy)
3. [Smart Contract Testing](#smart-contract-testing)
4. [Frontend Testing](#frontend-testing)
5. [Backend Testing](#backend-testing)
6. [Integration Testing](#integration-testing)
7. [E2E Testing](#e2e-testing)
8. [CI/CD Integration](#cicd-integration)
9. [Test Coverage](#test-coverage)
10. [Best Practices](#best-practices)

## Overview

GovernStack DAO Hub follows a comprehensive testing strategy to ensure reliability and security across all components.

### Testing Pyramid

```
        /\
       /E2E\      ← Few, slow, comprehensive
      /------\
     /Integration\  ← Some, medium speed
    /------------\
   /  Unit Tests  \  ← Many, fast, focused
  /----------------\
```

### Test Types

- **Unit Tests**: Individual functions and components
- **Integration Tests**: Component interactions
- **E2E Tests**: Complete user workflows
- **Contract Tests**: Smart contract logic
- **Security Tests**: Vulnerability scanning

## Testing Strategy

### Coverage Goals

| Component | Unit | Integration | E2E |
|-----------|------|-------------|-----|
| Smart Contracts | 100% | 90% | 80% |
| Backend API | 90% | 80% | 70% |
| Frontend | 80% | 70% | 60% |

### Test Environment Setup

```bash
# Install all dependencies
npm run install:all

# Setup test databases
createdb governstack_test

# Configure test environment
cp .env.example .env.test
```

## Smart Contract Testing

### Using Clarinet

Clarinet provides a testing framework for Clarity smart contracts.

#### Running Tests

```bash
# Run all contract tests
clarinet test

# Run specific test file
clarinet test tests/governance_test.ts

# Watch mode
clarinet test --watch

# Coverage report
clarinet test --coverage
```

#### Test Structure

```typescript
// tests/governance_test.ts
import { Clarinet, Tx, Chain, Account, types } from 'clarinet-sdk'
import { assertEquals } from 'https://deno.land/std/testing/asserts.ts'

Clarinet.test({
  name: "Ensure that proposal can be created",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!
    const wallet1 = accounts.get('wallet_1')!
    
    let block = chain.mineBlock([
      Tx.contractCall(
        'governance-core',
        'create-proposal',
        [
          types.ascii('Test Proposal'),
          types.utf8('This is a test proposal'),
          types.principal(deployer.address),
          types.ascii('test-function'),
          types.list([])
        ],
        wallet1.address
      )
    ])
    
    assertEquals(block.receipts.length, 1)
    assertEquals(block.receipts[0].result.expectOk(), 'u1')
  }
})
```

#### Example Test Cases

##### 1. Proposal Creation

```typescript
Clarinet.test({
  name: "Only users with sufficient balance can create proposals",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!
    const wallet2 = accounts.get('wallet_2')!
    
    // Give wallet1 enough tokens
    let block = chain.mineBlock([
      Tx.contractCall(
        'governance-token',
        'mint',
        [types.uint(2000000), types.principal(wallet1.address)],
        deployer.address
      )
    ])
    
    // wallet1 can create proposal
    block = chain.mineBlock([
      Tx.contractCall(
        'governance-core',
        'create-proposal',
        [
          types.ascii('Proposal'),
          types.utf8('Description'),
          types.principal(deployer.address),
          types.ascii('function'),
          types.list([])
        ],
        wallet1.address
      )
    ])
    assertEquals(block.receipts[0].result.expectOk(), 'u1')
    
    // wallet2 cannot (insufficient balance)
    block = chain.mineBlock([
      Tx.contractCall(
        'governance-core',
        'create-proposal',
        [
          types.ascii('Proposal 2'),
          types.utf8('Description'),
          types.principal(deployer.address),
          types.ascii('function'),
          types.list([])
        ],
        wallet2.address
      )
    ])
    assertEquals(block.receipts[0].result.expectErr(), 'u105') // err-insufficient-balance
  }
})
```

##### 2. Voting Logic

```typescript
Clarinet.test({
  name: "Votes are counted correctly",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!
    const wallet2 = accounts.get('wallet_2')!
    
    // Setup: Create proposal and give tokens to voters
    let block = chain.mineBlock([
      // Mint tokens
      Tx.contractCall('governance-token', 'mint', 
        [types.uint(5000000), types.principal(wallet1.address)],
        deployer.address
      ),
      Tx.contractCall('governance-token', 'mint',
        [types.uint(3000000), types.principal(wallet2.address)],
        deployer.address
      ),
      // Create proposal
      Tx.contractCall('governance-core', 'create-proposal',
        [types.ascii('Test'), types.utf8('Test'), 
         types.principal(deployer.address), types.ascii('test'),
         types.list([])],
        wallet1.address
      )
    ])
    
    // Vote
    block = chain.mineBlock([
      Tx.contractCall('governance-core', 'cast-vote',
        [types.uint(1), types.uint(1)], // Vote FOR
        wallet1.address
      ),
      Tx.contractCall('governance-core', 'cast-vote',
        [types.uint(1), types.uint(0)], // Vote AGAINST
        wallet2.address
      )
    ])
    
    // Check vote counts
    const proposal = chain.callReadOnlyFn(
      'governance-core',
      'get-proposal',
      [types.uint(1)],
      deployer.address
    )
    
    const proposalData = proposal.result.expectSome().data
    assertEquals(proposalData['for-votes'], 'u5000000')
    assertEquals(proposalData['against-votes'], 'u3000000')
  }
})
```

##### 3. Staking Tests

```typescript
Clarinet.test({
  name: "Staking increases voting power based on lock duration",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const wallet1 = accounts.get('wallet_1')!
    
    // Mint tokens
    let block = chain.mineBlock([
      Tx.contractCall('governance-token', 'mint',
        [types.uint(1000000), types.principal(wallet1.address)],
        deployer.address
      )
    ])
    
    // Stake for 12 months (3x multiplier)
    block = chain.mineBlock([
      Tx.contractCall('staking', 'stake',
        [types.uint(1000000), types.uint(51840)],
        wallet1.address
      )
    ])
    
    // Check voting power
    const votingPower = chain.callReadOnlyFn(
      'staking',
      'get-voting-power',
      [types.principal(wallet1.address)],
      deployer.address
    )
    
    assertEquals(votingPower.result.expectOk(), 'u3000000') // 1M * 3x
  }
})
```

## Frontend Testing

### Tech Stack

- **Vitest**: Unit testing framework
- **React Testing Library**: Component testing
- **Playwright**: E2E testing

### Setup

```bash
cd frontend
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

### Component Tests

```typescript
// src/components/__tests__/Header.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Header } from '../Header'
import { useWalletStore } from '@/stores/walletStore'

vi.mock('@/stores/walletStore')

describe('Header', () => {
  it('renders connect button when not connected', () => {
    useWalletStore.mockReturnValue({
      isConnected: false,
      connect: vi.fn(),
      disconnect: vi.fn()
    })
    
    render(<Header />)
    
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument()
  })
  
  it('renders address when connected', () => {
    useWalletStore.mockReturnValue({
      isConnected: true,
      address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
      connect: vi.fn(),
      disconnect: vi.fn()
    })
    
    render(<Header />)
    
    expect(screen.getByText(/ST1PQH.../)).toBeInTheDocument()
  })
  
  it('calls disconnect when clicking disconnect', () => {
    const disconnect = vi.fn()
    useWalletStore.mockReturnValue({
      isConnected: true,
      address: 'ST1...',
      disconnect
    })
    
    render(<Header />)
    
    fireEvent.click(screen.getByText(/ST1.../))
    expect(disconnect).toHaveBeenCalled()
  })
})
```

### Store Tests

```typescript
// src/stores/__tests__/proposalStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useProposalStore } from '../proposalStore'

describe('proposalStore', () => {
  beforeEach(() => {
    useProposalStore.setState({ proposals: [], loading: false, error: null })
  })
  
  it('fetches proposals successfully', async () => {
    const mockProposals = [
      { id: 1, title: 'Test Proposal', status: 'active' }
    ]
    
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: mockProposals })
      })
    )
    
    const { fetchProposals } = useProposalStore.getState()
    await fetchProposals()
    
    expect(useProposalStore.getState().proposals).toEqual(mockProposals)
    expect(useProposalStore.getState().loading).toBe(false)
  })
  
  it('handles fetch error', async () => {
    global.fetch = vi.fn(() => Promise.reject(new Error('Failed')))
    
    const { fetchProposals } = useProposalStore.getState()
    await fetchProposals()
    
    expect(useProposalStore.getState().error).toBe('Failed')
  })
})
```

### Running Frontend Tests

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

## Backend Testing

### Tech Stack

- **Jest**: Testing framework
- **Supertest**: HTTP assertions

### Setup

```bash
cd backend
npm install -D jest @types/jest supertest @types/supertest ts-jest
```

### API Tests

```typescript
// src/__tests__/proposals.test.ts
import request from 'supertest'
import { app } from '../index'
import { db } from '../config/database'

describe('Proposals API', () => {
  beforeAll(async () => {
    await db.migrate.latest()
  })
  
  afterAll(async () => {
    await db.destroy()
  })
  
  describe('GET /api/proposals', () => {
    it('returns list of proposals', async () => {
      const response = await request(app)
        .get('/api/proposals')
        .expect(200)
      
      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.data)).toBe(true)
    })
    
    it('filters by status', async () => {
      const response = await request(app)
        .get('/api/proposals?status=active')
        .expect(200)
      
      const proposals = response.body.data
      proposals.forEach(p => {
        expect(p.status).toBe('active')
      })
    })
  })
  
  describe('GET /api/proposals/:id', () => {
    it('returns proposal by id', async () => {
      const response = await request(app)
        .get('/api/proposals/1')
        .expect(200)
      
      expect(response.body.data.id).toBe(1)
    })
    
    it('returns 404 for non-existent proposal', async () => {
      await request(app)
        .get('/api/proposals/99999')
        .expect(404)
    })
  })
})
```

### Service Tests

```typescript
// src/services/__tests__/stacksService.test.ts
import { describe, it, expect, vi } from 'vitest'
import { getProposalFromChain } from '../stacksService'

describe('StacksService', () => {
  it('fetches proposal from blockchain', async () => {
    const mockResponse = {
      result: {
        type: 'ok',
        value: {
          proposer: 'ST1...',
          title: 'Test Proposal'
        }
      }
    }
    
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })
    )
    
    const proposal = await getProposalFromChain(1)
    
    expect(proposal.title).toBe('Test Proposal')
  })
})
```

### Running Backend Tests

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

## Integration Testing

### Testing Complete Flows

```typescript
// tests/integration/proposal-flow.test.ts
describe('Proposal Creation and Voting Flow', () => {
  it('completes full proposal lifecycle', async () => {
    // 1. Create proposal
    const proposalResponse = await request(app)
      .post('/api/proposals')
      .send({
        title: 'Test Proposal',
        description: 'Test',
        contractAddress: 'ST1...',
        functionName: 'test'
      })
      .expect(200)
    
    const proposalId = proposalResponse.body.data.id
    
    // 2. Cast votes
    await request(app)
      .post(`/api/proposals/${proposalId}/vote`)
      .send({ support: 1 })
      .expect(200)
    
    // 3. Check vote counted
    const proposal = await request(app)
      .get(`/api/proposals/${proposalId}`)
      .expect(200)
    
    expect(proposal.body.data.forVotes).toBeGreaterThan(0)
  })
})
```

## E2E Testing

### Using Playwright

```typescript
// e2e/proposal-creation.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Proposal Creation', () => {
  test('user can create a proposal', async ({ page }) => {
    // Go to app
    await page.goto('http://localhost:5173')
    
    // Connect wallet (mock)
    await page.click('text=Connect Wallet')
    
    // Navigate to create proposal
    await page.click('text=Create Proposal')
    
    // Fill form
    await page.fill('[name="title"]', 'E2E Test Proposal')
    await page.fill('[name="description"]', 'This is a test proposal created by E2E test')
    
    // Submit
    await page.click('button[type="submit"]')
    
    // Verify redirect to proposals
    await expect(page).toHaveURL(/\/proposals/)
    
    // Verify proposal appears
    await expect(page.locator('text=E2E Test Proposal')).toBeVisible()
  })
})
```

### Running E2E Tests

```bash
# Install Playwright
npm install -D @playwright/test

# Run tests
npx playwright test

# Run with UI
npx playwright test --ui

# Debug
npx playwright test --debug
```

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  contracts:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install Clarinet
        run: curl -sL https://get.hiro.so/clarinet | bash
      - name: Run contract tests
        run: clarinet test
  
  backend:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: cd backend && npm ci
      - name: Run tests
        run: cd backend && npm test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test
  
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - name: Install dependencies
        run: cd frontend && npm ci
      - name: Run tests
        run: cd frontend && npm test
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Test Coverage

### Viewing Coverage Reports

```bash
# Generate coverage
npm run test:coverage

# View HTML report
open coverage/index.html
```

### Coverage Requirements

```json
// package.json
{
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

## Best Practices

### 1. Write Tests First (TDD)

```typescript
// Write test first
it('calculates voting power correctly', () => {
  expect(calculateVotingPower(1000, 2)).toBe(2000)
})

// Then implement
function calculateVotingPower(amount: number, multiplier: number) {
  return amount * multiplier
}
```

### 2. Test Edge Cases

```typescript
describe('Proposal validation', () => {
  it('rejects empty title', () => {
    expect(() => validateProposal({ title: '' })).toThrow()
  })
  
  it('rejects title > 256 chars', () => {
    const longTitle = 'a'.repeat(257)
    expect(() => validateProposal({ title: longTitle })).toThrow()
  })
  
  it('accepts valid title', () => {
    expect(() => validateProposal({ title: 'Valid Title' })).not.toThrow()
  })
})
```

### 3. Use Factories for Test Data

```typescript
// testutils/factories.ts
export function createMockProposal(overrides = {}) {
  return {
    id: 1,
    title: 'Test Proposal',
    description: 'Test Description',
    status: 'active',
    forVotes: '0',
    againstVotes: '0',
    ...overrides
  }
}

// Usage
const proposal = createMockProposal({ title: 'Custom Title' })
```

### 4. Isolate Tests

```typescript
beforeEach(() => {
  // Reset state before each test
  vi.clearAllMocks()
  db.truncate()
})
```

### 5. Test User Behavior, Not Implementation

```typescript
// ❌ Bad: Testing implementation
it('calls useState hook', () => {
  const component = render(<MyComponent />)
  expect(component.useState).toHaveBeenCalled()
})

// ✅ Good: Testing behavior
it('displays message when button clicked', () => {
  render(<MyComponent />)
  fireEvent.click(screen.getByText('Click Me'))
  expect(screen.getByText('Success!')).toBeInTheDocument()
})
```

---

## Resources

- **Clarinet Docs**: https://docs.hiro.so/clarinet
- **Vitest**: https://vitest.dev
- **React Testing Library**: https://testing-library.com/react
- **Playwright**: https://playwright.dev
- **Jest**: https://jestjs.io

---

For more information, see [DEVELOPMENT.md](DEVELOPMENT.md).
