import { getDataOwnerId } from '../../lib/auth'
import { getSettings } from '../../lib/userData'

export default defineEventHandler(async e => {
  return getSettings(await getDataOwnerId(e))
})
