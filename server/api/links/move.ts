import { linksStorage } from '../../lib/storages'
import { arrayMoveMutable } from 'array-move'

export default defineEventHandler(async e => {
  const body = await readBody(e)
  const id = body?.id
  const offset = body?.offset

  if (id == null)
    throw createError({
      statusCode: 400,
      message: e.context.$t('specifyLinkId'),
    })
  if (typeof offset != 'number')
    throw createError({
      statusCode: 400,
      message: e.context.$t('specifyOffset'),
    })

  const index = linksStorage.value.value.findIndex(l => l.id == id)
  arrayMoveMutable(linksStorage.value.value, index, index + offset)

  return 'ok'
})
