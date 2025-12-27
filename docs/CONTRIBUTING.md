# Contributing to GovernStack DAO Hub

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Collaborate openly

## Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Submit a pull request

## Development Setup

```bash
git clone https://github.com/your-username/governstack-dao.git
cd governstack-dao
./scripts/setup.sh
```

## Coding Standards

### Smart Contracts (Clarity)
- Follow official Clarity style guide
- Use descriptive variable names
- Add comprehensive comments
- Write unit tests for all functions
- Validate all inputs

Example:
```clarity
;; Good
(define-public (set-voting-period (new-period uint))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (> new-period u0) err-invalid-parameter)
    (var-set voting-period new-period)
    (ok true)
  )
)
```

### TypeScript/JavaScript
- Use TypeScript for type safety
- Follow ESLint configuration
- Use meaningful variable names
- Add JSDoc comments for public functions
- Write unit tests

Example:
```typescript
/**
 * Create a new governance proposal
 * @param title - Proposal title (max 256 chars)
 * @param description - Detailed description
 * @returns Transaction data for signing
 */
export async function createProposal(
  title: string,
  description: string
): Promise<TxData> {
  // Implementation
}
```

### Commit Messages

Use conventional commits format:

```
type(scope): subject

body

footer
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance

Examples:
```
feat(contracts): add vote delegation feature
fix(frontend): resolve wallet connection issue
docs(api): update endpoint documentation
```

## Pull Request Process

1. **Create Feature Branch**
```bash
git checkout -b feat/your-feature-name
```

2. **Make Changes**
   - Write clean, documented code
   - Add tests
   - Update documentation

3. **Test Thoroughly**
```bash
npm run test
npm run lint
```

4. **Commit Changes**
```bash
git add .
git commit -m "feat(scope): description"
```

5. **Push to Fork**
```bash
git push origin feat/your-feature-name
```

6. **Create Pull Request**
   - Clear title and description
   - Reference related issues
   - Add screenshots if UI changes
   - Request reviews

## Testing Requirements

### Smart Contracts
```bash
cd contracts
clarinet test
```

All contracts must have:
- Unit tests for each function
- Edge case testing
- Error condition testing
- Integration tests

### Frontend
```bash
cd frontend
npm run test
npm run test:coverage
```

Minimum coverage: 80%

### Backend
```bash
cd backend
npm run test
```

## Documentation

Update documentation when:
- Adding new features
- Changing API endpoints
- Modifying smart contracts
- Updating dependencies

Files to update:
- README.md
- API.md
- DEVELOPMENT.md
- Inline code comments

## Review Process

All PRs require:
- At least 1 approval from maintainer
- All tests passing
- No merge conflicts
- Documentation updated

Review focuses on:
- Code quality
- Security implications
- Performance impact
- Test coverage
- Documentation clarity

## Reporting Issues

### Bug Reports

Include:
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details
- Error messages/logs

Template:
```markdown
**Bug Description**
Clear description of the bug

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Screenshots**
If applicable

**Environment**
- OS: [e.g. Ubuntu 22.04]
- Browser: [e.g. Chrome 120]
- Wallet: [e.g. Hiro Wallet 4.0]
```

### Feature Requests

Include:
- Use case description
- Proposed solution
- Alternative solutions considered
- Additional context

## Community

- Join our Discord: [link]
- Follow on Twitter: [@GovernStack]
- Weekly community calls: Thursdays 3pm UTC

## Recognition

Contributors will be:
- Listed in README.md
- Mentioned in release notes
- Eligible for contributor NFTs
- Considered for grants

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

- Open a discussion on GitHub
- Ask in Discord #dev channel
- Email: dev@governstack.io

Thank you for contributing to GovernStack DAO Hub! 🚀
