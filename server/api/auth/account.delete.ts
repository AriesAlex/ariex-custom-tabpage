import { deleteAccount, requireUser } from '../../lib/auth'
import { deleteUserMedia } from '../../lib/media'

export default defineEventHandler(async event => {
  const user = await requireUser(event)
  await deleteUserMedia(user.id)
  await deleteAccount(event, user.id)
  return 'ok'
})
