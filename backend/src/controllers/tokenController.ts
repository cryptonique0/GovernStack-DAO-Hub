import { Request, Response } from 'express'
import { StacksService } from '../services/stacksService'

const stacks = new StacksService()

export class TokenController {
  getInfo = async (_req: Request, res: Response) => {
    try {
      const [nameCV, symbolCV, decimalsCV] = await Promise.all([
        stacks.getTokenName(),
        stacks.getTokenSymbol(),
        stacks.getTokenDecimals(),
      ])
      res.json({ success: true, data: { nameCV, symbolCV, decimalsCV } })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }
}
