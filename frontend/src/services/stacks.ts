import { openContractCall } from '@stacks/connect'
import { userSession } from '@/stores/walletStore'
import { uintCV, principalCV, stringAsciiCV, stringUtf8CV, listCV, bufferCV } from '@stacks/transactions'

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as string
const GOVERNANCE_CONTRACT_NAME = 'governance-core'

export async function createProposalTx(args: {
  title: string
  description: string
  contractAddress: string
  functionName: string
  parameters?: string[] // hex strings
}) {
  const functionArgs = [
    stringAsciiCV(args.title),
    stringUtf8CV(args.description),
    principalCV(args.contractAddress),
    stringAsciiCV(args.functionName),
    listCV((args.parameters || []).map(p => bufferCV(Buffer.from(p, 'hex'))))
  ]

  return openContractCall({
    userSession,
    contractAddress: CONTRACT_ADDRESS,
    contractName: GOVERNANCE_CONTRACT_NAME,
    functionName: 'create-proposal',
    functionArgs,
    onFinish: data => {
      console.log('create-proposal tx:', data.txId)
    },
  })
}

export async function castVoteTx(proposalId: number, support: 0 | 1 | 2) {
  const functionArgs = [uintCV(proposalId), uintCV(support)]
  return openContractCall({
    userSession,
    contractAddress: CONTRACT_ADDRESS,
    contractName: GOVERNANCE_CONTRACT_NAME,
    functionName: 'cast-vote',
    functionArgs,
    onFinish: data => {
      console.log('cast-vote tx:', data.txId)
    },
  })
}
