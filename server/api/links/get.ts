import { getDataOwnerId } from '../../lib/auth'
import { getLinks } from '../../lib/userData'

export default defineEventHandler(async e => {
  return getLinks(await getDataOwnerId(e))
})
