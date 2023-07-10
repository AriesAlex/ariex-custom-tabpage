import fs from 'fs-extra'
import crypto from 'crypto'
import { H3Event } from 'h3'
import { contentType } from 'mime-types'

const publicDir = `${process.dev ? '' : '.output/'}public`

export default async (e: H3Event, filename: string) => {
  const file = await fs.readFile(`${publicDir}/${filename}`)
  const hash = crypto.createHash('md5').update(file).digest('hex')

  const fileStat = await fs.stat(`${publicDir}/${filename}`)
  const lastModified = fileStat.mtime.toUTCString()

  const { req, res } = e.node
  const ifNoneMatch = req.headers['if-none-match']

  if (ifNoneMatch && ifNoneMatch === hash) {
    res.statusCode = 304
    res.end()
    return
  }

  res.setHeader('Cache-Control', `no-cache`)
  res.setHeader('Content-Type', contentType(filename) || 'video/mp4')
  res.setHeader('Last-Modified', lastModified)
  res.setHeader('ETag', hash)
  res.end(file)
}
