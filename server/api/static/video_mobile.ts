import { getDataOwnerId } from '../../lib/auth'
import { serveMedia } from '../../lib/media'

export default defineEventHandler(
  async e => serveMedia(e, await getDataOwnerId(e), 'videoMobile')
)
