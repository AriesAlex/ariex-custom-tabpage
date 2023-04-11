import storage from './lib/storage'

export default defineEventHandler(e => {
  return storage.value
})
