import { supabaseAdmin } from './db'

interface RateLimitResult {
  success: boolean
  remaining: number
  resetAt: Date
}

export async function checkRateLimit(
  identifier: string,
  endpoint: string,
  maxRequests = 10,
  windowMinutes = 15
): Promise<RateLimitResult> {
  const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString()

  const { data: existing } = await supabaseAdmin
    .from('rate_limits')
    .select('*')
    .eq('identifier', identifier)
    .eq('endpoint', endpoint)
    .gte('window_start', windowStart)
    .single()

  if (!existing) {
    const windowStartTime = new Date()
    const windowEnd = new Date(windowStartTime.getTime() + windowMinutes * 60 * 1000)
    await supabaseAdmin.from('rate_limits').insert({
      identifier,
      endpoint,
      request_count: 1,
      window_start: windowStartTime.toISOString(),
      window_end: windowEnd.toISOString()
    })
    return { success: true, remaining: maxRequests - 1, resetAt: windowEnd }
  }

  if (existing.request_count >= maxRequests) {
    return { success: false, remaining: 0, resetAt: new Date(existing.window_end) }
  }

  await supabaseAdmin
    .from('rate_limits')
    .update({ request_count: existing.request_count + 1 })
    .eq('id', existing.id)

  return {
    success: true,
    remaining: maxRequests - existing.request_count - 1,
    resetAt: new Date(existing.window_end)
  }
}
