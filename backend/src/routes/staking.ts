import { Router } from 'express'
import { StakingController } from '../controllers/stakingController'

const router = Router()
const stakingController = new StakingController()

router.get('/info', stakingController.getInfo)
router.get('/stakes/:address', stakingController.getStakes)
router.get('/voting-power/:address', stakingController.getVotingPower)
router.post('/stake', stakingController.stake)
router.post('/unstake', stakingController.unstake)
router.post('/claim-rewards', stakingController.claimRewards)
router.get('/rewards/:address', stakingController.getRewards)

export default router
