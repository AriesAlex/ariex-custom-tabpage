import fs from 'fs-extra'

const isDev = process.env.NODE_ENV == 'development'
const publicDir = `${isDev ? '' : '.output/'}public`

export default defineEventHandler(e => {
  return fs.readFileSync(`${publicDir}/image_mobile.jpg`)
})
