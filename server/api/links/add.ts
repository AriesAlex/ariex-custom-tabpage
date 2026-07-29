import { getDataOwnerId } from '../../lib/auth'
import { parseLink } from '../../lib/linkValidation'
import { saveLink } from '../../lib/userData'

export default defineEventHandler(async e => {
  const link = parseLink(e, await readBody(e))

  const saved = await saveLink(await getDataOwnerId(e), link)
  if (!saved)
    throw createError({
      statusCode: 400,
      message: e.context.$t('noLinkWithSuchId'),
    })

  return 'ok'
})
