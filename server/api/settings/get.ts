import { settingsStorage } from '../../lib/storages'

export default defineEventHandler(e => {
  return settingsStorage.value.value
})
