import { login } from '../../lib/auth'
import { enforceAuthRateLimit } from '../../lib/authRateLimit'

export default defineEventHandler(async event => {
  enforceAuthRateLimit(event)
  return login(event, await readBody(event))
})
