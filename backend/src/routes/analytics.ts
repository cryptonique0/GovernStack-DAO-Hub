import { Router } from 'express'
import { AnalyticsController } from '../controllers/analyticsController'

const router = Router()
const analyticsController = new AnalyticsController()

router.get('/overview', analyticsController.getOverview)
router.get('/proposals', analyticsController.getProposalStats)
router.get('/voting', analyticsController.getVotingStats)
router.get('/treasury', analyticsController.getTreasuryStats)

export default router
