export default defineEventHandler(async e => {
  const url = getQuery(e).url
  if (!url) return
  const imgData = await $fetch<string>(
    `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=32`,
    {
      responseType: 'arrayBuffer',
    }
  )
  return Buffer.from(imgData, 'binary').toString('base64')
})
