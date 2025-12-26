import dotenv from 'dotenv'

dotenv.config()

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.API_PORT || '3001', 10),
  
  // Stacks configuration
  stacksNetwork: process.env.STACKS_NETWORK || 'testnet',
  stacksApiUrl: process.env.STACKS_API_URL || 'https://api.testnet.hiro.so',
  governanceContractAddress: process.env.GOVERNANCE_CONTRACT_ADDRESS || '',
  governanceContractName: process.env.GOVERNANCE_CONTRACT_NAME || 'liable-chocolate-kingfisher',
  governanceTokenAddress: process.env.GOVERNANCE_TOKEN_ADDRESS || '',
  governanceTokenName: process.env.GOVERNANCE_TOKEN_NAME || 'worthy-aquamarine-swift',
  delegationContractAddress: process.env.DELEGATION_CONTRACT_ADDRESS || '',
  delegationContractName: process.env.DELEGATION_CONTRACT_NAME || 'delegation',
  
  // Database
  databaseUrl: process.env.DATABASE_URL || '',
  
  // Redis
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  
  // Security
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  // Rate limiting
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
}
