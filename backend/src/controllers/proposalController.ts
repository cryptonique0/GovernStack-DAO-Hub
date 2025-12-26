import { Request, Response } from 'express'
import { StacksService } from '../services/stacksService'

export class ProposalController {
  private stacksService: StacksService

  constructor() {
    this.stacksService = new StacksService()
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const { status, limit = 10, offset = 0 } = req.query
      
      // Fetch proposals from blockchain
      const proposals = await this.stacksService.getProposals({
        status: status as string,
        limit: Number(limit),
        offset: Number(offset)
      })

      res.json({
        success: true,
        data: proposals
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const proposal = await this.stacksService.getProposal(Number(id))

      if (!proposal) {
        return res.status(404).json({
          success: false,
          error: 'Proposal not found'
        })
      }

      res.json({
        success: true,
        data: proposal
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }

  create = async (req: Request, res: Response) => {
    try {
      const { title, description, contractAddress, functionName, parameters } = req.body

      // Validate input
      if (!title || !description || !contractAddress || !functionName) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields'
        })
      }

      // Return transaction for user to sign
      const txData = await this.stacksService.createProposalTx({
        title,
        description,
        contractAddress,
        functionName,
        parameters: parameters || []
      })

      res.json({
        success: true,
        data: txData
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }

  vote = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { support } = req.body // 0 = against, 1 = for, 2 = abstain

      if (support === undefined || support < 0 || support > 2) {
        return res.status(400).json({
          success: false,
          error: 'Invalid vote support value'
        })
      }

      const txData = await this.stacksService.castVoteTx(Number(id), support)

      res.json({
        success: true,
        data: txData
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }

  queue = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const txData = await this.stacksService.queueProposalTx(Number(id))

      res.json({
        success: true,
        data: txData
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }

  execute = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const txData = await this.stacksService.executeProposalTx(Number(id))

      res.json({
        success: true,
        data: txData
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }

  cancel = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const txData = await this.stacksService.cancelProposalTx(Number(id))

      res.json({
        success: true,
        data: txData
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        error: error.message
      })
    }
  }
}
