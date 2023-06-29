import fs from 'fs-extra'
import formidable from 'formidable'
import { IncomingMessage } from 'http'

export default defineEventHandler(async e => {
  const files = (await getFiles(e.node.req)) as any
  const file = files[Object.keys(files)[0]]
  fs.moveSync(file[0].filepath, 'public/video.mp4', { overwrite: true })
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
