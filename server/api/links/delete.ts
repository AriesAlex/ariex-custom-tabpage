import { linksStorage } from '../../lib/storages'

export default defineEventHandler(async e => {
  const body = await readBody(e)
  const id = body?.id
  if (id == null)
    throw createError({
      statusCode: 400,
      message: e.context.$t('specifyLinkId'),
    })

  linksStorage.value.value = linksStorage.value.value.filter(l => l.id != id)
  return 'ok'
})
