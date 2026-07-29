import { getDataOwnerId } from '../../lib/auth'
import { parseLinkId, parseLinkOffset } from '../../lib/linkValidation'
import { moveLink } from '../../lib/userData'

export default defineEventHandler(async e => {
  const body = await readBody(e)
  const id = parseLinkId(e, body?.id)
  const offset = parseLinkOffset(e, body?.offset)

  const moved = await moveLink(
    await getDataOwnerId(e),
    id,
    offset
  )
  if (!moved)
    throw createError({
      statusCode: 400,
      message: e.context.$t('noLinkWithSuchId'),
    })

  return 'ok'
})
