import storage from './lib/storage'
import { arrayMoveMutable } from 'array-move'

export default defineEventHandler(async e => {
  const body = await readBody(e)
  const id = body?.id
  const offset = body?.offset

  if (!id)
    throw createError({
      statusCode: 400,
      message: `Укажите id ссылки`,
    })
  if (!offset)
    throw createError({
      statusCode: 400,
      message: `Укажите смещение`,
    })

  const index = storage.value.findIndex(l => l.id == id)
  arrayMoveMutable(storage.value, index, index + offset)

  return 'ok'
})
