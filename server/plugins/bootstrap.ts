import { getAppConfig } from '../lib/config'
import { closeDatabase, initializeDatabase } from '../lib/database'
import { verifyObjectStorage } from '../lib/media'

const config = getAppConfig()
if (config.multiUserEnabled) {
  await initializeDatabase()
  await verifyObjectStorage()
}

export default defineNitroPlugin(nitroApp => {
  if (config.multiUserEnabled) nitroApp.hooks.hook('close', closeDatabase)
})
