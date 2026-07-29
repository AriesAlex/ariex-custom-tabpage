import {
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import fs from 'fs-extra'
import formidable from 'formidable'
import type { File } from 'formidable'
import { createReadStream } from 'node:fs'
import { Readable } from 'node:stream'
import { createError, sendStream, setResponseStatus } from 'h3'
import type { H3Event } from 'h3'
import { getAppConfig } from './config'
import staticHandler from './staticHandler'

export type MediaSlot = 'image' | 'imageMobile' | 'video' | 'videoMobile'

const MEDIA: Record<
  MediaSlot,
  { filename: string; kind: 'image' | 'video'; maxSize: number }
> = {
  image: { filename: 'image.jpg', kind: 'image', maxSize: 25 * 1024 * 1024 },
  imageMobile: {
    filename: 'image_mobile.jpg',
    kind: 'image',
    maxSize: 25 * 1024 * 1024,
  },
  video: { filename: 'video.mp4', kind: 'video', maxSize: 1024 * 1024 * 1024 },
  videoMobile: {
    filename: 'video_mobile.mp4',
    kind: 'video',
    maxSize: 1024 * 1024 * 1024,
  },
}

let s3Client: S3Client | undefined

export async function verifyObjectStorage() {
  const config = getAppConfig()
  if (!config.multiUserEnabled) return
  await getS3Client().send(new HeadBucketCommand({ Bucket: config.s3.bucket }))
}

export async function uploadMedia(
  event: H3Event,
  ownerId: string | null,
  slot: MediaSlot
) {
  const media = MEDIA[slot]
  const file = await readUploadedFile(event, media.maxSize)

  try {
    if (!file.mimetype?.startsWith(`${media.kind}/`))
      throw createError({
        statusCode: 400,
        message: event.context.$t(
          media.kind === 'image' ? 'invalidImageFile' : 'invalidVideoFile'
        ),
      })

    const config = getAppConfig()
    if (!config.multiUserEnabled) {
      const publicDir = `${process.dev ? '' : '.output/'}public`
      await fs.move(file.filepath, `${publicDir}/${media.filename}`, {
        overwrite: true,
      })
      return `${file.size}-${Date.now()}`
    }
    if (!ownerId) throw new Error('Authenticated owner is required for S3 media')

    const response = await getS3Client().send(
      new PutObjectCommand({
        Bucket: config.s3.bucket,
        Key: getObjectKey(ownerId, slot),
        Body: createReadStream(file.filepath),
        ContentLength: file.size,
        ContentType: file.mimetype,
      })
    )
    return response.ETag?.replaceAll('"', '') ?? String(Date.now())
  } finally {
    await fs.remove(file.filepath)
  }
}

export async function serveMedia(
  event: H3Event,
  ownerId: string | null,
  slot: MediaSlot
) {
  const media = MEDIA[slot]
  const config = getAppConfig()
  if (!config.multiUserEnabled)
    return staticHandler(event, media.filename)
  if (!ownerId) throw new Error('Authenticated owner is required for S3 media')

  try {
    const response = await getS3Client().send(
      new GetObjectCommand({
        Bucket: config.s3.bucket,
        Key: getObjectKey(ownerId, slot),
        Range: event.node.req.headers.range,
      })
    )
    if (!(response.Body instanceof Readable))
      throw new Error('S3 returned a non-streaming media body')

    event.node.res.setHeader('Cache-Control', 'private, no-cache')
    event.node.res.setHeader('Accept-Ranges', 'bytes')
    event.node.res.setHeader('X-Content-Type-Options', 'nosniff')
    if (response.ContentType)
      event.node.res.setHeader('Content-Type', response.ContentType)
    if (response.ContentLength != null)
      event.node.res.setHeader('Content-Length', response.ContentLength)
    if (response.ContentRange) {
      event.node.res.setHeader('Content-Range', response.ContentRange)
      setResponseStatus(event, 206)
    }
    if (response.ETag) event.node.res.setHeader('ETag', response.ETag)

    return sendStream(event, response.Body)
  } catch (error: unknown) {
    if (isMissingS3Object(error))
      return staticHandler(event, media.filename)
    throw error
  }
}

export async function deleteUserMedia(ownerId: string) {
  const config = getAppConfig()
  if (!config.multiUserEnabled) return

  await getS3Client().send(
    new DeleteObjectsCommand({
      Bucket: config.s3.bucket,
      Delete: {
        Objects: (Object.keys(MEDIA) as MediaSlot[]).map(slot => ({
          Key: getObjectKey(ownerId, slot),
        })),
        Quiet: true,
      },
    })
  )
}

function getS3Client() {
  const config = getAppConfig()
  if (!config.multiUserEnabled)
    throw new Error('S3 is unavailable in single-user mode')

  if (!s3Client)
    s3Client = new S3Client({
      endpoint: config.s3.endpoint,
      region: config.s3.region,
      forcePathStyle: config.s3.forcePathStyle,
      credentials: {
        accessKeyId: config.s3.accessKeyId,
        secretAccessKey: config.s3.secretAccessKey,
      },
    })
  return s3Client
}

function getObjectKey(ownerId: string, slot: MediaSlot) {
  const config = getAppConfig()
  if (!config.multiUserEnabled)
    throw new Error('S3 object keys are unavailable in single-user mode')
  return `${config.s3.prefix}/users/${ownerId}/${slot}`
}

function readUploadedFile(event: H3Event, maxFileSize: number) {
  return new Promise<File>((resolve, reject) => {
    const form = formidable({
      allowEmptyFiles: false,
      maxFiles: 1,
      maxFileSize,
      multiples: false,
    })
    form.parse(event.node.req, (error, _fields, files) => {
      if (error) {
        reject(error)
        return
      }
      const file = Object.values(files).flat()[0]
      if (!file) {
        reject(
          createError({
            statusCode: 400,
            message: event.context.$t('fileRequired'),
          })
        )
        return
      }
      resolve(file)
    })
  })
}

function isMissingS3Object(error: unknown) {
  if (!error || typeof error !== 'object') return false
  if ('name' in error && error.name === 'NoSuchKey') return true
  if (!('$metadata' in error) || !error.$metadata) return false
  const metadata = error.$metadata
  return (
    typeof metadata === 'object' &&
    'httpStatusCode' in metadata &&
    metadata.httpStatusCode === 404
  )
}
