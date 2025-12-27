import { Request, Response } from 'express'
import { StacksService } from '../services/stacksService'
import { parseCV } from '../utils/clarityParser'

const stacks = new StacksService()

export class TokenController {
  getInfo = async (_req: Request, res: Response) => {
    try {
      const [nameCV, symbolCV, decimalsCV] = await Promise.all([
        stacks.getTokenName(),
        stacks.getTokenSymbol(),
        stacks.getTokenDecimals(),
      ])
      const name = parseCV(nameCV)
      const symbol = parseCV(symbolCV)
      const decimals = parseCV(decimalsCV)
      res.json({ success: true, data: { name, symbol, decimals } })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }
}
