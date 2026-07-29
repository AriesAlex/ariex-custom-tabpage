import { getDataOwnerId } from '../lib/auth'
import { parseLinkUrl } from '../lib/linkValidation'

export default defineEventHandler(async e => {
  await getDataOwnerId(e)
  const url = parseLinkUrl(e, getQuery(e).url)
  const response = await $fetch.raw<ArrayBuffer>(
    `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(url)}&size=32`,
    {
      ignoreResponseError: true,
      responseType: 'arrayBuffer',
    }
  )
  if (
    !response._data ||
    !response.headers.get('content-type')?.startsWith('image/')
  )
    throw createError({ statusCode: 502, message: 'Icon provider failed' })
  return Buffer.from(response._data).toString('base64')
})
