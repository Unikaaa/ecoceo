// Simple in-memory rate limiter (for production, use Redis or Upstash)
const requestCounts = new Map<string, { count: number; resetTime: number }>()

interface RateLimitOptions {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
}

export async function rateLimit(
  identifier: string,
  options: RateLimitOptions = { windowMs: 60000, maxRequests: 100 }
): Promise<{ success: boolean; remaining: number; resetTime: number }> {
  const now = Date.now()
  const record = requestCounts.get(identifier)

  // Clean up old records
  if (record && record.resetTime < now) {
    requestCounts.delete(identifier)
  }

  const currentRecord = requestCounts.get(identifier)

  if (!currentRecord) {
    // First request
    requestCounts.set(identifier, {
      count: 1,
      resetTime: now + options.windowMs,
    })
    return {
      success: true,
      remaining: options.maxRequests - 1,
      resetTime: now + options.windowMs,
    }
  }

  if (currentRecord.count >= options.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetTime: currentRecord.resetTime,
    }
  }

  // Increment count
  currentRecord.count++
  requestCounts.set(identifier, currentRecord)

  return {
    success: true,
    remaining: options.maxRequests - currentRecord.count,
    resetTime: currentRecord.resetTime,
  }
}

export function getClientIP(request: Request): string {
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }

  return 'unknown'
}
