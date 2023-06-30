import staticHandler from '../lib/staticHandler'

export default defineEventHandler(
  async e => await staticHandler(e, 'video.mp4')
)
