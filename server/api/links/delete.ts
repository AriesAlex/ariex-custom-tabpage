import { getDataOwnerId } from '../../lib/auth'
import { parseLinkId } from '../../lib/linkValidation'
import { deleteLink } from '../../lib/userData'

export default defineEventHandler(async e => {
  const body = await readBody(e)
  const id = parseLinkId(e, body?.id)

  const deleted = await deleteLink(await getDataOwnerId(e), id)
  if (!deleted)
    throw createError({
      statusCode: 400,
      message: e.context.$t('noLinkWithSuchId'),
    })
  return 'ok'
})
