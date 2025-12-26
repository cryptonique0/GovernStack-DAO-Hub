import { Request, Response } from 'express'
import { StacksService } from '../services/stacksService'

const stacks = new StacksService()

export class StakingController {
  getInfo = async (req: Request, res: Response) => {
    try {
      const [totalStakedCV, rewardRateCV] = await Promise.all([
        stacks.getTotalStaked(),
        stacks.getRewardRate(),
      ])
      res.json({ success: true, data: { totalStakedCV, rewardRateCV } })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }

  getStakes = async (req: Request, res: Response) => {
    try {
      const { address } = req.params
      const stakeCV = await stacks.getStake(address)
      res.json({ success: true, data: { stakeCV } })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }

  stake = async (req: Request, res: Response) => {
    try {
      const { amount, lockDuration } = req.body
      
      res.json({
        success: true,
        data: { txData: {} }
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }

  unstake = async (req: Request, res: Response) => {
    try {
      const { amount } = req.body
      
      res.json({
        success: true,
        data: { txData: {} }
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }

  claimRewards = async (req: Request, res: Response) => {
    try {
      res.json({
        success: true,
        data: { txData: {} }
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }

  getRewards = async (req: Request, res: Response) => {
    try {
      const { address } = req.params
      const rewardsCV = await stacks.calculateRewards(address)
      res.json({ success: true, data: { rewardsCV } })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }

  getVotingPower = async (req: Request, res: Response) => {
    try {
      const { address } = req.params
      const votingPowerCV = await stacks.getVotingPower(address)
      res.json({ success: true, data: { votingPowerCV } })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }
}
