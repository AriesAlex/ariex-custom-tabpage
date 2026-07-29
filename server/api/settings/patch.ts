import { getDataOwnerId } from '../../lib/auth'
import { parseSettings } from '../../lib/settingsValidation'
import { saveSettings } from '../../lib/userData'

export default defineEventHandler(async e => {
  const settings = parseSettings(e, await readBody(e))
  await saveSettings(await getDataOwnerId(e), settings)
  return 'ok'
})
