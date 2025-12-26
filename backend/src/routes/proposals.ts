import { Router } from 'express'
import { ProposalController } from '../controllers/proposalController'

const router = Router()
const proposalController = new ProposalController()

router.get('/', proposalController.getAll)
router.get('/:id', proposalController.getById)
router.post('/', proposalController.create)
router.post('/:id/vote', proposalController.vote)
router.post('/:id/queue', proposalController.queue)
router.post('/:id/execute', proposalController.execute)
router.post('/:id/cancel', proposalController.cancel)

export default router
