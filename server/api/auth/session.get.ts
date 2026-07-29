import type { AuthState } from '~/interfaces/Auth'
import { getAuthUser } from '../../lib/auth'
import { getAppConfig } from '../../lib/config'

export default defineEventHandler(async event => {
  const config = getAppConfig()
  const state: AuthState = {
    multiUserEnabled: config.multiUserEnabled,
    registrationEnabled: config.registrationEnabled,
    user: config.multiUserEnabled ? await getAuthUser(event) : null,
  }
  return state
})
