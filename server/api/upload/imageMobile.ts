import { getDataOwnerId } from '../../lib/auth'
import { uploadMedia } from '../../lib/media'

export default defineEventHandler(
  async e => uploadMedia(e, await getDataOwnerId(e), 'imageMobile')
)
