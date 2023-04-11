import storage from './lib/storage'

export default defineEventHandler(async e => {
  const body = await readBody(e)
  const id = body?.id
  if (!id)
    throw createError({
      statusCode: 400,
      message: `Укажите id ссылки`,
    })

  storage.value = storage.value.filter(l => l.id != id)
  return 'ok'
})
