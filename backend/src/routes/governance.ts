import { Router } from 'express'
import { GovernanceController } from '../controllers/governanceController'

const router = Router()
const governanceController = new GovernanceController()

router.get('/params', governanceController.getParams)
router.put('/params', governanceController.updateParams)
router.get('/delegation/:address', governanceController.getDelegation)
router.post('/delegate', governanceController.delegate)
router.post('/revoke-delegation', governanceController.revokeDelegation)

export default router
