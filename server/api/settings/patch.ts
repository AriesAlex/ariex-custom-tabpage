import { settingsStorage } from '../lib/storages'

export default defineEventHandler(async e => {
  const newSettings = await readBody(e)
  settingsStorage.value.value = newSettings
  return 'ok'
})
