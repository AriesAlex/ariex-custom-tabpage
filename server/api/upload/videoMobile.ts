import uploadHandler from '../lib/uploadHandler'

export default defineEventHandler(
  async e => await uploadHandler(e, 'video_mobile.mp4')
)
