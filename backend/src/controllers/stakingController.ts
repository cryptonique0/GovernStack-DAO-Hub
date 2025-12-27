import { Request, Response } from 'express'
import { StacksService } from '../services/stacksService'
import { parseStakingInfo, parseStake, parseOptional } from '../utils/clarityParser'

const stacks = new StacksService()

export class StakingController {
  getInfo = async (req: Request, res: Response) => {
    try {
      const [totalStakedCV, rewardRateCV] = await Promise.all([
        stacks.getTotalStaked(),
        stacks.getRewardRate(),
      ])
      const info = parseStakingInfo(totalStakedCV, rewardRateCV)
      res.json({ success: true, data: info })
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
      const stake = parseStake(stakeCV)
      res.json({ success: true, data: { stake } })
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
      const rewards = parseOptional(rewardsCV)
      res.json({ success: true, data: { rewards } })
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
      const votingPower = parseOptional(votingPowerCV)
      res.json({ success: true, data: { votingPower } })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }
}
