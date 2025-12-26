import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { config } from './config'
import { errorHandler } from './middleware/errorHandler'
import { rateLimiter } from './middleware/rateLimiter'

// Routes
import proposalRoutes from './routes/proposals'
import treasuryRoutes from './routes/treasury'
import stakingRoutes from './routes/staking'
import governanceRoutes from './routes/governance'
import analyticsRoutes from './routes/analytics'

const app = express()

// Middleware
app.use(helmet())
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}))
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(rateLimiter)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API Routes
app.use('/api/proposals', proposalRoutes)
app.use('/api/treasury', treasuryRoutes)
app.use('/api/staking', stakingRoutes)
app.use('/api/governance', governanceRoutes)
app.use('/api/analytics', analyticsRoutes)

// Error handling
app.use(errorHandler)

// Start server
const PORT = config.port
app.listen(PORT, () => {
  console.log(`🚀 GovernStack API running on port ${PORT}`)
  console.log(`📡 Environment: ${config.nodeEnv}`)
  console.log(`🔗 Network: ${config.stacksNetwork}`)
})

export default app
