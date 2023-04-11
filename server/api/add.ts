import storage from './lib/storage'
import { v4 } from 'uuid'

export default defineEventHandler(async e => {
  const link = await readBody(e)

  if (!link?.title || !link?.url)
    throw createError({
      statusCode: 400,
      message: `Укажите заголовок и ссылку`,
    })

  if (!link.url.startsWith('http')) link.url = 'https://' + link.url
  if (!link.icon) link.icon = null

  if (link.id) {
    const alreadyExistingLink = storage.value.findIndex(l => l.id == link.id)
    if (!alreadyExistingLink) {
      throw createError({
        statusCode: 400,
        message: `Ссылки с таким id не существует`,
      })
    }
    storage.value[alreadyExistingLink] = link
  } else storage.value.push({ ...link, id: v4() })

  return 'ok'
})
