export default defineEventHandler(async e => {
  const url = getQuery(e).url
  if (!url) return
  const imgData = await $fetch<ArrayBuffer>(
    `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(String(url))}&size=32`,
    {
      responseType: 'arrayBuffer',
    }
  )
  return Buffer.from(imgData).toString('base64')
})
