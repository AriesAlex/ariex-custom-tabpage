import { createError, getRequestIP } from 'h3'
import type { H3Event } from 'h3'

const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 20

interface Attempts {
  count: number
  expiresAt: number
}

const attemptsByAddress = new Map<string, Attempts>()

export function enforceAuthRateLimit(event: H3Event) {
  const now = Date.now()
  for (const [address, attempts] of attemptsByAddress)
    if (attempts.expiresAt <= now) attemptsByAddress.delete(address)

  const address = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'
  const attempts = attemptsByAddress.get(address)

  if (!attempts) {
    attemptsByAddress.set(address, { count: 1, expiresAt: now + WINDOW_MS })
    return
  }
  if (attempts.count >= MAX_ATTEMPTS)
    throw createError({
      statusCode: 429,
      message: event.context.$t('tooManyAuthAttempts'),
    })
  attempts.count++
}
