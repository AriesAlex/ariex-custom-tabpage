import fs from 'fs-extra'
import formidable from 'formidable'
import crypto from 'crypto'
import { IncomingMessage } from 'http'
import { H3Event } from 'h3'

const publicDir = `${process.dev ? '' : '.output/'}public`

export default async (e: H3Event, filename: string) => {
  const files = (await getFiles(e.node.req)) as any
  const file = files[Object.keys(files)[0]]

  fs.moveSync(file[0].filepath, `${publicDir}/${filename}`, {
    overwrite: true,
  })

  const fileRaw = await fs.readFile(`${publicDir}/${filename}`)
  const hash = crypto.createHash('md5').update(fileRaw).digest('hex')

  return hash
}

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
