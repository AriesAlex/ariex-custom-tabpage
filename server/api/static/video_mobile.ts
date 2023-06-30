import staticHandler from '../lib/staticHandler'

export default defineEventHandler(
  async e => await staticHandler(e, 'video_mobile.mp4')
)
