import fs from 'fs-extra'
import formidable from 'formidable'
import { IncomingMessage } from 'http'

const isDev = process.env.NODE_ENV == 'development'
const publicDir = `${isDev ? '' : '.output/'}public`

export default defineEventHandler(async e => {
  const files = (await getFiles(e.node.req)) as any
  const file = files[Object.keys(files)[0]]
  fs.moveSync(file[0].filepath, `${publicDir}/image_mobile.jpg`, {
    overwrite: true,
  })
  return 'ok'
})

function getFiles(req: IncomingMessage) {
  return new Promise((resolve, reject) => {
    const form = formidable({ multiples: true })
    form.parse(req, (error, fields, files) => {
      if (error) {
        reject(error)
        return
      }
      resolve({ ...fields, ...files })
    })
  })
}
