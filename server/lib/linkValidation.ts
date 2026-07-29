import { createError } from 'h3'
import type { H3Event } from 'h3'
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

interface ParsedLink {
  id: string | null
  title: string
  url: string
  icon: string | null
}

export function parseLink(event: H3Event, value: unknown): ParsedLink {
  if (!value || typeof value !== 'object') return invalidLink(event)
  const candidate = value as Record<string, unknown>
  const title = typeof candidate.title === 'string' ? candidate.title.trim() : ''
  const rawUrl = typeof candidate.url === 'string' ? candidate.url.trim() : ''

  if (!title || title.length > 200 || !rawUrl || rawUrl.length > 2048)
    return invalidLink(event)

  const url = parseLinkUrl(event, rawUrl)
  const id =
    candidate.id == null ? null : parseLinkId(event, candidate.id)
  const icon =
    candidate.icon == null
      ? null
      : typeof candidate.icon === 'string' && candidate.icon.length <= 700_000
        ? candidate.icon
        : invalidLink(event)

  return { id, title, url, icon }
}

export function parseLinkId(event: H3Event, value: unknown) {
  if (typeof value === 'string' && UUID_PATTERN.test(value)) return value
  throw createError({
    statusCode: 400,
    message: event.context.$t('specifyLinkId'),
  })
}

export function parseLinkOffset(event: H3Event, value: unknown) {
  if (
    typeof value === 'number' &&
    Number.isSafeInteger(value) &&
    Math.abs(value) <= 10_000
  )
    return value
  throw createError({
    statusCode: 400,
    message: event.context.$t('specifyOffset'),
  })
}

export function parseLinkUrl(event: H3Event, value: unknown) {
  if (typeof value !== 'string' || !value.trim() || value.length > 2048)
    return invalidLinkUrl(event)
  const normalizedValue = value.trim()
  const valueWithProtocol = /^[a-z][a-z\d+.-]*:/i.test(normalizedValue)
    ? normalizedValue
    : `https://${normalizedValue}`

  let url: URL
  try {
    url = new URL(valueWithProtocol)
  } catch {
    throw invalidLinkUrl(event)
  }
  if (url.protocol === 'http:' || url.protocol === 'https:')
    return url.toString()

  return invalidLinkUrl(event)
}

function invalidLinkUrl(event: H3Event): never {
  throw createError({
    statusCode: 400,
    message: event.context.$t('invalidLink'),
  })
}

function invalidLink(event: H3Event): never {
  throw createError({
    statusCode: 400,
    message: event.context.$t('specifyTitleAndLink'),
  })
}
