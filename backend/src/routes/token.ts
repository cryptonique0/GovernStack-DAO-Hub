import { Router } from 'express'
import { TokenController } from '../controllers/tokenController'

const router = Router()
const tokenController = new TokenController()

router.get('/info', tokenController.getInfo)

export default router
