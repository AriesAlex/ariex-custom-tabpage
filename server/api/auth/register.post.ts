import { register } from '../../lib/auth'
import { enforceAuthRateLimit } from '../../lib/authRateLimit'

export default defineEventHandler(async event => {
  enforceAuthRateLimit(event)
  const user = await register(event, await readBody(event))
  setResponseStatus(event, 201)
  return user
})
