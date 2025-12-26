import { Request, Response } from 'express'
import { StacksService } from '../services/stacksService'

const stacks = new StacksService()

export class GovernanceController {
  getParams = async (req: Request, res: Response) => {
    try {
      const [votingPeriodCV, quorumPercentageCV, proposalThresholdCV, executionDelayCV] = await Promise.all([
        stacks.getVotingPeriod(),
        stacks.getQuorumPercentage(),
        stacks.getMinProposalThreshold(),
        stacks.getExecutionDelay(),
      ])
      res.json({ success: true, data: { votingPeriodCV, quorumPercentageCV, proposalThresholdCV, executionDelayCV } })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }

  updateParams = async (req: Request, res: Response) => {
    try {
      const params = req.body
      
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

  getDelegation = async (req: Request, res: Response) => {
    try {
      const { address } = req.params
      
      res.json({
        success: true,
        data: {
          delegate: address,
          delegatedAt: null
        }
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }

  delegate = async (req: Request, res: Response) => {
    try {
      const { delegate } = req.body
      
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

  revokeDelegation = async (req: Request, res: Response) => {
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

  getProposalState = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const stateCV = await stacks.getProposalState(Number(id))
      res.json({ success: true, data: { stateCV } })
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message })
    }
  }
}
