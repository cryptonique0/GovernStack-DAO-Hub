import {
  AnchorMode,
  PostConditionMode,
  stringAsciiCV,
  stringUtf8CV,
  uintCV,
  principalCV,
  listCV,
  bufferCV,
  callReadOnlyFunction,
} from '@stacks/transactions'
import { StacksTestnet, StacksMainnet } from '@stacks/network'
import { config } from '../config'

export class StacksService {
  private network: StacksTestnet | StacksMainnet

  constructor() {
    this.network = config.stacksNetwork === 'mainnet' 
      ? new StacksMainnet() 
      : new StacksTestnet()
  }

  async getProposals(filters: any) {
    const count = await this.getProposalCount()
    const proposals: any[] = []
    for (let i = 1; i <= count; i++) {
      const p = await this.getProposal(i)
      if (!p) continue
      if (filters?.status && p.status !== filters.status) continue
      proposals.push(p)
    }
    return proposals
  }

  async getProposal(id: number) {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: config.governanceContractAddress,
        contractName: config.governanceContractName,
        functionName: 'get-proposal',
        functionArgs: [uintCV(id)],
        network: this.network,
        senderAddress: config.governanceContractAddress,
      })
      // The response is a Clarity value; parse minimally
      // Return raw CV for now; frontend can format as needed
      // @ts-ignore
      return result?.value || null
    } catch (e) {
      return null
    }
  }

  async getProposalCount(): Promise<number> {
    const result = await callReadOnlyFunction({
      contractAddress: config.governanceContractAddress,
      contractName: config.governanceContractName,
      functionName: 'get-proposal-count',
      functionArgs: [],
      network: this.network,
      senderAddress: config.governanceContractAddress,
    })
    // @ts-ignore
    const val = result?.value?.value
    return typeof val === 'bigint' ? Number(val) : 0
  }

  async createProposalTx(data: any) {
    // Generate transaction data for creating a proposal
    const txOptions = {
      contractAddress: config.governanceContractAddress,
      contractName: config.governanceContractName,
      functionName: 'create-proposal',
      functionArgs: [
        stringAsciiCV(data.title),
        stringUtf8CV(data.description),
        principalCV(data.contractAddress),
        stringAsciiCV(data.functionName),
        listCV(data.parameters.map((p: any) => bufferCV(Buffer.from(p))))
      ],
      network: this.network,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Allow,
      senderKey: '', // Will be signed by frontend
    }

    return txOptions
  }

  async castVoteTx(proposalId: number, support: number) {
    const txOptions = {
      contractAddress: config.governanceContractAddress,
      contractName: config.governanceContractName,
      functionName: 'cast-vote',
      functionArgs: [
        uintCV(proposalId),
        uintCV(support)
      ],
      network: this.network,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Allow,
      senderKey: '',
    }

    return txOptions
  }

  async queueProposalTx(proposalId: number) {
    const txOptions = {
      contractAddress: config.governanceContractAddress,
      contractName: config.governanceContractName,
      functionName: 'queue-proposal',
      functionArgs: [uintCV(proposalId)],
      network: this.network,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Allow,
      senderKey: '',
    }

    return txOptions
  }

  async executeProposalTx(proposalId: number) {
    const txOptions = {
      contractAddress: config.governanceContractAddress,
      contractName: config.governanceContractName,
      functionName: 'execute-proposal',
      functionArgs: [uintCV(proposalId)],
      network: this.network,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Allow,
      senderKey: '',
    }

    return txOptions
  }

  async cancelProposalTx(proposalId: number) {
    const txOptions = {
      contractAddress: config.governanceContractAddress,
      contractName: config.governanceContractName,
      functionName: 'cancel-proposal',
      functionArgs: [uintCV(proposalId)],
      network: this.network,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Allow,
      senderKey: '',
    }

    return txOptions
  }

  // SIP-010 read-only helpers
  async getTokenName() {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: config.governanceTokenAddress,
        contractName: config.governanceTokenName,
        functionName: 'get-name',
        functionArgs: [],
        network: this.network,
        senderAddress: config.governanceTokenAddress,
      })
      // Return Clarity value directly; frontend/backend consumer can parse
      // @ts-ignore
      return result || null
    } catch (e) {
      return null
    }
  }

  async getTokenSymbol() {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: config.governanceTokenAddress,
        contractName: config.governanceTokenName,
        functionName: 'get-symbol',
        functionArgs: [],
        network: this.network,
        senderAddress: config.governanceTokenAddress,
      })
      // @ts-ignore
      return result || null
    } catch (e) {
      return null
    }
  }

  async getTokenDecimals() {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: config.governanceTokenAddress,
        contractName: config.governanceTokenName,
        functionName: 'get-decimals',
        functionArgs: [],
        network: this.network,
        senderAddress: config.governanceTokenAddress,
      })
      // @ts-ignore
      return result || null
    } catch (e) {
      return null
    }
  }

  // Staking read-only helpers
  async getStake(address: string) {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: config.stakingContractAddress,
        contractName: config.stakingContractName,
        functionName: 'get-stake',
        functionArgs: [principalCV(address)],
        network: this.network,
        senderAddress: config.stakingContractAddress,
      })
      // @ts-ignore
      return result || null
    } catch (e) {
      return null
    }
  }

  async getTotalStaked() {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: config.stakingContractAddress,
        contractName: config.stakingContractName,
        functionName: 'get-total-staked',
        functionArgs: [],
        network: this.network,
        senderAddress: config.stakingContractAddress,
      })
      // @ts-ignore
      return result || null
    } catch (e) {
      return null
    }
  }

  async getRewardRate() {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: config.stakingContractAddress,
        contractName: config.stakingContractName,
        functionName: 'get-reward-rate',
        functionArgs: [],
        network: this.network,
        senderAddress: config.stakingContractAddress,
      })
      // @ts-ignore
      return result || null
    } catch (e) {
      return null
    }
  }

  async calculateRewards(address: string) {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: config.stakingContractAddress,
        contractName: config.stakingContractName,
        functionName: 'calculate-rewards',
        functionArgs: [principalCV(address)],
        network: this.network,
        senderAddress: config.stakingContractAddress,
      })
      // @ts-ignore
      return result || null
    } catch (e) {
      return null
    }
  }

  async getVotingPower(address: string) {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: config.stakingContractAddress,
        contractName: config.stakingContractName,
        functionName: 'get-voting-power',
        functionArgs: [principalCV(address)],
        network: this.network,
        senderAddress: config.stakingContractAddress,
      })
      // @ts-ignore
      return result || null
    } catch (e) {
      return null
    }
  }

  // Governance read-only helpers
  async getVotingPeriod() {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: config.governanceContractAddress,
        contractName: config.governanceContractName,
        functionName: 'get-voting-period',
        functionArgs: [],
        network: this.network,
        senderAddress: config.governanceContractAddress,
      })
      // @ts-ignore
      return result || null
    } catch (e) {
      return null
    }
  }

  async getQuorumPercentage() {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: config.governanceContractAddress,
        contractName: config.governanceContractName,
        functionName: 'get-quorum-percentage',
        functionArgs: [],
        network: this.network,
        senderAddress: config.governanceContractAddress,
      })
      // @ts-ignore
      return result || null
    } catch (e) {
      return null
    }
  }

  async getMinProposalThreshold() {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: config.governanceContractAddress,
        contractName: config.governanceContractName,
        functionName: 'get-min-proposal-threshold',
        functionArgs: [],
        network: this.network,
        senderAddress: config.governanceContractAddress,
      })
      // @ts-ignore
      return result || null
    } catch (e) {
      return null
    }
  }

  async getExecutionDelay() {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: config.governanceContractAddress,
        contractName: config.governanceContractName,
        functionName: 'get-execution-delay',
        functionArgs: [],
        network: this.network,
        senderAddress: config.governanceContractAddress,
      })
      // @ts-ignore
      return result || null
    } catch (e) {
      return null
    }
  }

  async getProposalState(id: number) {
    try {
      const result = await callReadOnlyFunction({
        contractAddress: config.governanceContractAddress,
        contractName: config.governanceContractName,
        functionName: 'get-proposal-state',
        functionArgs: [uintCV(id)],
        network: this.network,
        senderAddress: config.governanceContractAddress,
      })
      // @ts-ignore
      return result || null
    } catch (e) {
      return null
    }
  }
}
