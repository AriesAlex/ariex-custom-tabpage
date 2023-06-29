import { linksStorage } from '../lib/storages'

export default defineEventHandler(e => {
  return linksStorage.value.value
})
