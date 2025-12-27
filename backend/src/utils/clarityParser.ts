import { cvToJSON } from '@stacks/transactions'

// Parse a cvToJSON result into a simplified JS value
export function parseCV(cv: any): any {
  if (!cv) return null
  // cv has shape { type, value, success? }
  if (cv.type === 'uint' || cv.type === 'int') {
    // cv.value is string (strict mode) or number
    const v = cv.value
    if (typeof v === 'string') {
      // Big ints may be returned as strings; try Number but fall back to string
      const n = Number(v)
      return Number.isFinite(n) ? n : v
    }
    return v
  }

  if (cv.type === 'bool') return Boolean(cv.value)

  if (cv.type?.startsWith('(string') || cv.type === 'string-ascii' || cv.type === 'string-utf8') {
    return cv.value
  }

  if (cv.type === 'principal') return cv.value

  // Tuple -> map each field
  if (cv.type?.startsWith('(tuple') || (cv.type === 'tuple')) {
    const out: any = {}
    if (!cv.value) return out
    Object.keys(cv.value).forEach((k) => {
      out[k] = parseCV(cv.value[k])
    })
    return out
  }

  // List
  if (cv.type?.startsWith('(list') || cv.type === 'list') {
    return (cv.value || []).map((v: any) => parseCV(v))
  }

  // Response Ok/Err
  if (cv.type?.startsWith('(response') || cv.type === 'response') {
    return parseCV(cv.value)
  }

  // Optional
  if (cv.type?.startsWith('(optional') || cv.type === 'optional') {
    return cv.value === null ? null : parseCV(cv.value)
  }

  // Buffer
  if (cv.type?.startsWith('(buff') || cv.type === 'buffer') {
    return cv.value
  }

  // Fallback: return raw value
  return cv.value ?? cv
}
