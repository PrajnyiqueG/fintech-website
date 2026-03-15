
import { NextRequest } from 'next/server'

// In-memory store for rate limiting (use Redis in production for multi-instance)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

interface RateLimitConfig {
  windowMs: number  // Time window in milliseconds
  maxRequests: number  // Max requests per window
}

export function getRateLimitKey(req: NextRequest, prefix: string): string {
  const forwarded = req.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'
  return `${prefix}:${ip}`
}

export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const existing = rateLimitStore.get(key)

  if (!existing || now > existing.resetTime) {
    // New window
    const resetTime = now + config.windowMs
    rateLimitStore.set(key, { count: 1, resetTime })
    return { allowed: true, remaining: config.maxRequests - 1, resetTime }
  }

  if (existing.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetTime: existing.resetTime }
  }

  existing.count++
  return {
    allowed: true,
    remaining: config.maxRequests - existing.count,
    resetTime: existing.resetTime
  }
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 60000)

export const RATE_LIMITS = {
  auth: { windowMs: 15 * 60 * 1000, maxRequests: 10 },       // 10 per 15 min
  contact: { windowMs: 60 * 60 * 1000, maxRequests: 5 },     // 5 per hour
  api: { windowMs: 60 * 1000, maxRequests: 60 },             // 60 per minute
}
