# Security Best Practices - GovernStack DAO Hub

## Smart Contract Security

### Access Control
- ✅ Use `contract-owner` for admin functions
- ✅ Implement role-based access control where needed
- ✅ Validate all function callers
- ❌ Never trust user input without validation

### Input Validation
```clarity
;; Good: Validate all inputs
(define-public (set-parameter (value uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (and (> value u0) (<= value u100)) err-invalid-parameter)
    (var-set parameter value)
    (ok true)
  )
)

;; Bad: No validation
(define-public (set-parameter (value uint))
  (begin
    (var-set parameter value)
    (ok true)
  )
)
```

### Reentrancy Protection
- Use checks-effects-interactions pattern
- Update state before external calls
- Use `asserts!` to validate state

### Integer Overflow/Underflow
```clarity
;; Good: Check for overflow
(define-public (add-tokens (amount uint))
  (let
    (
      (current-balance (var-get balance))
      (new-balance (+ current-balance amount))
    )
    (asserts! (>= new-balance current-balance) err-overflow)
    (var-set balance new-balance)
    (ok true)
  )
)
```

### Time-Based Logic
- Use block heights, not timestamps
- Account for Bitcoin's variable block times
- Add grace periods for time-sensitive operations

## Frontend Security

### Wallet Connection
```typescript
// Always verify network
const verifyNetwork = () => {
  const currentNetwork = userSession.network
  if (currentNetwork !== expectedNetwork) {
    throw new Error('Wrong network')
  }
}

// Validate addresses
const isValidAddress = (address: string) => {
  return /^S[TM][0-9A-Z]{38,40}$/.test(address)
}
```

### Transaction Security
```typescript
// Always show transaction details before signing
const showTransactionPreview = (tx) => {
  return {
    contract: tx.contractAddress,
    function: tx.functionName,
    args: tx.functionArgs,
    fee: tx.fee,
    nonce: tx.nonce
  }
}

// Verify transaction success
const verifyTransaction = async (txId: string) => {
  const result = await waitForTransaction(txId)
  if (result.status !== 'success') {
    throw new Error('Transaction failed')
  }
}
```

### XSS Protection
```typescript
// Sanitize user input
import DOMPurify from 'dompurify'

const sanitizeInput = (input: string) => {
  return DOMPurify.sanitize(input)
}

// Never use dangerouslySetInnerHTML with user content
// Bad:
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// Good:
<div>{sanitizeInput(userInput)}</div>
```

## Backend Security

### API Security
```typescript
// Rate limiting (already implemented)
import rateLimit from 'express-rate-limit'

// Input validation
import Joi from 'joi'

const proposalSchema = Joi.object({
  title: Joi.string().max(256).required(),
  description: Joi.string().max(1024).required(),
  contractAddress: Joi.string().pattern(/^S[TM][0-9A-Z]{38,40}$/).required()
})

// Validate requests
app.post('/api/proposals', (req, res) => {
  const { error } = proposalSchema.validate(req.body)
  if (error) {
    return res.status(400).json({ error: error.details })
  }
  // Process request...
})
```

### Environment Variables
```typescript
// Never commit sensitive data
// Use environment variables for:
- Private keys
- API keys
- Database credentials
- JWT secrets

// Validate environment on startup
const validateEnv = () => {
  const required = ['DATABASE_URL', 'JWT_SECRET', 'REDIS_URL']
  const missing = required.filter(key => !process.env[key])
  if (missing.length) {
    throw new Error(`Missing env vars: ${missing.join(', ')}`)
  }
}
```

### Database Security
```typescript
// Use parameterized queries
// Bad:
db.query(`SELECT * FROM users WHERE id = ${userId}`)

// Good:
db.query('SELECT * FROM users WHERE id = $1', [userId])

// Encrypt sensitive data
import crypto from 'crypto'

const encrypt = (text: string) => {
  const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY!)
  return cipher.update(text, 'utf8', 'hex') + cipher.final('hex')
}
```

## Operational Security

### Deployment Checklist

#### Before Testnet
- [ ] All tests pass
- [ ] Code review completed
- [ ] No hardcoded secrets
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Rate limiting enabled

#### Before Mainnet
- [ ] External audit completed
- [ ] Bug bounty program launched
- [ ] Multi-sig treasury configured
- [ ] Emergency pause mechanism tested
- [ ] Incident response plan ready
- [ ] Insurance/coverage in place

### Monitoring
```typescript
// Log all important events
logger.info('Proposal created', {
  proposalId,
  proposer,
  timestamp: Date.now()
})

// Monitor for suspicious activity
const detectAnomalies = async () => {
  // Large votes
  if (voteAmount > threshold) {
    alert('Large vote detected')
  }
  
  // Rapid proposal creation
  if (proposalRate > maxRate) {
    alert('High proposal rate detected')
  }
}
```

### Incident Response

**If vulnerability discovered:**
1. Assess severity and impact
2. Activate emergency pause if needed
3. Notify users immediately
4. Develop and test fix
5. Deploy fix after audit
6. Post-mortem analysis

**Emergency Pause:**
```clarity
(define-data-var paused bool false)

(define-public (pause)
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set paused true)
    (ok true)
  )
)

(define-read-only (is-paused)
  (var-get paused)
)

;; Check in all public functions
(asserts! (not (is-paused)) err-contract-paused)
```

## User Education

### Best Practices for Users
1. **Verify Contracts**: Always check contract addresses
2. **Review Transactions**: Understand what you're signing
3. **Secure Keys**: Use hardware wallets for large amounts
4. **Beware Phishing**: Only use official website
5. **Start Small**: Test with small amounts first

### Documentation
- Provide clear security documentation
- Explain risks to users
- Regular security updates
- Transparent incident disclosure

## Regular Security Audits

### Internal Reviews
- Weekly code reviews
- Monthly security assessments
- Quarterly penetration testing

### External Audits
- Pre-mainnet smart contract audit
- Annual security audits
- Bug bounty program

### Bug Bounty Rewards
- Critical: $10,000+
- High: $5,000
- Medium: $1,000
- Low: $500

## Compliance

### Data Privacy
- GDPR compliance for EU users
- Minimal data collection
- User data encryption
- Right to deletion

### KYC/AML
- Implement if required by jurisdiction
- Partner with compliance providers
- Document all processes

## Security Resources

- [Clarity Security Guide](https://docs.stacks.co/clarity/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Smart Contract Best Practices](https://consensys.github.io/smart-contract-best-practices/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
