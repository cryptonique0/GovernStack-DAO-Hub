import { Router } from 'express'
import { TreasuryController } from '../controllers/treasuryController'

const router = Router()
const treasuryController = new TreasuryController()

router.get('/balance', treasuryController.getBalance)
router.get('/payments', treasuryController.getPayments)
router.post('/payments', treasuryController.createPayment)
router.post('/payments/:id/execute', treasuryController.executePayment)
router.get('/streams', treasuryController.getStreams)
router.post('/streams', treasuryController.createStream)
router.post('/streams/:id/claim', treasuryController.claimStream)

export default router
