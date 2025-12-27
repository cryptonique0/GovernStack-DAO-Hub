# Deployment Guide

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Environment Configuration](#environment-configuration)
4. [Smart Contract Deployment](#smart-contract-deployment)
5. [Backend Deployment](#backend-deployment)
6. [Frontend Deployment](#frontend-deployment)
7. [Post-Deployment](#post-deployment)
8. [Monitoring & Maintenance](#monitoring--maintenance)
9. [Troubleshooting](#troubleshooting)

## Overview

This guide covers deploying the GovernStack DAO Hub to both testnet and mainnet environments. The deployment process involves three main components:

1. **Smart Contracts** (Clarity on Stacks blockchain)
2. **Backend API** (Node.js/Express)
3. **Frontend** (React/Vite static site)

### Deployment Checklist

- [ ] Environment variables configured
- [ ] Smart contracts tested
- [ ] Database migrations ready
- [ ] Frontend built and tested
- [ ] Domain and SSL configured
- [ ] Monitoring tools set up
- [ ] Backup strategy in place

## Prerequisites

### Tools Required

```bash
# Clarinet (for smart contracts)
curl -sL https://get.hiro.so/clarinet | bash

# Node.js 18+
nvm install 18
nvm use 18

# PostgreSQL 14+
# Redis 6+
# Docker (optional, recommended)
```

### Accounts & Services

- [ ] Stacks wallet with STX for deployment fees
- [ ] Domain name (e.g., governstack.io)
- [ ] Cloud hosting account (AWS, GCP, DigitalOcean, etc.)
- [ ] SSL certificate (Let's Encrypt recommended)
- [ ] Database hosting (or self-hosted)
- [ ] CDN account (optional, for frontend)

## Environment Configuration

### Root `.env`

```bash
# Network
NODE_ENV=production
NETWORK=mainnet  # or testnet

# API
API_URL=https://api.governstack.io
FRONTEND_URL=https://governstack.io
```

### Backend `.env`

```bash
# Server
PORT=3001
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/governstack_prod
DATABASE_SSL=true
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your_redis_password

# Stacks
STACKS_NETWORK=mainnet
STACKS_API_URL=https://api.hiro.so
CONTRACT_ADDRESS=SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM

# Security
JWT_SECRET=your_very_secure_random_string_here
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# CORS
CORS_ORIGIN=https://governstack.io

# Logging
LOG_LEVEL=info
```

### Frontend `.env.production`

```bash
VITE_STACKS_NETWORK=mainnet
VITE_API_URL=https://api.governstack.io
VITE_CONTRACT_ADDRESS=SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
VITE_GOVERNANCE_CONTRACT=governance-core
VITE_TOKEN_CONTRACT=governance-token
VITE_TREASURY_CONTRACT=treasury
VITE_STAKING_CONTRACT=staking
```

## Smart Contract Deployment

### Step 1: Prepare Contracts

Ensure all contracts are tested:

```bash
cd contracts
clarinet test
```

All tests should pass before deployment.

### Step 2: Configure Deployment

Create deployment plan:

```bash
# Generate deployment plan
clarinet deployments generate --testnet

# or for mainnet
clarinet deployments generate --mainnet
```

This creates `deployments/default.testnet-plan.yaml` or `deployments/default.mainnet-plan.yaml`.

### Step 3: Review Deployment Plan

Edit the deployment plan file:

```yaml
---
id: 0
name: GovernStack DAO Hub
network: mainnet
stacks-node: https://api.hiro.so
bitcoin-node: http://localhost:8332
plan:
  batches:
    - id: 0
      transactions:
        - contract-publish:
            contract-name: sip-010-trait
            expected-sender: SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
            cost: 5000
            path: contracts/sip-010-trait.clar
        - contract-publish:
            contract-name: governance-token
            expected-sender: SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
            cost: 50000
            path: contracts/governance-token.clar
        - contract-publish:
            contract-name: governance-core
            expected-sender: SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
            cost: 100000
            path: contracts/governance-core.clar
        - contract-publish:
            contract-name: treasury
            expected-sender: SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
            cost: 75000
            path: contracts/treasury.clar
        - contract-publish:
            contract-name: timelock
            expected-sender: SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
            cost: 50000
            path: contracts/timelock.clar
        - contract-publish:
            contract-name: delegation
            expected-sender: SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
            cost: 50000
            path: contracts/delegation.clar
        - contract-publish:
            contract-name: staking
            expected-sender: SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
            cost: 75000
            path: contracts/staking.clar
```

### Step 4: Deploy to Testnet

```bash
# Deploy to testnet first
clarinet deployments apply -p deployments/default.testnet-plan.yaml

# Check deployment
clarinet deployments check -p deployments/default.testnet-plan.yaml
```

### Step 5: Verify on Testnet

1. Check contracts on explorer: https://explorer.hiro.so/testnet
2. Test contract functions
3. Verify all interactions work correctly

### Step 6: Deploy to Mainnet

⚠️ **IMPORTANT**: Only deploy to mainnet after thorough testnet testing!

```bash
# Deploy to mainnet
clarinet deployments apply -p deployments/default.mainnet-plan.yaml
```

### Step 7: Record Contract Addresses

Save all deployed contract addresses:

```bash
# governance-core: SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.governance-core
# governance-token: SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.governance-token
# treasury: SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.treasury
# staking: SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.staking
# delegation: SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.delegation
# timelock: SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.timelock
```

Update environment variables with these addresses.

## Backend Deployment

### Option 1: Docker Deployment (Recommended)

#### Create Dockerfile

```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3001

# Start server
CMD ["node", "dist/index.js"]
```

#### Create docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:14
    environment:
      - POSTGRES_DB=governstack
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  redis:
    image: redis:6-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

#### Deploy with Docker

```bash
# Build and start services
docker-compose up -d

# Run migrations
docker-compose exec backend npm run migrate

# Check logs
docker-compose logs -f backend
```

### Option 2: Manual Deployment

#### 1. Setup Server

```bash
# SSH into server
ssh user@your-server.com

# Install dependencies
sudo apt update
sudo apt install -y nodejs npm postgresql redis-server nginx

# Install PM2 for process management
npm install -g pm2
```

#### 2. Deploy Code

```bash
# Clone repository
git clone https://github.com/your-org/governstack-dao.git
cd governstack-dao/backend

# Install dependencies
npm install

# Build TypeScript
npm run build

# Run migrations
npm run migrate
```

#### 3. Configure PM2

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'governstack-api',
    script: './dist/index.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    }
  }]
}
```

Start with PM2:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 4. Configure Nginx

```nginx
# /etc/nginx/sites-available/governstack

upstream backend {
    server localhost:3001;
}

server {
    listen 80;
    server_name api.governstack.io;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.governstack.io;
    
    ssl_certificate /etc/letsencrypt/live/api.governstack.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.governstack.io/privkey.pem;
    
    location / {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and restart:

```bash
sudo ln -s /etc/nginx/sites-available/governstack /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. Setup SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d api.governstack.io
```

## Frontend Deployment

### Step 1: Build Production Bundle

```bash
cd frontend

# Install dependencies
npm install

# Build for production
npm run build
```

This creates an optimized build in `dist/` folder.

### Step 2: Deploy to Static Hosting

#### Option A: Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

Create `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

#### Option B: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

Create `netlify.toml`:

```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

#### Option C: Self-Hosted (Nginx)

```nginx
server {
    listen 80;
    server_name governstack.io;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name governstack.io;
    
    ssl_certificate /etc/letsencrypt/live/governstack.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/governstack.io/privkey.pem;
    
    root /var/www/governstack/dist;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
    
    # Cache static assets
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Copy files and restart:

```bash
sudo mkdir -p /var/www/governstack
sudo cp -r dist/* /var/www/governstack/
sudo systemctl restart nginx
```

## Post-Deployment

### 1. Verify Deployment

#### Smart Contracts
```bash
# Check contract on explorer
https://explorer.hiro.so/txid/SP1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.governance-core

# Test read-only function
curl -X POST https://api.hiro.so/v2/contracts/call-read/SP1.../governance-core/get-proposal-count
```

#### Backend API
```bash
# Health check
curl https://api.governstack.io/health

# Get proposals
curl https://api.governstack.io/api/proposals
```

#### Frontend
```bash
# Check if site loads
curl -I https://governstack.io

# Test in browser
open https://governstack.io
```

### 2. Initialize DAO

```bash
# Create initial governance parameters via contract call
# Set initial token distribution
# Configure treasury parameters
```

### 3. Documentation

Update documentation with:
- Deployed contract addresses
- API endpoints
- Frontend URL
- Admin contacts

### 4. Security Audit

- [ ] Run security scan on smart contracts
- [ ] Check API security headers
- [ ] Verify SSL/TLS configuration
- [ ] Test rate limiting
- [ ] Review access controls

## Monitoring & Maintenance

### Application Monitoring

#### Backend (PM2)

```bash
# View logs
pm2 logs governstack-api

# Monitor resources
pm2 monit

# Restart if needed
pm2 restart governstack-api
```

#### Setup Monitoring Tools

```bash
# Install monitoring
npm install -g pm2-logrotate
pm2 install pm2-logrotate

# Setup alerts (example with PM2 Plus)
pm2 link <secret_key> <public_key>
```

### Database Backups

```bash
# Automated PostgreSQL backup
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/postgres"
DB_NAME="governstack"

pg_dump $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete
```

Add to crontab:

```bash
# Backup database daily at 2 AM
0 2 * * * /path/to/backup.sh
```

### Uptime Monitoring

Use services like:
- UptimeRobot
- Pingdom
- StatusCake

Monitor:
- Frontend availability
- API endpoints
- Database connectivity
- Blockchain node connectivity

### Log Aggregation

Consider using:
- **Papertrail** - Simple log aggregation
- **Datadog** - Full monitoring suite
- **ELK Stack** - Self-hosted option

## Troubleshooting

### Smart Contracts

**Issue**: Contract deployment fails
```bash
# Check account balance
clarinet deployments check -p deployments/default.mainnet-plan.yaml

# Verify contract syntax
clarinet check
```

**Issue**: Contract interaction fails
- Verify correct contract address
- Check function arguments
- Ensure sufficient STX for fees

### Backend

**Issue**: Database connection fails
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
psql -h localhost -U user -d governstack -c "SELECT 1"
```

**Issue**: High memory usage
```bash
# Check PM2 metrics
pm2 monit

# Restart with cluster mode
pm2 delete governstack-api
pm2 start ecosystem.config.js
```

### Frontend

**Issue**: 404 on routes
- Check nginx configuration for SPA routing
- Verify `try_files` directive

**Issue**: API calls failing
- Check CORS configuration in backend
- Verify API_URL environment variable
- Check browser console for errors

---

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Security audit completed
- [ ] Backup strategy in place
- [ ] Rollback plan prepared
- [ ] Team notified

### Deployment
- [ ] Contracts deployed and verified
- [ ] Backend deployed and running
- [ ] Frontend deployed and accessible
- [ ] Database migrated
- [ ] SSL certificates configured

### Post-Deployment
- [ ] Health checks passing
- [ ] Monitoring configured
- [ ] Backups automated
- [ ] Documentation updated
- [ ] Announcement made

---

## Support

For deployment issues:
- **GitHub Issues**: https://github.com/governstack/dao-hub/issues
- **Discord**: https://discord.gg/governstack
- **Email**: support@governstack.io

---

**Remember**: Always test on testnet before mainnet deployment!
