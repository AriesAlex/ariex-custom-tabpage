import { logout } from '../../lib/auth'

export default defineEventHandler(async event => {
  await logout(event)
  return 'ok'
})
