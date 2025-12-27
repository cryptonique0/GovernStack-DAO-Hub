/**
 * Clarity Value Parsing Utilities
 * Converts cvToJSON output into simplified plain JS objects/numbers
 */

// Extract numeric value from parsed CV (handles string numbers and bigints)
export function extractUint(parsedCV: any): number | null {
  if (!parsedCV || !parsedCV.value) return null
  const v = parsedCV.value
  if (typeof v === 'number') return v
  if (typeof v === 'string') {
    try {
      const n = BigInt(v)
      // Safe cast if within JS safe integer range
      if (n <= BigInt(Number.MAX_SAFE_INTEGER) && n >= BigInt(Number.MIN_SAFE_INTEGER)) {
        return Number(n)
      }
      // Return string for large numbers
      return v as any
    } catch (e) {
      return null
    }
  }
  return null
}

// Extract string value from parsed CV
export function extractString(parsedCV: any): string | null {
  if (!parsedCV || !parsedCV.value) return null
  const v = parsedCV.value
  return typeof v === 'string' ? v : null
}

// Extract boolean value from parsed CV
export function extractBool(parsedCV: any): boolean | null {
  if (!parsedCV || !parsedCV.value) return null
  const v = parsedCV.value
  return typeof v === 'boolean' ? v : null
}

// Extract tuple fields into object
export function extractTuple(parsedCV: any): Record<string, any> | null {
  if (!parsedCV || !parsedCV.value || typeof parsedCV.value !== 'object' || Array.isArray(parsedCV.value)) {
    return null
  }
  const tuple = parsedCV.value
  const result: Record<string, any> = {}
  for (const [key, val] of Object.entries(tuple)) {
    if (typeof val === 'object' && val !== null && 'value' in val) {
      // It's a parsed CV, extract the value
      result[key] = (val as any).value
    } else {
      result[key] = val
    }
  }
  return result
}

// Parse staking info (uint uint) -> { totalStaked, rewardRate }
export function parseStakingInfo(totalStakedCV: any, rewardRateCV: any): {
  totalStaked: number | string
  rewardRate: number | string
} {
  return {
    totalStaked: extractUint(totalStakedCV) ?? 0,
    rewardRate: extractUint(rewardRateCV) ?? 0,
  }
}

// Parse stake tuple -> { amount, stakedAt, lockUntil, rewardDebt, lockMultiplier }
export function parseStake(stakeCV: any): {
  amount: number | string | null
  stakedAt: number | string | null
  lockUntil: number | string | null
  rewardDebt: number | string | null
  lockMultiplier: number | string | null
} | null {
  const tuple = extractTuple(stakeCV)
  if (!tuple) return null
  return {
    amount: tuple.amount ?? null,
    stakedAt: tuple['staked-at'] ?? null,
    lockUntil: tuple['lock-until'] ?? null,
    rewardDebt: tuple['reward-debt'] ?? null,
    lockMultiplier: tuple['lock-multiplier'] ?? null,
  }
}

// Parse token metadata (name/symbol/decimals)
export function parseTokenMetadata(
  nameCV: any,
  symbolCV: any,
  decimalsCV: any
): {
  name: string | null
  symbol: string | null
  decimals: number | string | null
} {
  return {
    name: extractString(nameCV),
    symbol: extractString(symbolCV),
    decimals: extractUint(decimalsCV),
  }
}

// Parse proposal (complex tuple)
export function parseProposal(proposalCV: any): Record<string, any> | null {
  return extractTuple(proposalCV)
}

// Parse optional value (some/none)
export function parseOptional(optionalCV: any): any | null {
  if (!optionalCV) return null
  if (optionalCV.value === null || optionalCV.value === undefined) return null
  return optionalCV.value
}

// Parse response (ok/err)
export function parseResponse(responseCV: any): { success: boolean; value: any } | null {
  if (!responseCV) return null
  return {
    success: responseCV.success ?? false,
    value: responseCV.value ?? null,
  }
}
